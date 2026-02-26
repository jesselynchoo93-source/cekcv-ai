"use client";

import { useCallback, useState } from "react";
import type { JobMatch } from "@/components/apps/cekcv-individual/types";

export function useDeferredJobs() {
  const [jobs, setJobs] = useState<JobMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (role: string, location: string) => {
    if (!role) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/cekcv/search-jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, location: location || "Indonesia", limit: 20 }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Failed to search for jobs");
        return;
      }

      setJobs(data.jobs || []);
    } catch {
      setError("Failed to connect to job search service");
    } finally {
      setLoading(false);
    }
  }, []);

  return { jobs, loading, error, search };
}
