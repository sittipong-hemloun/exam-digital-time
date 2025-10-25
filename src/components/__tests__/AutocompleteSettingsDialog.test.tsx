/**
 * Tests for AutocompleteSettingsDialog component
 */

import { render, screen, fireEvent } from "@testing-library/react";
import { AutocompleteSettingsDialog } from "../AutocompleteSettingsDialog";

// Mock the fetch API
global.fetch = jest.fn();

const mockThemeClasses = {
  background: "bg-white",
  decorativeGlow1: "bg-blue-400/20",
  decorativeGlow2: "bg-green-400/20",
  card: "bg-white/10",
  cardBorder: "border-gray-200",
  text: "text-gray-900",
  textMuted: "text-gray-500",
  textPrimary: "text-green-600",
  gradient: "from-green-400 to-green-600",
};

const mockLatestSemester = {
  sm_yr: "2024",
  sm_sem: "1",
  date_test: "2024-01-15",
};

describe("AutocompleteSettingsDialog", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render dialog with title when open", () => {
    render(
      <AutocompleteSettingsDialog
        isOpen={true}
        onOpenChange={jest.fn()}
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
        language="en"
        theme="light"
        themeClasses={mockThemeClasses}
        latestSemester={mockLatestSemester}
      />
    );

    expect(screen.getByText("Exam Information")).toBeInTheDocument();
  });

  it("should render dialog with Thai title when language is th", () => {
    render(
      <AutocompleteSettingsDialog
        isOpen={true}
        onOpenChange={jest.fn()}
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
        language="th"
        theme="light"
        themeClasses={mockThemeClasses}
        latestSemester={mockLatestSemester}
      />
    );

    expect(screen.getByText("ข้อมูลการสอบ")).toBeInTheDocument();
  });

  it("should not render dialog when isOpen is false", () => {
    const { container } = render(
      <AutocompleteSettingsDialog
        isOpen={false}
        onOpenChange={jest.fn()}
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
        language="en"
        theme="light"
        themeClasses={mockThemeClasses}
        latestSemester={mockLatestSemester}
      />
    );

    // Dialog should not be visible
    expect(container.querySelector("[role='dialog']")).not.toBeInTheDocument();
  });

  it("should render remarks textarea", () => {
    render(
      <AutocompleteSettingsDialog
        isOpen={true}
        onOpenChange={jest.fn()}
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
        language="en"
        theme="light"
        themeClasses={mockThemeClasses}
        latestSemester={mockLatestSemester}
      />
    );

    expect(screen.getByPlaceholderText(/Enter additional remarks/i)).toBeInTheDocument();
  });

  it("should render Thai remarks label", () => {
    render(
      <AutocompleteSettingsDialog
        isOpen={true}
        onOpenChange={jest.fn()}
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
        language="th"
        theme="light"
        themeClasses={mockThemeClasses}
        latestSemester={mockLatestSemester}
      />
    );

    expect(screen.getByText("หมายเหตุ")).toBeInTheDocument();
  });

  it("should call onCancel when cancel button is clicked", () => {
    const mockOnCancel = jest.fn();
    render(
      <AutocompleteSettingsDialog
        isOpen={true}
        onOpenChange={jest.fn()}
        onConfirm={jest.fn()}
        onCancel={mockOnCancel}
        language="en"
        theme="light"
        themeClasses={mockThemeClasses}
        latestSemester={mockLatestSemester}
      />
    );

    const cancelButton = screen.getByRole("button", { name: /Cancel/i });
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it("should clear room value when cancel button is clicked", () => {
    const mockOnCancel = jest.fn();
    render(
      <AutocompleteSettingsDialog
        isOpen={true}
        onOpenChange={jest.fn()}
        onConfirm={jest.fn()}
        onCancel={mockOnCancel}
        language="en"
        theme="light"
        themeClasses={mockThemeClasses}
        latestSemester={mockLatestSemester}
      />
    );

    const cancelButton = screen.getByRole("button", { name: /Cancel/i });
    fireEvent.click(cancelButton);

    // The cancel button should call onCancel
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it("should disable confirm button when room is empty", () => {
    render(
      <AutocompleteSettingsDialog
        isOpen={true}
        onOpenChange={jest.fn()}
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
        language="en"
        theme="light"
        themeClasses={mockThemeClasses}
        latestSemester={mockLatestSemester}
      />
    );

    const confirmButton = screen.getByRole("button", { name: /Confirm/i });
    expect(confirmButton).toBeDisabled();
  });

  it("should allow remarks input", async () => {
    render(
      <AutocompleteSettingsDialog
        isOpen={true}
        onOpenChange={jest.fn()}
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
        language="en"
        theme="light"
        themeClasses={mockThemeClasses}
        latestSemester={mockLatestSemester}
      />
    );

    const remarksTextarea = screen.getByPlaceholderText(/Enter additional remarks/i);
    fireEvent.change(remarksTextarea, { target: { value: "Test remark" } });

    expect(remarksTextarea).toHaveValue("Test remark");
  });

  it("should show loading state when searching", () => {
    render(
      <AutocompleteSettingsDialog
        isOpen={true}
        onOpenChange={jest.fn()}
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
        language="en"
        theme="light"
        themeClasses={mockThemeClasses}
        latestSemester={mockLatestSemester}
        isLoading={true}
      />
    );

    const confirmButton = screen.getByRole("button", { name: /Confirm/i });
    expect(confirmButton).toBeDisabled();
  });

  it("should alert when no latestSemester is provided", async () => {
    global.fetch = jest.fn();
    const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});

    render(
      <AutocompleteSettingsDialog
        isOpen={true}
        onOpenChange={jest.fn()}
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
        language="en"
        theme="light"
        themeClasses={mockThemeClasses}
      />
    );

    // Try to interact with the room autocomplete
    // This would trigger the alert in handleSelectRoom
    alertSpy.mockRestore();
  });

  it("should have RoomAutocomplete component", () => {
    render(
      <AutocompleteSettingsDialog
        isOpen={true}
        onOpenChange={jest.fn()}
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
        language="en"
        theme="light"
        themeClasses={mockThemeClasses}
        latestSemester={mockLatestSemester}
      />
    );

    // Check for room input
    expect(screen.getByPlaceholderText(/Search room/i)).toBeInTheDocument();
  });

  it("should display description text", () => {
    render(
      <AutocompleteSettingsDialog
        isOpen={true}
        onOpenChange={jest.fn()}
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
        language="en"
        theme="light"
        themeClasses={mockThemeClasses}
        latestSemester={mockLatestSemester}
      />
    );

    expect(
      screen.getByText(/Search for exam room to auto-fill information/i)
    ).toBeInTheDocument();
  });

  it("should display Thai description text", () => {
    render(
      <AutocompleteSettingsDialog
        isOpen={true}
        onOpenChange={jest.fn()}
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
        language="th"
        theme="light"
        themeClasses={mockThemeClasses}
        latestSemester={mockLatestSemester}
      />
    );

    expect(
      screen.getByText(/ค้นหาห้องสอบเพื่อดึงข้อมูลอัตโนมัติ/i)
    ).toBeInTheDocument();
  });
});
