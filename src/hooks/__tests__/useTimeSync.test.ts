/**
 * Tests for useTimeSync hook
 */

import { renderHook, waitFor } from '@testing-library/react';
import { useTimeSync } from '../useTimeSync';

// Mock the timeUtils
jest.mock('@/lib/timeUtils', () => ({
  syncServerTime: jest.fn().mockResolvedValue(0),
}));

describe('useTimeSync', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should initialize with current time', () => {
    const { result } = renderHook(() => useTimeSync());

    expect(result.current.currentTime).toBeInstanceOf(Date);
  });

  it('should have timeOffset property', () => {
    const { result } = renderHook(() => useTimeSync());

    expect(typeof result.current.timeOffset).toBe('number');
  });

  it('should update time every second', async () => {
    const { result, rerender } = renderHook(() => useTimeSync());

    const initialTime = result.current.currentTime.getTime();

    // Fast-forward 1 second
    jest.advanceTimersByTime(1000);

    await waitFor(() => {
      const newTime = result.current.currentTime.getTime();
      // New time should be approximately 1 second after initial time
      expect(newTime - initialTime).toBeGreaterThanOrEqual(1000);
    });
  });

  it('should return currentTime as Date object', () => {
    const { result } = renderHook(() => useTimeSync());

    expect(result.current.currentTime).toBeInstanceOf(Date);
    expect(typeof result.current.currentTime.getTime).toBe('function');
  });

  it('should have methods to get hours, minutes, seconds', () => {
    const { result } = renderHook(() => useTimeSync());

    const time = result.current.currentTime;
    expect(typeof time.getHours).toBe('function');
    expect(typeof time.getMinutes).toBe('function');
    expect(typeof time.getSeconds).toBe('function');
  });

  it('should initialize timeOffset', () => {
    const { result } = renderHook(() => useTimeSync());

    expect(typeof result.current.timeOffset).toBe('number');
  });

  it('should cleanup timer on unmount', () => {
    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');

    const { unmount } = renderHook(() => useTimeSync());

    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();

    clearIntervalSpy.mockRestore();
  });

  it('should return valid time values', () => {
    const { result } = renderHook(() => useTimeSync());

    const time = result.current.currentTime;

    expect(time.getHours()).toBeGreaterThanOrEqual(0);
    expect(time.getHours()).toBeLessThan(24);
    expect(time.getMinutes()).toBeGreaterThanOrEqual(0);
    expect(time.getMinutes()).toBeLessThan(60);
    expect(time.getSeconds()).toBeGreaterThanOrEqual(0);
    expect(time.getSeconds()).toBeLessThan(60);
  });
});
