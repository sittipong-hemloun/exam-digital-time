/**
 * Control buttons component for exam clock
 * Optimized with React.memo to prevent unnecessary re-renders
 */

import { memo } from "react";
import { Button } from "@/components/ui/button";
import { Settings, Plus, Minus, Sun, Moon, Maximize, Minimize } from "lucide-react";
import { getTranslation, type Language } from "@/lib/translations";
import { LanguageFlag } from "@/components/LanguageFlag";
import type { Theme, ThemeClasses } from "@/lib/themeConstants";

interface ControlButtonsProps {
  theme: Theme;
  ThemeClasses: ThemeClasses;
  language: Language;
  fontSize: number;
  isFullscreen: boolean;
  onDecreaseFontSize: () => void;
  onIncreaseFontSize: () => void;
  onToggleTheme: () => void;
  onToggleLanguage: () => void;
  onToggleFullscreen: () => void;
  onOpenSettings: () => void;
}

const getButtonBgClasses = (theme: Theme): string => {
  return theme === "dark" ? "bg-white/5 hover:bg-white/10" : "bg-black/5 hover:bg-black/10";
};

const getTextColor = (theme: Theme): string => {
  return theme === "dark" ? "text-foreground" : "text-gray-900";
};

// Memoized font size controls
const FontSizeControls = memo(function FontSizeControls({
  fontSize,
  theme,
  ThemeClasses,
  language,
  onDecreaseFontSize,
  onIncreaseFontSize,
}: {
  fontSize: number;
  theme: Theme;
  ThemeClasses: ThemeClasses;
  language: Language;
  onDecreaseFontSize: () => void;
  onIncreaseFontSize: () => void;
}) {
  return (
    <div
      className={`flex gap-2 backdrop-blur-lg rounded-full px-3 py-2 border ${ThemeClasses.cardBorder} ${theme === "dark" ? "bg-white/5" : "bg-black/5"
        } transition-colors duration-500`}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={onDecreaseFontSize}
        disabled={fontSize === 0}
        className={`rounded-full h-9 w-9 ${theme === "dark" ? "hover:bg-white/10" : "hover:bg-black/10"} ${getTextColor(theme)} disabled:opacity-30`}
        title={getTranslation("decreaseFont", language)}
      >
        <Minus className="h-5 w-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onIncreaseFontSize}
        disabled={fontSize === 6}
        className={`rounded-full h-9 w-9 ${theme === "dark" ? "hover:bg-white/10" : "hover:bg-black/10"} ${getTextColor(theme)} disabled:opacity-30`}
        title={getTranslation("increaseFont", language)}
      >
        <Plus className="h-5 w-5" />
      </Button>
    </div>
  );
});

// Memoized language toggle
const LanguageToggle = memo(function LanguageToggle({
  language,
  theme,
  ThemeClasses,
  onToggleLanguage,
}: {
  language: Language;
  theme: Theme;
  ThemeClasses: ThemeClasses;
  onToggleLanguage: () => void;
}) {
  const textColor = getTextColor(theme);
  const buttonBg = getButtonBgClasses(theme);

  return (
    <div className={`rounded-full px-2 py-2 backdrop-blur-lg border ${ThemeClasses.cardBorder} ${buttonBg} flex items-center gap-1`}>
      <Button
        variant="ghost"
        onClick={onToggleLanguage}
        className={`rounded-full px-3 h-10 gap-2 ${textColor} hover:bg-white/10 flex items-center font-medium transition-all duration-300 ${language === "th" ? `${theme === "dark" ? "bg-white/10" : "bg-black/10"}` : ""
          }`}
        title={getTranslation("changeLanguage", language)}
      >
        <LanguageFlag language="th" className="w-5 h-4" />
        <span className="hidden sm:inline-block text-sm font-semibold">ไทย</span>
      </Button>

      <div className={`h-6 w-px ${theme === "dark" ? "bg-white/10" : "bg-black/10"}`}></div>

      <Button
        variant="ghost"
        onClick={onToggleLanguage}
        className={`rounded-full px-3 h-10 gap-2 ${textColor} hover:bg-white/10 flex items-center font-medium transition-all duration-300 ${language === "en" ? `${theme === "dark" ? "bg-white/10" : "bg-black/10"}` : ""
          }`}
        title={getTranslation("changeLanguage", language)}
      >
        <LanguageFlag language="en" className="w-5 h-4" />
        <span className="hidden sm:inline-block text-sm font-semibold">EN</span>
      </Button>
    </div>
  );
});

