import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import {
  validateDateTest,
  validateRoomTest,
  validateSmYear,
  validateSmSem,
} from "@/lib/validators";

export interface TestInfo {
  nno: number;
  sm_sem: string;
  sm_yr: string;
  sm_test: string;
  cs_code: string;
  course_nam: string | null;
  course_name: string | null;
  date_test: string;
  time_test: string;
  time_am_pm: string | null;
  sec_lec1: string;
  sec_lab1: string;
  room_test: string | null;
  build: string | null;
  count_person: number | null;
  person1: string | null;
  id_start: string | null;
  id_stop: string | null;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawDateTest = searchParams.get("date_test");
    const rawRoomTest = searchParams.get("room_test");
    const rawSmYr = searchParams.get("sm_yr");
    const rawSmSem = searchParams.get("sm_sem");

    // Validate all required parameters
    const dateValidation = validateDateTest(rawDateTest || "");
    if (!dateValidation.isValid) {
      return NextResponse.json(
        { error: `Invalid date_test: ${dateValidation.error}` },
        { status: 400 }
      );
    }

    const roomValidation = validateRoomTest(rawRoomTest || "");
    if (!roomValidation.isValid) {
      return NextResponse.json(
        { error: `Invalid room_test: ${roomValidation.error}` },
        { status: 400 }
      );
    }

    const yearValidation = validateSmYear(rawSmYr || "");
    if (!yearValidation.isValid) {
      return NextResponse.json(
        { error: `Invalid sm_yr: ${yearValidation.error}` },
        { status: 400 }
      );
    }

    const semValidation = validateSmSem(rawSmSem || "");
    if (!semValidation.isValid) {
      return NextResponse.json(
        { error: `Invalid sm_sem: ${semValidation.error}` },
        { status: 400 }
      );
    }

    // Use validated values
    const dateTest = dateValidation.value;
    const roomTest = roomValidation.value;
    const smYr = yearValidation.value;
    const smSem = semValidation.value;

    // Search for test records using Prisma ORM instead of raw SQL
    const testRecords = await prisma.test_table.findMany({
      where: {
        date_test: dateTest,
        room_test: roomTest,
        sm_yr: smYr,
        sm_sem: smSem,
      },
      select: {
        nno: true,
        sm_sem: true,
        sm_yr: true,
        sm_test: true,
        cs_code: true,
        course_nam: true,
        course_name: true,
        date_test: true,
        time_test: true,
        time_am_pm: true,
        sec_lec1: true,
        sec_lab1: true,
        room_test: true,
        build: true,
        count_person: true,
        person1: true,
        id_start: true,
        id_stop: true,
      },
      orderBy: {
        nno: "asc",
      },
    });

    if (testRecords.length === 0) {
      return NextResponse.json(
        {
          error: "No records found",
          records: [],
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      count: testRecords.length,
      records: testRecords,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Unknown error occurred while fetching test info";

    return NextResponse.json(
      {
        error: errorMessage,
        details: process.env.NODE_ENV === "development" ? error : undefined,
      },
      { status: 500 }
    );
  }
}
