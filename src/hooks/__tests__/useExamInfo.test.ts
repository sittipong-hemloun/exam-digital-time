/**
 * Tests for useExamInfo hook
 */

import { renderHook, act } from "@testing-library/react";
import { useExamInfo } from "../useExamInfo";

describe("useExamInfo", () => {
  it("should initialize with empty exam info", () => {
    const { result } = renderHook(() => useExamInfo());

    expect(result.current.examInfo.courseCode).toBe("");
    expect(result.current.examInfo.courseName).toBe("");
    expect(result.current.examInfo.lecture).toBe("");
    expect(result.current.examInfo.lab).toBe("");
    expect(result.current.examInfo.time).toBe("");
    expect(result.current.examInfo.examRoom).toBe("");
    expect(result.current.examInfo.remarks).toBe("");
  });

  it("should update form data when handleInputChange is called", () => {
    const { result } = renderHook(() => useExamInfo());

    act(() => {
      result.current.handleInputChange("courseCode", "CS101");
      result.current.handleInputChange("lecture", "01");
    });

    expect(result.current.formData.courseCode).toBe("CS101");
    expect(result.current.formData.lecture).toBe("01");
  });

  it("should handle input changes for all fields", () => {
    const { result } = renderHook(() => useExamInfo());

    act(() => {
      result.current.handleInputChange("courseCode", "CS101");
      result.current.handleInputChange("courseName", "Introduction to CS");
      result.current.handleInputChange("lecture", "01");
      result.current.handleInputChange("lab", "001");
      result.current.handleInputChange("time", "09:00-12:00");
      result.current.handleInputChange("examRoom", "EN101");
      result.current.handleInputChange("remarks", "No calculator");
    });

    expect(result.current.formData.courseCode).toBe("CS101");
    expect(result.current.formData.courseName).toBe("Introduction to CS");
    expect(result.current.formData.lecture).toBe("01");
    expect(result.current.formData.lab).toBe("001");
    expect(result.current.formData.time).toBe("09:00-12:00");
    expect(result.current.formData.examRoom).toBe("EN101");
    expect(result.current.formData.remarks).toBe("No calculator");
  });

  it("should return true from handleConfirm", () => {
    const { result } = renderHook(() => useExamInfo());

    const confirmResult = result.current.handleConfirm();
    expect(confirmResult).toBe(true);
  });

  it("should return false from handleCancel", () => {
    const { result } = renderHook(() => useExamInfo());

    const cancelResult = result.current.handleCancel();
    expect(cancelResult).toBe(false);
  });

  it("should have hasExamInfo method", () => {
    const { result } = renderHook(() => useExamInfo());

    expect(typeof result.current.hasExamInfo).toBe("function");
  });

  it("should detect when exam info has no values initially", () => {
    const { result } = renderHook(() => useExamInfo());

    expect(result.current.hasExamInfo()).toBe(false);
  });

  it("should expose examInfo state", () => {
    const { result } = renderHook(() => useExamInfo());

    expect(result.current.examInfo).toBeDefined();
    expect(typeof result.current.examInfo).toBe("object");
  });

  it("should expose formData state", () => {
    const { result } = renderHook(() => useExamInfo());

    expect(result.current.formData).toBeDefined();
    expect(typeof result.current.formData).toBe("object");
  });

  it("should update formData independently from examInfo", () => {
    const { result } = renderHook(() => useExamInfo());

    act(() => {
      result.current.handleInputChange("courseCode", "CS101");
    });

    expect(result.current.formData.courseCode).toBe("CS101");
    expect(result.current.examInfo.courseCode).toBe(""); // Still empty until confirmed
  });

  it("should allow multiple sequential changes", () => {
    const { result } = renderHook(() => useExamInfo());

    act(() => {
      result.current.handleInputChange("courseCode", "CS101");
    });

    expect(result.current.formData.courseCode).toBe("CS101");

    act(() => {
      result.current.handleInputChange("courseCode", "CS102");
    });

    expect(result.current.formData.courseCode).toBe("CS102");

    act(() => {
      result.current.handleInputChange("courseCode", "CS103");
    });

    expect(result.current.formData.courseCode).toBe("CS103");
  });
});
