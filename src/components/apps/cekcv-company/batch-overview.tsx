"use client";

import { Button } from "@/components/ui/button";
import { Columns3 } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { translations, t } from "@/lib/translations";
import type { DashboardCandidate, BatchInsights } from "./types";
import { scoreColor } from "./utils";
import { AnimatedStat } from "./ui/score-ring";
import { SkillGapPills } from "./ui/skill-gap-pills";
import { ScreeningGuide } from "./ui/screening-guide";

export function BatchOverview({
  candidates,
  insights,
  role,
  compareCount,
  onExportExcel,
  onExportPDF,
  onShareLink,
  onCompare,
}: {
  candidates: DashboardCandidate[];
  insights: BatchInsights | null;
  role: string;
  compareCount: number;
  onExportExcel: () => void;
  onExportPDF: () => void;
  onShareLink: () => void;
  onCompare: () => void;
}) {
  const { locale } = useLanguage();
  const f = translations.companyForm;
  const total = candidates.length;
  const shortlisted = insights?.shortlisted ?? candidates.filter((c) => c.status?.toLowerCase() === "shortlist").length;
  const review = insights?.review ?? candidates.filter((c) => c.status?.toLowerCase() === "review").length;
  const rejected = insights?.rejected ?? candidates.filter((c) => c.status?.toLowerCase() === "reject").length;
  const avgScore = insights?.avgScore ?? (total ? Math.round(candidates.reduce((s, c) => s + (c.score || 0), 0) / total) : 0);
  const topScore = insights?.topScore ?? (total ? Math.max(...candidates.map((c) => c.score || 0)) : 0);
  const topGaps = insights?.topGaps ?? [];

  return (
    <div className="space-y-4">
      {/* Header + Action buttons */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {locale === "en" ? "Screening Results" : "Hasil Screening"}
            </h1>
            <ScreeningGuide avgScore={avgScore} totalCandidates={total} />
          </div>
          <p className="mt-1 text-muted-foreground">
            <span className="font-medium text-foreground">{role}</span>
            <span className="mx-2 text-muted-foreground/50">|</span>
            {total} {locale === "en" ? "candidates screened by 3 AI models" : "kandidat discreening oleh 3 model AI"}
          </p>
        </div>

        {/* Compare button — always visible for discoverability */}
        {total >= 2 && (
          <div className="flex flex-wrap items-center gap-2 print:hidden">
            <Button
              size="sm"
              onClick={onCompare}
              variant={compareCount >= 2 ? "default" : "outline"}
              className={compareCount >= 2 ? "cekcv-gradient text-white" : ""}
            >
              <Columns3 className="mr-1.5 h-3.5 w-3.5" />
              {compareCount >= 2
                ? `${t(f.compare, locale)} (${compareCount})`
                : (locale === "en" ? "Compare Candidates" : "Bandingkan Kandidat")}
            </Button>
          </div>
        )}
      </div>

      {/* Stats grid — 2 cards */}
      <div className="grid grid-cols-2 gap-3">
        {/* Avg Score */}
        <div className="rounded-xl border bg-card p-4">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            {locale === "en" ? "Avg. Score" : "Rata-rata Skor"}
          </p>
          <p className={`mt-1 text-3xl font-bold ${scoreColor(avgScore)}`}>
            <AnimatedStat value={avgScore} />
          </p>
          <p className="text-[11px] text-muted-foreground">
            {locale === "en" ? `best: ${topScore}` : `terbaik: ${topScore}`}
          </p>
        </div>

        {/* Shortlisted — relative to total */}
        <div className="rounded-xl border bg-card p-4">
          <p className="text-[11px] font-medium uppercase tracking-wider text-blue-600 dark:text-blue-400">
            {locale === "en" ? "Shortlisted" : "Shortlist"}
          </p>
          <p className="mt-1 text-3xl font-bold text-blue-600 dark:text-blue-400">
            <AnimatedStat value={shortlisted} />
            <span className="text-base font-normal text-muted-foreground">
              {" "}/ {total}
            </span>
          </p>
          <p className="text-[11px] text-muted-foreground">
            {review > 0 && <>{review} review · </>}
            {rejected} {locale === "en" ? "reject" : "tolak"}
          </p>
        </div>
      </div>

      {/* Common gaps — pills */}
      <SkillGapPills gaps={topGaps} total={total} locale={locale} />
    </div>
  );
}
