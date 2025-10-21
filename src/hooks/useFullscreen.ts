/**
 * Custom hook for fullscreen functionality
 */

import { useEffect, useState } from "react";

export const useFullscreen = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    // Check if fullscreen API is supported (only on client side)
    const isSupported = !!(
      document.fullscreenEnabled ||
      (document as any).webkitFullscreenEnabled ||
      (document as any).mozFullScreenEnabled ||
      (document as any).msFullscreenEnabled
    );

    if (!isSupported) {
      console.warn("Fullscreen API is not supported on this browser");
      return;
    }

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      console.log("Fullscreen state:", !!document.fullscreenElement);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Allow ESC key to exit fullscreen
      if (e.key === "Escape" && document.fullscreenElement) {
        console.log("ESC pressed, exiting fullscreen");
        document.exitFullscreen().catch((err) => {
          console.error("Failed to exit fullscreen:", err);
        });
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const isFullscreenSupported = () => !!(
    document.fullscreenEnabled ||
    (document as any).webkitFullscreenEnabled ||
    (document as any).mozFullScreenEnabled ||
    (document as any).msFullscreenEnabled
  );

  const toggleFullscreen = async () => {
    if (!isFullscreenSupported()) {
      console.warn("Fullscreen API is not supported on this browser");
      return;
    }

    try {
      // Use document.fullscreenElement as the source of truth
      if (document.fullscreenElement) {
        // We're in fullscreen, exit it
        console.log("Exiting fullscreen...");
        await document.exitFullscreen();
      } else {
        // We're not in fullscreen, enter it
        console.log("Entering fullscreen...");
        await document.documentElement.requestFullscreen().catch((err) => {
          console.error("Failed to enter fullscreen:", err);
        });
      }
    } catch (err) {
      console.error("Error toggling fullscreen:", err);
    }
  };

  const enterFullscreen = async () => {
    if (!isFullscreenSupported()) {
      console.warn("Fullscreen API is not supported on this browser");
      return;
    }

    try {
      if (!document.fullscreenElement) {
        console.log("Auto-entering fullscreen...");
        await document.documentElement.requestFullscreen();
      }
    } catch (err) {
      console.warn("Failed to request fullscreen:", err);
    }
  };

  const exitFullscreen = async () => {
    if (!isFullscreenSupported()) {
      console.warn("Fullscreen API is not supported on this browser");
      return;
    }

    try {
      if (document.fullscreenElement) {
        console.log("Exiting fullscreen...");
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error("Error exiting fullscreen:", err);
    }
  };

  return { isFullscreen, toggleFullscreen, enterFullscreen, exitFullscreen };
};
