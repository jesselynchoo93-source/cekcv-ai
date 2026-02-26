"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import type { JobMatch } from "../types";

export interface JobSearchState {
  searchedJobs: JobMatch[] | null;
  searching: boolean;
  searchError: string | null;
  retry: () => void;
}

// Wait before auto-triggering so n8n has time to write search params
const AUTO_TRIGGER_DELAY = 5000;
// If the first auto-attempt fails, retry once after this delay
const AUTO_RETRY_DELAY = 8000;

export function useAutoJobSearch(jobId: string | null | undefined): JobSearchState {
  const [searchedJobs, setSearchedJobs] = useState<JobMatch[] | null>(null);
  // Start in searching state when jobId is available to avoid empty-state flash
  const [searching, setSearching] = useState(!!jobId);
  const [searchError, setSearchError] = useState<string | null>(null);

  const retriesLeft = useRef(1);
  const mountedRef = useRef(true);
  // Store jobId in ref so doSearch doesn't need it as a dependency
  const jobIdRef = useRef(jobId);
  jobIdRef.current = jobId;

  const doSearch = useCallback(async () => {
    const id = jobIdRef.current;
    if (!id || !mountedRef.current) return;
    setSearching(true);
    setSearchError(null);
    try {
      const res = await fetch("/api/cekcv/search-jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: id }),
      });
      if (!mountedRef.current) return;
      const data = await res.json();
      if (!mountedRef.current) return;
      if (!data.success) throw new Error(data.error || "Search failed");
      const jobs = Array.isArray(data.jobs) ? data.jobs : [];
      if (jobs.length === 0) throw new Error("No jobs found. Try again later.");
      setSearchedJobs(jobs);
      setSearching(false);
    } catch (err) {
      if (!mountedRef.current) return;
      // If we have retries left, schedule a silent retry (stay in searching state)
      if (retriesLeft.current > 0) {
        retriesLeft.current--;
        setTimeout(() => {
          if (mountedRef.current) doSearch();
        }, AUTO_RETRY_DELAY);
      } else {
        setSearchError(err instanceof Error ? err.message : "Search failed");
        setSearching(false);
      }
    }
  }, []);

  // Auto-trigger exactly once. Uses a separate ref + timeout that survives
  // React Strict Mode's cleanup-remount cycle.
  const scheduledRef = useRef(false);
  useEffect(() => {
    mountedRef.current = true;
    if (jobId && !scheduledRef.current) {
      scheduledRef.current = true;
      setTimeout(() => {
        if (mountedRef.current) doSearch();
      }, AUTO_TRIGGER_DELAY);
    }
    return () => {
      mountedRef.current = false;
    };
  }, [jobId, doSearch]);

  // Manual retry — no silent retries, show errors immediately
  const retry = useCallback(() => {
    retriesLeft.current = 0;
    doSearch();
  }, [doSearch]);

  return { searchedJobs, searching, searchError, retry };
}
