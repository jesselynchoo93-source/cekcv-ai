"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { StatusResponse } from "@/lib/n8n";

const POLL_INTERVAL = 3000;
const MAX_ERRORS = 5;

export function useJobPolling() {
  const [jobId, setJobId] = useState<string | null>(null);
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [polling, setPolling] = useState(false);
  const [pollError, setPollError] = useState<string | null>(null);
  const [stepDescriptions, setStepDescriptions] = useState<Record<string, string>>({});
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const errorCountRef = useRef(0);
  const stoppedRef = useRef(false);
  const pollingRef = useRef(false);

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
    setPolling(false);
  }, []);

  const poll = useCallback(async (id: string) => {
    // Skip if already stopped or another poll is in-flight
    if (stoppedRef.current || pollingRef.current) return;
    pollingRef.current = true;

    try {
      const res = await fetch(`/api/cekcv/status?jobId=${encodeURIComponent(id)}`);

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
      // Small delay before first poll to let Init Job Status write the row
      timeoutRef.current = setTimeout(() => poll(id), 1000);
      intervalRef.current = setInterval(() => poll(id), POLL_INTERVAL);
    },
    [poll, stop]
  );

  const reset = useCallback(() => {
    stop();
    setJobId(null);
    setStatus(null);
    setPollError(null);
    setStepDescriptions({});
    errorCountRef.current = 0;
  }, [stop]);

  useEffect(() => {
    return () => stop();
  }, [stop]);

  return { jobId, status, polling, pollError, stepDescriptions, start, reset };
}
