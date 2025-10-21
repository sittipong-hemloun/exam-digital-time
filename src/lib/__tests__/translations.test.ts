/**
 * Tests for translations
 */

import { getTranslation } from '../translations';

describe('translations', () => {
  describe('getTranslation', () => {
    it('should return Thai translation when language is "th"', () => {
      const result = getTranslation('examInfo', 'th');
      expect(result).toBe('ข้อมูลการสอบ');
    });

    it('should return English translation when language is "en"', () => {
      const result = getTranslation('examInfo', 'en');
      expect(result).toBe('Exam Information');
    });

    it('should return correct Thai button labels', () => {
      expect(getTranslation('cancel', 'th')).toBe('ยกเลิก');
      expect(getTranslation('confirm', 'th')).toBe('ยืนยัน');
    });

    it('should return correct English button labels', () => {
      expect(getTranslation('cancel', 'en')).toBe('Cancel');
      expect(getTranslation('confirm', 'en')).toBe('Confirm');
    });

    it('should return correct form labels in Thai', () => {
      expect(getTranslation('course', 'th')).toBe('รหัสวิชา/ชื่อวิชา');
      expect(getTranslation('lecture', 'th')).toBe('หมู่บรรยาย');
      expect(getTranslation('lab', 'th')).toBe('หมู่ปฏิบัติ');
      expect(getTranslation('examRoom', 'th')).toBe('ห้องสอบ');
    });

    it('should return correct form labels in English', () => {
      expect(getTranslation('course', 'en')).toBe('Course Code/Name');
      expect(getTranslation('lecture', 'en')).toBe('Lecture Section');
      expect(getTranslation('lab', 'en')).toBe('Lab Section');
      expect(getTranslation('examRoom', 'en')).toBe('Exam Room');
    });

    it('should return correct placeholder text in Thai', () => {
      const result = getTranslation('coursePlaceholder', 'th');
      expect(result).toContain('CS101');
      expect(result).toContain('Computer Programming');
    });

    it('should return correct placeholder text in English', () => {
      const result = getTranslation('coursePlaceholder', 'en');
      expect(result).toContain('CS101');
      expect(result).toContain('Computer Programming');
    });

    it('should return the key itself if translation does not exist', () => {
      const result = getTranslation('nonExistentKey', 'th');
      expect(result).toBe('nonExistentKey');
    });

    it('should handle all UI labels', () => {
      const labels = [
        'decreaseFont',
        'increaseFont',
        'settings',
        'changeLanguage',
        'changeTheme',
        'fullscreen',
        'exitFullscreen',
      ];

      labels.forEach(label => {
        const thTranslation = getTranslation(label, 'th');
        const enTranslation = getTranslation(label, 'en');

        expect(thTranslation).toBeTruthy();
        expect(enTranslation).toBeTruthy();
        expect(thTranslation).not.toBe(label);
        expect(enTranslation).not.toBe(label);
      });
    });
  });
});
