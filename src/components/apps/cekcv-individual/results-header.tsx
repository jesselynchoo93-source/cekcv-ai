"use client";

import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ArrowRight, Briefcase } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { translations, t } from "@/lib/translations";
import { useAnimatedCounter } from "@/hooks/use-animated-counter";
import { ConfettiTrigger } from "./ui/confetti-trigger";
import { AtsGuide } from "./ui/ats-guide";
import type { CekCVResult } from "./types";

/** Capitalise "JESSELYN HASNAH" → "Jesselyn Hasnah" */
function titleCase(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

function getAtsTooltipKey(status: string, score: number): "atsTooltipHigh" | "atsTooltipMid" | "atsTooltipLow" {
  const s = status.toLowerCase();
  if (s.includes("shortlist") || s.includes("interview") || score >= 70) {
    return "atsTooltipHigh";
  }
  if (s.includes("maybe") || s.includes("review") || score >= 50) {
    return "atsTooltipMid";
  }
  return "atsTooltipLow";
}

interface ResultsHeaderProps {
  result: CekCVResult;
}

export function ResultsHeader({ result }: ResultsHeaderProps) {
  const { candidate, current_assessment, score_projection, role } = result;
  const score = current_assessment.overall_score;
  const animatedScore = useAnimatedCounter(score);
  const rawName = candidate.name?.split(" ")[0] || "there";
  const firstName = titleCase(rawName);
  const potentialGain = score_projection.potential_gain;
  const { locale } = useLanguage();
  const r = translations.results;

  const greeting = t(r.greeting, locale).replace("{name}", firstName);

  const scoreColor =
    score >= 70 ? "cekcv-gradient-text" : score >= 50 ? "text-yellow-500" : "text-red-500";

  return (
    <>
      <ConfettiTrigger score={score} />
      <div className="cekcv-glass cekcv-glow rounded-2xl p-6 sm:p-8">
        {/* Top row: greeting + role */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-bold sm:text-3xl">{greeting}</h2>
          {role && (
            <div className="flex items-center gap-2 rounded-lg border bg-background/60 px-3 py-1.5 text-sm">
              <Briefcase className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <span className="font-medium">{role}</span>
            </div>
          )}
        </div>

        {/* Score centerpiece */}
        <div className="mt-6 flex items-center justify-center gap-6 sm:gap-8">
          <div className="text-center">
            <p className={`text-6xl font-bold tabular-nums ${scoreColor}`}>
              {animatedScore}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{t(r.currentScore, locale)}</p>
          </div>

          {potentialGain > 0 && (
            <>
              <div className="flex flex-col items-center gap-1">
                <ArrowRight className="h-5 w-5 text-muted-foreground/40" />
                <span className="rounded-full cekcv-gradient px-2 py-0.5 text-xs font-semibold text-white">
                  +{potentialGain}
                </span>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold tabular-nums cekcv-gradient-text">
                  {score_projection.estimated_improved_score}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{t(r.potential, locale)}</p>
              </div>
            </>
          )}
        </div>

        {/* Bottom row: ATS status + contact */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border/50 pt-4">
          {current_assessment.status && (
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex cursor-default items-center gap-1.5">
                    <span className="text-xs font-medium text-muted-foreground">ATS:</span>
                    <Badge variant={score >= 70 ? "default" : "secondary"}>
                      {current_assessment.status}
                    </Badge>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs">
                  <p className="text-xs">{t(r[getAtsTooltipKey(current_assessment.status, score)], locale)}</p>
                </TooltipContent>
              </Tooltip>
              <AtsGuide
                currentScore={score}
                potentialScore={score_projection.estimated_improved_score}
              />
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            {[candidate.email, candidate.phone].filter(Boolean).join(" · ")}
          </p>
        </div>
      </div>
    </>
  );
}
