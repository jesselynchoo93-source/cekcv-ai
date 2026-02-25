"use client";

import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { translations, t } from "@/lib/translations";
import { useAnimatedCounter } from "@/hooks/use-animated-counter";
import { ConfettiTrigger } from "./ui/confetti-trigger";
import type { CekCVResult } from "./types";

interface ResultsHeaderProps {
  result: CekCVResult;
}

export function ResultsHeader({ result }: ResultsHeaderProps) {
  const { candidate, current_assessment, score_projection, role } = result;
  const score = current_assessment.overall_score;
  const animatedScore = useAnimatedCounter(score);
  const firstName = candidate.name?.split(" ")[0] || "there";
  const potentialGain = score_projection.potential_gain;
  const { locale } = useLanguage();
  const r = translations.results;

  const greeting = t(r.greeting, locale).replace("{name}", firstName);

  return (
    <>
      <ConfettiTrigger score={score} />
      <div className="cekcv-glass cekcv-glow rounded-2xl p-6 sm:p-8">
        {/* Greeting + role */}
        <div>
          <h2 className="text-2xl font-bold sm:text-3xl">
            {greeting}
          </h2>
          <p className="mt-1 text-muted-foreground">
            {t(r.matchText, locale)}{" "}
            {role && (
              <Badge variant="outline" className="ml-0.5 inline-flex align-middle">
                {role}
              </Badge>
            )}
            {!role && <span className="font-semibold">{t(r.targetRole, locale)}</span>}
            {locale === "en" ? " role" : ""}
          </p>
        </div>

        {/* Score centerpiece */}
        <div className="mt-6 flex items-center justify-center gap-6 sm:gap-8">
          <div className="text-center">
            <p className="text-6xl font-bold tabular-nums cekcv-gradient-text">
              {animatedScore}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{t(r.currentScore, locale)}</p>
          </div>

          {potentialGain > 0 && (
            <>
              <ArrowRight className="h-5 w-5 text-muted-foreground/50" />
              <div className="text-center">
                <p className="text-4xl font-bold tabular-nums text-green-500">
                  {score_projection.estimated_improved_score}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{t(r.potential, locale)}</p>
              </div>
              <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                +{potentialGain}
              </Badge>
            </>
          )}
        </div>

        {/* Bottom row: status + contact */}
        <div className="mt-6 flex items-center justify-between border-t border-border/50 pt-4">
          {current_assessment.status && (
            <Badge variant={score >= 70 ? "default" : "secondary"}>
              {current_assessment.status}
            </Badge>
          )}
          <p className="text-xs text-muted-foreground">
            {[candidate.email, candidate.phone].filter(Boolean).join(" | ")}
          </p>
        </div>
      </div>
    </>
  );
}
