"use client";

import { useEffect, useState, useCallback } from "react";

// Components
import { Logo } from "@/components/Logo";
import { ClockDisplay } from "@/components/ClockDisplay";
import { ControlButtons } from "@/components/ControlButtons";
import { AutocompleteSettingsDialog } from "@/components/AutocompleteSettingsDialog";
import { ExamInfoDisplay } from "@/components/ExamInfoDisplay";
import { FeedbackButton } from "@/components/FeedbackButton";
import { Footer } from "@/components/Footer";

// Custom Hooks
import { useTimeSync } from "@/hooks/useTimeSync";
import { useFullscreen } from "@/hooks/useFullscreen";
import { useExamInfo } from "@/hooks/useExamInfo";

// Utilities
import { getThemeClasses, getFontSizeClasses } from "@/lib/themeConstants";
import type { Language } from "@/lib/translations";
import type { Theme } from "@/lib/themeConstants";
import type { TestInfo } from "@/app/api/test-info/route";

export default function Home() {
  // UI State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [fontSize, setFontSize] = useState(3);
  const [language, setLanguage] = useState<Language>("th");
  const [theme, setTheme] = useState<Theme>("dark");
  const [isMounted, setIsMounted] = useState(false);
  const [latestSemester, setLatestSemester] = useState<{
    sm_yr: string;
    sm_sem: string;
    date_test: string;
  } | null>(null);

  // Custom Hooks
  const { currentTime } = useTimeSync();
  const { isFullscreen, toggleFullscreen, enterFullscreen } = useFullscreen();
  const { examInfo, applyTestInfo } = useExamInfo();

  // Initialize mounted state on client and fetch latest semester
  useEffect(() => {
    setIsMounted(true);

    // Fetch latest semester info
    const fetchLatestSemester = async () => {
      try {
        // Use relative path to work with both IIS and direct localhost access
        const response = await fetch("/api/test-rooms", {
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
        });
        if (response.ok) {
          const data = await response.json();
          setLatestSemester(data.latestSemester);
        } else {
          console.warn("API returned non-ok status:", response.status);
        }
      } catch (error) {
        console.error("Error fetching latest semester:", error);
      }
    };

    fetchLatestSemester();
  }, []);

  // Event Handlers (memoized to prevent unnecessary re-renders)
  const handleToggleTheme = useCallback(
    () => setTheme((prev) => (prev === "dark" ? "light" : "dark")),
    []
  );

  const handleToggleLanguage = useCallback(
    () => setLanguage((prev) => (prev === "th" ? "en" : "th")),
    []
  );

  const handleIncreaseFontSize = useCallback(
    () => setFontSize((prev) => (prev < 5 ? prev + 1 : prev)),
    []
  );

  const handleDecreaseFontSize = useCallback(
    () => setFontSize((prev) => (prev > 1 ? prev - 1 : prev)),
    []
  );

  // Dialog Handlers with Fullscreen (memoized)
  const handleConfirmWithFullscreen = useCallback(
    async (testInfo: TestInfo | null = null) => {
      if (testInfo) {
        applyTestInfo(testInfo);
      }
      setIsDialogOpen(false);
      // Wait for DOM to update before requesting fullscreen
      await new Promise((resolve) => setTimeout(resolve, 100));
      await enterFullscreen();
    },
    [applyTestInfo, enterFullscreen]
  );

  const handleCancelWithFullscreen = useCallback(async () => {
    setIsDialogOpen(false);
    // Wait for DOM to update before requesting fullscreen
    await new Promise((resolve) => setTimeout(resolve, 100));
    await enterFullscreen();
  }, [enterFullscreen]);

  const fontSizeClasses = getFontSizeClasses(fontSize);
  const themeClasses = getThemeClasses(theme);

  // Prevent hydration mismatch by not rendering time until mounted on client
  if (!isMounted) {
    return (
      <div
        className={`min-h-screen ${themeClasses.background} flex flex-col items-center justify-center p-4 relative overflow-hidden transition-colors duration-500`}
      >
        <div className="relative z-10">
          <div
            className={`${themeClasses.card} backdrop-blur-xl rounded-3xl p-6 md:p-12 shadow-glow border ${themeClasses.cardBorder}`}
          >
            <div className="flex items-center justify-center gap-2 md:gap-4 mb-4 md:mb-6">
              <div
                className={`${fontSizeClasses.time} font-mono font-bold ${themeClasses.textPrimary}`}
              >
                --
              </div>
              <div
                className={`${fontSizeClasses.time} font-mono font-bold ${themeClasses.textPrimary}`}
              >
                :
              </div>
              <div
                className={`${fontSizeClasses.time} font-mono font-bold ${themeClasses.textPrimary}`}
              >
                --
              </div>
              <div
                className={`${fontSizeClasses.time} font-mono font-bold ${themeClasses.textPrimary}`}
              >
                :
              </div>
              <div
                className={`${fontSizeClasses.time} font-mono font-bold ${themeClasses.textPrimary}`}
              >
                --
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${themeClasses.background} flex flex-col items-center justify-center p-4 relative overflow-hidden transition-colors duration-500`}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute top-1/4 left-1/2 w-[500px] h-[500px] ${themeClasses.decorativeGlow2} rounded-full blur-3xl transition-colors duration-500`}
        ></div>
        <div
          className={`absolute bottom-1/4 right-1/2 w-[500px] h-[500px] ${themeClasses.decorativeGlow2} rounded-full blur-3xl transition-colors duration-500`}
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      {/* Control Buttons */}
      <ControlButtons
        theme={theme}
        language={language}
        fontSize={fontSize}
        isFullscreen={isFullscreen}
        onDecreaseFontSize={handleDecreaseFontSize}
        onIncreaseFontSize={handleIncreaseFontSize}
        onToggleTheme={handleToggleTheme}
        onToggleLanguage={handleToggleLanguage}
        onToggleFullscreen={toggleFullscreen}
        onOpenSettings={() => setIsDialogOpen(true)}
      />

      {/* Logo */}
      <Logo language={language} />

      {/* Main Clock Display */}
      <ClockDisplay
        currentTime={currentTime}
        fontSize={fontSize}
        language={language}
        theme={theme}
        themeClasses={themeClasses}
      />

      {/* Exam Info Display */}
      <ExamInfoDisplay
        examInfo={examInfo}
        fontSize={fontSize}
        language={language}
        themeClasses={themeClasses}
        hasExamInfo={!!(
          examInfo.courseCode ||
          examInfo.courseName ||
          examInfo.lecture ||
          examInfo.lab ||
          examInfo.time ||
          examInfo.examRoom ||
          examInfo.remarks
        )}
      />

      {/* Autocomplete Settings Dialog */}
      <AutocompleteSettingsDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onConfirm={handleConfirmWithFullscreen}
        onCancel={handleCancelWithFullscreen}
        language={language}
        theme={theme}
        themeClasses={themeClasses}
        latestSemester={latestSemester || undefined}
      />

      {/* Feedback Button */}
      <FeedbackButton
        language={language}
        theme={theme}
        googleFormUrl="https://docs.google.com/forms/d/e/1FAIpQLSdaURXq1amwJvATGI3wSHn3BAPlVrD_M_zppIeQ5jpoX251GQ/viewform"
      />

      {/* Footer with Source Attribution */}
      <Footer language={language} themeClasses={themeClasses} />
    </div>
  );
}
