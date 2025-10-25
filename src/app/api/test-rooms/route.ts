import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { validateRoomQuery } from "@/lib/validators";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawQuery = searchParams.get("q") || "";

    // Validate and sanitize the search query
    const queryValidation = validateRoomQuery(rawQuery);
    if (!queryValidation.isValid) {
      return NextResponse.json(
        { error: queryValidation.error || "Invalid search query" },
        { status: 400 }
      );
    }
    const query = queryValidation.value || "";

    // Get today's date in Thai format (e.g., "20 ต.ค. 68")
    const now = new Date();
    const thaiMonths = [
      "ม.ค.",
      "ก.พ.",
      "มี.ค.",
      "เม.ย.",
      "พ.ค.",
      "มิ.ย.",
      "ก.ค.",
      "ส.ค.",
      "ก.ย.",
      "ต.ค.",
      "พ.ย.",
      "ธ.ค.",
    ];
    const thaiYear = now.getFullYear() + 543;
    const thaiDate = `${now.getDate()} ${thaiMonths[now.getMonth()]} ${String(thaiYear).slice(-2)}`;

    // Get latest semester using Prisma ORM with orderBy
    const latestRecord = await prisma.test_table.findFirst({
      where: {
        date_test: thaiDate,
      },
      select: {
        sm_yr: true,
        sm_sem: true,
      },
      orderBy: [{ sm_yr: "desc" }, { sm_sem: "desc" }],
    });

    if (!latestRecord) {
      return NextResponse.json(
        { error: "No records found in test_table" },
        { status: 404 }
      );
    }

    // Fetch distinct rooms using Prisma ORM
    // Get all matching records and extract distinct room_test values
    const testRecords = await prisma.test_table.findMany({
      where: {
        sm_yr: latestRecord.sm_yr,
        sm_sem: latestRecord.sm_sem,
        date_test: thaiDate,
        ...(query && {
          room_test: {
            contains: query,
          },
        }),
      },
      select: {
        room_test: true,
      },
      orderBy: {
        room_test: "asc",
      },
      distinct: ["room_test"],
    });

    const roomList = testRecords
      .map((r) => r.room_test)
      .filter((r) => r !== null) as string[];

    return NextResponse.json({
      rooms: roomList,
      latestSemester: {
        sm_yr: latestRecord.sm_yr,
        sm_sem: latestRecord.sm_sem,
        date_test: thaiDate,
      },
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Unknown error occurred while fetching rooms";

    console.error("test-rooms error:", error);

    return NextResponse.json(
      {
        error: errorMessage,
        details: process.env.NODE_ENV === "development" ? error : undefined,
      },
      { status: 500 }
    );
  }
}
