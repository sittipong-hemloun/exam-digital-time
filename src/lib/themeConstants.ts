/**
 * Theme and styling constants for exam clock
 */

export type Theme = "light" | "dark";

export interface ThemeClasses {
  background: string;
  decorativeGlow1: string;
  decorativeGlow2: string;
  card: string;
  cardBorder: string;
  text: string;
  textMuted: string;
  textPrimary: string;
  gradient: string;
}

export interface FontSizeClasses {
  time: string;
  date: string;
  examInfo: string;
  rule: string;
}

/**
 * Get theme-specific CSS classes
 */
export const getThemeClasses = (theme: Theme): ThemeClasses => {
  if (theme === "light") {
    return {
      background: "bg-gradient-to-br from-blue-50 via-white to-green-50",
      decorativeGlow1: "bg-blue-400/20",
      decorativeGlow2: "bg-green-400/20",
      card: "bg-white/10",
      cardBorder: "border-gray-200",
      text: "text-gray-900",
      textMuted: "text-gray-600",
      textPrimary: "text-green-600",
      gradient: "from-blue-600 to-green-600",
    };
  }

  // Dark theme (default)
  return {
    background: "bg-gradient-background",
    decorativeGlow1: "bg-primary/10",
    decorativeGlow2: "bg-accent-green/10",
    card: "bg-card/50",
    cardBorder: "border-border",
    text: "text-foreground",
    textMuted: "text-muted-foreground",
    textPrimary: "text-primary",
    gradient: "from-primary to-accent-green",
  };
};

/**
 * Get font size classes based on fontSize level
 */
export const getFontSizeClasses = (fontSize: number): FontSizeClasses => {
  const sizes: Record<number, FontSizeClasses> = {
    1: {
      time: "text-7xl md:text-[6rem]",
      date: "text-xl md:text-2xl",
      examInfo: "text-base md:text-3xl",
      rule: "text-sm md:text-lg",
    },
    2: {
      time: "text-8xl md:text-[7rem]",
      date: "text-2xl md:text-3xl",
      examInfo: "text-lg md:text-4xl",
      rule: "text-base md:text-xl",
    },
    3: {
      time: "text-9xl md:text-[8rem]",
      date: "text-3xl md:text-4xl",
      examInfo: "text-xl md:text-5xl",
      rule: "text-lg md:text-2xl",
    },
    4: {
      time: "text-[10rem] md:text-[9rem]",
      date: "text-4xl md:text-5xl",
      examInfo: "text-2xl md:text-6xl",
      rule: "text-xl md:text-3xl",
    },
    5: {
      time: "text-[12rem] md:text-[10rem]",
      date: "text-5xl md:text-6xl",
      examInfo: "text-3xl md:text-7xl",
      rule: "text-2xl md:text-4xl",
    },
  };
  return sizes[fontSize as keyof typeof sizes] || sizes[3];
};

/**
 * Get input field classes based on theme
 */
export const getInputClasses = (theme: Theme): string => {
  if (theme === "dark") {
    return "bg-black text-white border border-gray-700 focus:border-primary focus:bg-gray-800";
  }
  return "bg-gray-50/80 text-gray-900 border border-gray-300 focus:border-green-600 focus:bg-white";
};

/**
 * Get button container classes based on theme
 */
export const getButtonContainerClasses = (theme: Theme): string => {
  return `flex gap-2 backdrop-blur-lg rounded-full px-3 py-2 border border-white/20 ${
    theme === "dark" ? "bg-white/5" : "bg-black/5"
  } transition-colors duration-500`;
};

/**
 * Get button classes based on theme
 */
export const getButtonClasses = (theme: Theme, size: "sm" | "md" | "lg" = "md"): string => {
  const baseClasses =
    theme === "dark"
      ? "bg-white/5 hover:bg-white/10 text-foreground"
      : "bg-black/5 hover:bg-black/10 text-gray-900";

  const sizeClasses = {
    sm: "h-9 w-9",
    md: "px-4 h-10 gap-2",
    lg: "px-4 h-14 gap-2",
  };

  return `rounded-full ${sizeClasses[size]} ${baseClasses} border border-white/20 backdrop-blur-lg flex items-center`;
};
