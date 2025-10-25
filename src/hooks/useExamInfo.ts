/**
 * Custom hook for exam information management
 */

import { useState } from "react";
import type { TestInfo } from "@/app/api/test-info/route";

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

  // Fetch exam data from database using room and date
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
      const response = await fetch(
        `/api/test-info?date_test=${encodeURIComponent(dateTest)}&room_test=${encodeURIComponent(roomTest)}&sm_yr=${encodeURIComponent(smYr)}&sm_sem=${encodeURIComponent(smSem)}`
      );

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Failed to fetch exam data");
        return [];
      }

      const data = await response.json();
      setSearchResults(data.records || []);
      return data.records || [];
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
      courseCode: testInfo.cs_code || "",
      courseName: testInfo.course_name || testInfo.course_nam || "",
      lecture: testInfo.sec_lec1 || "",
      lab: testInfo.sec_lab1 || "",
      time: timeStr,
      examRoom: testInfo.room_test || "",
      remarks: "", // Let user fill in remarks manually
    };
  };

  const applyTestInfo = (testInfo: TestInfo) => {
    const newExamInfo = mapTestInfoToExamInfo(testInfo);
    setFormData(newExamInfo);
    setExamInfo(newExamInfo);
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
  };
};
