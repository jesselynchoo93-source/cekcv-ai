"use client";

import { MapPin, ExternalLink } from "lucide-react";
import type { JobMatch } from "../types";

interface JobCardProps {
  job: JobMatch;
  index: number;
}

export function JobCard({ job, index }: JobCardProps) {
  const isLinkedIn = job.url?.includes("linkedin.com");

  return (
    <a
      href={job.url || undefined}
      target="_blank"
      rel="noopener noreferrer"
      className="group animate-in fade-in-0 slide-in-from-bottom-2 block"
      style={{ animationDelay: `${index * 50}ms`, animationFillMode: "backwards" }}
    >
      <div className="flex items-center gap-3 rounded-lg border px-4 py-3 transition-colors hover:bg-muted/30">
        {/* Match score */}
        {job.match_score != null && (
          <span
            className={`shrink-0 rounded-md px-2 py-0.5 text-xs font-semibold ${
              job.match_score >= 80
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                : job.match_score >= 60
                  ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                  : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
            }`}
          >
            {job.match_score}%
          </span>
        )}

        {/* Job info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <span className="truncate font-medium text-sm">{job.title || "Untitled"}</span>
            <span className="shrink-0 text-xs text-muted-foreground">{job.company}</span>
          </div>
          {job.location && (
            <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground/60">
              <MapPin className="h-2.5 w-2.5" />
              <span className="truncate">{job.location}</span>
            </p>
          )}
        </div>

        {/* LinkedIn icon + arrow */}
        <div className="flex shrink-0 items-center gap-2">
          {isLinkedIn && (
            <svg className="h-4 w-4 text-[#0A66C2]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          )}
          <ExternalLink className="h-3.5 w-3.5 text-muted-foreground/30 transition-colors group-hover:text-muted-foreground" />
        </div>
      </div>
    </a>
  );
}
