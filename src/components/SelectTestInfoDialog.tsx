import { memo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollableContainer } from "@/components/ScrollableContainer";
import type { TestInfo } from "@/app/api/test-info/route";

interface SelectTestInfoDialogProps {
  isOpen: boolean;
  records: TestInfo[];
  onSelect: (record: TestInfo) => void;
  onCancel: () => void;
  theme: string;
  themeClasses: {
    textPrimary: string;
    background: string;
    text: string;
    cardBorder: string;
  };
  language: string;
}

export const SelectTestInfoDialog = memo(function SelectTestInfoDialog({
  isOpen,
  records,
  onSelect,
  onCancel,
  theme,
  themeClasses,
  language,
}: SelectTestInfoDialogProps) {
  const title = language === "th" ? "เลือกข้อมูลสอบ" : "Select Test Information";
  const description =
    language === "th"
      ? "พบข้อมูลมากกว่า 1 รายการ กรุณาเลือกข้อมูลที่ต้องการ"
      : "Found multiple records. Please select one.";
  const cancelText = language === "th" ? "ยกเลิก" : "Cancel";

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent
        className={`sm:max-w-[900px] text-2xl ${themeClasses.background} ${themeClasses.text} transition-colors duration-500 rounded-2xl shadow-2xl`}
      >
        <DialogHeader>
          <DialogTitle className={`text-4xl ${themeClasses.textPrimary}`}>
            {title}
          </DialogTitle>
          <DialogDescription className={`text-base ${themeClasses.textPrimary}`}>
            {description}
          </DialogDescription>
        </DialogHeader>

        <ScrollableContainer maxHeight="max-h-96" theme={theme}>
          <div className="space-y-3 pr-2">
            {records.map((record) => (
              <div
                key={record.nno}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  theme === "dark"
                    ? "border-gray-700 hover:bg-gray-800"
                    : "border-gray-300 hover:bg-gray-100"
                }`}
                onClick={() => onSelect(record)}
              >
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className={`font-semibold ${themeClasses.textPrimary}`}>
                      {language === "th" ? "รหัสวิชา" : "Course Code"}
                    </div>
                    <div>{record.cs_code}</div>
                  </div>
                  <div>
                    <div className={`font-semibold ${themeClasses.textPrimary}`}>
                      {language === "th" ? "ชื่อวิชา" : "Course Name"}
                    </div>
                    <div>{record.course_name || record.course_nam || "-"}</div>
                  </div>
                  <div>
                    <div className={`font-semibold ${themeClasses.textPrimary}`}>
                      {language === "th" ? "เวลาสอบ" : "Time"}
                    </div>
                    <div>
                      {record.time_test} {record.time_am_pm || ""}
                    </div>
                  </div>
                  <div>
                    <div className={`font-semibold ${themeClasses.textPrimary}`}>
                      {language === "th" ? "ห้องสอบ" : "Room"}
                    </div>
                    <div>{record.room_test || "-"}</div>
                  </div>
                  <div>
                    <div className={`font-semibold ${themeClasses.textPrimary}`}>
                      {language === "th" ? "อาคาร" : "Building"}
                    </div>
                    <div>{record.build || "-"}</div>
                  </div>
                  <div>
                    <div className={`font-semibold ${themeClasses.textPrimary}`}>
                      {language === "th" ? "จำนวนคน" : "Count"}
                    </div>
                    <div>{record.count_person || "-"}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollableContainer>

        <div className="flex justify-end gap-3 mt-6">
          <Button
            variant="outline"
            onClick={onCancel}
            className={`text-base px-6 h-11 rounded-lg text-white ${
              theme === "dark"
                ? "border-gray-700 hover:bg-black"
                : "border-gray-300 hover:bg-gray-100"
            } transition-all duration-300`}
          >
            {cancelText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
});
