/**
 * Time-related utility functions for exam clock
 */

export interface FormattedTime {
  hours: string;
  minutes: string;
  seconds: string;
}

/**
 * Format a date to HH:MM:SS format
 */
export const formatTime = (date: Date): FormattedTime => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return { hours: "--", minutes: "--", seconds: "--" };
  }
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  return { hours, minutes, seconds };
};

/**
 * Format a date to localized date string
 */
export const formatDate = (date: Date, language: "th" | "en"): string => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return language === "th" ? "วันที่ไม่ระบุ" : "No date";
  }

  const daysTh = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];
  const daysEn = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const monthsTh = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];
  const monthsEn = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const days = language === "th" ? daysTh : daysEn;
  const months = language === "th" ? monthsTh : monthsEn;
  const dayName = days[date.getDay()];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = language === "th" ? date.getFullYear() + 543 : date.getFullYear();

  if (language === "th") {
    return `วัน${dayName}ที่ ${day} ${month} ${year}`;
  } else {
    return `${month} ${day}, ${year}`;
  }
};

/**
 * Sync time with server using HTTP Date header
 * For static exports, falls back to no time offset since server time is unavailable
 */
export const syncServerTime = async (timeoutMs = 3000): Promise<number> => {
  // Skip syncing if we're in a static export environment (no server endpoint available)
  if (typeof window === "undefined") {
    return 0;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    // Try to fetch with a minimal endpoint - if it fails, we'll use client time
    const res = await fetch(window.location.href, {
      method: "HEAD",
      cache: "no-store",
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const serverDateHeader = res.headers.get("Date");
    if (!serverDateHeader) {
      console.warn("No Date header found in response");
      return 0;
    }

    const serverTime = new Date(serverDateHeader).getTime();
    const clientTime = Date.now();
    const offset = serverTime - clientTime;

    return offset;
  } catch (error) {
    // Handle AbortError separately as it's expected when timeout occurs
    if (error instanceof DOMException && error.name === "AbortError") {
      console.warn("Server time sync request timed out - using client time");
    } else if (error instanceof TypeError) {
      // Network errors or CORS issues are common in static deployments
      console.warn("Unable to sync with server time - using client time");
    } else {
      console.warn("Failed to sync with server time:", error);
    }
    return 0;
  }
};
