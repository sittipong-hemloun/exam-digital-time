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

const Index = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [fontSize, setFontSize] = useState(5); // 1=small, 2=medium, 3=large, 4=extra large, 5=huge
  const [language, setLanguage] = useState<Language>("th");
  const [theme, setTheme] = useState<Theme>("light");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [serverTime, setServerTime] = useState<Date | null>(null); // Store the server time directly
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

  // Fetch initial time from timeapi.io (more stable alternative)
  useEffect(() => {
    const fetchWorldTime = async () => {
      try {
        // Try timeapi.io first (no rate limits, very stable)
        const response = await fetch('https://timeapi.io/api/time/current/zone?timeZone=UTC');
        if (response.ok) {
          const data = await response.json();
          const apiTime = new Date(data.dateTime);
          setServerTime(apiTime);
          setCurrentTime(apiTime);
          console.log('Time synced from timeapi.io:', apiTime.toISOString());
          return;
        }
      } catch (error) {
        console.warn('timeapi.io failed, trying backup...', error);
      }

      try {
        // Fallback to worldclockapi.com
        const response = await fetch('https://worldclockapi.com/api/json/utc/now');
        if (response.ok) {
          const data = await response.json();
          const apiTime = new Date(data.currentDateTime);
          setServerTime(apiTime);
          setCurrentTime(apiTime);
          console.log('Time synced from worldclockapi.com:', apiTime.toISOString());
          return;
        }
      } catch (error) {
        console.warn('worldclockapi.com failed, using local time', error);
      }

      // Final fallback to local time
      console.warn('All time APIs failed, using local system time');
      setServerTime(new Date());
      setCurrentTime(new Date());
    };

    fetchWorldTime();
    // Refresh server time every 10 minutes to stay synchronized
    const syncInterval = setInterval(fetchWorldTime, 10 * 60 * 1000);

    return () => clearInterval(syncInterval);
  }, []);

  // Update time every second based on server time
  useEffect(() => {
    if (!serverTime) return;

    const startTime = serverTime.getTime();
    const startTimestamp = Date.now();

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTimestamp;
      const newTime = new Date(startTime + elapsed);
      setCurrentTime(newTime);
    }, 1000);

    return () => clearInterval(timer);
  }, [serverTime]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

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
  };

  const handleCancel = () => {
    setFormData(examInfo);
    setIsDialogOpen(false);
  };

  const increaseFontSize = () => {
    if (fontSize < 5) setFontSize(fontSize + 1);
  };

  const decreaseFontSize = () => {
    if (fontSize > 1) setFontSize(fontSize - 1);
  };

  const getFontSizeClasses = () => {
    const sizes = {
      1: { time: "text-5xl md:text-7xl", date: "text-base md:text-xl", examInfo: "text-xs md:text-sm" },
      2: { time: "text-6xl md:text-8xl", date: "text-lg md:text-2xl", examInfo: "text-sm md:text-base" },
      3: { time: "text-7xl md:text-9xl", date: "text-xl md:text-3xl", examInfo: "text-base md:text-lg" },
      4: { time: "text-8xl md:text-[12rem]", date: "text-2xl md:text-4xl", examInfo: "text-lg md:text-xl" },
      5: { time: "text-9xl md:text-[14rem]", date: "text-3xl md:text-5xl", examInfo: "text-xl md:text-2xl" },
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

  return (
    <div className={`min-h-screen ${themeClasses.background} flex flex-col items-center justify-center p-4 relative overflow-hidden transition-colors duration-500`}>
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-1/4 left-1/4 w-96 h-96 ${themeClasses.decorativeGlow1} rounded-full blur-3xl animate-pulse-glow transition-colors duration-500`}></div>
        <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 ${themeClasses.decorativeGlow2} rounded-full blur-3xl animate-pulse-glow transition-colors duration-500`} style={{ animationDelay: "1s" }}></div>
      </div>

      {/* Control Buttons */}
      <div className="absolute top-4 right-4 z-20 flex gap-2">
        {/* Font Size Controls */}
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={decreaseFontSize}
            disabled={fontSize === 1}
            className={`rounded-full ${themeClasses.card} backdrop-blur-xl border hover:${themeClasses.card} hover:shadow-lg disabled:opacity-50 transition-all duration-300`}
            title={getTranslation("decreaseFont")}
          >
            <Minus className={`${theme === "dark" ? "text-foreground" : "text-gray-900"} h-5 w-5 transition-colors duration-500`} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={increaseFontSize}
            disabled={fontSize === 5}
            className={`rounded-full ${themeClasses.card} backdrop-blur-xl border hover:${themeClasses.card} hover:shadow-lg disabled:opacity-50 transition-all duration-300`}
            title={getTranslation("increaseFont")}
          >
            <Plus className={`${theme === "dark" ? "text-foreground" : "text-gray-900"} h-5 w-5 transition-colors duration-500`} />
          </Button>
        </div>

        {/* Theme Toggle Button */}
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          className={`rounded-full ${themeClasses.card} backdrop-blur-xl border hover:${themeClasses.card} hover:shadow-lg transition-all duration-300`}
          title={getTranslation("changeTheme")}
        >
          {theme === "dark" ? <Sun className={`h-5 w-5 text-yellow-400 transition-colors duration-500`} /> : <Moon className={`h-5 w-5 ${theme === "light" ? "text-gray-900" : "text-foreground"} transition-colors duration-500`} />}
        </Button>

        {/* Language Toggle Button */}
        <Button
          variant="outline"
          onClick={toggleLanguage}
          className={`rounded-full ${themeClasses.card} backdrop-blur-xl border hover:${themeClasses.card} hover:shadow-lg transition-all duration-300`}
          title={getTranslation("changeLanguage")}
        >
          <div className="flex items-center gap-1">
            <Globe className={`h-5 w-5 ${theme === "dark" ? "text-foreground" : "text-gray-900"} transition-colors duration-500`} />
            <span className={`${themeClasses.text} ml-2 font-medium hidden sm:inline-block transition-colors duration-500`}>{language === "th" ? "ไทย" : "EN"}</span>
          </div>
        </Button>


        {/* Fullscreen Toggle Button */}
        <Button
          variant="outline"
          onClick={toggleFullscreen}
          className={`rounded-full ${themeClasses.card} backdrop-blur-xl border hover:${themeClasses.card} hover:shadow-lg transition-all duration-300`}
          title={isFullscreen ? getTranslation("exitFullscreen") : getTranslation("fullscreen")}
        >
          {isFullscreen ? (
            <div className="flex items-center gap-1">
              <Minimize className={`h-5 w-5 ${theme === "dark" ? "text-foreground" : "text-gray-900"} transition-colors duration-500`} />
              <span className={`${themeClasses.text} ml-2 font-medium hidden sm:inline-block transition-colors duration-500`}>{getTranslation("exitFullscreen")}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <Maximize className={`h-5 w-5 ${theme === "dark" ? "text-foreground" : "text-gray-900"} transition-colors duration-500`} />
              <span className={`${themeClasses.text} ml-2 font-medium hidden sm:inline-block transition-colors duration-500`}>{getTranslation("fullscreen")}</span>
            </div>
          )}
        </Button>

        {/* Settings Button */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className={`rounded-full ${themeClasses.card} backdrop-blur-xl border hover:${themeClasses.card} hover:shadow-lg transition-all duration-300`}
              title={getTranslation("settings")}
            >
              <Settings className={`${theme === "dark" ? "text-foreground" : "text-gray-900"} h-5 w-5 transition-colors duration-500`} />
              <span className={`${themeClasses.text} ml-2 font-medium hidden sm:inline-block transition-colors duration-500`}
              >{getTranslation("settings")}</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{getTranslation("examInfo")}</DialogTitle>
              <DialogDescription>
                {getTranslation("examInfoDesc")}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="course">{getTranslation("course")}</Label>
                <Input
                  id="course"
                  value={formData.course}
                  onChange={(e) => handleInputChange("course", e.target.value)}
                  placeholder={getTranslation("coursePlaceholder")}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lecture">{getTranslation("lecture")}</Label>
                <Input
                  id="lecture"
                  value={formData.lecture}
                  onChange={(e) => handleInputChange("lecture", e.target.value)}
                  placeholder={getTranslation("lecturePlaceholder")}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lab">{getTranslation("lab")}</Label>
                <Input
                  id="lab"
                  value={formData.lab}
                  onChange={(e) => handleInputChange("lab", e.target.value)}
                  placeholder={getTranslation("labPlaceholder")}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="time">{getTranslation("examTime")}</Label>
                <Input
                  id="time"
                  value={formData.time}
                  onChange={(e) => handleInputChange("time", e.target.value)}
                  placeholder={getTranslation("timePlaceholder")}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="examRoom">{getTranslation("examRoom")}</Label>
                <Input
                  id="examRoom"
                  value={formData.examRoom}
                  onChange={(e) => handleInputChange("examRoom", e.target.value)}
                  placeholder={getTranslation("roomPlaceholder")}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="remarks">{getTranslation("remarks")}</Label>
                <Textarea
                  id="remarks"
                  value={formData.remarks}
                  onChange={(e) => handleInputChange("remarks", e.target.value)}
                  placeholder={getTranslation("remarksPlaceholder")}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleCancel}>
                {getTranslation("cancel")}
              </Button>
              <Button onClick={handleConfirm}>{getTranslation("confirm")}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Logo */}
      <div className="mb-4 animate-fade-in">
        {/* <img src={examThaiLogo} alt="Logo" className="h-20 md:h-24 drop-shadow-glow" /> */}
        <img src={language === "th" ? examThaiLogo : examEnglishLogo} alt="Logo" className="h-20 md:h-24 drop-shadow-glow" />
      </div>

      {/* Main Clock Display */}
      <div className="relative z-10 animate-fade-in" style={{ animationDelay: "0.2s" }}>
        <div className={`${themeClasses.card} backdrop-blur-xl rounded-3xl p-6 md:p-12 shadow-glow border ${themeClasses.cardBorder} transition-colors duration-500`}>
          {/* Time Display */}
          <div className="flex items-center justify-center gap-2 md:gap-4 mb-4 md:mb-6">
            <div className="text-center">
              <div className={`${fontSizeClasses.time} font-mono font-bold bg-gradient-to-r ${themeClasses.gradient} bg-clip-text text-transparent drop-shadow-lg transition-all duration-300`}>
                {hours}
              </div>
            </div>

            <div className={`${fontSizeClasses.time} font-mono font-bold ${themeClasses.textPrimary} transition-colors duration-500`}>
              :
            </div>

            <div className="text-center">
              <div className={`${fontSizeClasses.time} font-mono font-bold bg-gradient-to-r ${themeClasses.gradient} bg-clip-text text-transparent drop-shadow-lg transition-all duration-300`}>
                {minutes}
              </div>
            </div>

            <div className={`${fontSizeClasses.time} font-mono font-bold ${themeClasses.textPrimary} transition-colors duration-500`}>
              :
            </div>

            <div className="text-center">
              <div className={`${fontSizeClasses.time} font-mono font-bold bg-gradient-to-r ${themeClasses.gradient} bg-clip-text text-transparent drop-shadow-lg transition-all duration-300`}>
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
        <div className="relative z-10 mt-4 animate-fade-in w-full max-w-4xl">
          <div className={`${themeClasses.card} backdrop-blur-xl rounded-2xl p-4 md:p-6 shadow-glow border ${themeClasses.cardBorder} transition-colors duration-500`}>
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-3 ${fontSizeClasses.examInfo} transition-all duration-300`}>
              {examInfo.course && (
                <div className="flex gap-2">
                  <span className={`font-semibold ${themeClasses.textPrimary} transition-colors duration-500`}>{getTranslation("course")}:</span>
                  <span className={`${themeClasses.text} opacity-90 transition-colors duration-500`}>{examInfo.course}</span>
                </div>
              )}
              {examInfo.lecture && (
                <div className="flex gap-2">
                  <span className={`font-semibold ${themeClasses.textPrimary} transition-colors duration-500`}>{getTranslation("lecture")}:</span>
                  <span className={`${themeClasses.text} opacity-90 transition-colors duration-500`}>{examInfo.lecture}</span>
                </div>
              )}
              {examInfo.lab && (
                <div className="flex gap-2">
                  <span className={`font-semibold ${themeClasses.textPrimary} transition-colors duration-500`}>{getTranslation("lab")}:</span>
                  <span className={`${themeClasses.text} opacity-90 transition-colors duration-500`}>{examInfo.lab}</span>
                </div>
              )}
              {examInfo.time && (
                <div className="flex gap-2">
                  <span className={`font-semibold ${themeClasses.textPrimary} transition-colors duration-500`}>{getTranslation("examTime")}:</span>
                  <span className={`${themeClasses.text} opacity-90 transition-colors duration-500`}>{examInfo.time}</span>
                </div>
              )}
              {examInfo.examRoom && (
                <div className="flex gap-2">
                  <span className={`font-semibold ${themeClasses.textPrimary} transition-colors duration-500`}>{getTranslation("examRoom")}:</span>
                  <span className={`${themeClasses.text} opacity-90 transition-colors duration-500`}>{examInfo.examRoom}</span>
                </div>
              )}
              {examInfo.remarks && (
                <div className="flex gap-2 md:col-span-2">
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
};

export default Index;
