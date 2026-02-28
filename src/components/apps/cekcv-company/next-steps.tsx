"use client";

import { Mail, Sparkles, Target, ChevronsRight } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import type { DashboardCandidate, BatchInsights, StatusFilter } from "./types";
import { cleanCandidateName } from "./utils";

interface Step {
  icon: typeof Target;
  text: string;
  action: () => void;
  actionLabel: string;
}

export function NextSteps({
  candidates,
  insights,
  onFilter,
  onJumpToCandidate,
}: {
  candidates: DashboardCandidate[];
  insights: BatchInsights | null;
  onFilter: (filter: StatusFilter) => void;
  onJumpToCandidate: (idx: number) => void;
  onExportCSV: () => void;
}) {
  const { locale } = useLanguage();
  const shortlisted = insights?.shortlisted ?? candidates.filter((c) => c.status?.toLowerCase() === "shortlist").length;
  const topCandidate = candidates[0];

  if (!topCandidate) return null;

  const steps: Step[] = [];

  if (shortlisted > 0) {
    steps.push({
      icon: Target,
      text: locale === "en"
        ? `Review ${shortlisted} shortlisted candidate${shortlisted > 1 ? "s" : ""}`
        : `Review ${shortlisted} kandidat shortlist`,
      action: () => onFilter("shortlist"),
      actionLabel: locale === "en" ? "View" : "Lihat",
    });
  }

  if (topCandidate.email) {
    steps.push({
      icon: Mail,
      text: locale === "en"
        ? `Reach out to top candidate: ${cleanCandidateName(topCandidate.name, topCandidate.fileName, 1)}`
        : `Hubungi kandidat terbaik: ${cleanCandidateName(topCandidate.name, topCandidate.fileName, 1)}`,
      action: () => onJumpToCandidate(0),
      actionLabel: locale === "en" ? "Contact" : "Kontak",
    });
  }

  if (steps.length === 0) return null;

  return (
    <div className="rounded-xl border bg-gradient-to-r from-blue-50/50 to-purple-50/50 p-4 dark:from-blue-950/20 dark:to-purple-950/20 print:hidden">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
        <Sparkles className="h-4 w-4 text-blue-500" />
        {locale === "en" ? "Suggested Next Steps" : "Langkah Selanjutnya"}
      </h3>
      <div className="grid gap-2.5 sm:grid-cols-2">
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <button
              key={i}
              onClick={step.action}
              className="flex flex-col items-start gap-2 rounded-lg border bg-card/80 px-3.5 py-3 text-left text-sm transition-all hover:bg-card hover:shadow-sm"
            >
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="text-xs text-muted-foreground leading-snug">{step.text}</span>
              </div>
              <span className="flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 pl-6">
                {step.actionLabel}
                <ChevronsRight className="h-3 w-3" />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
