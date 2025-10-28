/**
 * Dialog for editing exam information
 * Allows manual editing of exam info without database update
 */

import { memo, useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollableContainer } from "@/components/ScrollableContainer";
import { getTranslation, type Language } from "@/lib/translations";
import type { ThemeClasses } from "@/lib/themeConstants";
import type { ExamInfo } from "@/hooks/useExamInfo";

interface EditExamInfoDialogProps {
  isOpen: boolean;
  examInfo: ExamInfo;
  onConfirm: (updatedInfo: ExamInfo) => void;
  onCancel: () => void;
  language: Language;
  theme: string;
  themeClasses: ThemeClasses;
}

export const EditExamInfoDialog = memo(function EditExamInfoDialog({
  isOpen,
  examInfo,
  onConfirm,
  onCancel,
  language,
  theme,
  themeClasses,
}: EditExamInfoDialogProps) {
  const [formData, setFormData] = useState<ExamInfo>(examInfo);

  // Update form data when examInfo changes
  useEffect(() => {
    setFormData(examInfo);
  }, [examInfo]);

  const handleInputChange = (field: keyof ExamInfo, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleConfirm = () => {
    onConfirm(formData);
  };

  const handleCancel = () => {
    setFormData(examInfo); // Reset to original
    onCancel();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent
        className={`sm:max-w-[600px] text-2xl ${themeClasses.background} ${themeClasses.text} transition-colors duration-500 rounded-2xl shadow-2xl`}
      >
        <DialogHeader>
          <DialogTitle className={`text-4xl ${themeClasses.textPrimary}`}>
            {language === "th" ? "แก้ไขข้อมูลการสอบ" : "Edit Exam Information"}
          </DialogTitle>
          <DialogDescription className={`text-base ${themeClasses.textPrimary}`}>
            {language === "th"
              ? "แก้ไขข้อมูลการสอบ (ไม่มีผลกับฐานข้อมูล)"
              : "Edit exam information (UI only, no database update)"}
          </DialogDescription>
        </DialogHeader>

        <ScrollableContainer maxHeight="max-h-96" theme={theme}>
          <div className="space-y-4 px-2">
            {/* Course Code */}
            <div className="space-y-2">
              <Label
                htmlFor="courseCode"
                className={`text-base ${themeClasses.textPrimary}`}
              >
                {getTranslation("courseCode", language)}
              </Label>
              <Input
                id="courseCode"
                value={formData.courseCode}
                onChange={(e) => handleInputChange("courseCode", e.target.value)}
                placeholder={getTranslation("courseCodePlaceholder", language)}
                className={`text-base ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              />
            </div>

            {/* Course Name */}
            <div className="space-y-2">
              <Label
                htmlFor="courseName"
                className={`text-base ${themeClasses.textPrimary}`}
              >
                {getTranslation("courseName", language)}
              </Label>
              <Input
                id="courseName"
                value={formData.courseName}
                onChange={(e) => handleInputChange("courseName", e.target.value)}
                placeholder={getTranslation("courseNamePlaceholder", language)}
                className={`text-base ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              />
            </div>

            {/* Lecture Section */}
            <div className="space-y-2">
              <Label
                htmlFor="lecture"
                className={`text-base ${themeClasses.textPrimary}`}
              >
                {getTranslation("lecture", language)}
              </Label>
              <Input
                id="lecture"
                value={formData.lecture}
                onChange={(e) => handleInputChange("lecture", e.target.value)}
                placeholder={getTranslation("lecturePlaceholder", language)}
                className={`text-base ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              />
            </div>

            {/* Lab Section */}
            <div className="space-y-2">
              <Label htmlFor="lab" className={`text-base ${themeClasses.textPrimary}`}>
                {getTranslation("lab", language)}
              </Label>
              <Input
                id="lab"
                value={formData.lab}
                onChange={(e) => handleInputChange("lab", e.target.value)}
                placeholder={getTranslation("labPlaceholder", language)}
                className={`text-base ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              />
            </div>

            {/* Exam Time */}
            <div className="space-y-2">
              <Label
                htmlFor="time"
                className={`text-base ${themeClasses.textPrimary}`}
              >
                {getTranslation("examTime", language)}
              </Label>
              <Input
                id="time"
                value={formData.time}
                onChange={(e) => handleInputChange("time", e.target.value)}
                placeholder={getTranslation("timePlaceholder", language)}
                className={`text-base ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              />
            </div>

            {/* Exam Room */}
            <div className="space-y-2">
              <Label
                htmlFor="examRoom"
                className={`text-base ${themeClasses.textPrimary}`}
              >
                {getTranslation("examRoom", language)}
              </Label>
              <Input
                id="examRoom"
                value={formData.examRoom}
                onChange={(e) => handleInputChange("examRoom", e.target.value)}
                placeholder={getTranslation("roomPlaceholder", language)}
                className={`text-base ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              />
            </div>

            {/* Remarks */}
            <div className="space-y-2">
              <Label
                htmlFor="remarks"
                className={`text-base ${themeClasses.textPrimary}`}
              >
                {getTranslation("remarks", language)}
              </Label>
              <Textarea
                id="remarks"
                value={formData.remarks}
                onChange={(e) => handleInputChange("remarks", e.target.value)}
                placeholder={getTranslation("remarksPlaceholder", language)}
                rows={3}
                className={`text-base ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              />
            </div>
          </div>
        </ScrollableContainer>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <Button
            variant="outline"
            onClick={handleCancel}
            className={`text-base px-6 h-11 rounded-lg ${
              theme === "dark"
                ? "border-gray-700 hover:bg-gray-800 text-white"
                : "border-gray-300 hover:bg-gray-100 text-gray-900"
            } transition-all duration-300`}
          >
            {getTranslation("cancel", language)}
          </Button>
          <Button
            onClick={handleConfirm}
            className={`text-base px-6 h-11 rounded-lg text-white ${
              theme === "dark"
                ? "bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500"
                : "bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-400 hover:to-blue-400"
            } transition-all duration-300 shadow-lg`}
          >
            {getTranslation("confirm", language)}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
});
