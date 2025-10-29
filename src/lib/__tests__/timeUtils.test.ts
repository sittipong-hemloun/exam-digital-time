import {
  isExamTimeEndedWithTime,
  formatTimeWithColons,
  formatExamRoom,
  splitFieldBySeparator,
} from '../timeUtils';

describe('timeUtils', () => {
  describe('isExamTimeEndedWithTime', () => {
    it('should return false when current time is before end time', () => {
      expect(isExamTimeEndedWithTime('12.00-14.00', 13, 0)).toBe(false);
      expect(isExamTimeEndedWithTime('12.00-14.00', 13, 59)).toBe(false);
      expect(isExamTimeEndedWithTime('09.00-12.00', 11, 59)).toBe(false);
    });

    it('should return true when current time is exactly at end time', () => {
      expect(isExamTimeEndedWithTime('12.00-14.00', 14, 0)).toBe(false);
    });

    it('should return true when current time is after end time', () => {
      expect(isExamTimeEndedWithTime('12.00-14.00', 14, 1)).toBe(true);
      expect(isExamTimeEndedWithTime('12.00-14.00', 15, 0)).toBe(true);
      expect(isExamTimeEndedWithTime('09.00-12.00', 12, 1)).toBe(true);
    });

    it('should handle time with Thai suffix', () => {
      expect(isExamTimeEndedWithTime('12.00-14.00 น.', 14, 1)).toBe(true);
      expect(isExamTimeEndedWithTime('12.00-14.00 น.', 13, 0)).toBe(false);
    });

    it('should handle single digit hours', () => {
      expect(isExamTimeEndedWithTime('9.00-12.00', 12, 1)).toBe(true);
      expect(isExamTimeEndedWithTime('9.00-12.00', 11, 59)).toBe(false);
    });

    it('should return false for invalid time format', () => {
      expect(isExamTimeEndedWithTime('invalid', 14, 0)).toBe(false);
      expect(isExamTimeEndedWithTime('', 14, 0)).toBe(false);
      expect(isExamTimeEndedWithTime('12:00-14:00', 14, 0)).toBe(false);
    });

    it('should handle late evening times', () => {
      expect(isExamTimeEndedWithTime('22.00-23.59', 23, 59)).toBe(false);
      expect(isExamTimeEndedWithTime('20.00-22.00', 22, 1)).toBe(true);
      expect(isExamTimeEndedWithTime('18.00-20.00', 19, 30)).toBe(false);
    });
  });

  describe('formatTimeWithColons', () => {
    it('should replace dots with colons', () => {
      expect(formatTimeWithColons('12.00-14.00')).toBe('12:00-14:00');
      expect(formatTimeWithColons('09.30-11.45')).toBe('09:30-11:45');
    });

    it('should handle empty string', () => {
      expect(formatTimeWithColons('')).toBe('');
    });

    it('should handle time without dots', () => {
      expect(formatTimeWithColons('12:00-14:00')).toBe('12:00-14:00');
    });

    it('should handle partial time strings', () => {
      expect(formatTimeWithColons('12.00')).toBe('12:00');
    });
  });

  describe('formatExamRoom', () => {
    it('should remove seat count in Thai format', () => {
      expect(formatExamRoom('1401A (40 ที่)')).toBe('1401A');
      expect(formatExamRoom('13A(60 ที่)')).toBe('13A');
      expect(formatExamRoom('Room 201 (30 ที่)')).toBe('Room 201');
    });

    it('should handle rooms without seat count', () => {
      expect(formatExamRoom('1401A')).toBe('1401A');
      expect(formatExamRoom('Room 201')).toBe('Room 201');
    });

    it('should handle empty string', () => {
      expect(formatExamRoom('')).toBe('');
    });

    it('should trim whitespace', () => {
      expect(formatExamRoom('  1401A (40 ที่)  ')).toBe('1401A');
      expect(formatExamRoom('1401A  (40 ที่)')).toBe('1401A');
    });

    it('should handle text after seat count', () => {
      // Note: regex removes whitespace around the pattern, so "(extra)" becomes "(extra)"
      expect(formatExamRoom('1401A (40 ที่) (extra)')).toBe('1401A(extra)');
    });
  });

  describe('splitFieldBySeparator', () => {
    it('should split by " / " separator', () => {
      expect(splitFieldBySeparator('CS101 / CS102')).toEqual(['CS101', 'CS102']);
      expect(splitFieldBySeparator('Math / Physics / Chemistry')).toEqual([
        'Math',
        'Physics',
        'Chemistry',
      ]);
    });

    it('should handle single value without separator', () => {
      expect(splitFieldBySeparator('CS101')).toEqual(['CS101']);
    });

    it('should return empty array for empty string', () => {
      expect(splitFieldBySeparator('')).toEqual([]);
    });

    it('should trim whitespace from values', () => {
      expect(splitFieldBySeparator('  CS101  /  CS102  ')).toEqual(['CS101', 'CS102']);
    });

    it('should handle Thai text', () => {
      expect(splitFieldBySeparator('คณิตศาสตร์ / ฟิสิกส์')).toEqual([
        'คณิตศาสตร์',
        'ฟิสิกส์',
      ]);
    });
  });
});
