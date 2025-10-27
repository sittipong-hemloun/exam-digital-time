/**
 * Logo component for exam clock
 * Optimized with React.memo to prevent unnecessary re-renders
 */

import { memo } from "react";
import Image from "next/image";
import examThaiLogo from "@/assets/thai-logo.png";
import examEnglishLogo from "@/assets/eng-logo.png";
import type { Language } from "@/lib/translations";

interface LogoProps {
  language: Language;
}

export const Logo = memo(function Logo({ language }: LogoProps) {
  return (
    <div className="">
      <Image
        src={language === "th" ? examThaiLogo : examEnglishLogo}
        alt="Logo"
        className="h-16 md:h-20 drop-shadow-2xl w-auto filter brightness-110 absolute top-4 left-4 md:top-6 md:left-10"
        priority
      />
    </div>
  );
});
