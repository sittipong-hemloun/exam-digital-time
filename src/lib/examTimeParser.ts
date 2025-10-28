/**
 * Utility functions for parsing exam time strings
 */

export interface ParsedExamTime {
  startTime: Date | null;
  endTime: Date | null;
  isValid: boolean;
}

/**
 * Parse exam time string to Date objects
 * Supports formats like:
 * - "09:00 - 12:00"
 * - "09:00-12:00"
 * - "09.00-12.00" (Thai format with dots)
 * - "13:00 PM - 16:00 PM"
 * - "9:00 - 12:00 น."
 */
export function parseExamTime(timeString: string, referenceDate?: Date): ParsedExamTime {
  if (!timeString) {
    return { startTime: null, endTime: null, isValid: false };
  }

  const now = referenceDate || new Date();

  // Remove common Thai/English words and extra spaces
  const cleaned = timeString
    .replace(/น\.|AM|PM|am|pm/gi, "")
    .trim();

  // Try to match time range pattern
  // Supports both : and . as separators (HH:MM or HH.MM)
  const rangePattern = /(\d{1,2})[:.](\d{2})\s*-\s*(\d{1,2})[:.](\d{2})/;
  const match = cleaned.match(rangePattern);

  if (!match) {
    return { startTime: null, endTime: null, isValid: false };
  }

  const [, startHour, startMinute, endHour, endMinute] = match;

  // Create Date objects with today's date
  const startTime = new Date(now);
  startTime.setHours(parseInt(startHour, 10), parseInt(startMinute, 10), 0, 0);

  const endTime = new Date(now);
  endTime.setHours(parseInt(endHour, 10), parseInt(endMinute, 10), 0, 0);

  // Validate times
  if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
    return { startTime: null, endTime: null, isValid: false };
  }

  // If end time is before start time, assume it's next day
  if (endTime < startTime) {
    endTime.setDate(endTime.getDate() + 1);
  }

  return {
    startTime,
    endTime,
    isValid: true,
  };
}

/**
 * Format time left as string
 */
export function formatTimeLeft(hours: number, minutes: number, seconds: number): string {
  const parts: string[] = [];

  if (hours > 0) {
    parts.push(`${hours}h`);
  }
  if (minutes > 0 || hours > 0) {
    parts.push(`${minutes}m`);
  }
  parts.push(`${seconds}s`);

  return parts.join(" ");
}
