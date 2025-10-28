"use client";

import { useEffect, useState, useCallback } from "react";

// Components
import { Logo } from "@/components/Logo";
import { ClockDisplay } from "@/components/ClockDisplay";
import { CountdownTimer } from "@/components/CountdownTimer";
import { ControlButtons } from "@/components/ControlButtons";
import { AutocompleteSettingsDialog } from "@/components/AutocompleteSettingsDialog";
import { ExamInfoDisplay } from "@/components/ExamInfoDisplay";
import { FeedbackButton } from "@/components/FeedbackButton";
import { Footer } from "@/components/Footer";

// Custom Hooks
import { useTimeSync } from "@/hooks/useTimeSync";
import { useFullscreen } from "@/hooks/useFullscreen";
import { useExamInfo } from "@/hooks/useExamInfo";
import { useNotificationSound } from "@/hooks/useNotificationSound";

// Utilities
import { getThemeClasses, getFontSizeClasses } from "@/lib/themeConstants";
import type { Language } from "@/lib/translations";
import type { Theme } from "@/lib/themeConstants";
import type { TestInfo } from "@/actions/examActions";
import { fetchRoomSuggestions } from "@/actions/examActions";

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
  const { playCountdownAlert, initialize: initializeSound } = useNotificationSound({
    enabled: true,
    volume: 1.0,
    language: language
  });

  // Initialize mounted state on client and fetch latest semester
  useEffect(() => {
    setIsMounted(true);

    // Fetch latest semester info via Server Action
    const fetchLatestSemester = async () => {
      try {
        const result = await fetchRoomSuggestions("");
        if (!result.error && result.latestSemester) {
          setLatestSemester(result.latestSemester);
        } else {
          console.warn("Failed to fetch latest semester:", result.error);
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
      // Initialize speech synthesis after user interaction
      initializeSound();
      setIsDialogOpen(false);
      // Wait for DOM to update before requesting fullscreen
      await new Promise((resolve) => setTimeout(resolve, 100));
      await enterFullscreen();
    },
    [applyTestInfo, enterFullscreen, initializeSound]
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
        className={`h-screen w-screen ${themeClasses.background} flex items-center justify-center transition-colors duration-500`}
      >
        <div className="flex items-center justify-center gap-2 md:gap-4">
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
    );
  }

  return (
    <div
      className={`h-screen w-screen ${themeClasses.background} overflow-hidden transition-colors duration-500`}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute top-1/2 left-1/2 w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2 ${themeClasses.decorativeGlow1} rounded-full blur-3xl opacity-50 transition-colors duration-500`}
        ></div>
      </div>

      {/* Main Grid Layout */}
      <div className="relative h-full w-full grid grid-rows-[auto_1fr_auto] p-6 gap-6">
        {/* Top Bar - Control Buttons & Logo */}
        <div className="flex items-start justify-between gap-4">
          <Logo language={language} />
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
        </div>

        {/* Center Content Area */}
        <div className="flex flex-col items-center justify-center gap-4 overflow-auto">
          {/* Clock and Countdown Container */}
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 w-full">
            {/* Main Clock Display */}
            <ClockDisplay
              currentTime={currentTime}
              fontSize={fontSize}
              language={language}
              theme={theme}
              themeClasses={themeClasses}
            />

            {/* Decorative Divider - Only shown when countdown is active */}
            {examInfo.time && (
              <div className="flex items-center justify-center">
                {/* Vertical divider for desktop, horizontal for mobile */}
                <div className="relative flex items-center justify-center">
                  {/* Mobile: Horizontal Divider */}
                  <div className="lg:hidden w-64 h-px relative">
                    <div
                      className={`absolute inset-0 ${theme === "dark" ? "bg-gradient-to-r from-transparent via-green-500/50 to-transparent" : "bg-gradient-to-r from-transparent via-green-600/40 to-transparent"}`}
                    ></div>
                  </div>

                  {/* Desktop: Vertical Divider */}
                  <div className="hidden lg:block h-64 w-px relative">
                    <div
                      className={`absolute inset-0 ${theme === "dark" ? "bg-gradient-to-b from-transparent via-green-500/50 to-transparent" : "bg-gradient-to-b from-transparent via-green-600/40 to-transparent"}`}
                    ></div>
                    {/* Glowing center dot */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <div
                        className={`w-3 h-3 rounded-full ${theme === "dark" ? "bg-green-500" : "bg-green-600"} shadow-lg ${theme === "dark" ? "shadow-green-500/50" : "shadow-green-600/50"} animate-pulse`}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Countdown Timer - Only shown when exam time is set */}
            {examInfo.time && (
              <CountdownTimer
                examTime={examInfo.time}
                fontSize={fontSize}
                language={language}
                themeClasses={themeClasses}
                onAlert={playCountdownAlert}
              />
            )}
          </div>

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
        </div>

        {/* Bottom Bar - Footer & Feedback */}
        <div className="flex items-end justify-between gap-4">
          <Footer language={language} themeClasses={themeClasses} />
          <FeedbackButton
            language={language}
            theme={theme}
            googleFormUrl="https://docs.google.com/forms/d/e/1FAIpQLSdaURXq1amwJvATGI3wSHn3BAPlVrD_M_zppIeQ5jpoX251GQ/viewform"
          />
        </div>
      </div>

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
    </div>
  );
}
