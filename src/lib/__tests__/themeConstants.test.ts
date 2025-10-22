/**
 * Tests for theme utilities
 */

import {
  getThemeClasses,
  getFontSizeClasses,
  getInputClasses,
  getButtonClasses,
} from "../themeConstants";

describe("themeConstants", () => {
  describe("getThemeClasses", () => {
    it("should return dark theme classes by default", () => {
      const result = getThemeClasses("dark");

      expect(result.background).toBe("bg-gradient-background");
      expect(result.text).toBe("text-foreground");
      expect(result.textPrimary).toBe("text-primary");
      expect(result.textMuted).toBe("text-muted-foreground");
    });

    it("should return light theme classes", () => {
      const result = getThemeClasses("light");

      expect(result.background).toContain("from-blue-50");
      expect(result.text).toBe("text-gray-900");
      expect(result.textPrimary).toBe("text-green-600");
      expect(result.textMuted).toBe("text-gray-600");
    });

    it("should have gradient property for both themes", () => {
      const darkResult = getThemeClasses("dark");
      const lightResult = getThemeClasses("light");

      expect(darkResult.gradient).toBeTruthy();
      expect(lightResult.gradient).toBeTruthy();
    });

    it("should have decorative glow classes", () => {
      const darkResult = getThemeClasses("dark");
      const lightResult = getThemeClasses("light");

      expect(darkResult.decorativeGlow1).toBeTruthy();
      expect(darkResult.decorativeGlow2).toBeTruthy();
      expect(lightResult.decorativeGlow1).toBeTruthy();
      expect(lightResult.decorativeGlow2).toBeTruthy();
    });

    it("should have card styling", () => {
      const darkResult = getThemeClasses("dark");
      const lightResult = getThemeClasses("light");

      expect(darkResult.card).toBeTruthy();
      expect(darkResult.cardBorder).toBeTruthy();
      expect(lightResult.card).toBeTruthy();
      expect(lightResult.cardBorder).toBeTruthy();
    });
  });

  describe("getFontSizeClasses", () => {
    it("should return correct classes for font size level 1", () => {
      const result = getFontSizeClasses(1);

      expect(result.time).toContain("text-7xl");
      expect(result.date).toContain("text-xl");
      expect(result.examInfo).toContain("text-base");
    });

    it("should return correct classes for font size level 3 (medium)", () => {
      const result = getFontSizeClasses(3);

      expect(result.time).toContain("text-9xl");
      expect(result.date).toContain("text-3xl");
      expect(result.examInfo).toContain("text-xl");
    });

    it("should return correct classes for font size level 5 (largest)", () => {
      const result = getFontSizeClasses(5);

      expect(result.time).toContain("text-[12rem]");
      expect(result.date).toContain("text-5xl");
      expect(result.examInfo).toContain("text-3xl");
    });

    it("should return default size for invalid level", () => {
      const result = getFontSizeClasses(99);

      expect(result).toBeDefined();
      expect(result.time).toBeTruthy();
      expect(result.date).toBeTruthy();
      expect(result.examInfo).toBeTruthy();
    });

    it("should have all required properties", () => {
      const result = getFontSizeClasses(2);

      expect(result).toHaveProperty("time");
      expect(result).toHaveProperty("date");
      expect(result).toHaveProperty("examInfo");
    });
  });

  describe("getInputClasses", () => {
    it("should return dark theme input classes", () => {
      const result = getInputClasses("dark");

      expect(result).toContain("bg-black");
      expect(result).toContain("text-white");
      expect(result).toContain("border-gray-700");
    });

    it("should return light theme input classes", () => {
      const result = getInputClasses("light");

      expect(result).toContain("bg-gray-50");
      expect(result).toContain("text-gray-900");
      expect(result).toContain("border-gray-300");
    });

    it("should include focus states", () => {
      const darkResult = getInputClasses("dark");
      const lightResult = getInputClasses("light");

      expect(darkResult).toContain("focus:");
      expect(lightResult).toContain("focus:");
    });
  });

  describe("getButtonClasses", () => {
    it("should return dark theme button classes by default", () => {
      const result = getButtonClasses("dark", "md");

      expect(result).toContain("bg-white/5");
      expect(result).toContain("text-foreground");
      expect(result).toContain("rounded-full");
    });

    it("should return light theme button classes", () => {
      const result = getButtonClasses("light", "md");

      expect(result).toContain("bg-black/5");
      expect(result).toContain("text-gray-900");
    });

    it("should apply small size classes", () => {
      const result = getButtonClasses("dark", "sm");

      expect(result).toContain("h-9");
      expect(result).toContain("w-9");
    });

    it("should apply medium size classes", () => {
      const result = getButtonClasses("dark", "md");

      expect(result).toContain("px-4");
      expect(result).toContain("h-10");
    });

    it("should apply large size classes", () => {
      const result = getButtonClasses("dark", "lg");

      expect(result).toContain("px-4");
      expect(result).toContain("h-14");
    });

    it("should include hover and border states", () => {
      const result = getButtonClasses("dark", "md");

      expect(result).toContain("hover:");
      expect(result).toContain("border");
      expect(result).toContain("backdrop-blur");
    });
  });
});
