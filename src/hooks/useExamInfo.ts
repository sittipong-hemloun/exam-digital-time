/**
 * Custom hook for exam information management
 */

import { useState } from "react";
import type { TestInfo } from "@/actions/examActions";
import { fetchExamInfo as fetchExamInfoAction } from "@/actions/examActions";

export interface ExamInfo {
  courseCode: string;
  courseName: string;
  lecture: string;
  lab: string;
  time: string;
  examRoom: string;
  remarks: string;
}

const initialExamInfo: ExamInfo = {
  courseCode: "",
  courseName: "",
  lecture: "",
  lab: "",
  time: "",
  examRoom: "",
  remarks: "",
};

export const useExamInfo = () => {
  const [examInfo, setExamInfo] = useState<ExamInfo>(initialExamInfo);
  const [formData, setFormData] = useState<ExamInfo>(initialExamInfo);
  const [searchResults, setSearchResults] = useState<TestInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      examInfo.courseCode ||
      examInfo.courseName ||
      examInfo.lecture ||
      examInfo.lab ||
      examInfo.time ||
      examInfo.examRoom ||
      examInfo.remarks
    );
  };

  // Fetch exam data from database using room and date via Server Action
  const fetchExamData = async (
    roomTest: string,
    dateTest: string,
    smYr: string,
    smSem: string
  ) => {
    setIsLoading(true);
    setError(null);
    setSearchResults([]);

    try {
      const response = await fetchExamInfoAction(dateTest, roomTest, smYr, smSem);

      if (response.error) {
        setError(response.error);
        return [];
      }

      setSearchResults(response.records || []);
      return response.records || [];
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMsg);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Map TestInfo to ExamInfo
  const mapTestInfoToExamInfo = (testInfo: TestInfo): ExamInfo => {
    const timeStr = `${testInfo.time_test}${testInfo.time_am_pm ? " " + testInfo.time_am_pm : ""}`;
    return {
      courseCode: testInfo.cs_code || "-",
      courseName: testInfo.course_name || testInfo.course_nam || "-",
      lecture: testInfo.sec_lec1 || "",
      lab: testInfo.sec_lab1 === "0" ? "-" : testInfo.sec_lab1 || "-",
      time: timeStr,
      examRoom: testInfo.room_test || "-",
      remarks: "", // Let user fill in remarks manually
    };
  };

  const applyTestInfo = (testInfo: TestInfo) => {
    const newExamInfo = mapTestInfoToExamInfo(testInfo);
    setFormData(newExamInfo);
    setExamInfo(newExamInfo);
  };

  // Update exam info directly (for manual editing, not from DB)
  const updateExamInfo = (newExamInfo: ExamInfo) => {
    setExamInfo(newExamInfo);
    setFormData(newExamInfo);
  };

  return {
    examInfo,
    formData,
    searchResults,
    isLoading,
    error,
    handleInputChange,
    handleConfirm,
    handleCancel,
    hasExamInfo,
    fetchExamData,
    applyTestInfo,
    mapTestInfoToExamInfo,
    updateExamInfo,
  };
};
