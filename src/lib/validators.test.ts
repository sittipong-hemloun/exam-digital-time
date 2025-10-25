import {
  validateRoomQuery,
  validateDateTest,
  validateRoomTest,
  validateSmYear,
  validateSmSem,
} from "./validators";

describe("Input Validators", () => {
  describe("validateRoomQuery", () => {
    it("should accept valid room queries", () => {
      const result = validateRoomQuery("301");
      expect(result.isValid).toBe(true);
      expect(result.value).toBe("301");
    });

    it("should accept empty query", () => {
      const result = validateRoomQuery("");
      expect(result.isValid).toBe(true);
      expect(result.value).toBe("");
    });

    it("should accept queries with Thai characters", () => {
      const result = validateRoomQuery("ห้อง101");
      expect(result.isValid).toBe(true);
    });

    it("should reject SQL injection attempts", () => {
      const sqlInjectionAttempts = [
        "%' OR '1'='1",
        "%'; DROP TABLE test_table;--",
        "%' UNION SELECT * FROM users--",
        "'; DELETE FROM test_table;--",
      ];

      sqlInjectionAttempts.forEach((attempt) => {
        const result = validateRoomQuery(attempt);
        expect(result.isValid).toBe(false);
      });
    });

    it("should reject queries exceeding max length", () => {
      const longQuery = "a".repeat(101);
      const result = validateRoomQuery(longQuery);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain("100 characters");
    });

    it("should accept queries with parentheses and spaces (real room names)", () => {
      const result = validateRoomQuery("10202A (30 ที่)");
      expect(result.isValid).toBe(true);
    });

    it("should reject SQL injection characters only", () => {
      const invalidQueries = [
        'room"test',
        "room'test",
        "room;delete",
        "room--comment",
        "room/**/comment",
      ];

      invalidQueries.forEach((query) => {
        const result = validateRoomQuery(query);
        expect(result.isValid).toBe(false);
      });
    });
  });

  describe("validateDateTest", () => {
    it("should accept valid Thai date format", () => {
      const result = validateDateTest("20 ต.ค. 68");
      expect(result.isValid).toBe(true);
    });

    it("should accept valid ISO date format", () => {
      const result = validateDateTest("2025-10-25");
      expect(result.isValid).toBe(true);
    });

    it("should reject invalid date formats", () => {
      const invalidDates = [
        "2025/10/25",
        "25-10-2025",
        "Oct 25 2025",
        "20-ต.ค.-68",
      ];

      invalidDates.forEach((date) => {
        const result = validateDateTest(date);
        expect(result.isValid).toBe(false);
      });
    });

    it("should reject SQL injection in date field", () => {
      const result = validateDateTest("20' OR '1'='1");
      expect(result.isValid).toBe(false);
    });
  });

  describe("validateRoomTest", () => {
    it("should accept valid room test values", () => {
      const validRooms = ["101", "A101", "ROOM-101", "room_test"];

      validRooms.forEach((room) => {
        const result = validateRoomTest(room);
        expect(result.isValid).toBe(true);
      });
    });

    it("should accept real room names with parentheses and Thai characters", () => {
      const result = validateRoomTest("10202A (30 ที่)");
      expect(result.isValid).toBe(true);
    });

    it("should reject values exceeding max length", () => {
      const longRoom = "a".repeat(101);
      const result = validateRoomTest(longRoom);
      expect(result.isValid).toBe(false);
    });

    it("should reject SQL injection attempts", () => {
      const sqlAttempts = [
        "101' OR '1'='1",
        "101; DROP--",
        "101' UNION SELECT--",
        '101" OR "1"="1',
      ];

      sqlAttempts.forEach((attempt) => {
        const result = validateRoomTest(attempt);
        expect(result.isValid).toBe(false);
      });
    });
  });

  describe("validateSmYear", () => {
    it("should accept valid year values", () => {
      const validYears = ["68", "2568", "25"];

      validYears.forEach((year) => {
        const result = validateSmYear(year);
        expect(result.isValid).toBe(true);
      });
    });

    it("should reject non-numeric values", () => {
      const result = validateSmYear("sixty-eight");
      expect(result.isValid).toBe(false);
    });

    it("should reject SQL injection in year field", () => {
      const result = validateSmYear("68; DROP--");
      expect(result.isValid).toBe(false);
    });
  });

  describe("validateSmSem", () => {
    it("should accept valid semester values (1-3)", () => {
      const validSems = ["1", "2", "3"];

      validSems.forEach((sem) => {
        const result = validateSmSem(sem);
        expect(result.isValid).toBe(true);
      });
    });

    it("should reject semester values outside range", () => {
      const invalidSems = ["0", "4", "5"];

      invalidSems.forEach((sem) => {
        const result = validateSmSem(sem);
        expect(result.isValid).toBe(false);
      });
    });

    it("should reject non-numeric values", () => {
      const result = validateSmSem("first");
      expect(result.isValid).toBe(false);
    });
  });
});
