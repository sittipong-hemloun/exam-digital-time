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
  theme: string;
}

// Color mapping for different states with enhanced visual effects
const getColorClasses = (
  color: CountdownColor
): {
  text: string;
  textGlow: string;
  progress: string;
  progressGradient: string;
  glow: string;
  bgAccent: string;
  animation: string;
} => {
  switch (color) {
    case "green":
      return {
        text: "text-green-400",
        textGlow: "drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]",
        progress: "bg-gradient-to-r from-green-400 via-green-500 to-green-600",
        progressGradient: "bg-green-500",
        glow: "shadow-[0_0_15px_rgba(34,197,94,0.6)]",
        bgAccent: "bg-green-500/10",
        animation: "",
      };
    case "yellow":
      return {
        text: "text-yellow-400",
        textGlow: "drop-shadow-[0_0_10px_rgba(234,179,8,0.6)]",
        progress: "bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500",
        progressGradient: "bg-yellow-500",
        glow: "shadow-[0_0_20px_rgba(234,179,8,0.7)]",
        bgAccent: "bg-yellow-500/10",
        animation: "animate-pulse",
      };
    case "red":
      return {
        text: "text-red-400",
        textGlow: "drop-shadow-[0_0_12px_rgba(239,68,68,0.8)]",
        progress: "bg-gradient-to-r from-red-400 via-red-500 to-red-600",
        progressGradient: "bg-red-500",
        glow: "shadow-[0_0_25px_rgba(239,68,68,0.9)]",
        bgAccent: "bg-red-500/10",
        animation: "animate-pulse",
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
  theme,
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
    <>
      <div className="flex items-center justify-center">
        {/* Vertical divider for desktop, horizontal for mobile */}
        <div className="relative flex items-center justify-center">
          {/* Mobile: Horizontal Divider */}
          <div className="lg:hidden w-64 h-px relative">
            <div
              className={`absolute inset-0 ${theme === "dark" ? "bg-gradient-to-r from-transparent via-green-500/50 to-transparent" : "bg-gradient-to-r from-transparent via-green-600/40 to-transparent"}`}
            ></div>
          </div>

          {/* Desktop: Vertical Divider */}
          <div className="hidden lg:block h-64 w-px relative">
            <div
              className={`absolute inset-0 ${theme === "dark" ? "bg-gradient-to-b from-transparent via-green-500/50 to-transparent" : "bg-gradient-to-b from-transparent via-green-600/40 to-transparent"}`}
            ></div>
            {/* Glowing center dot */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div
                className={`w-3 h-3 rounded-full ${theme === "dark" ? "bg-green-500" : "bg-green-600"} shadow-lg ${theme === "dark" ? "shadow-green-500/50" : "shadow-green-600/50"} animate-pulse`}
              ></div>
            </div>
          </div>
        </div>
      </div>

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
          {/* Large Time Display with Enhanced Glow */}
          <div
            className={`${fontSizeClasses.countdown} font-mono font-bold ${colorClasses.text} ${colorClasses.textGlow} ${colorClasses.animation} transition-all duration-500`}
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

        {/* Progress Bar with Enhanced Effects */}
        <div className="w-full">
          {/* Progress Bar Container */}
          <div
            className={`relative w-full h-4 ${themeClasses.cardBorder} border-2 rounded-full overflow-hidden backdrop-blur-sm transition-all duration-500 ${colorClasses.bgAccent}`}
          >
            {/* Gradient Progress Bar with Glow */}
            <div
              className={`h-full ${colorClasses.progress} transition-all duration-1000 ease-linear ${colorClasses.glow} relative overflow-hidden`}
              style={{ width: `${countdown.progress}%` }}
            >
              {/* Shimmer Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            </div>
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
      </div>
    </>
  );
});
