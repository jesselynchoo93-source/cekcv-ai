"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Check, ChevronDown, Lightbulb } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { translations, t } from "@/lib/translations";
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

/**
 * Splits a long paragraph into scannable bullet points.
 * Splits on sentence boundaries (. followed by space + uppercase) while
 * keeping quoted text, abbreviations (e.g., "e.g.", "P&L"), and examples intact.
 */
function splitIntoBullets(text: string): string[] {
  // Split on ". " followed by an uppercase letter — the most reliable sentence boundary.
  // Negative lookbehind avoids splitting after common abbreviations.
  const sentences = text
    .split(/(?<=[.!])\s+(?=[A-Z])/)
    .map((s) => s.trim())
    .filter(Boolean);

  // If splitting produced only 1 chunk (or text is short), return as-is.
  if (sentences.length <= 1) return [text];
  return sentences;
}

function getPriority(index: number): "high" | "medium" | "low" {
  if (index === 0) return "high";
  if (index === 1) return "medium";
  return "low";
}

export function ImprovementsTab({ result, role, jobDescription, jobId }: ImprovementsTabProps) {
  const { improvements, score_projection } = result;
  const { locale } = useLanguage();
  const r = translations.results;
  const totalItems = improvements.top_3_priority_actions.length + improvements.suggestions.length;

  const { checkedItems, toggleItem, checkedCount, progress } = useChecklist(
    totalItems,
    jobId ? `cekcv-checklist-${jobId}` : undefined
  );

  const currentScore = score_projection.current_score;
  const potentialGain = score_projection.potential_gain;
  const estimatedScore =
    totalItems > 0
      ? Math.round(currentScore + (potentialGain * checkedCount) / totalItems)
      : currentScore;

  return (
    <div className="space-y-6">
      {/* Header */}
      <p className="text-muted-foreground">
        {t(r.howToImprove, locale)}{" "}
        <span className="font-semibold text-foreground">{role || t(r.thisRole, locale)}</span>
      </p>

      {/* Progress tracker with gradient bar */}
      {totalItems > 0 && (
        <div className="rounded-xl border p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0 flex-1 space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {checkedCount}/{totalItems} {t(r.applied, locale)}
                </span>
                <span className="font-medium">{progress}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted/30">
                <div
                  className="cekcv-progress-shimmer h-full rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <div className="border-l pl-4 text-right">
              <p className="text-2xl font-bold tabular-nums cekcv-gradient-text">
                {estimatedScore}
              </p>
              <p className="text-[10px] text-muted-foreground">{t(r.estScore, locale)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Top Priority Actions */}
      {improvements.top_3_priority_actions.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold">{t(r.highestImpact, locale)}</h3>
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
            <CardTitle className="text-base">{t(r.missingKeywords, locale)}</CardTitle>
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

      {/* Additional Suggestions */}
      {improvements.suggestions.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold">{t(r.additionalSuggestions, locale)}</h3>
          <div className="space-y-2">
            {improvements.suggestions.map((suggestion, i) => {
              const checklistIdx = improvements.top_3_priority_actions.length + i;
              const isChecked = checkedItems.has(checklistIdx);
              const bullets = splitIntoBullets(suggestion.text);

              return (
                <div key={i} className="rounded-lg border p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleItem(checklistIdx)}
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                        isChecked
                          ? "cekcv-gradient border-transparent text-white"
                          : "border-muted-foreground/30 hover:border-primary"
                      }`}
                    >
                      {isChecked && <Check className="h-3 w-3" />}
                    </button>
                    <span
                      className={`text-sm font-medium ${
                        isChecked ? "line-through text-muted-foreground" : ""
                      }`}
                    >
                      {suggestion.title}
                    </span>
                  </div>
                  <ul className="ml-6 space-y-1">
                    {bullets.map((bullet, j) => (
                      <li
                        key={j}
                        className="flex gap-2 text-sm text-muted-foreground"
                      >
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/40" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ATS Formatting Tips - Collapsible */}
      {improvements.ats_formatting_tips.length > 0 && (
        <Collapsible>
          <CollapsibleTrigger className="flex w-full items-center gap-2 rounded-lg border px-4 py-3 text-sm font-semibold transition-colors hover:bg-muted/50">
            <Lightbulb className="h-4 w-4 text-yellow-500" />
            {t(r.atsFormattingTips, locale)} ({improvements.ats_formatting_tips.length})
            <ChevronDown className="ml-auto h-4 w-4 text-muted-foreground transition-transform [[data-state=open]>&]:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 space-y-2">
            {improvements.ats_formatting_tips.map((tip, i) => (
              <AtsTipCard key={i} tip={tip} />
            ))}
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
}
