"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { FileText, Upload, Target } from "lucide-react";
import { STEPS } from "./constants";
import { extractJDRequirements, formatFileSize } from "./utils";
import { RotatingTips } from "./ui/rotating-tips";

interface ProgressViewProps {
  status: {
    step?: string;
    progress?: number;
    stepDescription?: string;
    status?: string;
    error?: string | null;
  } | null;
  pollError: string | null;
  onReset: () => void;
  jobDescription: string;
  fileName: string;
  fileSize: number;
  /** Accumulated step descriptions from parent, keyed by step name */
  stepDescriptions: Record<string, string>;
}

export function ProgressView({
  status,
  pollError,
  onReset,
  jobDescription,
  fileName,
  fileSize,
  stepDescriptions,
}: ProgressViewProps) {
  const currentStep = status?.step || "started";
  const progress = status?.progress || 0;
  const stepOrder = Object.keys(STEPS);
  const currentIdx = stepOrder.indexOf(currentStep);
  const [startTime] = useState(() => Date.now());
  const [elapsed, setElapsed] = useState(0);

  // Update elapsed time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  // Estimate remaining time
  const estimatedRemaining = progress > 5
    ? Math.max(0, Math.round((elapsed / (progress / 100)) * ((100 - progress) / 100)))
    : null;

  const timeDisplay = estimatedRemaining !== null
    ? estimatedRemaining < 30
      ? "Less than 30 seconds"
      : `~${Math.ceil(estimatedRemaining / 10) * 10}s remaining`
    : "Estimating...";

  const jdRequirements = extractJDRequirements(jobDescription);

  return (
    <Card className="mx-auto max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Analyzing your CV
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress bar with time estimate */}
        <div className="space-y-2">
          <Progress value={progress} className="h-3" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{progress}% complete</span>
            <span>{timeDisplay}</span>
          </div>
        </div>

        {/* Two-panel layout: CV info + JD preview */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Left: CV Info */}
          <div className="space-y-3 rounded-lg border bg-card p-4">
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              <Upload className="h-4 w-4 text-primary" />
              Your CV
            </h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4 shrink-0" />
              <span className="truncate">{fileName}</span>
              <span className="shrink-0 text-xs">({formatFileSize(fileSize)})</span>
            </div>
            {/* Show step description data if available */}
            {currentIdx >= 1 && stepDescriptions.analyzing && (
              <div className="animate-in fade-in-0 slide-in-from-bottom-2 rounded bg-primary/5 p-2 text-xs text-muted-foreground">
                {stepDescriptions.analyzing}
              </div>
            )}
            {currentIdx < 1 && (
              <div className="space-y-2">
                <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
                <p className="text-xs text-muted-foreground">Reading your CV...</p>
              </div>
            )}
          </div>

          {/* Right: JD Preview */}
          <div className="space-y-3 rounded-lg border bg-card p-4">
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              <Target className="h-4 w-4 text-primary" />
              Target Job
            </h3>
            {jdRequirements.length > 0 ? (
              <ul className="space-y-1">
                {jdRequirements.slice(0, 6).map((req, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-1.5 text-xs text-muted-foreground"
                  >
                    <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-primary" />
                    <span className="line-clamp-2">{req}</span>
                  </li>
                ))}
                {jdRequirements.length > 6 && (
                  <li className="text-xs text-muted-foreground/60">
                    +{jdRequirements.length - 6} more requirements
                  </li>
                )}
              </ul>
            ) : (
              <p className="text-xs text-muted-foreground line-clamp-6">
                {jobDescription.slice(0, 300)}
                {jobDescription.length > 300 && "..."}
              </p>
            )}
          </div>
        </div>

        <Separator />

        {/* Step progress tracker */}
        <div className="space-y-1">
          {stepOrder.map((key, thisIdx) => {
            const { label, icon } = STEPS[key];
            const isDone = thisIdx < currentIdx;
            const isCurrent = key === currentStep;
            const description = isDone ? stepDescriptions[key] : undefined;

            return (
              <div key={key}>
                <div
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                    isCurrent ? "bg-primary/5" : ""
                  }`}
                >
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-medium transition-all ${
                      isDone
                        ? "bg-primary text-primary-foreground"
                        : isCurrent
                          ? "bg-primary text-primary-foreground shadow-[0_0_0_4px] shadow-primary/20"
                          : "bg-muted text-muted-foreground"
                    }`}
                    style={isCurrent ? { animation: "pulse-ring 2s ease-in-out infinite" } : undefined}
                  >
                    {isDone ? "\u2713" : icon}
                  </div>
                  <span
                    className={`text-sm ${
                      isDone
                        ? "text-muted-foreground"
                        : isCurrent
                          ? "font-semibold text-foreground"
                          : "text-muted-foreground/60"
                    }`}
                  >
                    {label}
                    {isCurrent && (
                      <span className="ml-1 inline-block animate-pulse">...</span>
                    )}
                  </span>
                </div>
                {/* Step description flash for completed steps */}
                {description && isDone && (
                  <div className="animate-in fade-in-0 slide-in-from-left-2 ml-12 pb-1 text-xs text-muted-foreground/80">
                    {description}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Error display */}
        {pollError && (
          <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3">
            <p className="text-sm font-medium text-destructive">Connection issue</p>
            <p className="text-xs text-destructive/80">{pollError}</p>
          </div>
        )}

        {/* Rotating tips */}
        <RotatingTips />

        <div className="flex justify-center pt-2">
          <Button variant="ghost" size="sm" onClick={onReset} className="text-muted-foreground">
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
