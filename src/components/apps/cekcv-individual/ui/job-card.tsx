"use client";

import { MapPin, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { JobMatch } from "../types";

interface JobCardProps {
  job: JobMatch;
  index: number;
}

export function JobCard({ job, index }: JobCardProps) {
  const isLinkedIn = job.url.includes("linkedin.com");

  return (
    <div
      className="animate-in fade-in-0 slide-in-from-bottom-4"
      style={{ animationDelay: `${index * 100}ms`, animationFillMode: "backwards" }}
    >
      <Card className={isLinkedIn ? "border-l-4 border-l-[#0A66C2]" : ""}>
        <CardContent className="py-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h4 className="font-medium leading-tight">{job.title || "Untitled"}</h4>
              <p className="mt-0.5 text-sm text-muted-foreground">{job.company}</p>
              {job.location && (
                <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {job.location}
                </p>
              )}
            </div>
            {isLinkedIn && (
              <svg className="h-5 w-5 shrink-0 text-[#0A66C2]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            )}
          </div>
          {job.url && (
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              asChild
            >
              <a href={job.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-1.5 h-3 w-3" />
                {isLinkedIn ? "View on LinkedIn" : "View Job"}
              </a>
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
