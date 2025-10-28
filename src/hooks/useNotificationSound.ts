/**
 * Custom hook for playing voice announcements using Text-to-Speech
 */

import { useCallback, useRef } from "react";
import { getTranslation, type Language } from "@/lib/translations";

export interface NotificationSoundConfig {
  enabled?: boolean;
  volume?: number; // 0.0 to 1.0
  language?: Language;
}

export const useNotificationSound = (
  config: NotificationSoundConfig = {}
) => {
  const { enabled = true, volume = 1.0, language = "th" } = config;
  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null);
  const isSpeakingRef = useRef(false);

  // Get Speech Synthesis instance
  const getSpeechSynthesis = useCallback(() => {
    if (typeof window === "undefined") return null;
    if (!speechSynthesisRef.current) {
      speechSynthesisRef.current = window.speechSynthesis;
    }
    return speechSynthesisRef.current;
  }, []);

  // Initialize/warm up Speech Synthesis (call this on user interaction)
  const initialize = useCallback(() => {
    if (!enabled) return;

    try {
      const synth = getSpeechSynthesis();
      if (!synth) return;

      // Warm up speech synthesis by speaking a silent utterance
      // This ensures the API is ready and browser allows audio
      const utterance = new SpeechSynthesisUtterance("");
      utterance.volume = 0;
      synth.speak(utterance);
      synth.cancel(); // Cancel immediately
    } catch (error) {
      console.error("Failed to initialize speech synthesis:", error);
    }
  }, [enabled, getSpeechSynthesis]);

  // Speak text using Text-to-Speech
  const speak = useCallback(
    (text: string) => {
      if (!enabled || isSpeakingRef.current) return;

      try {
        const synth = getSpeechSynthesis();
        if (!synth) return;

        // Cancel any ongoing speech
        synth.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        // Set language
        utterance.lang = language === "th" ? "th-TH" : "en-US";

        // Set volume (0 to 1)
        utterance.volume = volume;

        // Set rate (0.1 to 10) - slightly slower for clarity
        utterance.rate = language === "th" ? 0.9 : 1.0;

        // Set pitch (0 to 2)
        utterance.pitch = 1.0;

        // Track speaking state
        utterance.onstart = () => {
          isSpeakingRef.current = true;
        };

        utterance.onend = () => {
          isSpeakingRef.current = false;
        };

        utterance.onerror = (event) => {
          console.error("Speech synthesis error:", event);
          isSpeakingRef.current = false;
        };

        synth.speak(utterance);
      } catch (error) {
        console.error("Failed to play voice announcement:", error);
        isSpeakingRef.current = false;
      }
    },
    [enabled, volume, language, getSpeechSynthesis]
  );

  // Play countdown alert with voice announcement
  const playCountdownAlert = useCallback(
    (minutesLeft: number) => {
      if (!enabled) return;

      let messageKey = "";

      if (minutesLeft === 30) {
        messageKey = "voiceAnnouncement30min";
      } else if (minutesLeft === 15) {
        messageKey = "voiceAnnouncement15min";
      } else if (minutesLeft === 5) {
        messageKey = "voiceAnnouncement5min";
      }

      if (messageKey) {
        const message = getTranslation(messageKey, language);
        speak(message);
      }
    },
    [enabled, language, speak]
  );

  return {
    speak,
    playCountdownAlert,
    initialize,
  };
};
