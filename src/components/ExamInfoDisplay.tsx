/**
 * Exam information display component
 */

import { getFontSizeClasses } from "@/lib/themeConstants";
import { getTranslation, type Language } from "@/lib/translations";
import type { Theme, ThemeClasses, FontSizeClasses } from "@/lib/themeConstants";
import type { ExamInfo } from "@/hooks/useExamInfo";

interface ExamInfoDisplayProps {
  examInfo: ExamInfo;
  fontSize: number;
  language: Language;
  theme: Theme;
  themeClasses: ThemeClasses;
  hasExamInfo: boolean;
}

export function ExamInfoDisplay({
  examInfo,
  fontSize,
  language,
  theme,
  themeClasses,
  hasExamInfo,
}: ExamInfoDisplayProps) {
  if (!hasExamInfo) {
    return null;
  }

  const fontSizeClasses = getFontSizeClasses(fontSize);

  return (
    <div className="relative z-10 mt-8 w-full max-w-7xl mx-auto px-4">
      <div
        className={`${themeClasses.card} backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-2xl border ${themeClasses.cardBorder} transition-colors duration-500`}
      >
        <div className={`grid grid-cols-1 md:grid-cols-12 gap-3 ${fontSizeClasses.examInfo} transition-all duration-300`}>
          {examInfo.course && (
            <div className="flex gap-2 col-span-full">
              <span className={`font-semibold ${themeClasses.textPrimary} transition-colors duration-500`}>
                {getTranslation("course", language)}:
              </span>
              <span className={`${themeClasses.text} opacity-90 transition-colors duration-500`}>
                {examInfo.course}
              </span>
            </div>
          )}
          {examInfo.lecture && (
            <div className="flex gap-2 col-span-6">
              <span className={`font-semibold ${themeClasses.textPrimary} transition-colors duration-500`}>
                {getTranslation("lecture", language)}:
              </span>
              <span className={`${themeClasses.text} opacity-90 transition-colors duration-500`}>
                {examInfo.lecture}
              </span>
            </div>
          )}
          {examInfo.lab && (
            <div className="flex gap-2 col-span-6">
              <span className={`font-semibold ${themeClasses.textPrimary} transition-colors duration-500`}>
                {getTranslation("lab", language)}:
              </span>
              <span className={`${themeClasses.text} opacity-90 transition-colors duration-500`}>
                {examInfo.lab}
              </span>
            </div>
          )}
          {examInfo.time && (
            <div className="flex gap-2 col-span-6">
              <span className={`font-semibold ${themeClasses.textPrimary} transition-colors duration-500`}>
                {getTranslation("examTime", language)}:
              </span>
              <span className={`${themeClasses.text} opacity-90 transition-colors duration-500`}>
                {examInfo.time}
              </span>
            </div>
          )}
          {examInfo.examRoom && (
            <div className="flex gap-2 col-span-6">
              <span className={`font-semibold ${themeClasses.textPrimary} transition-colors duration-500`}>
                {getTranslation("examRoom", language)}:
              </span>
              <span className={`${themeClasses.text} opacity-90 transition-colors duration-500`}>
                {examInfo.examRoom}
              </span>
            </div>
          )}
          {examInfo.remarks && (
            <div className="flex gap-2 md:col-span-12">
              <span className={`font-semibold ${themeClasses.textPrimary} transition-colors duration-500`}>
                {getTranslation("remarks", language)}:
              </span>
              <span className={`${themeClasses.text} opacity-90 transition-colors duration-500`}>
                {examInfo.remarks}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
