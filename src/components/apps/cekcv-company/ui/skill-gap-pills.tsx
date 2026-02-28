"use client";

import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";

export function SkillGapPills({
  gaps,
  total,
  locale,
}: {
  gaps: { gap: string; count: number }[];
  total: number;
  locale: "en" | "id";
}) {
  if (gaps.length === 0) return null;

  return (
    <div className="rounded-lg border border-yellow-200 bg-yellow-50/50 p-3 dark:border-yellow-900/50 dark:bg-yellow-950/20">
      <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-yellow-700 dark:text-yellow-400">
        <AlertTriangle className="h-3.5 w-3.5" />
        {locale === "en" ? "Most common skill gaps" : "Skill gap paling umum"}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {gaps.map((g, i) => (
          <Badge
            key={i}
            variant="outline"
            className="border-yellow-300 bg-yellow-100/50 text-yellow-800 dark:border-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
          >
            {g.gap}
            <span className="ml-1.5 rounded-full bg-yellow-200 px-1.5 py-px text-[9px] font-bold dark:bg-yellow-800">
              {g.count}/{total}
            </span>
          </Badge>
        ))}
      </div>
    </div>
  );
}
