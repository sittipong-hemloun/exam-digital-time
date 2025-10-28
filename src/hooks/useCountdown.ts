/**
 * Custom hook for countdown timer with progress tracking
 */

import { useState, useEffect, useCallback, useRef } from "react";

export type CountdownStatus = "before-start" | "in-progress" | "finished";
export type CountdownColor = "green" | "yellow" | "red";

export interface CountdownConfig {
  startTime?: Date;
  endTime?: Date;
  // Time thresholds in minutes for color changes
  yellowThreshold?: number; // Default: 30 minutes
  redThreshold?: number; // Default: 15 minutes
  // Alert times in minutes before end
  alertTimes?: number[]; // Default: [30, 15, 5]
  onAlert?: (minutesLeft: number) => void;
}

export interface CountdownResult {
  status: CountdownStatus;
  color: CountdownColor;
  timeLeft: {
    hours: number;
    minutes: number;
    seconds: number;
    totalSeconds: number;
  };
  progress: number; // 0-100
  isActive: boolean;
}

const DEFAULT_CONFIG: Required<Omit<CountdownConfig, "startTime" | "endTime" | "onAlert">> = {
  yellowThreshold: 30,
  redThreshold: 15,
  alertTimes: [30, 15, 5],
};

export const useCountdown = (config: CountdownConfig): CountdownResult => {
  const {
    startTime,
    endTime,
    yellowThreshold = DEFAULT_CONFIG.yellowThreshold,
    redThreshold = DEFAULT_CONFIG.redThreshold,
    alertTimes = DEFAULT_CONFIG.alertTimes,
    onAlert,
  } = config;

  const [currentTime, setCurrentTime] = useState(new Date());
  const alertedTimes = useRef(new Set<number>());

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Calculate countdown values
  const calculate = useCallback((): CountdownResult => {
    if (!startTime || !endTime) {
      return {
        status: "before-start",
        color: "green",
        timeLeft: { hours: 0, minutes: 0, seconds: 0, totalSeconds: 0 },
        progress: 0,
        isActive: false,
      };
    }

    const now = currentTime.getTime();
    const start = startTime.getTime();
    const end = endTime.getTime();

    // Before exam starts
    if (now < start) {
      return {
        status: "before-start",
        color: "green",
        timeLeft: { hours: 0, minutes: 0, seconds: 0, totalSeconds: 0 },
        progress: 0,
        isActive: false,
      };
    }

    // After exam ends
    if (now >= end) {
      return {
        status: "finished",
        color: "red",
        timeLeft: { hours: 0, minutes: 0, seconds: 0, totalSeconds: 0 },
        progress: 100,
        isActive: false,
      };
    }

    // During exam
    const totalDuration = end - start;
    const elapsed = now - start;
    const remaining = end - now;

    const totalSeconds = Math.floor(remaining / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const progress = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
    const minutesLeft = Math.floor(remaining / 60000);

    // Determine color based on time left
    let color: CountdownColor = "green";
    if (minutesLeft <= redThreshold) {
      color = "red";
    } else if (minutesLeft <= yellowThreshold) {
      color = "yellow";
    }

    // Trigger alerts
    if (onAlert) {
      for (const alertTime of alertTimes) {
        if (minutesLeft <= alertTime && !alertedTimes.current.has(alertTime)) {
          alertedTimes.current.add(alertTime);
          onAlert(alertTime);
        }
      }
    }

    return {
      status: "in-progress",
      color,
      timeLeft: { hours, minutes, seconds, totalSeconds },
      progress,
      isActive: true,
    };
  }, [currentTime, startTime, endTime, yellowThreshold, redThreshold, alertTimes, onAlert]);

  // Reset alerted times when start/end time changes
  useEffect(() => {
    alertedTimes.current.clear();
  }, [startTime, endTime]);

  return calculate();
};
