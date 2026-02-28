"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CheckCircle2, XCircle, ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { translations, t } from "@/lib/translations";
import { ScoreGauge } from "../charts/score-gauge";
import type { CekCVResult } from "../types";

const VISIBLE_COUNT = 5;

/** Deduplicate near-identical strings using word overlap. */
function dedup(items: string[], threshold = 0.35): string[] {
  const wordSet = (text: string) =>
    new Set(text.toLowerCase().replace(/[^\w\s]/g, "").split(/\s+/).filter(Boolean));

  const unique: string[] = [];
  for (const item of items) {
    const words = wordSet(item);
    const isDupe = unique.some((u) => {
      const uWords = wordSet(u);
      if (uWords.size === 0 || words.size === 0) return false;
      let overlap = 0;
      for (const w of words) if (uWords.has(w)) overlap++;
      return overlap / Math.min(uWords.size, words.size) > threshold;
    });
    if (!isDupe) unique.push(item);
  }
  return unique;
}

const RadarChart = dynamic(
  () => import("../charts/radar-chart").then((m) => m.RadarChart),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
        {/* fallback — translated version is in the component below */}
        Loading...
      </div>
    ),
  }
);

interface OverviewTabProps {
  result: CekCVResult;
}

export function OverviewTab({ result }: OverviewTabProps) {
  const { current_assessment, score_breakdown, score_projection } = result;
  const score = current_assessment.overall_score;
  const { locale } = useLanguage();
  const r = translations.results;

  const strengths = useMemo(() => dedup(current_assessment.strengths), [current_assessment.strengths]);
  const gaps = useMemo(() => dedup(current_assessment.gaps), [current_assessment.gaps]);

  const [showAllStrengths, setShowAllStrengths] = useState(false);
  const [showAllGaps, setShowAllGaps] = useState(false);

  const visibleStrengths = showAllStrengths ? strengths : strengths.slice(0, VISIBLE_COUNT);
  const hiddenStrengthCount = strengths.length - VISIBLE_COUNT;
  const visibleGaps = showAllGaps ? gaps : gaps.slice(0, VISIBLE_COUNT);
  const hiddenGapCount = gaps.length - VISIBLE_COUNT;

  return (
    <div className="space-y-6">
      {/* Score Gauge */}
      <div className="flex justify-center">
        <ScoreGauge
          currentScore={score}
          potentialScore={score_projection.estimated_improved_score}
          size={200}
        />
      </div>

      {/* Radar + Breakdown side by side */}
      <div className={`grid gap-6 ${score_breakdown.length >= 3 ? "lg:grid-cols-2" : ""}`}>
        {score_breakdown.length >= 3 && (
          <div className="rounded-xl border p-4">
            <h3 className="mb-3 text-sm font-semibold">{t(r.skillMatchProfile, locale)}</h3>
            <RadarChart data={score_breakdown} />
          </div>
        )}

        {score_breakdown.length > 0 && (
          <div className="rounded-xl border p-4">
            <h3 className="mb-3 text-sm font-semibold">{t(r.scoreBreakdown, locale)}</h3>
            <div className="space-y-2.5">
              {score_breakdown.map((item, i) => {
                const pct =
                  item.weighted_max > 0
                    ? Math.round((item.weighted_current / item.weighted_max) * 100)
                    : item.score;
                return (
                  <Tooltip key={i}>
                    <TooltipTrigger asChild>
                      <div className="cursor-default space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="truncate pr-2">{item.category}</span>
                          <span className="shrink-0 font-medium tabular-nums">
                            {item.weighted_current}/{item.weighted_max}
                          </span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-muted/30">
                          <div
                            className="cekcv-gradient h-full rounded-full transition-all duration-700"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">
                        <span className="font-medium">{item.category}</span>: {pct}% {t(r.matchPct, locale)} (
                        {item.weighted_current} {t(r.ofPoints, locale)} {item.weighted_max} {t(r.points, locale)})
                      </p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Strengths & Gaps */}
      <div className="grid gap-6 sm:grid-cols-2">
        {strengths.length > 0 && (
          <div className="rounded-xl border p-4">
            <h3 className="flex items-center gap-1.5 text-sm font-semibold">
              <CheckCircle2 className="h-4 w-4 text-blue-500" />
              {t(r.strengths, locale)}
            </h3>
            <div className="mt-3 divide-y divide-muted/40">
              {visibleStrengths.map((s, i) => (
                <div key={i} className="flex items-start gap-2.5 py-2.5 text-sm first:pt-0 last:pb-0">
                  <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                    i < 3
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {i + 1}
                  </span>
                  <span className={i < 3 ? "" : "text-muted-foreground"}>{s}</span>
                </div>
              ))}
            </div>
            {hiddenStrengthCount > 0 && (
              <button
                onClick={() => setShowAllStrengths(!showAllStrengths)}
                className="mt-2 flex w-full items-center justify-center gap-1 rounded-lg py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/20 transition-colors"
              >
                {showAllStrengths
                  ? (locale === "en" ? "Show less" : "Lebih sedikit")
                  : (locale === "en" ? `+${hiddenStrengthCount} more` : `+${hiddenStrengthCount} lagi`)}
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showAllStrengths ? "rotate-180" : ""}`} />
              </button>
            )}
          </div>
        )}
        {gaps.length > 0 && (
          <div className="rounded-xl border p-4">
            <h3 className="flex items-center gap-1.5 text-sm font-semibold">
              <XCircle className="h-4 w-4 text-red-500" />
              {t(r.gapsToAddress, locale)}
            </h3>
            <div className="mt-3 divide-y divide-muted/40">
              {visibleGaps.map((g, i) => (
                <div key={i} className="flex items-start gap-2.5 py-2.5 text-sm first:pt-0 last:pb-0">
                  <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                    i === 0
                      ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                      : i < 3
                        ? "bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400"
                        : "bg-muted text-muted-foreground"
                  }`}>
                    {i + 1}
                  </span>
                  <span className={`flex-1 ${i === 0 ? "font-medium" : i >= 3 ? "text-muted-foreground" : ""}`}>{g}</span>
                  {i === 0 && (
                    <span className="mt-0.5 shrink-0 rounded bg-red-100 px-1.5 py-0.5 text-[9px] font-bold uppercase text-red-700 dark:bg-red-900/40 dark:text-red-400">
                      {locale === "en" ? "Fix first" : "Prioritas"}
                    </span>
                  )}
                </div>
              ))}
            </div>
            {hiddenGapCount > 0 && (
              <button
                onClick={() => setShowAllGaps(!showAllGaps)}
                className="mt-2 flex w-full items-center justify-center gap-1 rounded-lg py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20 transition-colors"
              >
                {showAllGaps
                  ? (locale === "en" ? "Show less" : "Lebih sedikit")
                  : (locale === "en" ? `+${hiddenGapCount} more` : `+${hiddenGapCount} lagi`)}
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showAllGaps ? "rotate-180" : ""}`} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
