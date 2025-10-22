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
      (document as unknown as Record<string, unknown>).webkitFullscreenEnabled ||
      (document as unknown as Record<string, unknown>).mozFullScreenEnabled ||
      (document as unknown as Record<string, unknown>).msFullscreenEnabled
    );

    if (!isSupported) {
      console.warn("Fullscreen API is not supported on this browser");
      return;
    }

    const handleFullscreenChange = (): void => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    const handleKeyDown = (e: KeyboardEvent): void => {
      // Allow ESC key to exit fullscreen
      if (e.key === "Escape" && document.fullscreenElement) {
        document.exitFullscreen().catch((err: Error) => {
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

  const isFullscreenSupported = (): boolean =>
    !!(
      document.fullscreenEnabled ||
      (document as unknown as Record<string, unknown>).webkitFullscreenEnabled ||
      (document as unknown as Record<string, unknown>).mozFullScreenEnabled ||
      (document as unknown as Record<string, unknown>).msFullscreenEnabled
    );

  const toggleFullscreen = async (): Promise<void> => {
    if (!isFullscreenSupported()) {
      console.warn("Fullscreen API is not supported on this browser");
      return;
    }

    try {
      // Use document.fullscreenElement as the source of truth
      if (document.fullscreenElement) {
        // We're in fullscreen, exit it
        await document.exitFullscreen();
      } else {
        // We're not in fullscreen, enter it
        await document.documentElement.requestFullscreen().catch((err: Error) => {
          console.error("Failed to enter fullscreen:", err);
        });
      }
    } catch (err: unknown) {
      console.error("Error toggling fullscreen:", err);
    }
  };

  const enterFullscreen = async (): Promise<void> => {
    if (!isFullscreenSupported()) {
      console.warn("Fullscreen API is not supported on this browser");
      return;
    }

    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      }
    } catch (err: unknown) {
      console.warn("Failed to request fullscreen:", err);
    }
  };

  const exitFullscreen = async (): Promise<void> => {
    if (!isFullscreenSupported()) {
      console.warn("Fullscreen API is not supported on this browser");
      return;
    }

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch (err: unknown) {
      console.error("Error exiting fullscreen:", err);
    }
  };

  return { isFullscreen, toggleFullscreen, enterFullscreen, exitFullscreen };
};
