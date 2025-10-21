/**
 * Tests for timeUtils functions
 */

import { formatTime, formatDate } from '../timeUtils';

describe('timeUtils', () => {
  describe('formatTime', () => {
    it('should format time correctly with leading zeros', () => {
      const date = new Date('2024-01-15T09:05:03');
      const result = formatTime(date);

      expect(result.hours).toBe('09');
      expect(result.minutes).toBe('05');
      expect(result.seconds).toBe('03');
    });

    it('should handle single digit values with padding', () => {
      const date = new Date('2024-01-15T01:02:04');
      const result = formatTime(date);

      expect(result.hours).toBe('01');
      expect(result.minutes).toBe('02');
      expect(result.seconds).toBe('04');
    });

    it('should handle midnight time', () => {
      const date = new Date('2024-01-15T00:00:00');
      const result = formatTime(date);

      expect(result.hours).toBe('00');
      expect(result.minutes).toBe('00');
      expect(result.seconds).toBe('00');
    });

    it('should handle noon time', () => {
      const date = new Date('2024-01-15T12:30:45');
      const result = formatTime(date);

      expect(result.hours).toBe('12');
      expect(result.minutes).toBe('30');
      expect(result.seconds).toBe('45');
    });
  });

  describe('formatDate', () => {
    it('should format Thai date correctly', () => {
      // January 15, 2024 is Monday
      const date = new Date('2024-01-15');
      const result = formatDate(date, 'th');

      expect(result).toContain('จันทร์');
      expect(result).toContain('15');
      expect(result).toContain('มกราคม');
      expect(result).toContain('2567'); // 2024 + 543
    });

    it('should format English date correctly', () => {
      const date = new Date('2024-01-15');
      const result = formatDate(date, 'en');

      expect(result).toContain('January');
      expect(result).toContain('15');
      expect(result).toContain('2024');
      expect(result).not.toContain('วัน');
    });

    it('should handle different months in Thai', () => {
      const date = new Date('2024-12-25');
      const result = formatDate(date, 'th');

      expect(result).toContain('ธันวาคม');
      expect(result).toContain('2567'); // Thai year
    });

    it('should handle different months in English', () => {
      const date = new Date('2024-12-25');
      const result = formatDate(date, 'en');

      expect(result).toContain('December');
      expect(result).toContain('2024');
    });

    it('should handle all days of week in Thai', () => {
      const daysOfWeekTh = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];

      // Test each day (starting from Sunday Jan 7, 2024)
      for (let i = 0; i < 7; i++) {
        const date = new Date(`2024-01-${7 + i}`);
        const result = formatDate(date, 'th');
        expect(result).toContain(daysOfWeekTh[i]);
      }
    });

    it('should handle all days of week in English', () => {
      // Note: English format doesn't include day names, just date components
      const dates = [
        { date: '2024-01-07', contains: 'January' }, // Sunday
        { date: '2024-01-08', contains: 'January' }, // Monday
        { date: '2024-01-09', contains: 'January' }, // Tuesday
        { date: '2024-01-10', contains: 'January' }, // Wednesday
        { date: '2024-01-11', contains: 'January' }, // Thursday
        { date: '2024-01-12', contains: 'January' }, // Friday
        { date: '2024-01-13', contains: 'January' }, // Saturday
      ];

      dates.forEach(({ date, contains }) => {
        const result = formatDate(new Date(date), 'en');
        expect(result).toContain(contains);
        expect(result).toContain('2024');
      });
    });
  });
});
