import { memo, useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollableContainer } from "@/components/ScrollableContainer";
import { fetchRoomSuggestions } from "@/actions/examActions";

interface RoomAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelectRoom: (room: string) => void;
  theme: string;
  themeClasses: {
    textPrimary: string;
    background: string;
    text: string;
  };
  language: string;
  disabled?: boolean;
}

const inputClasses = (theme: string) =>
  `text-2xl h-11 rounded-lg ${
    theme === "dark"
      ? "bg-black text-white border border-gray-700 focus:border-primary focus:bg-gray-800"
      : "bg-gray-50/80 text-gray-900 border border-gray-300 focus:border-green-600 focus:bg-white"
  } transition-colors duration-300`;

export const RoomAutocomplete = memo(function RoomAutocomplete({
  value,
  onChange,
  onSelectRoom,
  theme,
  themeClasses,
  language,
  disabled = false,
}: RoomAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Fetch room suggestions via Server Action
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!value.trim()) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const result = await fetchRoomSuggestions(value);
        if (!result.error) {
          setSuggestions(result.rooms || []);
          setIsOpen(true);
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [value]);

  // Handle click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectSuggestion = (room: string) => {
    onChange(room);
    onSelectRoom(room);
    setIsOpen(false);
  };

  const labelText = language === "th" ? "ห้องสอบ" : "Exam Room";
  const placeholderText = language === "th" ? "ค้นหาห้องสอบ..." : "Search room...";

  return (
    <div ref={wrapperRef} className="relative grid gap-2">
      <Label
        htmlFor="room-autocomplete"
        className={`text-2xl font-semibold ${themeClasses.textPrimary} transition-colors duration-500`}
      >
        {labelText}
      </Label>
      <div className="relative">
        <Input
          id="room-autocomplete"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => value.trim() && setIsOpen(true)}
          placeholder={placeholderText}
          className={inputClasses(theme)}
          disabled={disabled}
          autoComplete="off"
        />

        {isLoading && (
          <div className="absolute right-3 top-3">
            <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></div>
          </div>
        )}

        {/* Autocomplete Dropdown */}
        {isOpen && suggestions.length > 0 && (
          <div
            className={`absolute top-full left-0 right-0 mt-1 rounded-lg border z-50 ${
              theme === "dark"
                ? "bg-gray-900 border-gray-700 text-white"
                : "bg-white border-gray-300 text-gray-900"
            }`}
          >
            <ScrollableContainer
              maxHeight="max-h-60"
              theme={theme}
              className={`${
                theme === "dark"
                  ? "bg-gray-900"
                  : "bg-white"
              }`}
            >
              {suggestions.map((room, index) => (
                <div
                  key={index}
                  onClick={() => handleSelectSuggestion(room)}
                  className={`px-4 py-3 cursor-pointer ${
                    theme === "dark"
                      ? "hover:bg-gray-800"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {room}
                </div>
              ))}
            </ScrollableContainer>
          </div>
        )}

        {isOpen && value.trim() && suggestions.length === 0 && !isLoading && (
          <div
            className={`absolute top-full left-0 right-0 mt-1 rounded-lg border p-3 z-50 ${
              theme === "dark"
                ? "bg-gray-900 border-gray-700 text-gray-400"
                : "bg-white border-gray-300 text-gray-500"
            }`}
          >
            {language === "th" ? "ไม่พบห้องสอบ" : "No rooms found"}
          </div>
        )}
      </div>
    </div>
  );
});
