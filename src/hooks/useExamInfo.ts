/**
 * Custom hook for exam information management
 */

import { useState } from "react";

export interface ExamInfo {
  course: string;
  lecture: string;
  lab: string;
  time: string;
  examRoom: string;
  remarks: string;
}

const initialExamInfo: ExamInfo = {
  course: "",
  lecture: "",
  lab: "",
  time: "",
  examRoom: "",
  remarks: "",
};

export const useExamInfo = () => {
  const [examInfo, setExamInfo] = useState<ExamInfo>(initialExamInfo);
  const [formData, setFormData] = useState<ExamInfo>(initialExamInfo);

  const handleInputChange = (field: keyof ExamInfo, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleConfirm = () => {
    setExamInfo(formData);
    return true;
  };

  const handleCancel = () => {
    setFormData(examInfo);
    return false;
  };

  const hasExamInfo = () => {
    return !!(
      examInfo.course ||
      examInfo.lecture ||
      examInfo.lab ||
      examInfo.time ||
      examInfo.examRoom ||
      examInfo.remarks
    );
  };

  return {
    examInfo,
    formData,
    handleInputChange,
    handleConfirm,
    handleCancel,
    hasExamInfo,
  };
};
