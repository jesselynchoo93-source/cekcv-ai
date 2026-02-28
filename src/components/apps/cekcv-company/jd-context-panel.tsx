"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ClipboardList, ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { translations, t } from "@/lib/translations";
import { WEIGHT_LABELS } from "./utils";

export function JDContextPanel({
  jobDescription,
  weights,
}: {
  jobDescription?: string;
  weights?: Record<string, number>;
}) {
  const { locale } = useLanguage();
  const f = translations.companyForm;

  if (!jobDescription && !weights) return null;

  return (
    <Collapsible className="print:hidden">
      <CollapsibleTrigger className="flex w-full items-center gap-2 rounded-xl border bg-card px-4 py-3 text-sm font-medium hover:bg-muted/50 transition-colors">
        <ClipboardList className="h-4 w-4 text-muted-foreground" />
        {t(f.jobRequirements, locale)}
        <ChevronDown className="ml-auto h-4 w-4 text-muted-foreground transition-transform [[data-state=open]>&]:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-2">
        <Card>
          <CardContent className="p-4 space-y-4">
            {jobDescription && (
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {locale === "en" ? "Job Description" : "Job Description"}
                </p>
                <p className="whitespace-pre-wrap text-sm text-muted-foreground leading-relaxed max-h-64 overflow-y-auto">
                  {jobDescription}
                </p>
              </div>
            )}

            {weights && Object.keys(weights).length > 0 && (
              <div className={jobDescription ? "border-t pt-3" : ""}>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t(f.priorityWeights, locale)}
                </p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {Object.entries(weights)
                    .sort(([, a], [, b]) => (b as number) - (a as number))
                    .map(([key, weight]) => {
                      const label = WEIGHT_LABELS[key];
                      const Icon = label?.icon || ClipboardList;
                      const w = weight as number;
                      return (
                        <div key={key} className="flex items-center gap-2 rounded-lg border bg-muted/20 p-2">
                          <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[11px] font-medium">{label ? (locale === "en" ? label.en : label.id) : key}</p>
                          </div>
                          <span className={`text-xs font-bold ${w >= 7 ? "text-blue-600 dark:text-blue-400" : w >= 4 ? "text-yellow-600 dark:text-yellow-400" : "text-muted-foreground"}`}>
                            {w}/10
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  );
}
