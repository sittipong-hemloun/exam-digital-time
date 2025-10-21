/**
 * Custom hook for time synchronization with server
 */

import { useEffect, useState } from "react";
import { syncServerTime } from "@/lib/timeUtils";

export const useTimeSync = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timeOffset, setTimeOffset] = useState(0);

  // Initialize and sync time with server
  useEffect(() => {
    const initializeTime = async () => {
      const offset = await syncServerTime();
      setTimeOffset(offset);
    };

    initializeTime();

    // Re-sync every 10 minutes to maintain accuracy
    const syncInterval = setInterval(async () => {
      const offset = await syncServerTime();
      setTimeOffset(offset);
    }, 10 * 60 * 1000);

    return () => clearInterval(syncInterval);
  }, []);

  // Update displayed time every second with offset
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date(Date.now() + timeOffset));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeOffset]);

  return { currentTime, timeOffset };
};
