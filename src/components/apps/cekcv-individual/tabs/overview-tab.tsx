"use client";

import dynamic from "next/dynamic";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CheckCircle2, XCircle } from "lucide-react";
import { ScoreGauge } from "../charts/score-gauge";
import type { CekCVResult } from "../types";

const RadarChart = dynamic(
  () => import("../charts/radar-chart").then((m) => m.RadarChart),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
        Loading chart...
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
            <h3 className="mb-3 text-sm font-semibold">Skill Match Profile</h3>
            <RadarChart data={score_breakdown} />
          </div>
        )}

        {score_breakdown.length > 0 && (
          <div className="rounded-xl border p-4">
            <h3 className="mb-3 text-sm font-semibold">Score Breakdown</h3>
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
                        <span className="font-medium">{item.category}</span>: {pct}% match (
                        {item.weighted_current} of {item.weighted_max} points)
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
          <div className="space-y-2">
            <h3 className="flex items-center gap-1.5 text-sm font-semibold">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              Strengths
            </h3>
            <div className="space-y-1.5">
              {current_assessment.strengths.map((s, i) => (
                <div key={i} className="flex items-start gap-2 pl-1 text-sm">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
                  <span className="line-clamp-2">{s}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {current_assessment.gaps.length > 0 && (
          <div className="space-y-2">
            <h3 className="flex items-center gap-1.5 text-sm font-semibold">
              <XCircle className="h-4 w-4 text-red-500" />
              Gaps
            </h3>
            <div className="space-y-1.5">
              {current_assessment.gaps.map((g, i) => (
                <div key={i} className="flex items-start gap-2 pl-1 text-sm">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
                  <span className="line-clamp-2">{g}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
