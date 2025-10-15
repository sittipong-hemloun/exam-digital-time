import { useEffect, useState } from "react";
import examLogo from "@/assets/thai-logo.png";
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
import { Settings, Plus, Minus } from "lucide-react";

interface ExamInfo {
  course: string;
  lecture: string;
  lab: string;
  time: string;
  examRoom: string;
  remarks: string;
}

const Index = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [fontSize, setFontSize] = useState(5); // 1=small, 2=medium, 3=large, 4=extra large, 5=huge
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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    return { hours, minutes, seconds };
  };

  const formatDate = (date: Date) => {
    const days = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];
    const months = [
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

    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear() + 543; // แปลงเป็น พ.ศ.

    return `วัน${dayName}ที่ ${day} ${month} ${year}`;
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

  const { hours, minutes, seconds } = formatTime(currentTime);
  const fontSizeClasses = getFontSizeClasses();

  return (
    <div className="min-h-screen bg-gradient-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-green/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1s" }}></div>
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
            className="rounded-full bg-card/50 backdrop-blur-xl border-border hover:bg-card/80 disabled:opacity-50"
            title="ลดขนาดตัวอักษร"
          >
            <Minus className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={increaseFontSize}
            disabled={fontSize === 5}
            className="rounded-full bg-card/50 backdrop-blur-xl border-border hover:bg-card/80 disabled:opacity-50"
            title="เพิ่มขนาดตัวอักษร"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        {/* Settings Button */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-card/50 backdrop-blur-xl border-border hover:bg-card/80"
              title="ตั้งค่าข้อมูลการสอบ"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>ข้อมูลการสอบ</DialogTitle>
              <DialogDescription>
                กรอกข้อมูลเกี่ยวกับการสอบ (ข้อมูลที่ไม่กรอกจะไม่แสดง)
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="course">รหัสวิชา/ชื่อวิชา</Label>
                <Input
                  id="course"
                  value={formData.course}
                  onChange={(e) => handleInputChange("course", e.target.value)}
                  placeholder="เช่น CS101 Computer Programming"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lecture">หมู่บรรยาย</Label>
                <Input
                  id="lecture"
                  value={formData.lecture}
                  onChange={(e) => handleInputChange("lecture", e.target.value)}
                  placeholder="เช่น 01"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lab">หมู่ปฏิบัติ</Label>
                <Input
                  id="lab"
                  value={formData.lab}
                  onChange={(e) => handleInputChange("lab", e.target.value)}
                  placeholder="เช่น 001"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="time">เวลาสอบ</Label>
                <Input
                  id="time"
                  value={formData.time}
                  onChange={(e) => handleInputChange("time", e.target.value)}
                  placeholder="เช่น 09:00 - 12:00"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="examRoom">ห้องสอบ</Label>
                <Input
                  id="examRoom"
                  value={formData.examRoom}
                  onChange={(e) => handleInputChange("examRoom", e.target.value)}
                  placeholder="เช่น EN101"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="remarks">หมายเหตุ</Label>
                <Textarea
                  id="remarks"
                  value={formData.remarks}
                  onChange={(e) => handleInputChange("remarks", e.target.value)}
                  placeholder="ข้อมูลเพิ่มเติม"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleCancel}>
                ยกเลิก
              </Button>
              <Button onClick={handleConfirm}>ยืนยัน</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Logo */}
      <div className="mb-4 animate-fade-in">
        <img src={examLogo} alt="Logo" className="h-20 md:h-24 drop-shadow-glow" />
      </div>

      {/* Main Clock Display */}
      <div className="relative z-10 animate-fade-in" style={{ animationDelay: "0.2s" }}>
        <div className="bg-card/50 backdrop-blur-xl rounded-3xl p-6 md:p-12 shadow-glow border border-border">
          {/* Time Display */}
          <div className="flex items-center justify-center gap-2 md:gap-4 mb-4 md:mb-6">
            <div className="text-center">
              <div className={`${fontSizeClasses.time} font-mono font-bold bg-gradient-primary bg-clip-text text-transparent drop-shadow-lg transition-all duration-300`}>
                {hours}
              </div>
            </div>

            <div className={`${fontSizeClasses.time} font-mono font-bold text-primary`}>
              :
            </div>

            <div className="text-center">
              <div className={`${fontSizeClasses.time} font-mono font-bold bg-gradient-primary bg-clip-text text-transparent drop-shadow-lg transition-all duration-300`}>
                {minutes}
              </div>
            </div>

            <div className={`${fontSizeClasses.time} font-mono font-bold text-primary`}>
              :
            </div>

            <div className="text-center">
              <div className={`${fontSizeClasses.time} font-mono font-bold bg-gradient-primary bg-clip-text text-transparent drop-shadow-lg transition-all duration-300`}>
                {seconds}
              </div>
            </div>
          </div>

          {/* Date Display */}
          <div className="text-center">
            <p className={`${fontSizeClasses.date} text-foreground/80 font-medium transition-all duration-300`}>
              {formatDate(currentTime)}
            </p>
          </div>
        </div>
      </div>

      {/* Exam Info Display - Only show fields with values */}
      {(examInfo.course || examInfo.lecture || examInfo.lab || examInfo.time || examInfo.examRoom || examInfo.remarks) && (
        <div className="relative z-10 mt-4 animate-fade-in w-full max-w-4xl">
          <div className="bg-card/50 backdrop-blur-xl rounded-2xl p-4 md:p-6 shadow-glow border border-border">
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-3 ${fontSizeClasses.examInfo} transition-all duration-300`}>
              {examInfo.course && (
                <div className="flex gap-2">
                  <span className="font-semibold text-primary">รหัสวิชา/ชื่อวิชา:</span>
                  <span className="text-foreground/90">{examInfo.course}</span>
                </div>
              )}
              {examInfo.lecture && (
                <div className="flex gap-2">
                  <span className="font-semibold text-primary">หมู่บรรยาย:</span>
                  <span className="text-foreground/90">{examInfo.lecture}</span>
                </div>
              )}
              {examInfo.lab && (
                <div className="flex gap-2">
                  <span className="font-semibold text-primary">หมู่ปฏิบัติ:</span>
                  <span className="text-foreground/90">{examInfo.lab}</span>
                </div>
              )}
              {examInfo.time && (
                <div className="flex gap-2">
                  <span className="font-semibold text-primary">เวลาสอบ:</span>
                  <span className="text-foreground/90">{examInfo.time}</span>
                </div>
              )}
              {examInfo.examRoom && (
                <div className="flex gap-2">
                  <span className="font-semibold text-primary">ห้องสอบ:</span>
                  <span className="text-foreground/90">{examInfo.examRoom}</span>
                </div>
              )}
              {examInfo.remarks && (
                <div className="flex gap-2 md:col-span-2">
                  <span className="font-semibold text-primary">หมายเหตุ:</span>
                  <span className="text-foreground/90">{examInfo.remarks}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 text-center animate-fade-in" style={{ animationDelay: "0.4s" }}>
        <p className="text-muted-foreground text-xs md:text-sm">
          นาฬิกาดิจิทัลสำหรับห้องสอบ
        </p>
      </div>
    </div>
  );
};

export default Index;
