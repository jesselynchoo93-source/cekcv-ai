"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TrendingUp } from "lucide-react";
import { useChecklist } from "@/hooks/use-checklist";
import { PriorityCard } from "../ui/priority-card";
import { KeywordBadge } from "../ui/keyword-badge";
import { AtsTipCard } from "../ui/ats-tip-card";
import type { CekCVResult } from "../types";

interface ImprovementsTabProps {
  result: CekCVResult;
  role: string;
  jobDescription: string;
  jobId?: string | null;
}

function getPriority(index: number): "high" | "medium" | "low" {
  if (index === 0) return "high";
  if (index === 1) return "medium";
  return "low";
}

export function ImprovementsTab({ result, role, jobDescription, jobId }: ImprovementsTabProps) {
  const { improvements, score_projection } = result;
  const allActions = [
    ...improvements.top_3_priority_actions,
    ...improvements.suggestions,
  ];
  const totalItems = allActions.length;

  const { checkedItems, toggleItem, checkedCount, progress } = useChecklist(
    totalItems,
    jobId ? `cekcv-checklist-${jobId}` : undefined
  );

  // Live score estimate
  const currentScore = score_projection.current_score;
  const potentialGain = score_projection.potential_gain;
  const estimatedScore = totalItems > 0
    ? Math.round(currentScore + (potentialGain * checkedCount) / totalItems)
    : currentScore;

  return (
    <div className="space-y-6">
      {/* Header */}
      <p className="text-muted-foreground">
        How to improve your CV for <span className="font-semibold text-foreground">{role || "this role"}</span>
      </p>

      {/* Progress tracker */}
      {totalItems > 0 && (
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{checkedCount}/{totalItems} improvements applied</span>
                  <span className="font-medium">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-primary/5 px-3 py-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <div className="text-right">
                  <p className="text-lg font-bold tabular-nums text-green-500">{estimatedScore}</p>
                  <p className="text-[10px] text-muted-foreground">Est. Score</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top Priority Actions */}
      {improvements.top_3_priority_actions.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Highest impact changes for this application</h3>
          {improvements.top_3_priority_actions.map((action, i) => (
            <PriorityCard
              key={i}
              action={action}
              priority={getPriority(i)}
              checked={checkedItems.has(i)}
              onToggle={() => toggleItem(i)}
            />
          ))}
        </div>
      )}

      {/* Missing Keywords */}
      {improvements.missing_keywords.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Keywords from the job description missing in your CV</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {improvements.missing_keywords.map((kw, i) => (
                <KeywordBadge key={i} keyword={kw} jobDescription={jobDescription} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Improvement Suggestions - Accordion */}
      {improvements.suggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Improvement Suggestions</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" className="w-full">
              {improvements.suggestions.map((suggestion, i) => {
                const checklistIdx = improvements.top_3_priority_actions.length + i;
                const isChecked = checkedItems.has(checklistIdx);
                // Use first sentence as title, rest as detail
                const firstSentenceEnd = suggestion.indexOf(". ");
                const title = firstSentenceEnd > 0 && firstSentenceEnd < 80
                  ? suggestion.slice(0, firstSentenceEnd + 1)
                  : suggestion.slice(0, 80) + (suggestion.length > 80 ? "..." : "");
                const detail = firstSentenceEnd > 0 && firstSentenceEnd < 80
                  ? suggestion.slice(firstSentenceEnd + 2)
                  : suggestion;

                return (
                  <AccordionItem key={i} value={`suggestion-${i}`}>
                    <AccordionTrigger className="text-left text-sm hover:no-underline">
                      <span className={isChecked ? "line-through text-muted-foreground" : ""}>
                        {title}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm text-muted-foreground">{detail}</p>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </CardContent>
        </Card>
      )}

      {/* ATS Formatting Tips */}
      {improvements.ats_formatting_tips.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold">ATS Formatting Tips</h3>
          <div className="space-y-2">
            {improvements.ats_formatting_tips.map((tip, i) => (
              <AtsTipCard key={i} tip={tip} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
