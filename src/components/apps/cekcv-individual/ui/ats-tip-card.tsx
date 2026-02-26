"use client";

import { Lightbulb } from "lucide-react";

interface AtsTipCardProps {
  tip: string;
}

/**
 * Split a tip on em dash (—) or double dash (--) into action + reason.
 * e.g. "Rename 'RELEVANT EXPERIENCES' to 'PROFESSIONAL EXPERIENCE' — ATS systems recognise standard headers"
 * → action: "Rename 'RELEVANT EXPERIENCES' to 'PROFESSIONAL EXPERIENCE'"
 * → reason: "ATS systems recognise standard headers"
 */
function splitTip(tip: string): { action: string; reason: string } | null {
  // Try em dash first, then en dash, then " - " (spaced hyphen)
  const separators = [" \u2014 ", " \u2013 ", " - "];
  for (const sep of separators) {
    const idx = tip.indexOf(sep);
    if (idx > 10) {
      return {
        action: tip.slice(0, idx).trim(),
        reason: tip.slice(idx + sep.length).trim(),
      };
    }
  }
  return null;
}

export function AtsTipCard({ tip }: AtsTipCardProps) {
  const split = splitTip(tip);

  if (!split) {
    return (
      <div className="flex items-start gap-3 rounded-lg border bg-card p-3">
        <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-yellow-500" />
        <p className="text-sm">{tip}</p>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 rounded-lg border bg-card p-3">
      <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-yellow-500" />
      <div className="min-w-0">
        <p className="text-sm font-medium">{split.action}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          <span className="mr-1">→</span>
          {split.reason}
        </p>
      </div>
    </div>
  );
}
