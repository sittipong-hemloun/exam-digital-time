import { memo, useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollableContainer } from "@/components/ScrollableContainer";
import type { TestInfo } from "@/actions/examActions";

interface SelectTestInfoDialogProps {
  isOpen: boolean;
  records: TestInfo[];
  onSelect: (records: TestInfo[]) => void;
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
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const title = language === "th" ? "เลือกข้อมูลสอบ" : "Select Test Information";
  const description =
    language === "th"
      ? "พบข้อมูลมากกว่า 1 รายการ กรุณาเลือกข้อมูลที่ต้องการ (สามารถเลือกได้หลายวิชา)"
      : "Found multiple records. Please select one or more.";
  const cancelText = language === "th" ? "ยกเลิก" : "Cancel";
  const selectAllText = language === "th" ? "เลือกทั้งหมด" : "Select All";
  const confirmText = language === "th" ? "ยืนยัน" : "Confirm";

  const allIds = useMemo(() => records.map((r) => r.nno), [records]);
  const isAllSelected = selectedIds.length === records.length;

  const handleToggle = (nno: number) => {
    setSelectedIds((prev) =>
      prev.includes(nno) ? prev.filter((id) => id !== nno) : [...prev, nno]
    );
  };

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(allIds);
    }
  };

  const handleConfirm = () => {
    const selectedRecords = records.filter((r) => selectedIds.includes(r.nno));
    if (selectedRecords.length > 0) {
      onSelect(selectedRecords);
      setSelectedIds([]);
    }
  };

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
            {records.map((record) => {
              const isSelected = selectedIds.includes(record.nno);
              return (
                <div
                  key={record.nno}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    isSelected
                      ? theme === "dark"
                        ? "border-green-500 bg-green-900/20"
                        : "border-green-600 bg-green-50"
                      : theme === "dark"
                      ? "border-gray-700 hover:bg-gray-800"
                      : "border-gray-300 hover:bg-gray-100"
                  }`}
                  onClick={() => handleToggle(record.nno)}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => handleToggle(record.nno)}
                      className="mt-1"
                    />
                    <div className="grid grid-cols-3 gap-4 text-sm flex-1">
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
                          {language === "th" ? "วันที่สอบ" : "Exam Date"}
                        </div>
                        <div>{record.date_test || "-"}</div>
                      </div>
                      <div>
                        <div className={`font-semibold ${themeClasses.textPrimary}`}>
                          {language === "th" ? "หมู่เรียน" : "Lecture Section"}
                        </div>
                        <div>{record.sec_lec1 || "-"}</div>
                      </div>
                      <div>
                        <div className={`font-semibold ${themeClasses.textPrimary}`}>
                          {language === "th" ? "หมู่ปฏิบัติ" : "Lab Section"}
                        </div>
                        <div>{record.sec_lab1 === "0" ? "-" : record.sec_lab1 || "-"}</div>
                      </div>
                      <div>
                        <div className={`font-semibold ${themeClasses.textPrimary}`}>
                          {language === "th" ? "เวลาสอบ" : "Exam Time"}
                        </div>
                        <div>{record.time_test || "-"}</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollableContainer>

        <div className="flex justify-between gap-3 mt-6">
          <Button
            variant="outline"
            onClick={handleSelectAll}
            className={`text-base px-6 h-11 rounded-lg ${
              theme === "dark"
                ? "border-gray-700 hover:bg-gray-800 text-white"
                : "border-gray-300 hover:bg-gray-100 text-gray-900"
            } transition-all duration-300`}
          >
            {selectAllText}
          </Button>
          <div className="flex gap-3">
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
            <Button
              onClick={handleConfirm}
              disabled={selectedIds.length === 0}
              className={`text-base px-8 h-11 rounded-lg ${
                theme === "dark"
                  ? "bg-green-600 hover:bg-green-500"
                  : "bg-green-500 hover:bg-green-400"
              } text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50`}
            >
              {confirmText} ({selectedIds.length})
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});
