/**
 * Control buttons component for exam clock
 */

import { Button } from "@/components/ui/button";
import { Settings, Plus, Minus, Sun, Moon, Maximize, Minimize } from "lucide-react";
import { getTranslation, type Language } from "@/lib/translations";
import { LanguageFlag } from "@/components/LanguageFlag";
import type { Theme } from "@/lib/themeConstants";

interface ControlButtonsProps {
  theme: Theme;
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

export function ControlButtons({
  theme,
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
  const buttonBg = getButtonBgClasses(theme);
  const textColor = getTextColor(theme);

  return (
    <div className="absolute top-6 right-6 z-20 flex gap-3">
      {/* Font Size Controls */}
      <div
        className={`flex gap-2 backdrop-blur-lg rounded-full px-3 py-2 border border-white/20 ${
          theme === "dark" ? "bg-white/5" : "bg-black/5"
        } transition-colors duration-500`}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={onDecreaseFontSize}
          disabled={fontSize === 1}
          className={`rounded-full h-9 w-9 ${theme === "dark" ? "hover:bg-white/10" : "hover:bg-black/10"} ${textColor} disabled:opacity-30`}
          title={getTranslation("decreaseFont", language)}
        >
          <Minus className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onIncreaseFontSize}
          disabled={fontSize === 5}
          className={`rounded-full h-9 w-9 ${theme === "dark" ? "hover:bg-white/10" : "hover:bg-black/10"} ${textColor} disabled:opacity-30`}
          title={getTranslation("increaseFont", language)}
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      {/* Theme Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleTheme}
        className={`rounded-full h-14 w-14 ${buttonBg} ${
          theme === "dark" ? "text-yellow-400" : textColor
        } border border-white/20 backdrop-blur-lg`}
        title={getTranslation("changeTheme", language)}
      >
        {theme === "dark" ? (
          <Sun className="h-5 w-5" />
        ) : (
          <Moon className="h-5 w-5" />
        )}
      </Button>

      {/* Language Toggle Button - SVG flags for universal browser support */}
      <div className={`rounded-full px-2 py-2 backdrop-blur-lg border border-white/20 ${buttonBg} flex items-center gap-1`}>
        <Button
          variant="ghost"
          onClick={onToggleLanguage}
          className={`rounded-full px-3 h-10 gap-2 ${textColor} hover:bg-white/10 flex items-center font-medium transition-all duration-300 ${
            language === "th" ? `${theme === "dark" ? "bg-white/10" : "bg-black/10"}` : ""
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
          className={`rounded-full px-3 h-10 gap-2 ${textColor} hover:bg-white/10 flex items-center font-medium transition-all duration-300 ${
            language === "en" ? `${theme === "dark" ? "bg-white/10" : "bg-black/10"}` : ""
          }`}
          title={getTranslation("changeLanguage", language)}
        >
          <LanguageFlag language="en" className="w-5 h-4" />
          <span className="hidden sm:inline-block text-sm font-semibold">EN</span>
        </Button>
      </div>

      {/* Fullscreen Toggle Button */}
      <Button
        variant="ghost"
        onClick={onToggleFullscreen}
        className={`rounded-full px-4 h-14 gap-2 ${buttonBg} ${textColor} border border-white/20 backdrop-blur-lg flex items-center`}
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

      {/* Settings Button */}
      <Button
        variant="ghost"
        onClick={onOpenSettings}
        className={`rounded-full px-4 h-14 gap-2 ${buttonBg} ${textColor} border border-white/20 backdrop-blur-lg flex items-center`}
        title={getTranslation("settings", language)}
      >
        <Settings className="h-5 w-5" />
        <span className="font-medium hidden sm:inline-block text-lg">
          {getTranslation("settings", language)}
        </span>
      </Button>
    </div>
  );
}
