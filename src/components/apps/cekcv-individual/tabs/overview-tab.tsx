"use client";

import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
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
  { ssr: false, loading: () => <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">Loading chart...</div> }
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
      {/* Score summary line */}
      <p className="text-center text-muted-foreground">
        Your CV scores{" "}
        <span className="font-semibold text-foreground">{score}/100</span> for the{" "}
        <span className="font-semibold text-foreground">{role || "target"}</span> role
      </p>

      {/* Score Gauge */}
      <div className="flex justify-center">
        <ScoreGauge
          currentScore={score}
          potentialScore={score_projection.estimated_improved_score}
          size={220}
        />
      </div>

      {/* Radar Chart */}
      {score_breakdown.length >= 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Skill Match: Your CV vs Job Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <RadarChart data={score_breakdown} />
          </CardContent>
        </Card>
      )}

      {/* Score Breakdown Bars */}
      {score_breakdown.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Score Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {score_breakdown.map((item, i) => {
                const pct = item.weighted_max > 0
                  ? Math.round((item.weighted_current / item.weighted_max) * 100)
                  : item.score;
                return (
                  <Tooltip key={i}>
                    <TooltipTrigger asChild>
                      <div className="cursor-default space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{item.category}</span>
                          <span className="font-medium tabular-nums">
                            {item.weighted_current}/{item.weighted_max}
                          </span>
                        </div>
                        <Progress value={pct} className="h-2" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">
                        <span className="font-medium">{item.category}</span>: {pct}% match
                        ({item.weighted_current} of {item.weighted_max} points)
                      </p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Strengths & Gaps */}
      <div className="grid gap-4 sm:grid-cols-2">
        {current_assessment.strengths.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">What makes you a strong fit</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {current_assessment.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                    <span className="line-clamp-2">{s}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
        {current_assessment.gaps.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Areas to strengthen for this role</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {current_assessment.gaps.map((g, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                    <span className="line-clamp-2">{g}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