// Memoized theme toggle
const ThemeToggle = memo(function ThemeToggle({
  theme,
  ThemeClasses,
  language,
  onToggleTheme,
}: {
  theme: Theme;
  ThemeClasses: ThemeClasses;
  language: Language;
  onToggleTheme: () => void;
}) {
  const buttonBg = getButtonBgClasses(theme);
  const textColor = getTextColor(theme);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onToggleTheme}
      className={`rounded-full h-14 w-14 ${buttonBg} ${theme === "dark" ? "text-yellow-400" : textColor
        } border ${ThemeClasses.cardBorder} backdrop-blur-lg`}
      title={getTranslation("changeTheme", language)}
    >
      {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
});

// Memoized fullscreen toggle
const FullscreenToggle = memo(function FullscreenToggle({
  isFullscreen,
  theme,
  ThemeClasses,
  language,
  onToggleFullscreen,
}: {
  isFullscreen: boolean;
  theme: Theme;
  ThemeClasses: ThemeClasses;
  language: Language;
  onToggleFullscreen: () => void;
}) {
  const buttonBg = getButtonBgClasses(theme);
  const textColor = getTextColor(theme);

  return (
    <Button
      variant="ghost"
      onClick={onToggleFullscreen}
      className={`rounded-full px-4 h-14 gap-2 ${buttonBg} ${textColor} border ${ThemeClasses.cardBorder} backdrop-blur-lg flex items-center`}
      title={
        isFullscreen
          ? getTranslation("exitFullscreen", language)
          : getTranslation("fullscreen", language)
      }
    >
      {isFullscreen ? (
        <>
          <Minimize className="h-5 w-5" />
          <span className="font-medium hidden sm:inline-block text-lg">
            {getTranslation("exitFullscreen", language)}
          </span>
        </>
      ) : (
        <>
          <Maximize className="h-5 w-5" />
          <span className="font-medium hidden sm:inline-block text-lg">
            {getTranslation("fullscreen", language)}
          </span>
        </>
      )}
    </Button>
  );
});

// Memoized settings button
const SettingsButton = memo(function SettingsButton({
  theme,
  ThemeClasses,
  language,
  onOpenSettings,
}: {
  theme: Theme;
  ThemeClasses: ThemeClasses;
  language: Language;
  onOpenSettings: () => void;
}) {
  const buttonBg = getButtonBgClasses(theme);
  const textColor = getTextColor(theme);

  return (
    <Button
      variant="ghost"
      onClick={onOpenSettings}
      className={`rounded-full px-4 h-14 gap-2 ${buttonBg} ${textColor} border ${ThemeClasses.cardBorder} backdrop-blur-lg flex items-center`}
      title={getTranslation("settings", language)}
    >
      <Settings className="h-5 w-5" />
      <span className="font-medium hidden sm:inline-block text-lg">
        {getTranslation("settings", language)}
      </span>
    </Button>
  );
});

export const ControlButtons = memo(function ControlButtons({
  theme,
  ThemeClasses,
  language,
  fontSize,
  isFullscreen,
  onDecreaseFontSize,
  onIncreaseFontSize,
  onToggleTheme,
  onToggleLanguage,
  onToggleFullscreen,
  onOpenSettings,
}: ControlButtonsProps) {
  return (
    <div className="absolute top-6 right-6 z-20 flex gap-3">
      <FontSizeControls
        fontSize={fontSize}
        theme={theme}
        ThemeClasses={ThemeClasses}
        language={language}
        onDecreaseFontSize={onDecreaseFontSize}
        onIncreaseFontSize={onIncreaseFontSize}
      />

      <ThemeToggle theme={theme} ThemeClasses={ThemeClasses} language={language} onToggleTheme={onToggleTheme} />

      <LanguageToggle
        language={language}
        theme={theme}
        ThemeClasses={ThemeClasses}
        onToggleLanguage={onToggleLanguage}
      />

      <FullscreenToggle
        isFullscreen={isFullscreen}
        theme={theme}
        ThemeClasses={ThemeClasses}
        language={language}
        onToggleFullscreen={onToggleFullscreen}
      />

      <SettingsButton
        theme={theme}
        ThemeClasses={ThemeClasses}
        language={language}
        onOpenSettings={onOpenSettings}
      />
    </div>
  );
});
