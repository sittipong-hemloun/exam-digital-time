/**
 * Input validation utilities for API endpoints
 * Prevents SQL injection and other input-based attacks
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  value?: string;
}

/**
 * Validates room search query
 * Allows alphanumeric, Thai characters, parentheses, spaces, hyphens, underscores, dots
 * Max length: 100 characters
 */
export function validateRoomQuery(query: string): ValidationResult {
  if (!query) {
    return { isValid: true, value: "" };
  }

  // Check length
  if (query.length > 100) {
    return {
      isValid: false,
      error: "Room query must not exceed 100 characters",
    };
  }

  // Block only SQL injection characters: quotes, semicolons, comments, and asterisks
  // Allow most other characters including parentheses, spaces, dots, slashes
  const blockedPattern = /['";]|--|\*|\/\*|\*\//;
  if (blockedPattern.test(query)) {
    return {
      isValid: false,
      error: "Room query contains invalid characters (quotes, semicolons, or SQL comments)",
    };
  }

  return { isValid: true, value: query };
}

/**
 * Validates date format (Thai format or YYYY-MM-DD)
 * Expected format: "DD MMM YY" or "YYYY-MM-DD"
 */
export function validateDateTest(dateTest: string): ValidationResult {
  if (!dateTest) {
    return { isValid: false, error: "Date is required" };
  }

  if (dateTest.length > 20) {
    return {
      isValid: false,
      error: "Date format is invalid",
    };
  }

  // Allow Thai date format (e.g., "20 ต.ค. 68") and ISO format (YYYY-MM-DD)
  // Thai date pattern: DD THAI_ABBREV_MONTH YY (e.g., "20 ต.ค. 68")
  // Pattern breakdown: \d{1,2} (day) \s (space) [\u0E00-\u0E7F]+(\\.[\u0E00-\u0E7F])* (thai text with dots) \s (space) \d{2} (year)
  const thaiDatePattern = /^\d{1,2}\s[\u0E00-\u0E7F]+\.[\u0E00-\u0E7F]*\.\s\d{2}$/;
  const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;

  if (!thaiDatePattern.test(dateTest) && !isoDatePattern.test(dateTest)) {
    return {
      isValid: false,
      error: "Date format is invalid. Use 'DD MMM YY' or 'YYYY-MM-DD'",
    };
  }

  return { isValid: true, value: dateTest };
}

/**
 * Validates room test format
 * Allows alphanumeric, Thai characters, parentheses, spaces, hyphens, underscores, dots, slashes
 * Max length: 100 characters (to accommodate full room descriptions)
 */
export function validateRoomTest(roomTest: string): ValidationResult {
  if (!roomTest) {
    return { isValid: false, error: "Room test is required" };
  }

  if (roomTest.length > 100) {
    return {
      isValid: false,
      error: "Room test must not exceed 100 characters",
    };
  }

  // Allow Thai characters, alphanumeric, parentheses, spaces, hyphens, underscores, dots, slashes
  // Block only SQL injection characters: quotes, semicolons, comments
  const blockedPattern = /['";]|--|\*|\/\*|\*\//;
  if (blockedPattern.test(roomTest)) {
    return {
      isValid: false,
      error: "Room test contains invalid characters (quotes, semicolons, or SQL comments)",
    };
  }

  return { isValid: true, value: roomTest };
}

/**
 * Validates semester year (sm_yr)
 * Expected format: 2-4 digit number
 */
export function validateSmYear(smYr: string): ValidationResult {
  if (!smYr) {
    return { isValid: false, error: "Year is required" };
  }

  if (smYr.length > 4) {
    return {
      isValid: false,
      error: "Year format is invalid",
    };
  }

  if (!/^\d{2,4}$/.test(smYr)) {
    return {
      isValid: false,
      error: "Year must be numeric (2-4 digits)",
    };
  }

  return { isValid: true, value: smYr };
}

/**
 * Validates semester number (sm_sem)
 * Expected format: 1-2 digit number (1-3)
 */
export function validateSmSem(smSem: string): ValidationResult {
  if (!smSem) {
    return { isValid: false, error: "Semester is required" };
  }

  if (smSem.length > 2) {
    return {
      isValid: false,
      error: "Semester format is invalid",
    };
  }

  if (!/^\d{1,2}$/.test(smSem)) {
    return {
      isValid: false,
      error: "Semester must be numeric",
    };
  }

  const semValue = parseInt(smSem, 10);
  if (semValue < 1 || semValue > 3) {
    return {
      isValid: false,
      error: "Semester must be between 1 and 3",
    };
  }

  return { isValid: true, value: smSem };
}

/**
 * Validates multiple parameters at once
 */
export function validateParameters(params: {
  [key: string]: string | null | undefined;
}): ValidationResult {
  const errors: string[] = [];

  if (!params.dateTest) {
    errors.push("date_test is required");
  } else {
    const dateValidation = validateDateTest(params.dateTest);
    if (!dateValidation.isValid) {
      errors.push(`date_test: ${dateValidation.error}`);
    }
  }

  if (!params.roomTest) {
    errors.push("room_test is required");
  } else {
    const roomValidation = validateRoomTest(params.roomTest);
    if (!roomValidation.isValid) {
      errors.push(`room_test: ${roomValidation.error}`);
    }
  }

  if (!params.smYr) {
    errors.push("sm_yr is required");
  } else {
    const yearValidation = validateSmYear(params.smYr);
    if (!yearValidation.isValid) {
      errors.push(`sm_yr: ${yearValidation.error}`);
    }
  }

  if (!params.smSem) {
    errors.push("sm_sem is required");
  } else {
    const semValidation = validateSmSem(params.smSem);
    if (!semValidation.isValid) {
      errors.push(`sm_sem: ${semValidation.error}`);
    }
  }

  if (errors.length > 0) {
    return {
      isValid: false,
      error: errors.join("; "),
    };
  }

  return { isValid: true };
}
