"use client";

import { memo, useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RoomAutocomplete } from "@/components/RoomAutocomplete";
import { SelectTestInfoDialog } from "@/components/SelectTestInfoDialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { getTranslation, type Language } from "@/lib/translations";
import type { Theme, ThemeClasses } from "@/lib/themeConstants";
import type { TestInfo } from "@/actions/examActions";
import { fetchExamInfo } from "@/actions/examActions";

interface AutocompleteSettingsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (testInfo: TestInfo) => void;
  onCancel: () => void;
  language: Language;
  theme: Theme;
  themeClasses: ThemeClasses;
  latestSemester?: {
    sm_yr: string;
    sm_sem: string;
    date_test: string;
  };
  isLoading?: boolean;
}

export const AutocompleteSettingsDialog = memo(
  function AutocompleteSettingsDialog({
    isOpen,
    onOpenChange,
    onConfirm,
    onCancel,
    language,
    theme,
    themeClasses,
    latestSemester,
    isLoading = false,
  }: AutocompleteSettingsDialogProps) {
    const [roomValue, setRoomValue] = useState("");
    const [remarks, setRemarks] = useState("");
    const [searchResults, setSearchResults] = useState<TestInfo[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showSelectDialog, setShowSelectDialog] = useState(false);

    // Check if exam time has passed
    const isExamTimePassed = useCallback((timeTest: string) => {
      try {
        // Parse time_test format: "12.00-14.00" or "12.00-14.00 น."
        const timeMatch = timeTest.match(/(\d{1,2})\.(\d{2})-(\d{1,2})\.(\d{2})/);
        if (!timeMatch) return false;

        const endHour = parseInt(timeMatch[3], 10);
        const endMinute = parseInt(timeMatch[4], 10);

        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();

        // Compare end time with current time
        if (currentHour > endHour) return true;
        if (currentHour === endHour && currentMinute > endMinute) return true;

        return false;
      } catch (error) {
        console.error("Error parsing time_test:", error);
        return false;
      }
    }, []);

    const handleSelectRoom = useCallback(
      async (room: string) => {
        if (!latestSemester) {
          alert(
            language === "th"
              ? "ไม่สามารถดึงข้อมูลเทอมล่าสุดได้"
              : "Failed to fetch latest semester"
          );
          return;
        }

        setIsSearching(true);
        try {
          const result = await fetchExamInfo(
            latestSemester.date_test,
            room,
            latestSemester.sm_yr,
            latestSemester.sm_sem
          );

          if (result.error) {
            alert(
              language === "th"
                ? "ไม่พบข้อมูลสอบ"
                : "No exam records found"
            );
            return;
          }

          const records = result.records || [];

          // Filter out exams that have already ended
          const activeRecords = records.filter(
            (record) => !isExamTimePassed(record.time_test)
          );

          if (activeRecords.length === 0) {
            alert(
              language === "th"
                ? "ไม่พบข้อมูลสอบ หรือการสอบทั้งหมดหมดเวลาแล้ว"
                : "No active exam records found or all exams have ended"
            );
          } else if (activeRecords.length === 1) {
            onConfirm(activeRecords[0]);
            setRoomValue("");
            onOpenChange(false);
          } else {
            setSearchResults(activeRecords);
            setShowSelectDialog(true);
          }
        } catch (error) {
          console.error("Error fetching test data:", error);
          alert(
            language === "th"
              ? "เกิดข้อผิดพลาดในการดึงข้อมูล"
              : "Error fetching data"
          );
        } finally {
          setIsSearching(false);
        }
      },
      [latestSemester, language, onConfirm, onOpenChange, isExamTimePassed]
    );

    const handleSelectTestInfo = (testInfos: TestInfo[]) => {
      // Merge multiple test infos into one
      if (testInfos.length === 1) {
        const testInfo = testInfos[0];
        // Use remarks from dialog if provided
        if (remarks.trim()) {
          // Append to existing remarks if any
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const existingRemarks = (testInfo as any).remarks || "";
          const updatedRemarks =
            existingRemarks && remarks
              ? existingRemarks + "\n" + remarks
              : remarks || existingRemarks;
          const updatedTestInfo = { ...testInfo, remarks: updatedRemarks };
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onConfirm(updatedTestInfo as any);
        } else {
          onConfirm(testInfo);
        }
      } else {
        // Multiple test infos - merge them
        const mergedInfo: TestInfo = {
          ...testInfos[0],
          cs_code: testInfos.map((t) => t.cs_code).join(" / "),
          course_name: testInfos
            .map((t) => t.course_name || t.course_nam || "-")
            .join(" / "),
          course_nam: null,
          sec_lec1: testInfos.map((t) => t.sec_lec1 || "-").join(" / "),
          sec_lab1: testInfos
            .map((t) => (t.sec_lab1 === "0" ? "-" : t.sec_lab1 || "-"))
            .join(" / "),
        };

        if (remarks.trim()) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const updatedTestInfo = { ...mergedInfo, remarks: remarks } as any;
          onConfirm(updatedTestInfo);
        } else {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onConfirm(mergedInfo as any);
        }
      }
      setRoomValue("");
      setRemarks("");
      setShowSelectDialog(false);
      onOpenChange(false);
    };

    return (
      <>
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
                {language === "th"
                  ? "ค้นหาห้องสอบเพื่อดึงข้อมูลอัตโนมัติ"
                  : "Search for exam room to auto-fill information"}
              </DialogDescription>
            </DialogHeader>

            <div className="py-3 space-y-4">
              <RoomAutocomplete
                value={roomValue}
                onChange={setRoomValue}
                onSelectRoom={handleSelectRoom}
                theme={theme}
                themeClasses={themeClasses}
                language={language}
                disabled={isSearching || isLoading}
              />

              {/* Remarks/Notes - Optional Input */}
              <div className="grid gap-2">
                <Label
                  htmlFor="remarks"
                  className={`text-2xl font-semibold ${themeClasses.textPrimary} transition-colors duration-500`}
                >
                  {language === "th" ? "หมายเหตุ" : "Remarks"}
                </Label>
                <Textarea
                  id="remarks"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder={
                    language === "th"
                      ? "กรอกหมายเหตุเพิ่มเติม (ไม่บังคับ)"
                      : "Enter additional remarks (optional)"
                  }
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
                onClick={() => {
                  onCancel();
                  setRoomValue("");
                }}
                className={`text-base px-6 h-11 rounded-lg text-white ${
                  theme === "dark"
                    ? "border-gray-700 hover:bg-black"
                    : "border-gray-300 hover:bg-gray-100"
                } transition-all duration-300`}
              >
                {getTranslation("cancel", language)}
              </Button>
              <Button
                onClick={() => handleSelectRoom(roomValue)}
                disabled={!roomValue.trim() || isSearching || isLoading}
                className={`text-base px-8 h-11 rounded-lg bg-gradient-to-r ${themeClasses.gradient} text-white font-semibold hover:opacity-95 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50`}
              >
                {isSearching
                  ? language === "th"
                    ? "กำลังค้นหา..."
                    : "Searching..."
                  : getTranslation("confirm", language)}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <SelectTestInfoDialog
          isOpen={showSelectDialog}
          records={searchResults}
          onSelect={handleSelectTestInfo}
          onCancel={() => setShowSelectDialog(false)}
          theme={theme}
          themeClasses={themeClasses}
          language={language}
        />
      </>
    );
  }
);
