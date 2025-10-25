/**
 * Tests for RoomAutocomplete component
 */

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { RoomAutocomplete } from "../RoomAutocomplete";

// Mock the fetch API
global.fetch = jest.fn();

const mockThemeClasses = {
  textPrimary: "text-gray-900",
  background: "bg-white",
  text: "text-gray-900",
};

describe("RoomAutocomplete", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render input field with label", () => {
    const mockOnChange = jest.fn();
    const mockOnSelectRoom = jest.fn();

    render(
      <RoomAutocomplete
        value=""
        onChange={mockOnChange}
        onSelectRoom={mockOnSelectRoom}
        theme="light"
        themeClasses={mockThemeClasses}
        language="en"
      />
    );

    expect(screen.getByLabelText("Exam Room")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Search room...")).toBeInTheDocument();
  });

  it("should render Thai labels and placeholders when language is th", () => {
    const mockOnChange = jest.fn();
    const mockOnSelectRoom = jest.fn();

    render(
      <RoomAutocomplete
        value=""
        onChange={mockOnChange}
        onSelectRoom={mockOnSelectRoom}
        theme="light"
        themeClasses={mockThemeClasses}
        language="th"
      />
    );

    expect(screen.getByLabelText("ห้องสอบ")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("ค้นหาห้องสอบ...")).toBeInTheDocument();
  });

  it("should call onChange when input value changes", () => {
    const mockOnChange = jest.fn();
    const mockOnSelectRoom = jest.fn();

    render(
      <RoomAutocomplete
        value=""
        onChange={mockOnChange}
        onSelectRoom={mockOnSelectRoom}
        theme="light"
        themeClasses={mockThemeClasses}
        language="en"
      />
    );

    const input = screen.getByPlaceholderText("Search room...");
    fireEvent.change(input, { target: { value: "EN101" } });

    expect(mockOnChange).toHaveBeenCalledWith("EN101");
  });

  it("should be disabled when disabled prop is true", () => {
    const mockOnChange = jest.fn();
    const mockOnSelectRoom = jest.fn();

    render(
      <RoomAutocomplete
        value=""
        onChange={mockOnChange}
        onSelectRoom={mockOnSelectRoom}
        theme="light"
        themeClasses={mockThemeClasses}
        language="en"
        disabled={true}
      />
    );

    const input = screen.getByPlaceholderText("Search room...");
    expect(input).toBeDisabled();
  });

  it("should display suggestions when dropdown is open", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ rooms: ["EN101", "EN102", "EN103"] }),
    });

    const mockOnChange = jest.fn();
    const mockOnSelectRoom = jest.fn();

    render(
      <RoomAutocomplete
        value="EN1"
        onChange={mockOnChange}
        onSelectRoom={mockOnSelectRoom}
        theme="light"
        themeClasses={mockThemeClasses}
        language="en"
      />
    );

    await waitFor(() => {
      expect(screen.getByText("EN101")).toBeInTheDocument();
    });

    expect(screen.getByText("EN102")).toBeInTheDocument();
    expect(screen.getByText("EN103")).toBeInTheDocument();
  });

  it("should call onSelectRoom when a suggestion is clicked", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ rooms: ["EN101", "EN102"] }),
    });

    const mockOnChange = jest.fn();
    const mockOnSelectRoom = jest.fn();

    render(
      <RoomAutocomplete
        value="EN1"
        onChange={mockOnChange}
        onSelectRoom={mockOnSelectRoom}
        theme="light"
        themeClasses={mockThemeClasses}
        language="en"
      />
    );

    await waitFor(() => {
      expect(screen.getByText("EN101")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("EN101"));

    expect(mockOnSelectRoom).toHaveBeenCalledWith("EN101");
  });

  it("should show no results message when no suggestions are found", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ rooms: [] }),
    });

    const mockOnChange = jest.fn();
    const mockOnSelectRoom = jest.fn();

    render(
      <RoomAutocomplete
        value="NOTFOUND"
        onChange={mockOnChange}
        onSelectRoom={mockOnSelectRoom}
        theme="light"
        themeClasses={mockThemeClasses}
        language="en"
      />
    );

    // Trigger focus to open dropdown
    const input = screen.getByPlaceholderText("Search room...");
    fireEvent.focus(input);

    await waitFor(() => {
      expect(screen.getByText("No rooms found")).toBeInTheDocument();
    });
  });

  it("should show Thai no results message when language is th", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ rooms: [] }),
    });

    const mockOnChange = jest.fn();
    const mockOnSelectRoom = jest.fn();

    render(
      <RoomAutocomplete
        value="NOTFOUND"
        onChange={mockOnChange}
        onSelectRoom={mockOnSelectRoom}
        theme="light"
        themeClasses={mockThemeClasses}
        language="th"
      />
    );

    // Trigger focus to open dropdown
    const input = screen.getByPlaceholderText("ค้นหาห้องสอบ...");
    fireEvent.focus(input);

    await waitFor(() => {
      expect(screen.getByText("ไม่พบห้องสอบ")).toBeInTheDocument();
    });
  });

  it("should not fetch suggestions when value is empty", async () => {
    const mockOnChange = jest.fn();
    const mockOnSelectRoom = jest.fn();

    render(
      <RoomAutocomplete
        value=""
        onChange={mockOnChange}
        onSelectRoom={mockOnSelectRoom}
        theme="light"
        themeClasses={mockThemeClasses}
        language="en"
      />
    );

    // Wait a bit for any debounce to trigger
    await waitFor(() => {
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  it("should apply dark theme classes when theme is dark", () => {
    const mockOnChange = jest.fn();
    const mockOnSelectRoom = jest.fn();

    render(
      <RoomAutocomplete
        value=""
        onChange={mockOnChange}
        onSelectRoom={mockOnSelectRoom}
        theme="dark"
        themeClasses={mockThemeClasses}
        language="en"
      />
    );

    const input = screen.getByPlaceholderText("Search room...");
    expect(input).toHaveClass("bg-black", "text-white");
  });
});
