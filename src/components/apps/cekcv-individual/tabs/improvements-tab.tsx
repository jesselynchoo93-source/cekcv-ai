"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Check, ChevronDown, Lightbulb } from "lucide-react";
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

/**
 * Extract a short action-word title (2-4 words) from a suggestion.
 * Pattern: "Verb + Object" — scannable at a glance.
 */
function generateShortTitle(text: string): string {
  const words = text.split(/\s+/);

  // Common action verbs that start suggestions
  const actionVerbs = new Set([
    "add", "include", "expand", "pursue", "create", "remove", "update",
    "rewrite", "replace", "highlight", "emphasize", "quantify", "list",
    "mention", "strengthen", "optimize", "tailor", "use", "move",
    "reorganize", "consolidate", "shorten", "lengthen", "improve",
    "specify", "align", "target", "develop", "obtain", "complete",
    "restructure", "simplify", "clarify", "demonstrate", "showcase",
    "incorporate", "integrate", "reduce", "increase", "boost", "fix",
  ]);

  // Try to extract a quoted term like 'Skills' or "Project Management"
  const quotedMatch = text.match(/['"]([^'"]{3,30})['"]/);
  const startsWithVerb = actionVerbs.has(words[0]?.toLowerCase());

  // Best case: "Verb + 'Quoted Section'"
  if (quotedMatch && startsWithVerb) {
    return `${words[0]} ${quotedMatch[1]}`;
  }

  // If starts with verb, take verb + next 1-3 key words (skip articles/prepositions)
  if (startsWithVerb) {
    const skip = new Set(["a", "an", "the", "your", "to", "for", "of", "in", "on", "with", "more", "and"]);
    const keyWords = [words[0]];
    for (let i = 1; i < words.length && keyWords.length < 4; i++) {
      const w = words[i].toLowerCase().replace(/[^a-z]/g, "");
      if (!skip.has(w) && w.length > 1) keyWords.push(words[i].replace(/[,:;.]+$/, ""));
    }
    return keyWords.join(" ");
  }

  // If has a quoted term, use it
  if (quotedMatch) {
    return quotedMatch[1];
  }

  // Fallback: first 3-4 meaningful words
  const skip = new Set(["a", "an", "the", "your", "to", "for", "of", "in", "on", "with", "and"]);
  const keyWords: string[] = [];
  for (const word of words) {
    const w = word.toLowerCase().replace(/[^a-z]/g, "");
    if (!skip.has(w) && w.length > 1) keyWords.push(word.replace(/[,:;.]+$/, ""));
    if (keyWords.length >= 3) break;
  }
  return keyWords.join(" ") || words.slice(0, 3).join(" ");
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
        How to improve your CV for{" "}
        <span className="font-semibold text-foreground">{role || "this role"}</span>
      </p>

      {/* Progress tracker with gradient bar */}
      {totalItems > 0 && (
        <div className="rounded-xl border p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0 flex-1 space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {checkedCount}/{totalItems} applied
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
              <p className="text-[10px] text-muted-foreground">est. score</p>
            </div>
          </div>
        </div>
      )}

      {/* Top Priority Actions */}
      {improvements.top_3_priority_actions.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Highest impact changes</h3>
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
            <CardTitle className="text-base">Missing Keywords</CardTitle>
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

      {/* Additional Suggestions — left-right layout */}
      {improvements.suggestions.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Additional Suggestions</h3>
          <div className="space-y-2">
            {improvements.suggestions.map((suggestion, i) => {
              const checklistIdx = improvements.top_3_priority_actions.length + i;
              const isChecked = checkedItems.has(checklistIdx);
              const title = generateShortTitle(suggestion);

              return (
                <div
                  key={i}
                  className="grid gap-3 rounded-lg border p-3 sm:grid-cols-[180px_1fr] items-start"
                >
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
                      {title}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{suggestion}</p>
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
            ATS Formatting Tips ({improvements.ats_formatting_tips.length})
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
