/**
 * Clock display component showing time and date
 */

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

export function ClockDisplay({
  currentTime,
  fontSize,
  language,
  theme,
  themeClasses,
}: ClockDisplayProps) {
  const { hours, minutes, seconds } = formatTime(currentTime);
  const fontSizeClasses = getFontSizeClasses(fontSize);

  return (
    <div className="relative z-10">
      <div className={`p-2 md:p-3 transition-colors duration-500`}>
        {/* Time Display */}
        <div className="flex items-center justify-center gap-2 md:gap-4 mb-3 md:mb-4">
          <div className="text-center">
            <div
              className={`${fontSizeClasses.time} font-mono font-bold  ${themeClasses.textPrimary} drop-shadow-lg`}
            >
              {hours}
            </div>
          </div>

          <div
            className={`${fontSizeClasses.time} font-mono font-bold ${themeClasses.textPrimary} transition-colors duration-500`}
          >
            :
          </div>

          <div className="text-center">
            <div
              className={`${fontSizeClasses.time} font-mono font-bold  ${themeClasses.textPrimary} drop-shadow-lg`}
            >
              {minutes}
            </div>
          </div>

          <div
            className={`${fontSizeClasses.time} font-mono font-bold ${themeClasses.textPrimary} transition-colors duration-500`}
          >
            :
          </div>

          <div className="text-center">
            <div
              className={`${fontSizeClasses.time} font-mono font-bold  ${themeClasses.textPrimary} drop-shadow-lg`}
            >
              {seconds}
            </div>
          </div>
        </div>

        {/* Date Display */}
        <div className="text-center">
          <p
            className={`${fontSizeClasses.date} ${themeClasses.text} opacity-80 font-medium transition-all duration-300`}
          >
            {formatDate(currentTime, language)}
          </p>
        </div>

        <hr className="mt-3"/>

        {/* Exam Rules */}
        <div className="mt-3 text-center">
          <p
            className={`${fontSizeClasses.rule} ${themeClasses.text} opacity-80 font-thin transition-all duration-300`}
          >
            {getTranslation("examRuleSubmission", language)}
          </p>
          <p
            className={`${fontSizeClasses.rule} ${themeClasses.text} opacity-80 font-thin transition-all duration-300`}
          >
            {getTranslation("examRuleCommunication", language)}
          </p>
        </div>
      </div>
    </div>
  );
}
