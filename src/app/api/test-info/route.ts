import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

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
    const dateTest = searchParams.get("date_test");
    const roomTest = searchParams.get("room_test");
    const smYr = searchParams.get("sm_yr");
    const smSem = searchParams.get("sm_sem");

    if (!dateTest || !roomTest || !smYr || !smSem) {
      return NextResponse.json(
        {
          error: "Missing required parameters: date_test, room_test, sm_yr, sm_sem",
        },
        { status: 400 }
      );
    }

    // Search for test records matching the criteria using raw SQL
    const testRecords = await prisma.$queryRaw<TestInfo[]>`
      SELECT
        nno, sm_sem, sm_yr, sm_test, cs_code, course_nam, course_name,
        date_test, time_test, time_am_pm, sec_lec1, sec_lab1, room_test,
        build, count_person, person1, id_start, id_stop
      FROM dbo.test_table
      WHERE date_test = ${dateTest}
        AND room_test = ${roomTest}
        AND sm_yr = ${smYr}
        AND sm_sem = ${smSem}
      ORDER BY nno ASC
    `;

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
