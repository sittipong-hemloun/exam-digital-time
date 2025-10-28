import { getTranslation } from "@/lib/translations";
import type { Language } from "@/lib/translations";

interface FooterProps {
  language: Language;
  themeClasses: {
    textMuted: string;
    textPrimary: string;
  };
}

export function Footer({ language, themeClasses }: FooterProps) {
  const attribution = getTranslation("sourceAttribution", language);

  return (
    <footer className={`z-10 fixed bottom-0 left-0 right-0 py-3 px-4 text-center text-lg ${themeClasses.textPrimary} bg-black/5 backdrop-blur-sm`}>
      <p>{attribution}</p>
    </footer>
  );
}
