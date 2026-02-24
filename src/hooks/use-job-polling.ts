"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { StatusResponse } from "@/lib/n8n";

const POLL_INTERVAL = 3000;

export function useJobPolling() {
  const [jobId, setJobId] = useState<string | null>(null);
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [polling, setPolling] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
      const data: StatusResponse = await res.json();
      setStatus(data);
      if (data.status === "complete" || data.status === "error") {
        stop();
      }
    } catch {
      // keep polling on transient errors
    }
  }, [stop]);

  const start = useCallback(
    (id: string) => {
      stop();
      setJobId(id);
      setStatus(null);
      setPolling(true);
      poll(id);
      intervalRef.current = setInterval(() => poll(id), POLL_INTERVAL);
    },
    [poll, stop]
  );

  const reset = useCallback(() => {
    stop();
    setJobId(null);
    setStatus(null);
  }, [stop]);

  useEffect(() => {
    return () => stop();
  }, [stop]);

  return { jobId, status, polling, start, reset };
}
