import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Test connection by querying a simple model
    // We'll use master_scoreed as an example
    const scoreedCount = await prisma.master_scoreed.count();

    // Get some basic info about the database
    const results = {
      status: "connected",
      timestamp: new Date().toISOString(),
      scoreedCount: scoreedCount,
      message: "Successfully connected to SQL Server database",
    };

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Unknown error occurred while connecting to database";

    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        message: errorMessage,
        error: process.env.NODE_ENV === "development" ? error : undefined,
      },
      { status: 500 }
    );
  }
}
