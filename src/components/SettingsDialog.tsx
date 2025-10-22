/**
 * Settings dialog component for exam information
 * Optimized with React.memo and useMemo to prevent unnecessary re-renders
 */

import { memo, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getTranslation, type Language } from "@/lib/translations";
import type { Theme, ThemeClasses } from "@/lib/themeConstants";
import type { ExamInfo } from "@/hooks/useExamInfo";

interface SettingsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: ExamInfo;
  onInputChange: (field: keyof ExamInfo, value: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
  language: Language;
  theme: Theme;
  themeClasses: ThemeClasses;
}

export const SettingsDialog = memo(function SettingsDialog({
  isOpen,
  onOpenChange,
  formData,
  onInputChange,
  onConfirm,
  onCancel,
  language,
  theme,
  themeClasses,
}: SettingsDialogProps) {
  const inputClasses = useMemo(
    () =>
      `text-2xl h-11 rounded-lg ${
        theme === "dark"
          ? "bg-black text-white border border-gray-700 focus:border-primary focus:bg-gray-800"
          : "bg-gray-50/80 text-gray-900 border border-gray-300 focus:border-green-600 focus:bg-white"
      } transition-colors duration-300`,
    [theme]
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className={`sm:max-w-[700px] text-2xl ${themeClasses.background} ${themeClasses.text} transition-colors duration-500 rounded-2xl shadow-2xl`}
      >
        <DialogHeader>
          <DialogTitle
            className={`text-4xl ${themeClasses.textPrimary} transition-colors duration-500`}
          >
            {getTranslation("examInfo", language)}
          </DialogTitle>
          <DialogDescription
            className={`text-base ${themeClasses.textMuted} transition-colors duration-500`}
          >
            {getTranslation("examInfoDesc", language)}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-5 py-3">
          {/* Course */}
          <div className="grid gap-2">
            <Label
              htmlFor="course"
              className={`text-2xl font-semibold ${themeClasses.textPrimary} transition-colors duration-500`}
            >
              {getTranslation("course", language)}
            </Label>
            <Input
              id="course"
              value={formData.course}
              onChange={(e) => onInputChange("course", e.target.value)}
              placeholder={getTranslation("coursePlaceholder", language)}
              className={inputClasses}
            />
          </div>

          {/* Lecture */}
          <div className="grid gap-2">
            <Label
              htmlFor="lecture"
              className={`text-2xl font-semibold ${themeClasses.textPrimary} transition-colors duration-500`}
            >
              {getTranslation("lecture", language)}
            </Label>
            <Input
              id="lecture"
              value={formData.lecture}
              onChange={(e) => onInputChange("lecture", e.target.value)}
              placeholder={getTranslation("lecturePlaceholder", language)}
              className={inputClasses}
            />
          </div>

          {/* Lab */}
          <div className="grid gap-2">
            <Label
              htmlFor="lab"
              className={`text-2xl font-semibold ${themeClasses.textPrimary} transition-colors duration-500`}
            >
              {getTranslation("lab", language)}
            </Label>
            <Input
              id="lab"
              value={formData.lab}
              onChange={(e) => onInputChange("lab", e.target.value)}
              placeholder={getTranslation("labPlaceholder", language)}
              className={inputClasses}
            />
          </div>

          {/* Time */}
          <div className="grid gap-2">
            <Label
              htmlFor="time"
              className={`text-2xl font-semibold ${themeClasses.textPrimary} transition-colors duration-500`}
            >
              {getTranslation("examTime", language)}
            </Label>
            <Input
              id="time"
              value={formData.time}
              onChange={(e) => onInputChange("time", e.target.value)}
              placeholder={getTranslation("timePlaceholder", language)}
              className={inputClasses}
            />
          </div>

          {/* Exam Room */}
          <div className="grid gap-2">
            <Label
              htmlFor="examRoom"
              className={`text-2xl font-semibold ${themeClasses.textPrimary} transition-colors duration-500`}
            >
              {getTranslation("examRoom", language)}
            </Label>
            <Input
              id="examRoom"
              value={formData.examRoom}
              onChange={(e) => onInputChange("examRoom", e.target.value)}
              placeholder={getTranslation("roomPlaceholder", language)}
              className={inputClasses}
            />
          </div>

          {/* Remarks */}
          <div className="grid gap-2">
            <Label
              htmlFor="remarks"
              className={`text-2xl font-semibold ${themeClasses.textPrimary} transition-colors duration-500`}
            >
              {getTranslation("remarks", language)}
            </Label>
            <Textarea
              id="remarks"
              value={formData.remarks}
              onChange={(e) => onInputChange("remarks", e.target.value)}
              placeholder={getTranslation("remarksPlaceholder", language)}
              rows={3}
              className={`rounded-lg ${
                theme === "dark"
                  ? "bg-black text-white border border-gray-700 focus:border-primary focus:bg-gray-800"
                  : "bg-gray-50/80 text-gray-900 border border-gray-300 focus:border-green-600 focus:bg-white"
              } transition-colors duration-300`}
            />
          </div>
        </div>
        <DialogFooter className="text-2xl gap-3">
          <Button
            variant="outline"
            onClick={onCancel}
            className={`text-base px-6 h-11 rounded-lg text-white ${
              theme === "dark"
                ? "border-gray-700 hover:bg-black"
                : "border-gray-300 hover:bg-gray-100"
            } transition-all duration-300`}
          >
            {getTranslation("cancel", language)}
          </Button>
          <Button
            onClick={onConfirm}
            className={`text-base px-8 h-11 rounded-lg bg-gradient-to-r ${themeClasses.gradient} text-white font-semibold hover:opacity-95 shadow-lg hover:shadow-xl transition-all duration-300`}
          >
            {getTranslation("confirm", language)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});
