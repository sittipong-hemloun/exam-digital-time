'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import { Settings, Plus, Minus, Globe, Sun, Moon, Maximize, Minimize } from "lucide-react";

// Assets
import examThaiLogo from "@/assets/thai-logo.png";
import examEnglishLogo from "@/assets/eng-logo.png";

// UI Components
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Custom Hooks
import { useTimeSync } from "@/hooks/useTimeSync";
import { useFullscreen } from "@/hooks/useFullscreen";
import { useExamInfo } from "@/hooks/useExamInfo";

// Utilities
import { formatTime, formatDate } from "@/lib/timeUtils";
import { getThemeClasses, getFontSizeClasses, getInputClasses } from "@/lib/themeConstants";
import { getTranslation, type Language } from "@/lib/translations";
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

  const { hours, minutes, seconds } = formatTime(currentTime);
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
      <div className="absolute top-6 right-6 z-20 flex gap-3">
        {/* Font Size Controls */}
        <div className={`flex gap-2 backdrop-blur-lg rounded-full px-3 py-2 border border-white/20 ${theme === "dark" ? "bg-white/5" : "bg-black/5"} transition-colors duration-500`}>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDecreaseFontSize}
            disabled={fontSize === 1}
            className={`rounded-full h-9 w-9 ${theme === "dark" ? "hover:bg-white/10 text-foreground" : "hover:bg-black/10 text-gray-900"} disabled:opacity-30`}
            title={getTranslation("decreaseFont", language)}
          >
            <Minus className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleIncreaseFontSize}
            disabled={fontSize === 5}
            className={`rounded-full h-9 w-9 ${theme === "dark" ? "hover:bg-white/10 text-foreground" : "hover:bg-black/10 text-gray-900"} disabled:opacity-30`}
            title={getTranslation("increaseFont", language)}
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        {/* Theme Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleToggleTheme}
          className={`rounded-full h-14 w-14 ${theme === "dark" ? "bg-white/5 hover:bg-white/10 text-yellow-400" : "bg-black/5 hover:bg-black/10 text-gray-900"} border border-white/20 backdrop-blur-lg`}
          title={getTranslation("changeTheme", language)}
        >
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>

        {/* Language Toggle Button */}
        <Button
          variant="ghost"
          onClick={handleToggleLanguage}
          className={`rounded-full px-4 h-14 gap-2 ${theme === "dark" ? "bg-white/5 hover:bg-white/10 text-foreground" : "bg-black/5 hover:bg-black/10 text-gray-900"} border border-white/20 backdrop-blur-lg flex items-center`}
          title={getTranslation("changeLanguage", language)}
        >
          <Globe className="h-5 w-5" />
          <span className="font-medium hidden sm:inline-block text-lg">{language === "th" ? "ไทย" : "EN"}</span>
        </Button>


        {/* Fullscreen Toggle Button */}
        <Button
          variant="ghost"
          onClick={toggleFullscreen}
          className={`rounded-full px-4 h-14 gap-2 ${theme === "dark" ? "bg-white/5 hover:bg-white/10 text-foreground" : "bg-black/5 hover:bg-black/10 text-gray-900"} border border-white/20 backdrop-blur-lg flex items-center`}
          title={isFullscreen ? getTranslation("exitFullscreen", language) : getTranslation("fullscreen", language)}
        >
          {isFullscreen ? (
            <>
              <Minimize className="h-5 w-5" />
              <span className="font-medium hidden sm:inline-block text-lg">{getTranslation("exitFullscreen", language)}</span>
            </>
          ) : (
            <>
              <Maximize className="h-5 w-5" />
              <span className="font-medium hidden sm:inline-block text-lg">{getTranslation("fullscreen", language)}</span>
            </>
          )}
        </Button>

        {/* Settings Button */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className={`rounded-full px-4 h-14 gap-2 ${theme === "dark" ? "bg-white/5 hover:bg-white/10 text-foreground" : "bg-black/5 hover:bg-black/10 text-gray-900"} border border-white/20 backdrop-blur-lg flex items-center`}
              title={getTranslation("settings", language)}
            >
              <Settings className="h-5 w-5" />
              <span className="font-medium hidden sm:inline-block text-lg">{getTranslation("settings", language)}</span>
            </Button>
          </DialogTrigger>
          <DialogContent className={`sm:max-w-[700px] text-lg ${themeClasses.background} ${themeClasses.text} transition-colors duration-500 rounded-2xl shadow-2xl`}>
            <DialogHeader>
              <DialogTitle className={`text-2xl ${themeClasses.textPrimary} transition-colors duration-500`}>{getTranslation("examInfo", language)}</DialogTitle>
              <DialogDescription className={`text-base ${themeClasses.textMuted} transition-colors duration-500`}>
                {getTranslation("examInfoDesc", language)}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-5 py-6">
              <div className="grid gap-2">
                <Label htmlFor="course" className={`text-lg font-semibold ${themeClasses.textPrimary} transition-colors duration-500`}>{getTranslation("course", language)}</Label>
                <Input
                  id="course"
                  value={formData.course}
                  onChange={(e) => handleInputChange("course", e.target.value)}
                  placeholder={getTranslation("coursePlaceholder", language)}
                  className={`text-lg h-11 rounded-lg ${theme === "dark" ? "bg-black text-white border border-gray-700 focus:border-primary focus:bg-gray-800" : "bg-gray-50/80 text-gray-900 border border-gray-300 focus:border-green-600 focus:bg-white"} transition-colors duration-300`}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lecture" className={`text-lg font-semibold ${themeClasses.textPrimary} transition-colors duration-500`}>{getTranslation("lecture", language)}</Label>
                <Input
                  id="lecture"
                  value={formData.lecture}
                  onChange={(e) => handleInputChange("lecture", e.target.value)}
                  placeholder={getTranslation("lecturePlaceholder", language)}
                  className={`text-lg h-11 rounded-lg ${theme === "dark" ? "bg-black text-white border border-gray-700 focus:border-primary focus:bg-gray-800" : "bg-gray-50/80 text-gray-900 border border-gray-300 focus:border-green-600 focus:bg-white"} transition-colors duration-300`}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lab" className={`text-lg font-semibold ${themeClasses.textPrimary} transition-colors duration-500`}>{getTranslation("lab", language)}</Label>
                <Input
                  id="lab"
                  value={formData.lab}
                  onChange={(e) => handleInputChange("lab", e.target.value)}
                  placeholder={getTranslation("labPlaceholder", language)}
                  className={`text-lg h-11 rounded-lg ${theme === "dark" ? "bg-black text-white border border-gray-700 focus:border-primary focus:bg-gray-800" : "bg-gray-50/80 text-gray-900 border border-gray-300 focus:border-green-600 focus:bg-white"} transition-colors duration-300`}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="time" className={`text-lg font-semibold ${themeClasses.textPrimary} transition-colors duration-500`}>{getTranslation("examTime", language)}</Label>
                <Input
                  id="time"
                  value={formData.time}
                  onChange={(e) => handleInputChange("time", e.target.value)}
                  placeholder={getTranslation("timePlaceholder", language)}
                  className={`text-lg h-11 rounded-lg ${theme === "dark" ? "bg-black text-white border border-gray-700 focus:border-primary focus:bg-gray-800" : "bg-gray-50/80 text-gray-900 border border-gray-300 focus:border-green-600 focus:bg-white"} transition-colors duration-300`}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="examRoom" className={`text-lg font-semibold ${themeClasses.textPrimary} transition-colors duration-500`}>{getTranslation("examRoom", language)}</Label>
                <Input
                  id="examRoom"
                  value={formData.examRoom}
                  onChange={(e) => handleInputChange("examRoom", e.target.value)}
                  placeholder={getTranslation("roomPlaceholder", language)}
                  className={`text-lg h-11 rounded-lg ${theme === "dark" ? "bg-black text-white border border-gray-700 focus:border-primary focus:bg-gray-800" : "bg-gray-50/80 text-gray-900 border border-gray-300 focus:border-green-600 focus:bg-white"} transition-colors duration-300`}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="remarks" className={`text-lg font-semibold ${themeClasses.textPrimary} transition-colors duration-500`}>{getTranslation("remarks", language)}</Label>
                <Textarea
                  id="remarks"
                  value={formData.remarks}
                  onChange={(e) => handleInputChange("remarks", e.target.value)}
                  placeholder={getTranslation("remarksPlaceholder", language)}
                  rows={3}
                  className={`text-lg rounded-lg ${theme === "dark" ? "bg-black text-white border border-gray-700 focus:border-primary focus:bg-gray-800" : "bg-gray-50/80 text-gray-900 border border-gray-300 focus:border-green-600 focus:bg-white"} transition-colors duration-300`}
                />
              </div>
            </div>
            <DialogFooter className="text-lg pt-4 gap-3">
              <Button
                variant="outline"
                onClick={handleCancelWithFullscreen}
                className={`text-base px-6 h-11 rounded-lg ${theme === "dark" ? "border-gray-700 hover:bg-black" : "border-gray-300 hover:bg-gray-100"} transition-all duration-300`}
              >
                {getTranslation("cancel", language)}
              </Button>
              <Button
                onClick={handleConfirmWithFullscreen}
                className={`text-base px-8 h-11 rounded-lg bg-gradient-to-r ${themeClasses.gradient} text-white font-semibold hover:opacity-95 shadow-lg hover:shadow-xl transition-all duration-300`}
              >
                {getTranslation("confirm", language)}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Logo */}
      <div className="mb-8">
        <Image
          src={language === "th" ? examThaiLogo : examEnglishLogo}
          alt="Logo"
          className="h-20 md:h-24 drop-shadow-2xl w-auto filter brightness-110"
          priority
        />
      </div>

      {/* Main Clock Display */}
      <div className="relative z-10">
        <div className={` p-8 md:p-16 transition-colors duration-500`}>
          {/* Time Display */}
          <div className="flex items-center justify-center gap-2 md:gap-4 mb-6 md:mb-8">
            <div className="text-center">
              <div className={`${fontSizeClasses.time} font-mono font-bold  ${themeClasses.textPrimary} drop-shadow-lg`}>
                {hours}
              </div>
            </div>

            <div className={`${fontSizeClasses.time} font-mono font-bold ${themeClasses.textPrimary} transition-colors duration-500`}>
              :
            </div>

            <div className="text-center">
              <div className={`${fontSizeClasses.time} font-mono font-bold  ${themeClasses.textPrimary} drop-shadow-lg`}>
                {minutes}
              </div>
            </div>

            <div className={`${fontSizeClasses.time} font-mono font-bold ${themeClasses.textPrimary} transition-colors duration-500`}>
              :
            </div>

            <div className="text-center">
              <div className={`${fontSizeClasses.time} font-mono font-bold  ${themeClasses.textPrimary} drop-shadow-lg`}>
                {seconds}
              </div>
            </div>
          </div>

          {/* Date Display */}
          <div className="text-center">
            <p className={`${fontSizeClasses.date} ${themeClasses.text} opacity-80 font-medium transition-all duration-300`}>
              {formatDate(currentTime, language)}
            </p>
          </div>
        </div>
      </div>

      {/* Exam Info Display - Only show fields with values */}
      {(examInfo.course || examInfo.lecture || examInfo.lab || examInfo.time || examInfo.examRoom || examInfo.remarks) && (
        <div className="relative z-10 mt-8 w-full max-w-7xl mx-auto px-4">
          <div className={`${themeClasses.card} backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-2xl border ${themeClasses.cardBorder} transition-colors duration-500`}>
            <div className={`grid grid-cols-1 md:grid-cols-12 gap-3 ${fontSizeClasses.examInfo} transition-all duration-300`}>
              {examInfo.course && (
                <div className="flex gap-2 col-span-full">
                  <span className={`font-semibold ${themeClasses.textPrimary} transition-colors duration-500`}>{getTranslation("course", language)}:</span>
                  <span className={`${themeClasses.text} opacity-90 transition-colors duration-500`}>{examInfo.course}</span>
                </div>
              )}
              {examInfo.lecture && (
                <div className="flex gap-2 col-span-6">
                  <span className={`font-semibold ${themeClasses.textPrimary} transition-colors duration-500`}>{getTranslation("lecture", language)}:</span>
                  <span className={`${themeClasses.text} opacity-90 transition-colors duration-500`}>{examInfo.lecture}</span>
                </div>
              )}
              {examInfo.lab && (
                <div className="flex gap-2 col-span-6">
                  <span className={`font-semibold ${themeClasses.textPrimary} transition-colors duration-500`}>{getTranslation("lab", language)}:</span>
                  <span className={`${themeClasses.text} opacity-90 transition-colors duration-500`}>{examInfo.lab}</span>
                </div>
              )}
              {examInfo.time && (
                <div className="flex gap-2 col-span-6">
                  <span className={`font-semibold ${themeClasses.textPrimary} transition-colors duration-500`}>{getTranslation("examTime", language)}:</span>
                  <span className={`${themeClasses.text} opacity-90 transition-colors duration-500`}>{examInfo.time}</span>
                </div>
              )}
              {examInfo.examRoom && (
                <div className="flex gap-2 col-span-6">
                  <span className={`font-semibold ${themeClasses.textPrimary} transition-colors duration-500`}>{getTranslation("examRoom", language)}:</span>
                  <span className={`${themeClasses.text} opacity-90 transition-colors duration-500`}>{examInfo.examRoom}</span>
                </div>
              )}
              {examInfo.remarks && (
                <div className="flex gap-2 md:col-span-12">
                  <span className={`font-semibold ${themeClasses.textPrimary} transition-colors duration-500`}>{getTranslation("remarks", language)}:</span>
                  <span className={`${themeClasses.text} opacity-90 transition-colors duration-500`}>{examInfo.remarks}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
