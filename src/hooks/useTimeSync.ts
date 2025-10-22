/**
 * Custom hook for time synchronization with server
 * Optimized to minimize re-renders and improve performance
 */

import { useEffect, useState, useRef } from "react";
import { syncServerTime } from "@/lib/timeUtils";

export const useTimeSync = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const timeOffsetRef = useRef(0);
  const lastSecondRef = useRef(-1);

  // Initialize and sync time with server
  useEffect(() => {
    const initializeTime = async () => {
      const offset = await syncServerTime();
      timeOffsetRef.current = offset;
    };

    initializeTime();

    // Re-sync every 10 minutes to maintain accuracy
    const syncInterval = setInterval(
      async () => {
        const offset = await syncServerTime();
        timeOffsetRef.current = offset;
      },
      10 * 60 * 1000
    );

    return () => clearInterval(syncInterval);
  }, []);

  // Update displayed time every second with offset (using ref to avoid recreating interval)
  // Only update state when the second actually changes (not every 1000ms)
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date(Date.now() + timeOffsetRef.current);
      const currentSecond = now.getSeconds();

      // Only update state when second changes to avoid unnecessary re-renders
      if (currentSecond !== lastSecondRef.current) {
        lastSecondRef.current = currentSecond;
        setCurrentTime(now);
      }
    }, 100); // Check more frequently but update state less often

    return () => clearInterval(timer);
  }, []);

  return { currentTime };
};
