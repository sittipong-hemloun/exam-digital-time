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
import type { TestInfo } from "@/app/api/test-info/route";

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
          const response = await fetch(
            `/api/test-info?date_test=${encodeURIComponent(latestSemester.date_test)}&room_test=${encodeURIComponent(room)}&sm_yr=${encodeURIComponent(latestSemester.sm_yr)}&sm_sem=${encodeURIComponent(latestSemester.sm_sem)}`
          );

          if (!response.ok) {
            throw new Error("Failed to fetch test data");
          }

          const data = await response.json();
          const records = data.records || [];

          if (records.length === 0) {
            alert(
              language === "th"
                ? "ไม่พบข้อมูลสอบ"
                : "No exam records found"
            );
          } else if (records.length === 1) {
            onConfirm(records[0]);
            setRoomValue("");
            onOpenChange(false);
          } else {
            setSearchResults(records);
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
      [latestSemester, language, onConfirm, onOpenChange]
    );

    const handleSelectTestInfo = (testInfo: TestInfo) => {
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
