"use client";

import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface KeywordBadgeProps {
  keyword: string;
  jobDescription?: string;
}

function findKeywordContext(keyword: string, text: string): string | null {
  const lower = text.toLowerCase();
  const kwLower = keyword.toLowerCase();
  const idx = lower.indexOf(kwLower);
  if (idx === -1) return null;

  const start = Math.max(0, idx - 40);
  const end = Math.min(text.length, idx + keyword.length + 40);
  const before = start > 0 ? "..." : "";
  const after = end < text.length ? "..." : "";
  const snippet = text.slice(start, end);

  return before + snippet + after;
}

export function KeywordBadge({ keyword, jobDescription }: KeywordBadgeProps) {
  const context = jobDescription ? findKeywordContext(keyword, jobDescription) : null;

  if (!context) {
    return (
      <Badge variant="outline" className="cursor-default border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
        {keyword}
      </Badge>
    );
  }

  // Highlight the keyword in context
  const lower = context.toLowerCase();
  const kwLower = keyword.toLowerCase();
  const matchIdx = lower.indexOf(kwLower);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge variant="outline" className="cursor-pointer border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:border-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
          {keyword}
        </Badge>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="max-w-xs">
        <p className="text-xs">
          <span className="font-medium">Found in JD: </span>
          {matchIdx >= 0 ? (
            <>
              {context.slice(0, matchIdx)}
              <mark className="bg-yellow-200 px-0.5 font-semibold dark:bg-yellow-800">
                {context.slice(matchIdx, matchIdx + keyword.length)}
              </mark>
              {context.slice(matchIdx + keyword.length)}
            </>
          ) : (
            context
          )}
        </p>
      </TooltipContent>
    </Tooltip>
  );
}
