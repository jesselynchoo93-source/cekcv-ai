"use client";

import { Target } from "lucide-react";

interface JobContextBannerProps {
  role: string;
  jobDescription?: string;
}

function extractCompany(jd: string): string | null {
  // Try common patterns: "at [Company]", "Company:", "Company Name:"
  const patterns = [
    /(?:at|@)\s+([A-Z][A-Za-z0-9\s&.,']+?)(?:\s*[-–—]|\s*\n|$)/,
    /company\s*(?:name)?\s*:\s*([^\n]+)/i,
    /^([A-Z][A-Za-z0-9\s&.,']{2,30})\s*[-–—]/m,
  ];
  for (const pattern of patterns) {
    const match = jd.match(pattern);
    if (match?.[1]) return match[1].trim();
  }
  return null;
}

export function JobContextBanner({ role, jobDescription }: JobContextBannerProps) {
  if (!role) return null;

  const company = jobDescription ? extractCompany(jobDescription) : null;

  return (
    <div className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-4 py-2.5">
      <Target className="h-4 w-4 shrink-0 text-primary" />
      <p className="text-sm">
        <span className="text-muted-foreground">Analyzing for: </span>
        <span className="font-semibold">{role}</span>
        {company && (
          <span className="text-muted-foreground"> at {company}</span>
        )}
      </p>
    </div>
  );
}
