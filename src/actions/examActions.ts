"use server";

import { prisma } from "@/lib/prisma";
import {
  validateDateTest,
  validateRoomTest,
  validateSmYear,
  validateSmSem,
  validateRoomQuery,
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

interface TestInfoResponse {
  count: number;
  records: TestInfo[];
  error?: string;
}

interface RoomsResponse {
  rooms: string[];
  latestSemester: {
    sm_yr: string;
    sm_sem: string;
    date_test: string;
  };
  error?: string;
}

interface HealthCheckResponse {
  status: "connected" | "error";
  timestamp: string;
  scoreedCount?: number;
  message: string;
}

/**
 * Fetch exam information for a specific room, date, and semester
 */
export async function fetchExamInfo(
  dateTest: string,
  roomTest: string,
  smYr: string,
  smSem: string
): Promise<TestInfoResponse> {
  try {
    // Validate all required parameters
    const dateValidation = validateDateTest(dateTest || "");
    if (!dateValidation.isValid) {
      return {
        count: 0,
        records: [],
        error: `Invalid date_test: ${dateValidation.error}`,
      };
    }

    const roomValidation = validateRoomTest(roomTest || "");
    if (!roomValidation.isValid) {
      return {
        count: 0,
        records: [],
        error: `Invalid room_test: ${roomValidation.error}`,
      };
    }

    const yearValidation = validateSmYear(smYr || "");
    if (!yearValidation.isValid) {
      return {
        count: 0,
        records: [],
        error: `Invalid sm_yr: ${yearValidation.error}`,
      };
    }

    const semValidation = validateSmSem(smSem || "");
    if (!semValidation.isValid) {
      return {
        count: 0,
        records: [],
        error: `Invalid sm_sem: ${semValidation.error}`,
      };
    }

    // Use validated values
    const validatedDateTest = dateValidation.value;
    const validatedRoomTest = roomValidation.value;
    const validatedSmYr = yearValidation.value;
    const validatedSmSem = semValidation.value;

    // Search for test records using Prisma ORM
    const testRecords = await prisma.test_table.findMany({
      where: {
        date_test: validatedDateTest,
        room_test: validatedRoomTest,
        sm_yr: validatedSmYr,
        sm_sem: validatedSmSem,
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
      return {
        count: 0,
        records: [],
        error: "No records found",
      };
    }

    return {
      count: testRecords.length,
      records: testRecords,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Unknown error occurred while fetching test info";

    console.error("fetchExamInfo error:", error);

    return {
      count: 0,
      records: [],
      error: errorMessage,
    };
  }
}

/**
 * Fetch room autocomplete suggestions and latest semester info
 */
export async function fetchRoomSuggestions(
  query: string = ""
): Promise<RoomsResponse> {
  try {
    // Validate and sanitize the search query
    const queryValidation = validateRoomQuery(query);
    if (!queryValidation.isValid) {
      return {
        rooms: [],
        latestSemester: {
          sm_yr: "",
          sm_sem: "",
          date_test: "",
        },
        error: queryValidation.error || "Invalid search query",
      };
    }
    const validatedQuery = queryValidation.value || "";

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
      return {
        rooms: [],
        latestSemester: {
          sm_yr: "",
          sm_sem: "",
          date_test: "",
        },
        error: "No records found in test_table",
      };
    }

    // Fetch distinct rooms using Prisma ORM
    const testRecords = await prisma.test_table.findMany({
      where: {
        sm_yr: latestRecord.sm_yr,
        sm_sem: latestRecord.sm_sem,
        date_test: thaiDate,
        ...(validatedQuery && {
          room_test: {
            contains: validatedQuery,
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

    return {
      rooms: roomList,
      latestSemester: {
        sm_yr: latestRecord.sm_yr,
        sm_sem: latestRecord.sm_sem,
        date_test: thaiDate,
      },
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Unknown error occurred while fetching rooms";

    console.error("fetchRoomSuggestions error:", error);

    return {
      rooms: [],
      latestSemester: {
        sm_yr: "",
        sm_sem: "",
        date_test: "",
      },
      error: errorMessage,
    };
  }
}

/**
 * Test database connectivity
 */
export async function checkDatabaseHealth(): Promise<HealthCheckResponse> {
  try {
    // Test connection by querying a simple model
    const scoreedCount = await prisma.master_scoreed.count();

    return {
      status: "connected",
      timestamp: new Date().toISOString(),
      scoreedCount: scoreedCount,
      message: "Successfully connected to SQL Server database",
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Unknown error occurred while connecting to database";

    console.error("checkDatabaseHealth error:", error);

    return {
      status: "error",
      timestamp: new Date().toISOString(),
      message: errorMessage,
    };
  }
}
