"use client";

import { useState, useCallback } from "react";
import { Search, Loader2, Clock, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language-context";
import { translations, t } from "@/lib/translations";
import { JobCard } from "../ui/job-card";
import type { CekCVResult, JobMatch } from "../types";

interface JobsTabProps {
  result: CekCVResult;
  role: string;
  jobId?: string | null;
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export function JobsTab({ result, role, jobId }: JobsTabProps) {
  const { recommended_jobs } = result;
  const { locale } = useLanguage();
  const r = translations.results;

  const [searchedJobs, setSearchedJobs] = useState<JobMatch[] | null>(null);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const baseJobs = Array.isArray(recommended_jobs?.jobs) ? recommended_jobs.jobs : [];
  const jobList = searchedJobs ?? baseJobs;
  const hasMatchScores = jobList.some((j) => j.match_score != null);

  const searchQuery = recommended_jobs?.search_query || role;
  const searchLocation = recommended_jobs?.search_location || "";

  const handleSearch = useCallback(async () => {
    if (!jobId) {
      setSearchError("No job ID available for search");
      return;
    }
    setSearching(true);
    setSearchError(null);
    try {
      const res = await fetch("/api/cekcv/search-jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });
      const data = await res.json();
      if (!data.success) {
        setSearchError(data.error || "Search failed");
        return;
      }
      const jobs = Array.isArray(data.jobs) ? data.jobs : [];
      if (jobs.length === 0) {
        setSearchError("No jobs found. Try again later.");
        return;
      }
      setSearchedJobs(jobs);
    } catch {
      setSearchError("Failed to connect to job search");
    } finally {
      setSearching(false);
    }
  }, [jobId]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <p className="text-muted-foreground">
        {t(r.similarRoles, locale)}
      </p>

      {/* Search info + match quality summary */}
      {jobList.length > 0 && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Search className="h-4 w-4" />
            {t(r.foundJobs, locale).replace("{count}", String(jobList.length))}
            {(recommended_jobs.search_query || (searchedJobs && searchQuery)) && (
              <> {t(r.forQuery, locale)} &ldquo;{recommended_jobs.search_query || searchQuery}&rdquo;</>
            )}
          </span>

          {hasMatchScores && (
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                {jobList.filter((j) => (j.match_score || 0) >= 80).length} {t(r.strong, locale)}
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-yellow-500" />
                {jobList.filter((j) => (j.match_score || 0) >= 60 && (j.match_score || 0) < 80).length} {t(r.moderate, locale)}
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-red-500" />
                {jobList.filter((j) => (j.match_score || 0) < 60).length} {t(r.low, locale)}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Job cards */}
      {jobList.length > 0 && (
        <div className="space-y-3">
          {jobList.map((job, i) => (
            <JobCard key={i} job={job} index={i} />
          ))}
        </div>
      )}

      {/* Empty state — encouraging CTA with LinkedIn branding */}
      {jobList.length === 0 && !searching && (
        <div className="rounded-2xl border bg-gradient-to-br from-[#0A66C2]/5 to-transparent p-6 sm:p-8">
          <div className="flex flex-col items-center gap-5 text-center">
            {/* LinkedIn logo circle */}
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0A66C2]/10">
              <LinkedInIcon className="h-8 w-8 text-[#0A66C2]" />
            </div>

            {/* Headline */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">
                {t(r.jobSearchCta, locale)}
              </h3>
              <p className="mx-auto max-w-md text-sm text-muted-foreground">
                {t(r.jobSearchCtaDesc, locale)}
              </p>
            </div>

            {/* Search keywords preview */}
            {searchQuery && (
              <div className="flex flex-wrap items-center justify-center gap-2">
                <span className="text-xs text-muted-foreground/60">{t(r.searchFor, locale)}:</span>
                <span className="rounded-full bg-[#0A66C2]/10 px-3 py-1 text-xs font-medium text-[#0A66C2]">
                  {searchQuery}
                </span>
                {searchLocation && (
                  <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                    {searchLocation}
                  </span>
                )}
              </div>
            )}

            {/* Error message */}
            {searchError && (
              <p className="text-sm text-destructive">{searchError}</p>
            )}

            {/* CTA Button */}
            <Button
              onClick={handleSearch}
              size="lg"
              className="gap-2.5 bg-[#0A66C2] text-white hover:bg-[#004182]"
            >
              <LinkedInIcon className="h-4 w-4" />
              {t(r.searchJobsBtn, locale)}
              <ExternalLink className="h-3.5 w-3.5 opacity-60" />
            </Button>

            {/* Time note */}
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground/60">
              <Clock className="h-3 w-3" />
              {t(r.jobSearchNote, locale)}
            </p>
          </div>
        </div>
      )}

      {/* Loading state */}
      {searching && (
        <div className="rounded-2xl border bg-gradient-to-br from-[#0A66C2]/5 to-transparent p-6 sm:p-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="relative">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0A66C2]/10">
                <LinkedInIcon className="h-8 w-8 text-[#0A66C2]" />
              </div>
              <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-background shadow-sm">
                <Loader2 className="h-4 w-4 animate-spin text-[#0A66C2]" />
              </div>
            </div>
            <div>
              <p className="font-medium">{t(r.findingJobs, locale)}</p>
              <p className="mt-1 text-xs text-muted-foreground/60">
                {t(r.jobSearchNote, locale)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
