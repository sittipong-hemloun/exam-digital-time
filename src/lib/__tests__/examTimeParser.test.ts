/**
 * Tests for examTimeParser utility functions
 */

import { parseExamTime, formatTimeLeft } from "../examTimeParser";

describe("parseExamTime", () => {
  const referenceDate = new Date("2025-01-15T08:00:00");

  test("should parse standard time range format", () => {
    const result = parseExamTime("09:00 - 12:00", referenceDate);

    expect(result.isValid).toBe(true);
    expect(result.startTime).toBeDefined();
    expect(result.endTime).toBeDefined();

    if (result.startTime && result.endTime) {
      expect(result.startTime.getHours()).toBe(9);
      expect(result.startTime.getMinutes()).toBe(0);
      expect(result.endTime.getHours()).toBe(12);
      expect(result.endTime.getMinutes()).toBe(0);
    }
  });

  test("should parse time range without spaces", () => {
    const result = parseExamTime("09:00-12:00", referenceDate);

    expect(result.isValid).toBe(true);
    expect(result.startTime).toBeDefined();
    expect(result.endTime).toBeDefined();
  });

  test("should parse Thai format with dots (12.00-15.00)", () => {
    const result = parseExamTime("12.00-15.00", referenceDate);

    expect(result.isValid).toBe(true);
    expect(result.startTime).toBeDefined();
    expect(result.endTime).toBeDefined();

    if (result.startTime && result.endTime) {
      expect(result.startTime.getHours()).toBe(12);
      expect(result.startTime.getMinutes()).toBe(0);
      expect(result.endTime.getHours()).toBe(15);
      expect(result.endTime.getMinutes()).toBe(0);
    }
  });

  test("should parse Thai format with dots and spaces (09.00 - 12.00)", () => {
    const result = parseExamTime("09.00 - 12.00", referenceDate);

    expect(result.isValid).toBe(true);
    if (result.startTime && result.endTime) {
      expect(result.startTime.getHours()).toBe(9);
      expect(result.endTime.getHours()).toBe(12);
    }
  });

  test("should parse time with Thai format", () => {
    const result = parseExamTime("09:00 - 12:00 น.", referenceDate);

    expect(result.isValid).toBe(true);
    expect(result.startTime).toBeDefined();
    expect(result.endTime).toBeDefined();
  });

  test("should parse time with AM/PM format", () => {
    const result = parseExamTime("09:00 AM - 12:00 PM", referenceDate);

    expect(result.isValid).toBe(true);
    expect(result.startTime).toBeDefined();
    expect(result.endTime).toBeDefined();
  });

  test("should handle single digit hours", () => {
    const result = parseExamTime("9:00 - 12:30", referenceDate);

    expect(result.isValid).toBe(true);
    if (result.startTime) {
      expect(result.startTime.getHours()).toBe(9);
    }
  });

  test("should return invalid for empty string", () => {
    const result = parseExamTime("", referenceDate);

    expect(result.isValid).toBe(false);
    expect(result.startTime).toBeNull();
    expect(result.endTime).toBeNull();
  });

  test("should return invalid for malformed time", () => {
    const result = parseExamTime("invalid time", referenceDate);

    expect(result.isValid).toBe(false);
    expect(result.startTime).toBeNull();
    expect(result.endTime).toBeNull();
  });

  test("should handle end time on next day", () => {
    const result = parseExamTime("23:00 - 01:00", referenceDate);

    expect(result.isValid).toBe(true);
    if (result.startTime && result.endTime) {
      expect(result.endTime.getDate()).toBe(result.startTime.getDate() + 1);
    }
  });
});

describe("formatTimeLeft", () => {
  test("should format hours, minutes, and seconds", () => {
    expect(formatTimeLeft(2, 30, 45)).toBe("2h 30m 45s");
  });

  test("should format minutes and seconds when no hours", () => {
    expect(formatTimeLeft(0, 30, 45)).toBe("30m 45s");
  });

  test("should format only seconds when no hours or minutes", () => {
    expect(formatTimeLeft(0, 0, 45)).toBe("45s");
  });

  test("should handle zero seconds", () => {
    expect(formatTimeLeft(0, 0, 0)).toBe("0s");
  });

  test("should include minutes even when zero if hours exist", () => {
    expect(formatTimeLeft(1, 0, 30)).toBe("1h 0m 30s");
  });
});
