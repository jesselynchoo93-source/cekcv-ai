"use client";

import { Check, X, Lightbulb } from "lucide-react";

interface AtsTipCardProps {
  tip: string;
}

function parseDosDonts(tip: string): { doText: string; dontText: string } | null {
  // Try to split on "instead" / "rather than" / "not" patterns
  const patterns = [
    /(?:don'?t|avoid|never)\s+(.+?)(?:\.\s*|\s*[,;]\s*)(?:instead|rather|use|try)\s+(.+)/i,
    /(?:use|try|prefer)\s+(.+?)(?:\s+instead of\s+|\s+rather than\s+|\s+not\s+)(.+)/i,
  ];

  for (const pattern of patterns) {
    const match = tip.match(pattern);
    if (match) {
      // First pattern: don't X, instead Y
      if (/don'?t|avoid|never/i.test(tip.slice(0, 10))) {
        return { dontText: match[1].trim(), doText: match[2].trim() };
      }
      // Second pattern: use X instead of Y
      return { doText: match[1].trim(), dontText: match[2].trim() };
    }
  }
  return null;
}

export function AtsTipCard({ tip }: AtsTipCardProps) {
  const parsed = parseDosDonts(tip);

  if (!parsed) {
    return (
      <div className="flex items-start gap-3 rounded-lg border bg-card p-3">
        <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-yellow-500" />
        <p className="text-sm">{tip}</p>
      </div>
    );
  }

  return (
    <div className="grid rounded-lg border bg-card sm:grid-cols-2">
      {/* Don't side */}
      <div className="flex items-start gap-3 border-b p-3 sm:border-b-0 sm:border-r">
        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-950">
          <X className="h-3 w-3 text-red-500" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-red-600 dark:text-red-400">
            Don&apos;t
          </p>
          <p className="mt-0.5 text-sm text-muted-foreground">{parsed.dontText}</p>
        </div>
      </div>
      {/* Do side */}
      <div className="flex items-start gap-3 p-3">
        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-950">
          <Check className="h-3 w-3 text-green-500" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-green-600 dark:text-green-400">
            Do
          </p>
          <p className="mt-0.5 text-sm">{parsed.doText}</p>
        </div>
      </div>
    </div>
  );
}
