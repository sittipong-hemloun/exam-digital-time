/**
 * Custom hook for time synchronization with server
 */

import { useEffect, useState, useRef } from "react";
import { syncServerTime } from "@/lib/timeUtils";

export const useTimeSync = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timeOffset, setTimeOffset] = useState(0);
  const timeOffsetRef = useRef(0);

  // Initialize and sync time with server
  useEffect(() => {
    const initializeTime = async () => {
      const offset = await syncServerTime();
      setTimeOffset(offset);
      timeOffsetRef.current = offset;
    };

    initializeTime();

    // Re-sync every 10 minutes to maintain accuracy
    const syncInterval = setInterval(
      async () => {
        const offset = await syncServerTime();
        setTimeOffset(offset);
        timeOffsetRef.current = offset;
      },
      10 * 60 * 1000
    );

    return () => clearInterval(syncInterval);
  }, []);

  // Update displayed time every second with offset (using ref to avoid recreating interval)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date(Date.now() + timeOffsetRef.current));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return { currentTime, timeOffset };
};
