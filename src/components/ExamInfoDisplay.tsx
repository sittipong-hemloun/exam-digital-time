/**
 * Exam information display component
 * Optimized with React.memo to prevent unnecessary re-renders
 */

import { memo, useMemo } from "react";
import { getFontSizeClasses } from "@/lib/themeConstants";
import { getTranslation, type Language } from "@/lib/translations";
import type { ThemeClasses } from "@/lib/themeConstants";
import type { ExamInfo } from "@/hooks/useExamInfo";

interface ExamInfoDisplayProps {
  examInfo: ExamInfo;
  fontSize: number;
  language: Language;
  themeClasses: ThemeClasses;
  hasExamInfo: boolean;
}

export const ExamInfoDisplay = memo(function ExamInfoDisplay({
  examInfo,
  fontSize,
  language,
  themeClasses,
  hasExamInfo,
}: ExamInfoDisplayProps) {
  const fontSizeClasses = useMemo(
    () => getFontSizeClasses(fontSize),
    [fontSize]
  );

  if (!hasExamInfo) {
    return null;
  }

  return (
    <div className="relative z-10 mt-8 w-full max-w-8xl mx-auto px-4">
      <div
        className={`${themeClasses.card} backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-2xl border ${themeClasses.cardBorder} transition-colors duration-500`}
      >
        <div
          className={`grid grid-cols-1 md:grid-cols-12 gap-6 ${fontSizeClasses.examInfo} transition-all duration-300`}
        >
          {examInfo.courseCode && (
            <div className="flex gap-2 col-span-full md:col-span-full">
              <span
                className={`font-semibold ${themeClasses.textPrimary} transition-colors duration-500`}
              >
                {getTranslation("courseCode", language)}:
              </span>
              <span className={`${themeClasses.text} opacity-90 transition-colors duration-500`}>
                {examInfo.courseCode}
              </span>
            </div>
          )}
          {examInfo.courseName && (
            <div className="flex gap-2 col-span-full md:col-span-full">
              <span
                className={`font-semibold ${themeClasses.textPrimary} transition-colors duration-500`}
              >
                {getTranslation("courseName", language)}:
              </span>
              <span className={`${themeClasses.text} opacity-90 transition-colors duration-500`}>
                {examInfo.courseName}
              </span>
            </div>
          )}
          {examInfo.lecture && (
            <div className="flex gap-2 col-span-6">
              <span
                className={`font-semibold ${themeClasses.textPrimary} transition-colors duration-500`}
              >
                {getTranslation("lecture", language)}:
              </span>
              <span className={`${themeClasses.text} opacity-90 transition-colors duration-500`}>
                {examInfo.lecture}
              </span>
            </div>
          )}
          {examInfo.lab && (
            <div className="flex gap-2 col-span-6">
              <span
                className={`font-semibold ${themeClasses.textPrimary} transition-colors duration-500`}
              >
                {getTranslation("lab", language)}:
              </span>
              <span className={`${themeClasses.text} opacity-90 transition-colors duration-500`}>
                {examInfo.lab}
              </span>
            </div>
          )}
          {examInfo.time && (
            <div className="flex gap-2 col-span-6">
              <span
                className={`font-semibold ${themeClasses.textPrimary} transition-colors duration-500`}
              >
                {getTranslation("examTime", language)}:
              </span>
              <span className={`${themeClasses.text} opacity-90 transition-colors duration-500`}>
                {examInfo.time}
              </span>
            </div>
          )}
          {examInfo.examRoom && (
            <div className="flex gap-2 col-span-6">
              <span
                className={`font-semibold ${themeClasses.textPrimary} transition-colors duration-500`}
              >
                {getTranslation("examRoom", language)}:
              </span>
              <span className={`${themeClasses.text} opacity-90 transition-colors duration-500`}>
                {examInfo.examRoom}
              </span>
            </div>
          )}
          {examInfo.remarks && (
            <div className="flex gap-2 md:col-span-12">
              <span
                className={`font-semibold ${themeClasses.textPrimary} transition-colors duration-500`}
              >
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
});
