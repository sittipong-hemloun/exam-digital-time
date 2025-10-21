/**
 * Feedback button component linking to Google Form
 */

import { MessageCircle } from "lucide-react";
import { getTranslation, type Language } from "@/lib/translations";
import type { Theme } from "@/lib/themeConstants";

interface FeedbackButtonProps {
  language: Language;
  theme: Theme;
  googleFormUrl?: string;
}

export function FeedbackButton({
  language,
  theme,
  googleFormUrl = "https://docs.google.com/forms/d/e/1FAIpQLSdaURXq1amwJvATGI3wSHn3BAPlVrD_M_zppIeQ5jpoX251GQ/viewform",
}: FeedbackButtonProps) {
  const handleFeedbackClick = () => {
    window.open(googleFormUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <button
      onClick={handleFeedbackClick}
      className={`fixed bottom-6 left-6 z-30 flex items-center gap-2 px-4 py-3 rounded-full backdrop-blur-lg border ${theme === "dark" ? "border-white" : "border-black"} transition-all duration-300 hover:scale-105 ${
        theme === "dark"
        ? "bg-gradient-to-r from-green-600/80 to-black/5 text-white hover:from-green-500 hover:to-green-500 shadow-lg shadow-blue-500/20"
        : "bg-gradient-to-r from-green-500/80 to-black/5 text-black hover:from-green-400 hover:to-green-400 shadow-lg shadow-blue-400/20"
      }`}
      title={getTranslation("feedback", language)}
    >
      <MessageCircle className="h-5 w-5" />
      <span className="font-medium hidden sm:inline-block text-2xl">
        {getTranslation("feedback", language)}
      </span>
    </button>
  );
}
