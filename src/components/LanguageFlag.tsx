/**
 * Language flag component using SVG flags
 * Displays Thai and English country flags with universal browser support
 */

import TH from "country-flag-icons/react/3x2/TH";
import GB from "country-flag-icons/react/3x2/GB";
import type { Language } from "@/lib/translations";

interface LanguageFlagProps {
  language: Language;
  className?: string;
}

export function LanguageFlag({ language, className = "w-6 h-4" }: LanguageFlagProps) {
  return language === "th" ? (
    <TH title="Thailand" className={className} />
  ) : (
    <GB title="United Kingdom" className={className} />
  );
}
