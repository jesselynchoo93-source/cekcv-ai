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
      <div className="flex items-start gap-2 rounded-lg border bg-card p-3">
        <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-yellow-500" />
        <p className="text-sm">{tip}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-2 rounded-lg border bg-card p-3 sm:grid-cols-2">
      <div className="flex items-start gap-2">
        <X className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
        <div>
          <p className="text-xs font-medium text-red-600 dark:text-red-400">Don&apos;t</p>
          <p className="text-sm text-muted-foreground">{parsed.dontText}</p>
        </div>
      </div>
      <div className="flex items-start gap-2">
        <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
        <div>
          <p className="text-xs font-medium text-green-600 dark:text-green-400">Do</p>
          <p className="text-sm">{parsed.doText}</p>
        </div>
      </div>
    </div>
  );
}
