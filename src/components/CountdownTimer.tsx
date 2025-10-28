/**
 * Countdown timer component with progress bar
 * Shows time remaining until exam end with color coding
 */

import { memo, useMemo } from "react";
import { useCountdown, type CountdownColor } from "@/hooks/useCountdown";
import { parseExamTime } from "@/lib/examTimeParser";
import { getFontSizeClasses } from "@/lib/themeConstants";
import { getTranslation, type Language } from "@/lib/translations";
import type { ThemeClasses } from "@/lib/themeConstants";

interface CountdownTimerProps {
  currentTime: Date; // Server-synced current time
  examTime: string; // e.g., "09:00 - 12:00"
  fontSize: number;
  language: Language;
  themeClasses: ThemeClasses;
  onAlert?: (minutesLeft: number) => void;
}

// Color mapping for different states
const getColorClasses = (
  color: CountdownColor
): {
  text: string;
  progress: string;
  glow: string;
} => {
  switch (color) {
    case "green":
      return {
        text: "text-green-500",
        progress: "bg-green-500",
        glow: "shadow-green-500/50",
      };
    case "yellow":
      return {
        text: "text-yellow-500",
        progress: "bg-yellow-500",
        glow: "shadow-yellow-500/50",
      };
    case "red":
      return {
        text: "text-red-500",
        progress: "bg-red-500",
        glow: "shadow-red-500/50",
      };
  }
};

export const CountdownTimer = memo(function CountdownTimer({
  currentTime,
  examTime,
  fontSize,
  language,
  themeClasses,
  onAlert,
}: CountdownTimerProps) {
  // Parse exam time
  const { startTime, endTime, isValid } = useMemo(
    () => parseExamTime(examTime),
    [examTime]
  );

  // Use countdown hook with server-synced time
  const countdown = useCountdown({
    currentTime,
    startTime: startTime || undefined,
    endTime: endTime || undefined,
    yellowThreshold: 30,
    redThreshold: 15,
    alertTimes: [30, 15, 5],
    onAlert,
  });

  const fontSizeClasses = useMemo(
    () => getFontSizeClasses(fontSize),
    [fontSize]
  );

  // Don't render if exam time is invalid or countdown is not active
  if (!isValid || !countdown.isActive) {
    return null;
  }

  const colorClasses = getColorClasses(countdown.color);
  const { hours, minutes, seconds } = countdown.timeLeft;

  return (
    <div className="flex flex-col items-center gap-4 min-w-[200px]">
      {/* Title */}
      <div className="text-center">
        <p
          className={`${fontSizeClasses.date} ${themeClasses.text} font-medium`}
        >
          {getTranslation("timeRemaining", language)}
        </p>
      </div>

      {/* Countdown Display */}
      <div className="flex flex-col items-center gap-2">
        {/* Large Time Display */}
        <div
          className={`${fontSizeClasses.date} font-mono font-bold ${colorClasses.text} drop-shadow-lg transition-all duration-500`}
        >
          {String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}:
          {String(seconds).padStart(2, "0")}
        </div>

        {/* Status Text */}
        <div className="text-center">
          <p
            className={`${fontSizeClasses.rule} ${themeClasses.text} opacity-70 font-medium transition-colors duration-500`}
          >
            {countdown.status === "in-progress" &&
              getTranslation("examInProgress", language)}
            {countdown.status === "finished" &&
              getTranslation("examFinished", language)}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full">
        {/* Progress Bar Container */}
        <div
          className={`w-full h-3 ${themeClasses.cardBorder} border rounded-full overflow-hidden backdrop-blur-sm transition-all duration-500`}
        >
          <div
            className={`h-full ${colorClasses.progress} transition-all duration-1000 ease-linear ${colorClasses.glow} shadow-lg`}
            style={{ width: `${countdown.progress}%` }}
          ></div>
        </div>

        {/* Progress Percentage */}
        <div className="mt-2 text-center">
          <p
            className={`${fontSizeClasses.rule} ${themeClasses.text} opacity-60 font-medium`}
          >
            {Math.round(countdown.progress)}% {getTranslation("elapsed", language)}
          </p>
        </div>
      </div>

      {/* Warning Messages */}
      {countdown.color === "yellow" && (
        <div
          className={`text-center px-3 py-1 rounded-lg bg-yellow-500/10 border border-yellow-500/30`}
        >
          <p className={`${fontSizeClasses.rule} text-yellow-500 font-medium`}>
            {getTranslation("warningTimeRunningOut", language)}
          </p>
        </div>
      )}

      {countdown.color === "red" && (
        <div
          className={`text-center px-3 py-1 rounded-lg bg-red-500/10 border border-red-500/30 animate-pulse`}
        >
          <p className={`${fontSizeClasses.rule} text-red-500 font-medium`}>
            {getTranslation("criticalTimeLow", language)}
          </p>
        </div>
      )}
    </div>
  );
});
