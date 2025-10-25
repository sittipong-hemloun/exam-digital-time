import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";

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

    // Get latest sm_yr and sm_sem using raw SQL
    const latestResult = await prisma.$queryRaw<
      Array<{ sm_yr: string; sm_sem: string }>
    >`
      SELECT TOP 1 sm_yr, sm_sem FROM dbo.test_table
      ORDER BY sm_yr DESC, sm_sem DESC
    `;

    if (!latestResult || latestResult.length === 0) {
      return NextResponse.json(
        { error: "No records found in test_table" },
        { status: 404 }
      );
    }

    const latestRecord = latestResult[0];

    // Fetch rooms matching the latest semester and today's date using raw SQL
    let roomsResult: Array<{ room_test: string | null }>;

    if (query) {
      roomsResult = await prisma.$queryRaw<
        Array<{ room_test: string | null }>
      >`
        SELECT DISTINCT room_test FROM dbo.test_table
        WHERE sm_yr = ${latestRecord.sm_yr}
        AND sm_sem = ${latestRecord.sm_sem}
        AND date_test = ${thaiDate}
        AND room_test LIKE ${'%' + query + '%'}
        ORDER BY room_test ASC
      `;
    } else {
      roomsResult = await prisma.$queryRaw<
        Array<{ room_test: string | null }>
      >`
        SELECT DISTINCT room_test FROM dbo.test_table
        WHERE sm_yr = ${latestRecord.sm_yr}
        AND sm_sem = ${latestRecord.sm_sem}
        AND date_test = ${thaiDate}
        ORDER BY room_test ASC
      `;
    }

    const roomList = roomsResult
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
