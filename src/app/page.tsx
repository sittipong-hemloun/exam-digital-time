'use client';

import { useEffect, useState } from "react";
import examThaiLogo from "@/assets/thai-logo.png";
import examEnglishLogo from "@/assets/eng-logo.png";
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
import { Settings, Plus, Minus, Globe, Sun, Moon, Maximize, Minimize } from "lucide-react";
import Image from "next/image";

interface ExamInfo {
  course: string;
  lecture: string;
  lab: string;
  time: string;
  examRoom: string;
  remarks: string;
}

type Language = "th" | "en";
type Theme = "light" | "dark";

export default function Home() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(true);
  const [fontSize, setFontSize] = useState(3); // 1=small, 2=medium, 3=large, 4=extra large, 5=huge
  const [language, setLanguage] = useState<Language>("th");
  const [theme, setTheme] = useState<Theme>("dark");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMounted, setIsMounted] = useState(false); // Track if component is mounted on client
  const [timeOffset, setTimeOffset] = useState(0); // Offset between server time and client time
  const [examInfo, setExamInfo] = useState<ExamInfo>({
    course: "",
    lecture: "",
    lab: "",
    time: "",
    examRoom: "",
    remarks: "",
  });
  const [formData, setFormData] = useState<ExamInfo>({
    course: "",
    lecture: "",
    lab: "",
    time: "",
    examRoom: "",
    remarks: "",
  });

  // Set mounted state on client and sync time
  useEffect(() => {
    setIsMounted(true);

    // Sync time with server using HTTP Date header
    const syncServerTime = async (timeoutMs = 3000) => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

        // Make HEAD request to get server time from Date header
        const res = await fetch(window.location.href, {
          method: 'HEAD',
          cache: 'no-store',
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        const serverDateHeader = res.headers.get('Date');
        if (!serverDateHeader) {
          console.warn('No Date header found in response');
          setTimeOffset(0);
          return false;
        }

        const serverTime = new Date(serverDateHeader).getTime();
        const clientTime = Date.now();
        const offset = serverTime - clientTime;

        setTimeOffset(offset);
        console.log('Time synced with server. Offset:', offset, 'ms');
        return true;
      } catch (error) {
        console.warn('Failed to sync with server time:', error);
        setTimeOffset(0);
        return false;
      }
    };

    // Initial sync with server time
    syncServerTime();

    // Re-sync every 10 minutes to maintain accuracy
    const syncInterval = setInterval(() => {
      syncServerTime();
    }, 10 * 60 * 1000);

    return () => {
      clearInterval(syncInterval);
    };
  }, []);

  // Update displayed time every second with offset
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date(Date.now() + timeOffset));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeOffset]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Auto-enter fullscreen on mount
  useEffect(() => {
    if (isMounted && !document.fullscreenElement) {
      try {
        document.documentElement.requestFullscreen().catch((err) => {
          console.warn("Failed to request fullscreen:", err);
        });
      } catch (err) {
        console.warn("Error requesting fullscreen:", err);
      }
    }
  }, [isMounted]);

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    return { hours, minutes, seconds };
  };

  const formatDate = (date: Date) => {
    const daysTh = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];
    const daysEn = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const monthsTh = [
      "มกราคม",
      "กุมภาพันธ์",
      "มีนาคม",
      "เมษายน",
      "พฤษภาคม",
      "มิถุนายน",
      "กรกฎาคม",
      "สิงหาคม",
      "กันยายน",
      "ตุลาคม",
      "พฤศจิกายน",
      "ธันวาคม",
    ];
    const monthsEn = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const days = language === "th" ? daysTh : daysEn;
    const months = language === "th" ? monthsTh : monthsEn;
    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = language === "th" ? date.getFullYear() + 543 : date.getFullYear();

    if (language === "th") {
      return `วัน${dayName}ที่ ${day} ${month} ${year}`;
    } else {
      return `${month} ${day}, ${year}`;
    }
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "th" ? "en" : "th"));
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error("Error toggling fullscreen:", err);
    }
  };

  const getTranslation = (key: string) => {
    const translations: Record<string, { th: string; en: string }> = {
      examInfo: { th: "ข้อมูลการสอบ", en: "Exam Information" },
      examInfoDesc: {
        th: "กรอกข้อมูลเกี่ยวกับการสอบ (ข้อมูลที่ไม่กรอกจะไม่แสดง)",
        en: "Enter exam information (empty fields will not be displayed)"
      },
      course: { th: "รหัสวิชา/ชื่อวิชา", en: "Course Code/Name" },
      lecture: { th: "หมู่บรรยาย", en: "Lecture Section" },
      lab: { th: "หมู่ปฏิบัติ", en: "Lab Section" },
      examTime: { th: "เวลาสอบ", en: "Exam Time" },
      examRoom: { th: "ห้องสอบ", en: "Exam Room" },
      remarks: { th: "หมายเหตุ", en: "Remarks" },
      cancel: { th: "ยกเลิก", en: "Cancel" },
      confirm: { th: "ยืนยัน", en: "Confirm" },
      footer: { th: "นาฬิกาดิจิทัลสำหรับห้องสอบ", en: "Digital Clock for Exam Room" },
      decreaseFont: { th: "ลดขนาดตัวอักษร", en: "Decrease Font Size" },
      increaseFont: { th: "เพิ่มขนาดตัวอักษร", en: "Increase Font Size" },
      settings: { th: "ตั้งค่าข้อมูลการสอบ", en: "Information Settings" },
      changeLanguage: { th: "เปลี่ยนภาษา", en: "Change Language" },
      changeTheme: { th: "เปลี่ยนธีม", en: "Change Theme" },
      fullscreen: { th: "เต็มหน้าจอ", en: "Fullscreen" },
      exitFullscreen: { th: "ออกจากเต็มหน้าจอ", en: "Exit Fullscreen" },
      coursePlaceholder: { th: "เช่น CS101 Computer Programming", en: "e.g. CS101 Computer Programming" },
      lecturePlaceholder: { th: "เช่น 01", en: "e.g. 01" },
      labPlaceholder: { th: "เช่น 001", en: "e.g. 001" },
      timePlaceholder: { th: "เช่น 09:00 - 12:00", en: "e.g. 09:00 - 12:00" },
      roomPlaceholder: { th: "เช่น EN101", en: "e.g. EN101" },
      remarksPlaceholder: { th: "ข้อมูลเพิ่มเติม", en: "Additional information" },
    };
    return translations[key]?.[language] || key;
  };

  const handleInputChange = (field: keyof ExamInfo, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleConfirm = () => {
    setExamInfo(formData);
    setIsDialogOpen(false);
    // Request fullscreen after dialog closes
    setTimeout(() => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch((err) => {
          console.warn("Failed to request fullscreen:", err);
        });
      }
    }, 100);
  };

  const handleCancel = () => {
    setFormData(examInfo);
    setIsDialogOpen(false);
    // Request fullscreen after dialog closes
    setTimeout(() => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch((err) => {
          console.warn("Failed to request fullscreen:", err);
        });
      }
    }, 100);
  };

  const increaseFontSize = () => {
    if (fontSize < 5) setFontSize(fontSize + 1);
  };

  const decreaseFontSize = () => {
    if (fontSize > 1) setFontSize(fontSize - 1);
  };

  const getFontSizeClasses = () => {
    const sizes = {
      1: { time: "text-7xl md:text-9xl", date: "text-xl md:text-3xl", examInfo: "text-base md:text-4xl" },
      2: { time: "text-8xl md:text-[12rem]", date: "text-2xl md:text-4xl", examInfo: "text-lg md:text-5xl" },
      3: { time: "text-9xl md:text-[14rem]", date: "text-3xl md:text-5xl", examInfo: "text-xl md:text-6xl" },
      4: { time: "text-[10rem] md:text-[16rem]", date: "text-4xl md:text-6xl", examInfo: "text-2xl md:text-7xl" },
      5: { time: "text-[12rem] md:text-[20rem]", date: "text-5xl md:text-7xl", examInfo: "text-3xl md:text-8xl" }
    };
    return sizes[fontSize as keyof typeof sizes];
  };

  const getThemeClasses = () => {
    if (theme === "light") {
      return {
        background: "bg-gradient-to-br from-blue-50 via-white to-green-50",
        decorativeGlow1: "bg-blue-400/20",
        decorativeGlow2: "bg-green-400/20",
        card: "bg-white/10",
        cardBorder: "border-gray-200",
        text: "text-gray-900",
        textMuted: "text-gray-600",
        textPrimary: "text-green-600",
        gradient: "from-blue-600 to-green-600",
      };
    }
    // Dark theme (default)
    return {
      background: "bg-gradient-background",
      decorativeGlow1: "bg-primary/10",
      decorativeGlow2: "bg-accent-green/10",
      card: "bg-card/50",
      cardBorder: "border-border",
      text: "text-foreground",
      textMuted: "text-muted-foreground",
      textPrimary: "text-primary",
      gradient: "from-primary to-accent-green",
    };
  };

  const { hours, minutes, seconds } = formatTime(currentTime);
  const fontSizeClasses = getFontSizeClasses();
  const themeClasses = getThemeClasses();

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
            onClick={decreaseFontSize}
            disabled={fontSize === 1}
            className={`rounded-full h-9 w-9 ${theme === "dark" ? "hover:bg-white/10 text-foreground" : "hover:bg-black/10 text-gray-900"} disabled:opacity-30`}
            title={getTranslation("decreaseFont")}
          >
            <Minus className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={increaseFontSize}
            disabled={fontSize === 5}
            className={`rounded-full h-9 w-9 ${theme === "dark" ? "hover:bg-white/10 text-foreground" : "hover:bg-black/10 text-gray-900"} disabled:opacity-30`}
            title={getTranslation("increaseFont")}
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        {/* Theme Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className={`rounded-full h-14 w-14 ${theme === "dark" ? "bg-white/5 hover:bg-white/10 text-yellow-400" : "bg-black/5 hover:bg-black/10 text-gray-900"} border border-white/20 backdrop-blur-lg`}
          title={getTranslation("changeTheme")}
        >
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>

        {/* Language Toggle Button */}
        <Button
          variant="ghost"
          onClick={toggleLanguage}
          className={`rounded-full px-4 h-14 gap-2 ${theme === "dark" ? "bg-white/5 hover:bg-white/10 text-foreground" : "bg-black/5 hover:bg-black/10 text-gray-900"} border border-white/20 backdrop-blur-lg flex items-center`}
          title={getTranslation("changeLanguage")}
        >
          <Globe className="h-5 w-5" />
          <span className="font-medium hidden sm:inline-block text-lg">{language === "th" ? "ไทย" : "EN"}</span>
        </Button>


        {/* Fullscreen Toggle Button */}
        <Button
          variant="ghost"
          onClick={toggleFullscreen}
          className={`rounded-full px-4 h-14 gap-2 ${theme === "dark" ? "bg-white/5 hover:bg-white/10 text-foreground" : "bg-black/5 hover:bg-black/10 text-gray-900"} border border-white/20 backdrop-blur-lg flex items-center`}
          title={isFullscreen ? getTranslation("exitFullscreen") : getTranslation("fullscreen")}
        >
          {isFullscreen ? (
            <>
              <Minimize className="h-5 w-5" />
              <span className="font-medium hidden sm:inline-block text-lg">{getTranslation("exitFullscreen")}</span>
            </>
          ) : (
            <>
              <Maximize className="h-5 w-5" />
              <span className="font-medium hidden sm:inline-block text-lg">{getTranslation("fullscreen")}</span>
            </>
          )}
        </Button>

        {/* Settings Button */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className={`rounded-full px-4 h-14 gap-2 ${theme === "dark" ? "bg-white/5 hover:bg-white/10 text-foreground" : "bg-black/5 hover:bg-black/10 text-gray-900"} border border-white/20 backdrop-blur-lg flex items-center`}
              title={getTranslation("settings")}
            >
              <Settings className="h-5 w-5" />
              <span className="font-medium hidden sm:inline-block text-lg">{getTranslation("settings")}</span>
            </Button>
          </DialogTrigger>
          <DialogContent className={`sm:max-w-[700px] text-lg ${themeClasses.background} ${themeClasses.text} transition-colors duration-500 rounded-2xl shadow-2xl`}>
            <DialogHeader>
              <DialogTitle className={`text-2xl ${themeClasses.textPrimary} transition-colors duration-500`}>{getTranslation("examInfo")}</DialogTitle>
              <DialogDescription className={`text-base ${themeClasses.textMuted} transition-colors duration-500`}>
                {getTranslation("examInfoDesc")}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-5 py-6">
              <div className="grid gap-2">
                <Label htmlFor="course" className={`text-lg font-semibold ${themeClasses.textPrimary} transition-colors duration-500`}>{getTranslation("course")}</Label>
                <Input
                  id="course"
                  value={formData.course}
                  onChange={(e) => handleInputChange("course", e.target.value)}
                  placeholder={getTranslation("coursePlaceholder")}
                  className={`text-lg h-11 rounded-lg ${theme === "dark" ? "bg-black text-white border border-gray-700 focus:border-primary focus:bg-gray-800" : "bg-gray-50/80 text-gray-900 border border-gray-300 focus:border-green-600 focus:bg-white"} transition-colors duration-300`}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lecture" className={`text-lg font-semibold ${themeClasses.textPrimary} transition-colors duration-500`}>{getTranslation("lecture")}</Label>
                <Input
                  id="lecture"
                  value={formData.lecture}
                  onChange={(e) => handleInputChange("lecture", e.target.value)}
                  placeholder={getTranslation("lecturePlaceholder")}
                  className={`text-lg h-11 rounded-lg ${theme === "dark" ? "bg-black text-white border border-gray-700 focus:border-primary focus:bg-gray-800" : "bg-gray-50/80 text-gray-900 border border-gray-300 focus:border-green-600 focus:bg-white"} transition-colors duration-300`}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lab" className={`text-lg font-semibold ${themeClasses.textPrimary} transition-colors duration-500`}>{getTranslation("lab")}</Label>
                <Input
                  id="lab"
                  value={formData.lab}
                  onChange={(e) => handleInputChange("lab", e.target.value)}
                  placeholder={getTranslation("labPlaceholder")}
                  className={`text-lg h-11 rounded-lg ${theme === "dark" ? "bg-black text-white border border-gray-700 focus:border-primary focus:bg-gray-800" : "bg-gray-50/80 text-gray-900 border border-gray-300 focus:border-green-600 focus:bg-white"} transition-colors duration-300`}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="time" className={`text-lg font-semibold ${themeClasses.textPrimary} transition-colors duration-500`}>{getTranslation("examTime")}</Label>
                <Input
                  id="time"
                  value={formData.time}
                  onChange={(e) => handleInputChange("time", e.target.value)}
                  placeholder={getTranslation("timePlaceholder")}
                  className={`text-lg h-11 rounded-lg ${theme === "dark" ? "bg-black text-white border border-gray-700 focus:border-primary focus:bg-gray-800" : "bg-gray-50/80 text-gray-900 border border-gray-300 focus:border-green-600 focus:bg-white"} transition-colors duration-300`}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="examRoom" className={`text-lg font-semibold ${themeClasses.textPrimary} transition-colors duration-500`}>{getTranslation("examRoom")}</Label>
                <Input
                  id="examRoom"
                  value={formData.examRoom}
                  onChange={(e) => handleInputChange("examRoom", e.target.value)}
                  placeholder={getTranslation("roomPlaceholder")}
                  className={`text-lg h-11 rounded-lg ${theme === "dark" ? "bg-black text-white border border-gray-700 focus:border-primary focus:bg-gray-800" : "bg-gray-50/80 text-gray-900 border border-gray-300 focus:border-green-600 focus:bg-white"} transition-colors duration-300`}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="remarks" className={`text-lg font-semibold ${themeClasses.textPrimary} transition-colors duration-500`}>{getTranslation("remarks")}</Label>
                <Textarea
                  id="remarks"
                  value={formData.remarks}
                  onChange={(e) => handleInputChange("remarks", e.target.value)}
                  placeholder={getTranslation("remarksPlaceholder")}
                  rows={3}
                  className={`text-lg rounded-lg ${theme === "dark" ? "bg-black text-white border border-gray-700 focus:border-primary focus:bg-gray-800" : "bg-gray-50/80 text-gray-900 border border-gray-300 focus:border-green-600 focus:bg-white"} transition-colors duration-300`}
                />
              </div>
            </div>
            <DialogFooter className="text-lg pt-4 gap-3">
              <Button
                variant="outline"
                onClick={handleCancel}
                className={`text-base px-6 h-11 rounded-lg ${theme === "dark" ? "border-gray-700 hover:bg-black" : "border-gray-300 hover:bg-gray-100"} transition-all duration-300`}
              >
                {getTranslation("cancel")}
              </Button>
              <Button
                onClick={handleConfirm}
                className={`text-base px-8 h-11 rounded-lg bg-gradient-to-r ${themeClasses.gradient} text-white font-semibold hover:opacity-95 shadow-lg hover:shadow-xl transition-all duration-300`}
              >
                {getTranslation("confirm")}
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
              {formatDate(currentTime)}
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
                  <span className={`font-semibold ${themeClasses.textPrimary} transition-colors duration-500`}>{getTranslation("course")}:</span>
                  <span className={`${themeClasses.text} opacity-90 transition-colors duration-500`}>{examInfo.course}</span>
                </div>
              )}
              {examInfo.lecture && (
                <div className="flex gap-2 col-span-6">
                  <span className={`font-semibold ${themeClasses.textPrimary} transition-colors duration-500`}>{getTranslation("lecture")}:</span>
                  <span className={`${themeClasses.text} opacity-90 transition-colors duration-500`}>{examInfo.lecture}</span>
                </div>
              )}
              {examInfo.lab && (
                <div className="flex gap-2 col-span-6">
                  <span className={`font-semibold ${themeClasses.textPrimary} transition-colors duration-500`}>{getTranslation("lab")}:</span>
                  <span className={`${themeClasses.text} opacity-90 transition-colors duration-500`}>{examInfo.lab}</span>
                </div>
              )}
              {examInfo.time && (
                <div className="flex gap-2 col-span-6">
                  <span className={`font-semibold ${themeClasses.textPrimary} transition-colors duration-500`}>{getTranslation("examTime")}:</span>
                  <span className={`${themeClasses.text} opacity-90 transition-colors duration-500`}>{examInfo.time}</span>
                </div>
              )}
              {examInfo.examRoom && (
                <div className="flex gap-2 col-span-6">
                  <span className={`font-semibold ${themeClasses.textPrimary} transition-colors duration-500`}>{getTranslation("examRoom")}:</span>
                  <span className={`${themeClasses.text} opacity-90 transition-colors duration-500`}>{examInfo.examRoom}</span>
                </div>
              )}
              {examInfo.remarks && (
                <div className="flex gap-2 md:col-span-12">
                  <span className={`font-semibold ${themeClasses.textPrimary} transition-colors duration-500`}>{getTranslation("remarks")}:</span>
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
