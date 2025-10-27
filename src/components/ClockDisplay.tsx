/**
 * Clock display component showing time and date
 * Optimized with React.memo and memoized sub-components to prevent unnecessary re-renders
 */

import { memo, useMemo } from "react";
import { formatTime, formatDate } from "@/lib/timeUtils";
import { getFontSizeClasses } from "@/lib/themeConstants";
import { getTranslation, type Language } from "@/lib/translations";
import type { Theme, ThemeClasses } from "@/lib/themeConstants";

interface ClockDisplayProps {
  currentTime: Date;
  fontSize: number;
  language: Language;
  theme: Theme;
  themeClasses: ThemeClasses;
}

// Memoized time display component - only re-renders when time values change
const TimeDisplay = memo(function TimeDisplay({
  hours,
  minutes,
  seconds,
  fontSizeClasses,
  themeClasses,
}: {
  hours: string;
  minutes: string;
  seconds: string;
  fontSizeClasses: ReturnType<typeof getFontSizeClasses>;
  themeClasses: ThemeClasses;
}) {
  return (
    <div className="flex items-center justify-center gap-2 md:gap-4">
      <div className="text-center">
        <div
          className={`${fontSizeClasses.time} font-mono font-bold ${themeClasses.textPrimary} drop-shadow-lg`}
        >
          {hours}
        </div>
      </div>

      <div
        className={`${fontSizeClasses.time} font-mono font-bold ${themeClasses.textPrimary}`}
      >
        :
      </div>

      <div className="text-center">
        <div
          className={`${fontSizeClasses.time} font-mono font-bold ${themeClasses.textPrimary} drop-shadow-lg`}
        >
          {minutes}
        </div>
      </div>

      <div
        className={`${fontSizeClasses.time} font-mono font-bold ${themeClasses.textPrimary}`}
      >
        :
      </div>

      <div className="text-center">
        <div
          className={`${fontSizeClasses.time} font-mono font-bold ${themeClasses.textPrimary} drop-shadow-lg`}
        >
          {seconds}
        </div>
      </div>
    </div>
  );
});

// Memoized date display component - only re-renders when date changes
const DateDisplay = memo(function DateDisplay({
  currentTime,
  language,
  fontSizeClasses,
  themeClasses,
}: {
  currentTime: Date;
  language: Language;
  fontSizeClasses: ReturnType<typeof getFontSizeClasses>;
  themeClasses: ThemeClasses;
}) {
  const formattedDate = useMemo(
    () => formatDate(currentTime, language),
    [currentTime, language]
  );

  return (
    <div className="text-center">
      <p
        className={`${fontSizeClasses.date} ${themeClasses.text} opacity-80 font-medium`}
      >
        {formattedDate}
      </p>
    </div>
  );
});

// Memoized rules display - only re-renders when language changes
const ExamRulesDisplay = memo(function ExamRulesDisplay({
  language,
  fontSizeClasses,
  themeClasses,
}: {
  language: Language;
  fontSizeClasses: ReturnType<typeof getFontSizeClasses>;
  themeClasses: ThemeClasses;
}) {
  return (
    <div className="mt-3 text-center">
      <p
        className={`${fontSizeClasses.rule} ${themeClasses.text} opacity-80 font-thin`}
      >
        {getTranslation("examRuleSubmission", language)}
      </p>
    </div>
  );
});

// Memoized gradient divider - only re-renders when theme changes
const GradientDivider = memo(function GradientDivider({
  theme,
}: {
  theme: Theme;
}) {
  return (
    <div
      className={`h-1 ${theme === "dark" ? "bg-gradient-to-r from-transparent via-green-500/30 to-transparent" : "bg-gradient-to-r from-transparent via-green-400/20 to-transparent"} mt-3`}
    ></div>
  );
});

export const ClockDisplay = memo(function ClockDisplay({
  currentTime,
  fontSize,
  language,
  theme,
  themeClasses,
}: ClockDisplayProps) {
  const { hours, minutes, seconds } = formatTime(currentTime);
  const fontSizeClasses = useMemo(
    () => getFontSizeClasses(fontSize),
    [fontSize]
  );

  return (
    <div className="relative z-10">
      <div className={`p-2 md:p-3 transition-colors duration-500`}>
        {/* Date Display */}
        <DateDisplay
          currentTime={currentTime}
          language={language}
          fontSizeClasses={fontSizeClasses}
          themeClasses={themeClasses}
        />

        {/* Time Display */}
        <TimeDisplay
          hours={hours}
          minutes={minutes}
          seconds={seconds}
          fontSizeClasses={fontSizeClasses}
          themeClasses={themeClasses}
        />

        <GradientDivider theme={theme} />

        {/* Exam Rules */}
        <ExamRulesDisplay
          language={language}
          fontSizeClasses={fontSizeClasses}
          themeClasses={themeClasses}
        />
      </div>
    </div>
  );
});
