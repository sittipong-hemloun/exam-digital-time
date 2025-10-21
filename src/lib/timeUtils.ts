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
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
    "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม",
  ];
  const monthsEn = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
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
 */
export const syncServerTime = async (timeoutMs = 3000): Promise<number> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const res = await fetch(window.location.href, {
      method: 'HEAD',
      cache: 'no-store',
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    const serverDateHeader = res.headers.get('Date');
    if (!serverDateHeader) {
      console.warn('No Date header found in response');
      return 0;
    }

    const serverTime = new Date(serverDateHeader).getTime();
    const clientTime = Date.now();
    const offset = serverTime - clientTime;

    console.log('Time synced with server. Offset:', offset, 'ms');
    return offset;
  } catch (error) {
    console.warn('Failed to sync with server time:', error);
    return 0;
  }
};
