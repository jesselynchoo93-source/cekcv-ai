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
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const errorCountRef = useRef(0);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setPolling(false);
  }, []);

  const poll = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/cekcv/status?jobId=${encodeURIComponent(id)}`);
      const data = await res.json();

      if (!res.ok || data.error) {
        errorCountRef.current++;
        if (errorCountRef.current >= MAX_ERRORS) {
          stop();
          setPollError(data.error || `Status check failed (HTTP ${res.status})`);
        }
        return;
      }

      errorCountRef.current = 0;
      setStatus(data as StatusResponse);

      if (data.status === "complete" || data.status === "error") {
        stop();
      }
    } catch (err) {
      errorCountRef.current++;
      if (errorCountRef.current >= MAX_ERRORS) {
        stop();
        setPollError(err instanceof Error ? err.message : "Lost connection to server");
      }
    }
  }, [stop]);

  const start = useCallback(
    (id: string) => {
      stop();
      setJobId(id);
      setStatus(null);
      setPollError(null);
      setPolling(true);
      errorCountRef.current = 0;
      // Small delay before first poll to let Init Job Status write the row
      setTimeout(() => poll(id), 1000);
      intervalRef.current = setInterval(() => poll(id), POLL_INTERVAL);
    },
    [poll, stop]
  );

  const reset = useCallback(() => {
    stop();
    setJobId(null);
    setStatus(null);
    setPollError(null);
    errorCountRef.current = 0;
  }, [stop]);

  useEffect(() => {
    return () => stop();
  }, [stop]);

  return { jobId, status, polling, pollError, start, reset };
}
