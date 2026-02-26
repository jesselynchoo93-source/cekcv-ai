"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { StatusResponse } from "@/lib/n8n";

const POLL_INTERVAL = 4000;
const FETCH_TIMEOUT = 15000; // Abort slow polls after 15s so they don't block subsequent polls
const MAX_ERRORS = 5;
const MAX_POLL_DURATION = 10 * 60 * 1000; // 10 minutes
const INTERPOLATION_INTERVAL = 1000; // Smooth progress every second
const INTERPOLATION_RATE = 0.4; // Add 0.4% per second when progress hasn't changed

export function useJobPolling() {
  const [jobId, setJobId] = useState<string | null>(null);
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [polling, setPolling] = useState(false);
  const [pollError, setPollError] = useState<string | null>(null);
  const [stepDescriptions, setStepDescriptions] = useState<Record<string, string>>({});
  const [displayProgress, setDisplayProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const maxDurationRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const interpolationRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const errorCountRef = useRef(0);
  const stoppedRef = useRef(false);
  const pollingRef = useRef(false);
  const highWaterRef = useRef(0);
  const realProgressRef = useRef(0);

  const stopInterpolation = useCallback(() => {
    if (interpolationRef.current) {
      clearInterval(interpolationRef.current);
      interpolationRef.current = null;
    }
  }, []);

  const startInterpolation = useCallback(() => {
    stopInterpolation();
    interpolationRef.current = setInterval(() => {
      setDisplayProgress((prev) => {
        const real = realProgressRef.current;
        // Don't interpolate past the next expected milestone or 99%
        const cap = Math.min(real + 25, 99);
        if (prev >= cap) return prev;
        return Math.min(prev + INTERPOLATION_RATE, cap);
      });
    }, INTERPOLATION_INTERVAL);
  }, [stopInterpolation]);

  const stop = useCallback(() => {
    stoppedRef.current = true;
    pollingRef.current = false;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (maxDurationRef.current) {
      clearTimeout(maxDurationRef.current);
      maxDurationRef.current = null;
    }
    stopInterpolation();
    setPolling(false);
  }, [stopInterpolation]);

  const poll = useCallback(async (id: string) => {
    // Skip if already stopped or another poll is in-flight
    if (stoppedRef.current || pollingRef.current) return;
    pollingRef.current = true;

    try {
      const controller = new AbortController();
      const fetchTimer = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

      const res = await fetch(`/api/cekcv/status?jobId=${encodeURIComponent(id)}`, {
        signal: controller.signal,
      });
      clearTimeout(fetchTimer);

      // Check again after await — could have been stopped while waiting
      if (stoppedRef.current) return;

      const data = await res.json();
      if (stoppedRef.current) return;

      if (!res.ok || data.error) {
        errorCountRef.current++;
        if (errorCountRef.current >= MAX_ERRORS) {
          stop();
          setPollError(data.error || `Status check failed (HTTP ${res.status})`);
        }
        return;
      }

      errorCountRef.current = 0;
      const statusData = data as StatusResponse;

      // Enforce monotonically increasing progress to prevent visual regression
      // caused by n8n writing earlier-stage status for the next candidate in a batch
      const incoming = statusData.progress ?? 0;
      if (incoming < highWaterRef.current) {
        statusData.progress = highWaterRef.current;
      } else {
        highWaterRef.current = incoming;
      }

      // Sync real progress for interpolation
      realProgressRef.current = statusData.progress;
      // Jump display to real progress when it catches up or exceeds
      setDisplayProgress((prev) =>
        statusData.progress > prev ? statusData.progress : prev
      );

      setStatus(statusData);

      // Accumulate step descriptions as they arrive
      if (statusData.step && statusData.stepDescription) {
        setStepDescriptions((prev) => ({
          ...prev,
          [statusData.step!]: statusData.stepDescription!,
        }));
      }

      if (data.status === "complete" || data.status === "error") {
        stop();
      }
    } catch (err) {
      if (stoppedRef.current) return;
      // Aborted fetches (timeout) are not real errors — just skip and retry next interval
      if (err instanceof DOMException && err.name === "AbortError") return;
      errorCountRef.current++;
      if (errorCountRef.current >= MAX_ERRORS) {
        stop();
        setPollError(err instanceof Error ? err.message : "Lost connection to server");
      }
    } finally {
      pollingRef.current = false;
    }
  }, [stop]);

  const start = useCallback(
    (id: string) => {
      stop();
      stoppedRef.current = false;
      setJobId(id);
      setStatus(null);
      setPollError(null);
      setStepDescriptions({});
      setPolling(true);
      errorCountRef.current = 0;
      highWaterRef.current = 0;
      realProgressRef.current = 0;
      setDisplayProgress(0);
      // Small delay before first poll to let Init Job Status write the row
      timeoutRef.current = setTimeout(() => poll(id), 1000);
      intervalRef.current = setInterval(() => poll(id), POLL_INTERVAL);
      startInterpolation();
      // Safety timeout: stop polling after MAX_POLL_DURATION
      maxDurationRef.current = setTimeout(() => {
        stop();
        setPollError("Analysis timed out. Please try again.");
      }, MAX_POLL_DURATION);
    },
    [poll, stop, startInterpolation]
  );

  const reset = useCallback(() => {
    stop();
    setJobId(null);
    setStatus(null);
    setPollError(null);
    setStepDescriptions({});
    errorCountRef.current = 0;
    highWaterRef.current = 0;
    realProgressRef.current = 0;
    setDisplayProgress(0);
  }, [stop]);

  useEffect(() => {
    return () => stop();
  }, [stop]);

  return { jobId, status, polling, pollError, stepDescriptions, displayProgress, start, reset };
}
