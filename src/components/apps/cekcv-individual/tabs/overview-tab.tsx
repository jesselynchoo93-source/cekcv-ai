"use client";

import dynamic from "next/dynamic";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CheckCircle2, XCircle } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { translations, t } from "@/lib/translations";
import { ScoreGauge } from "../charts/score-gauge";
import type { CekCVResult } from "../types";

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
  role: string;
}

export function OverviewTab({ result, role }: OverviewTabProps) {
  const { current_assessment, score_breakdown, score_projection } = result;
  const score = current_assessment.overall_score;
  const { locale } = useLanguage();
  const r = translations.results;

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
        {current_assessment.strengths.length > 0 && (
          <div className="rounded-xl border p-4">
            <h3 className="flex items-center gap-1.5 text-sm font-semibold">
              <CheckCircle2 className="h-4 w-4 text-blue-500" />
              {t(r.strengths, locale)}
            </h3>
            <div className="mt-3 space-y-2">
              {current_assessment.strengths.map((s, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <span className="mt-1.5 shrink-0 text-blue-500 dark:text-blue-400">+</span>
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {current_assessment.gaps.length > 0 && (
          <div className="rounded-xl border p-4">
            <h3 className="flex items-center gap-1.5 text-sm font-semibold">
              <XCircle className="h-4 w-4 text-red-500" />
              {t(r.gapsToAddress, locale)}
            </h3>
            <div className="mt-3 space-y-2">
              {current_assessment.gaps.map((g, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <span className="mt-1.5 shrink-0 text-red-500 dark:text-red-400">-</span>
                  <span>{g}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
