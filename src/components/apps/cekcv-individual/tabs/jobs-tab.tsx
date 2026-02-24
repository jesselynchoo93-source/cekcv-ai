"use client";

import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Briefcase, Search } from "lucide-react";
import { JobCard } from "../ui/job-card";
import { useDeferredJobs } from "@/hooks/use-deferred-jobs";
import type { CekCVResult } from "../types";

interface JobsTabProps {
  result: CekCVResult;
  role: string;
}

export function JobsTab({ result, role }: JobsTabProps) {
  const { recommended_jobs } = result;
  const { jobs, loading, error, search } = useDeferredJobs();

  // Trigger deferred job search on mount
  useEffect(() => {
    if (recommended_jobs.jobs.length === 0) {
      search(role || recommended_jobs.search_query, recommended_jobs.search_location);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Use deferred results if available, fall back to existing data
  const jobList = jobs.length > 0 ? jobs : recommended_jobs.jobs;
  const isLoading = loading && jobList.length === 0;

  return (
    <div className="space-y-4">
      {/* Header */}
      <p className="text-muted-foreground">
        Similar roles you&apos;d be a good fit for
      </p>

      {/* Search info */}
      {(recommended_jobs.total_found > 0 || jobList.length > 0) && !isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Search className="h-4 w-4" />
          <span>
            Found {jobList.length} relevant jobs
            {recommended_jobs.search_query && <> for &ldquo;{recommended_jobs.search_query}&rdquo;</>}
            {recommended_jobs.search_location && <> in {recommended_jobs.search_location}</>}
          </span>
        </div>
      )}

      {/* Loading skeletons */}
      {isLoading && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            Finding matching jobs for you...
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-lg border p-4">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="mt-2 h-4 w-1/2" />
              <Skeleton className="mt-2 h-4 w-1/3" />
              <Skeleton className="mt-3 h-8 w-32" />
            </div>
          ))}
        </div>
      )}

      {/* Job cards */}
      {!isLoading && jobList.length > 0 && (
        <div className="space-y-3">
          {jobList.map((job, i) => (
            <JobCard key={i} job={job} index={i} />
          ))}
        </div>
      )}

      {/* Error state */}
      {error && !isLoading && jobList.length === 0 && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-center">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !loading && jobList.length === 0 && !error && (
        <div className="flex flex-col items-center gap-3 py-10 text-center">
          <Briefcase className="h-10 w-10 text-muted-foreground/40" />
          <p className="text-muted-foreground">No matching jobs found for this role</p>
          <p className="text-xs text-muted-foreground/60">
            Job matching will be available once the search completes
          </p>
        </div>
      )}
    </div>
  );
}
