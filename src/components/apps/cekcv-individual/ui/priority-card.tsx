"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PriorityCardProps {
  action: string;
  priority: "high" | "medium" | "low";
  checked: boolean;
  onToggle: () => void;
}

const priorityConfig = {
  high: { label: "High Impact", border: "border-l-red-500", badge: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  medium: { label: "Medium", border: "border-l-yellow-500", badge: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
  low: { label: "Low", border: "border-l-green-500", badge: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
};

export function PriorityCard({ action, priority, checked, onToggle }: PriorityCardProps) {
  const config = priorityConfig[priority];

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
      <p className={cn("flex-1 text-sm", checked && "line-through text-muted-foreground")}>
        {action}
      </p>
      <Badge variant="outline" className={cn("shrink-0 text-xs", config.badge)}>
        {config.label}
      </Badge>
    </div>
  );
}
