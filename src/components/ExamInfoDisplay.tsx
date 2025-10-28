/**
 * Exam information display component
 * Optimized with React.memo to prevent unnecessary re-renders
 */

import { memo, useMemo } from "react";
import { Pencil } from "lucide-react";
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
  theme: string;
  onEdit?: () => void;
}

export const ExamInfoDisplay = memo(function ExamInfoDisplay({
  examInfo,
  fontSize,
  language,
  themeClasses,
  hasExamInfo,
  theme,
  onEdit,
}: ExamInfoDisplayProps) {
  const fontSizeClasses = useMemo(
    () => getFontSizeClasses(fontSize),
    [fontSize]
  );

  if (!hasExamInfo) {
    return null;
  }

  return (
    <div className="w-full max-w-8xl px-4">
      <div
        className={`${themeClasses.card} backdrop-blur-md rounded-2xl p-6 md:p-4 shadow-lg border ${themeClasses.cardBorder} transition-all duration-500 relative`}
      >
        {/* Edit Button */}
        {onEdit && (
          <button
            onClick={onEdit}
            className={`absolute top-4 z-10 right-4 p-2 rounded-lg backdrop-blur-lg border transition-all duration-300 hover:scale-110 ${
              theme === "dark"
                ? "border-green-500 bg-green-600/80 text-white hover:bg-green-500 shadow-lg shadow-green-500/20"
                : "border-green-600 bg-green-500/80 text-white hover:bg-green-400 shadow-lg shadow-green-400/20"
            }`}
            title={language === "th" ? "แก้ไขข้อมูลการสอบ" : "Edit Exam Information"}
          >
            <Pencil className="h-5 w-5" />
          </button>
        )}
        <div
          className={`grid grid-cols-1 md:grid-cols-12 gap-2 ${fontSizeClasses.examInfo} transition-all duration-300`}
        >
          {examInfo.courseCode && (
            <div className="flex flex-col gap-1 col-span-6">
              <span
                className={`text-2xl font-medium ${themeClasses.textPrimary} opacity-70 transition-colors duration-500`}
              >
                {getTranslation("courseCode", language)}
              </span>
              <span className={`${themeClasses.text} font-semibold transition-colors duration-500`}>
                {examInfo.courseCode}
              </span>
            </div>
          )}
          {examInfo.time && (
            <div className="flex flex-col gap-1 col-span-6">
              <span
                className={`text-2xl font-medium ${themeClasses.textPrimary} opacity-70 transition-colors duration-500`}
              >
                {getTranslation("examTime", language)}
              </span>
              <span className={`${themeClasses.text} font-semibold transition-colors duration-500`}>
                {examInfo.time}
              </span>
            </div>
          )}
          {examInfo.courseName && (
            <div className="flex flex-col gap-1 col-span-12">
              <span
                className={`text-2xl font-medium ${themeClasses.textPrimary} opacity-70 transition-colors duration-500`}
              >
                {getTranslation("courseName", language)}
              </span>
              <span className={`${themeClasses.text} font-semibold transition-colors duration-500`}>
                {examInfo.courseName}
              </span>
            </div>
          )}
          {examInfo.lecture && (
            <div className="flex flex-col gap-1 col-span-3">
              <span
                className={`text-2xl font-medium ${themeClasses.textPrimary} opacity-70 transition-colors duration-500`}
              >
                {getTranslation("lecture", language)}
              </span>
              <span className={`${themeClasses.text} font-semibold transition-colors duration-500`}>
                {examInfo.lecture}
              </span>
            </div>
          )}
          {examInfo.lab && (
            <div className="flex flex-col gap-1 col-span-3">
              <span
                className={`text-2xl font-medium ${themeClasses.textPrimary} opacity-70 transition-colors duration-500`}
              >
                {getTranslation("lab", language)}
              </span>
              <span className={`${themeClasses.text} font-semibold transition-colors duration-500`}>
                {examInfo.lab}
              </span>
            </div>
          )}
          {examInfo.examRoom && (
            <div className="flex flex-col gap-1 col-span-6">
              <span
                className={`text-2xl font-medium ${themeClasses.textPrimary} opacity-70 transition-colors duration-500`}
              >
                {getTranslation("examRoom", language)}
              </span>
              <span className={`${themeClasses.text} font-semibold transition-colors duration-500`}>
                {examInfo.examRoom}
              </span>
            </div>
          )}
          {examInfo.remarks && (
            <div className="flex flex-col gap-1 col-span-full">
              <span
                className={`text-2xl font-medium ${themeClasses.textPrimary} opacity-70 transition-colors duration-500`}
              >
                {getTranslation("remarks", language)}
              </span>
              <span className={`${themeClasses.text} font-semibold transition-colors duration-500`}>
                {examInfo.remarks}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
