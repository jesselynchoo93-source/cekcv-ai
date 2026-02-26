"use client";

import { useState, useCallback, useEffect } from "react";
import { Loader2, Clock, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language-context";
import { translations, t } from "@/lib/translations";
import { JobCard } from "../ui/job-card";
import type { CekCVResult } from "../types";
import type { JobSearchState } from "../hooks/use-auto-job-search";

interface JobsTabProps {
  result: CekCVResult;
  role: string;
  jobSearch: JobSearchState;
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function JobSearchTips() {
  const { locale } = useLanguage();
  const tips = translations.jobTips;
  const [index, setIndex] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setFading(true), 6000);
    return () => clearInterval(interval);
  }, []);

  const handleTransitionEnd = useCallback(() => {
    if (fading) {
      setIndex((prev) => (prev + 1) % tips.length);
      setFading(false);
    }
  }, [fading, tips.length]);

  return (
    <div className="flex items-start gap-2 rounded-lg bg-muted/50 px-4 py-3">
      <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-yellow-500" />
      <p
        className={`text-sm text-muted-foreground transition-opacity duration-300 ${
          fading ? "opacity-0" : "opacity-100"
        }`}
        onTransitionEnd={handleTransitionEnd}
      >
        {tips[index][locale]}
      </p>
    </div>
  );
}

export function JobsTab({ result, role, jobSearch }: JobsTabProps) {
  const { recommended_jobs } = result;
  const { locale } = useLanguage();
  const r = translations.results;

  const { searchedJobs, searching, searchError, retry } = jobSearch;

  const baseJobs = Array.isArray(recommended_jobs?.jobs) ? recommended_jobs.jobs : [];
  const jobList = searchedJobs ?? baseJobs;
  const hasMatchScores = jobList.some((j) => j.match_score != null);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <p className="text-muted-foreground">
          {t(r.similarRoles, locale)}
        </p>
        {jobList.length > 0 && (
          <p className="mt-1 text-sm text-muted-foreground/60">
            {t(r.similarRolesDesc, locale)}
          </p>
        )}
      </div>

      {/* Search info + match quality summary */}
      {jobList.length > 0 && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <LinkedInIcon className="h-3.5 w-3.5 text-[#0A66C2]" />
            {t(r.foundJobs, locale).replace("{count}", String(jobList.length))}
          </span>

          {hasMatchScores && (
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
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

      {/* Job list */}
      {jobList.length > 0 && (
        <div className="space-y-1.5">
          {jobList.map((job, i) => (
            <JobCard key={i} job={job} index={i} />
          ))}
        </div>
      )}

      {/* Searching state */}
      {jobList.length === 0 && searching && (
        <div className="mx-auto max-w-lg py-6">
          <div className="overflow-hidden rounded-xl border">
            {/* Card header — LinkedIn branded */}
            <div className="flex items-center gap-3 border-b bg-muted/20 px-5 py-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0A66C2]">
                <LinkedInIcon className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold leading-tight">{t(r.findingJobs, locale)}</p>
                <p className="text-sm text-muted-foreground">
                  {t(r.jobSearchNote, locale)}
                </p>
              </div>
              <Loader2 className="h-5 w-5 shrink-0 animate-spin text-[#0A66C2]" />
            </div>

            {/* Animated progress bar */}
            <div className="h-1 w-full overflow-hidden bg-[#0A66C2]/10">
              <div className="h-full w-1/4 animate-[shimmer-slide_1.8s_ease-in-out_infinite] rounded-full bg-[#0A66C2]/50" />
            </div>

            {/* Card body */}
            <div className="px-5 py-4">
              <JobSearchTips />
            </div>
          </div>
        </div>
      )}

      {/* Error / retry state */}
      {jobList.length === 0 && !searching && (
        <div className="py-8">
          <div className="mx-auto max-w-sm space-y-5 text-center">
            <p className="text-lg font-semibold">
              {t(r.jobSearchCta, locale)}
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t(r.jobSearchCtaDesc, locale)}
            </p>

            {searchError && (
              <p className="text-sm text-destructive">{searchError}</p>
            )}

            <Button
              onClick={retry}
              size="lg"
              className="cekcv-gradient text-white hover:opacity-90"
            >
              <LinkedInIcon className="mr-2 h-4 w-4" />
              {t(r.searchJobsBtn, locale)}
            </Button>

            <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground/50">
              <Clock className="h-3 w-3" />
              {t(r.jobSearchNote, locale)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
