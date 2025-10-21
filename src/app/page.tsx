'use client';

import { useEffect, useState } from "react";

// Components
import { Logo } from "@/components/Logo";
import { ClockDisplay } from "@/components/ClockDisplay";
import { ControlButtons } from "@/components/ControlButtons";
import { SettingsDialog } from "@/components/SettingsDialog";
import { ExamInfoDisplay } from "@/components/ExamInfoDisplay";

// Custom Hooks
import { useTimeSync } from "@/hooks/useTimeSync";
import { useFullscreen } from "@/hooks/useFullscreen";
import { useExamInfo } from "@/hooks/useExamInfo";

// Utilities
import { getThemeClasses, getFontSizeClasses } from "@/lib/themeConstants";
import type { Language } from "@/lib/translations";
import type { Theme } from "@/lib/themeConstants";

export default function Home() {
  // UI State
  const [isDialogOpen, setIsDialogOpen] = useState(true);
  const [fontSize, setFontSize] = useState(3);
  const [language, setLanguage] = useState<Language>("th");
  const [theme, setTheme] = useState<Theme>("dark");
  const [isMounted, setIsMounted] = useState(false);

  // Custom Hooks
  const { currentTime } = useTimeSync();
  const { isFullscreen, toggleFullscreen, enterFullscreen } = useFullscreen();
  const { examInfo, formData, handleInputChange, handleConfirm, handleCancel, hasExamInfo } = useExamInfo();

  // Initialize mounted state on client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Event Handlers
  const handleToggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  const handleToggleLanguage = () => setLanguage((prev) => (prev === "th" ? "en" : "th"));
  const handleIncreaseFontSize = () => fontSize < 5 && setFontSize(fontSize + 1);
  const handleDecreaseFontSize = () => fontSize > 1 && setFontSize(fontSize - 1);

  // Dialog Handlers with Fullscreen
  const handleConfirmWithFullscreen = () => {
    handleConfirm();
    setIsDialogOpen(false);
    setTimeout(() => enterFullscreen(), 100);
  };

  const handleCancelWithFullscreen = () => {
    handleCancel();
    setIsDialogOpen(false);
    setTimeout(() => enterFullscreen(), 100);
  };

  const fontSizeClasses = getFontSizeClasses(fontSize);
  const themeClasses = getThemeClasses(theme);

  // Prevent hydration mismatch by not rendering time until mounted on client
  if (!isMounted) {
    return (
      <div className={`min-h-screen ${themeClasses.background} flex flex-col items-center justify-center p-4 relative overflow-hidden transition-colors duration-500`}>
        <div className="relative z-10">
          <div className={`${themeClasses.card} backdrop-blur-xl rounded-3xl p-6 md:p-12 shadow-glow border ${themeClasses.cardBorder}`}>
            <div className="flex items-center justify-center gap-2 md:gap-4 mb-4 md:mb-6">
              <div className={`${fontSizeClasses.time} font-mono font-bold ${themeClasses.textPrimary}`}>--</div>
              <div className={`${fontSizeClasses.time} font-mono font-bold ${themeClasses.textPrimary}`}>:</div>
              <div className={`${fontSizeClasses.time} font-mono font-bold ${themeClasses.textPrimary}`}>--</div>
              <div className={`${fontSizeClasses.time} font-mono font-bold ${themeClasses.textPrimary}`}>:</div>
              <div className={`${fontSizeClasses.time} font-mono font-bold ${themeClasses.textPrimary}`}>--</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${themeClasses.background} flex flex-col items-center justify-center p-4 relative overflow-hidden transition-colors duration-500`}>
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-1/4 left-1/2 w-[500px] h-[500px] ${themeClasses.decorativeGlow2} rounded-full blur-3xl transition-colors duration-500`}></div>
        <div className={`absolute bottom-1/4 right-1/2 w-[500px] h-[500px] ${themeClasses.decorativeGlow2} rounded-full blur-3xl transition-colors duration-500`} style={{ animationDelay: "1s" }}></div>
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
        theme={theme}
        themeClasses={themeClasses}
        hasExamInfo={hasExamInfo()}
      />

      {/* Settings Dialog */}
      <SettingsDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        formData={formData}
        onInputChange={handleInputChange}
        onConfirm={handleConfirmWithFullscreen}
        onCancel={handleCancelWithFullscreen}
        language={language}
        theme={theme}
        themeClasses={themeClasses}
      />

    </div>
  );
}
