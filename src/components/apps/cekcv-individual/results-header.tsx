"use client";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAnimatedCounter } from "@/hooks/use-animated-counter";
import { ConfettiTrigger } from "./ui/confetti-trigger";
import type { CekCVResult } from "./types";

interface ResultsHeaderProps {
  result: CekCVResult;
}

export function ResultsHeader({ result }: ResultsHeaderProps) {
  const { candidate, current_assessment, role } = result;
  const score = current_assessment.overall_score;
  const animatedScore = useAnimatedCounter(score);

  const scoreColor =
    score >= 80 ? "text-green-500" : score >= 60 ? "text-yellow-500" : "text-red-500";

  return (
    <>
      <ConfettiTrigger score={score} />
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold">{candidate.name || "Candidate"}</h2>
          <p className="text-muted-foreground">
            {[candidate.email, candidate.phone].filter(Boolean).join(" | ")}
          </p>
          {role && (
            <Badge variant="outline" className="mt-2">
              {role}
            </Badge>
          )}
        </div>
        <div className="text-right">
          <p className={`text-5xl font-bold tabular-nums ${scoreColor}`}>{animatedScore}</p>
          <p className="text-sm text-muted-foreground">Overall Score</p>
          {current_assessment.status && (
            <Badge className="mt-1" variant={score >= 70 ? "default" : "secondary"}>
              {current_assessment.status}
            </Badge>
          )}
        </div>
      </div>
      <Separator />
    </>
  );
}
