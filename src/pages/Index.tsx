import { useEffect, useState } from "react";
import examLogo from "@/assets/exam-logo.png";

const Index = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

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

  const { hours, minutes, seconds } = formatTime(currentTime);

  return (
    <div className="min-h-screen bg-gradient-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-purple/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1s" }}></div>
      </div>

      {/* Logo */}
      <div className="mb-12 animate-fade-in">
        <img src={examLogo} alt="Logo" className="w-32 h-32 md:w-40 md:h-40 drop-shadow-glow" />
      </div>

      {/* Main Clock Display */}
      <div className="relative z-10 animate-fade-in" style={{ animationDelay: "0.2s" }}>
        <div className="bg-card/50 backdrop-blur-xl rounded-3xl p-8 md:p-16 shadow-glow border border-border">
          {/* Time Display */}
          <div className="flex items-center justify-center gap-2 md:gap-4 mb-8">
            <div className="text-center">
              <div className="text-7xl md:text-9xl font-mono font-bold bg-gradient-primary bg-clip-text text-transparent drop-shadow-lg">
                {hours}
              </div>
            </div>
            
            <div className="text-7xl md:text-9xl font-mono font-bold text-primary animate-pulse">
              :
            </div>
            
            <div className="text-center">
              <div className="text-7xl md:text-9xl font-mono font-bold bg-gradient-primary bg-clip-text text-transparent drop-shadow-lg">
                {minutes}
              </div>
            </div>
            
            <div className="text-7xl md:text-9xl font-mono font-bold text-primary animate-pulse">
              :
            </div>
            
            <div className="text-center">
              <div className="text-7xl md:text-9xl font-mono font-bold bg-gradient-primary bg-clip-text text-transparent drop-shadow-lg">
                {seconds}
              </div>
            </div>
          </div>

          {/* Date Display */}
          <div className="text-center">
            <p className="text-xl md:text-3xl text-foreground/80 font-medium">
              {formatDate(currentTime)}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 text-center animate-fade-in" style={{ animationDelay: "0.4s" }}>
        <p className="text-muted-foreground text-sm md:text-base">
          นาฬิกาดิจิทัลสำหรับห้องสอบ
        </p>
      </div>
    </div>
  );
};

export default Index;
