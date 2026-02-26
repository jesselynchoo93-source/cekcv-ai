"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/language-context";
import { translations, t } from "@/lib/translations";

interface PriorityCardProps {
  action: string;
  priority: "high" | "medium" | "low";
  checked: boolean;
  onToggle: () => void;
}

/** Split on em dash / en dash / spaced hyphen into title + detail */
function splitAction(text: string): { title: string; detail: string } | null {
  const separators = [" \u2014 ", " \u2013 ", " - "];
  for (const sep of separators) {
    const idx = text.indexOf(sep);
    if (idx > 10) {
      return { title: text.slice(0, idx).trim(), detail: text.slice(idx + sep.length).trim() };
    }
  }
  return null;
}

export function PriorityCard({ action, priority, checked, onToggle }: PriorityCardProps) {
  const { locale } = useLanguage();
  const r = translations.results;

  const priorityConfig = {
    high: { label: t(r.highImpact, locale), border: "border-l-red-500", badge: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
    medium: { label: t(r.mediumImpact, locale), border: "border-l-yellow-500", badge: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
    low: { label: t(r.lowImpact, locale), border: "border-l-green-500", badge: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  };

  const config = priorityConfig[priority];
  const split = splitAction(action);

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border border-l-4 p-3 transition-colors",
        config.border,
        checked && "bg-muted/50"
      )}
    >
      <Checkbox
        checked={checked}
        onCheckedChange={onToggle}
        className="mt-0.5"
      />
      <div className={cn("flex-1 min-w-0", checked && "line-through text-muted-foreground")}>
        {split ? (
          <>
            <p className="text-sm font-medium">{split.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              <span className="mr-1">→</span>
              {split.detail}
            </p>
          </>
        ) : (
          <p className="text-sm">{action}</p>
        )}
      </div>
      <Badge variant="outline" className={cn("shrink-0 text-xs", config.badge)}>
        {config.label}
      </Badge>
    </div>
  );
}
