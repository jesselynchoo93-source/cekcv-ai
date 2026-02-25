"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Upload,
  ScanSearch,
  BarChart3,
  Sparkles,
  FileEdit,
  Briefcase,
  CheckCircle2,
  FileText,
  Target,
  Check,
} from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { translations, t } from "@/lib/translations";
import { STEPS } from "./constants";
import { extractJDRequirements, formatFileSize } from "./utils";
import { RotatingTips } from "./ui/rotating-tips";

const ICON_MAP: Record<string, React.ElementType> = {
  Upload,
  ScanSearch,
  BarChart3,
  Sparkles,
  FileEdit,
  Briefcase,
  CheckCircle2,
};

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
  const { locale } = useLanguage();
  const p = translations.progress;
  const sa = translations.stepActive;

  const currentStep = status?.step || "started";
  const progress = status?.progress || 0;
  const stepOrder = Object.keys(STEPS);
  const currentIdx = stepOrder.indexOf(currentStep);
  const [startTime] = useState(() => Date.now());
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  // Smart time estimate: 180s base countdown, progress-based when we have data
  const FIXED_DURATION = 180; // 3 minutes base countdown
  const fixedRemaining = Math.max(0, FIXED_DURATION - elapsed);

  let remaining: number;
  if (progress >= 85) {
    // Almost done — trust the progress
    remaining = Math.max(0, Math.round((elapsed / progress) * (100 - progress)));
  } else if (progress >= 15) {
    // Enough data to estimate — use progress-based but cap at fixed
    const progressBased = Math.round((elapsed / progress) * (100 - progress));
    remaining = Math.min(progressBased, fixedRemaining);
  } else {
    // Too early — use fixed countdown
    remaining = fixedRemaining;
  }

  let timeDisplay: string;
  if (progress >= 90) {
    timeDisplay = t(p.almostDone, locale);
  } else if (remaining <= 15 && progress >= 70) {
    timeDisplay = t(p.almostDone, locale);
  } else if (remaining <= 30 && progress >= 50) {
    timeDisplay = t(p.lessThan30, locale);
  } else if (remaining === 0 && progress >= 60) {
    // Timer expired and progress is reasonably high — wrapping up
    timeDisplay = t(p.wrapping, locale);
  } else if (remaining === 0) {
    // Timer expired but progress is still low — show honest "still working"
    timeDisplay = t(p.stillWorking, locale);
  } else {
    // Round to nearest 10s for cleaner display
    const rounded = Math.ceil(remaining / 10) * 10;
    timeDisplay = `~${rounded}s ${t(p.remaining, locale)}`;
  }

  // Translated step labels
  const stepLabelKeys: Record<string, keyof typeof translations.steps> = {
    started: "upload",
    analyzing: "analyze",
    scoring_complete: "score",
    improving: "improve",
    resume_generated: "rewrite",
    jobs_found: "match",
    complete: "done",
  };

  const getStepLabel = (key: string) => {
    const labelKey = stepLabelKeys[key];
    return labelKey ? t(translations.steps[labelKey], locale) : STEPS[key]?.label || key;
  };

  const getActiveDescription = (key: string) => {
    const saKey = key as keyof typeof sa;
    if (sa[saKey]) return t(sa[saKey], locale);
    return STEPS[key]?.activeDescription || "";
  };

  const jdRequirements = extractJDRequirements(jobDescription);

  return (
    <div className="cekcv-glass cekcv-glow mx-auto max-w-3xl rounded-2xl p-6 sm:p-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full cekcv-gradient">
          <Target className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">{t(p.title, locale)}</h2>
          <p className="text-sm text-muted-foreground">
            {fileName} ({formatFileSize(fileSize)})
          </p>
        </div>
      </div>

      {/* Gradient progress bar */}
      <div className="mt-6">
        <div className="relative h-2.5 overflow-hidden rounded-full bg-muted/30">
          <div
            className="cekcv-progress-shimmer h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-1.5 flex justify-between text-xs text-muted-foreground">
          <span>{progress}% {t(p.complete, locale)}</span>
          <span>{timeDisplay}</span>
        </div>
      </div>

      {/* Horizontal stepper (desktop) */}
      <div className="mt-8 hidden sm:block">
        <div className="flex items-start justify-between">
          {stepOrder.map((key, thisIdx) => {
            const step = STEPS[key];
            const Icon = ICON_MAP[step.icon] || CheckCircle2;
            const isDone = thisIdx < currentIdx;
            const isCurrent = key === currentStep;

            return (
              <div key={key} className="flex flex-1 flex-col items-center">
                <div className="flex w-full items-center">
                  {thisIdx > 0 && (
                    <div
                      className={`h-0.5 flex-1 transition-colors duration-500 ${
                        isDone || isCurrent ? "cekcv-gradient" : "bg-muted/30"
                      }`}
                    />
                  )}
                  {thisIdx === 0 && <div className="flex-1" />}

                  <div
                    className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all duration-500 ${
                      isDone
                        ? "cekcv-gradient text-white"
                        : isCurrent
                          ? "cekcv-gradient text-white cekcv-glow"
                          : "bg-muted/40 text-muted-foreground/50"
                    }`}
                    style={isCurrent ? { animation: "pulse-ring 2s ease-in-out infinite" } : undefined}
                  >
                    {isDone ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Icon className="h-4 w-4" />
                    )}
                  </div>

                  {thisIdx < stepOrder.length - 1 && (
                    <div
                      className={`h-0.5 flex-1 transition-colors duration-500 ${
                        isDone ? "cekcv-gradient" : "bg-muted/30"
                      }`}
                    />
                  )}
                  {thisIdx === stepOrder.length - 1 && <div className="flex-1" />}
                </div>

                <p
                  className={`mt-2 text-xs font-medium ${
                    isDone
                      ? "text-foreground"
                      : isCurrent
                        ? "font-semibold text-foreground"
                        : "text-muted-foreground/50"
                  }`}
                >
                  {getStepLabel(key)}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Vertical stepper (mobile) */}
      <div className="mt-6 space-y-1 sm:hidden">
        {stepOrder.map((key, thisIdx) => {
          const step = STEPS[key];
          const Icon = ICON_MAP[step.icon] || CheckCircle2;
          const isDone = thisIdx < currentIdx;
          const isCurrent = key === currentStep;

          return (
            <div
              key={key}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                isCurrent ? "bg-background/80" : ""
              }`}
            >
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs transition-all ${
                  isDone
                    ? "cekcv-gradient text-white"
                    : isCurrent
                      ? "cekcv-gradient text-white"
                      : "bg-muted/40 text-muted-foreground/50"
                }`}
                style={isCurrent ? { animation: "pulse-ring 2s ease-in-out infinite" } : undefined}
              >
                {isDone ? <Check className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5" />}
              </div>
              <span
                className={`text-sm ${
                  isDone
                    ? "text-muted-foreground"
                    : isCurrent
                      ? "font-semibold text-foreground"
                      : "text-muted-foreground/50"
                }`}
              >
                {getStepLabel(key)}
                {isCurrent && <span className="ml-1 inline-block animate-pulse">...</span>}
              </span>
            </div>
          );
        })}
      </div>

      {/* Active step detail */}
      {currentStep !== "complete" && getActiveDescription(currentStep) && (
        <div className="mt-6 rounded-xl border bg-background/80 p-4 animate-in fade-in-0 slide-in-from-bottom-2">
          <p className="text-sm font-medium">
            {stepDescriptions[currentStep] || getActiveDescription(currentStep)}
          </p>
        </div>
      )}

      {/* CV + JD context panels */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border bg-background/60 p-4">
          <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <FileText className="h-3.5 w-3.5" />
            {t(p.yourCV, locale)}
          </h3>
          <p className="mt-2 text-sm font-medium">{fileName}</p>
          <p className="text-xs text-muted-foreground">{formatFileSize(fileSize)}</p>
          {currentIdx >= 1 && stepDescriptions.analyzing && (
            <p className="mt-2 rounded bg-muted/30 p-2 text-xs text-muted-foreground animate-in fade-in-0">
              {stepDescriptions.analyzing}
            </p>
          )}
        </div>

        <div className="rounded-xl border bg-background/60 p-4">
          <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <Target className="h-3.5 w-3.5" />
            {t(p.targetJob, locale)}
          </h3>
          {jdRequirements.length > 0 ? (
            <ul className="mt-2 space-y-1">
              {jdRequirements.slice(0, 4).map((req, i) => (
                <li key={i} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full cekcv-gradient" />
                  <span className="line-clamp-1">{req}</span>
                </li>
              ))}
              {jdRequirements.length > 4 && (
                <li className="text-xs text-muted-foreground/50">
                  +{jdRequirements.length - 4} more
                </li>
              )}
            </ul>
          ) : (
            <p className="mt-2 text-xs text-muted-foreground line-clamp-4">
              {jobDescription.slice(0, 200)}
              {jobDescription.length > 200 && "..."}
            </p>
          )}
        </div>
      </div>

      {/* Error display */}
      {pollError && (
        <div className="mt-4 rounded-lg border border-destructive/50 bg-destructive/10 p-3">
          <p className="text-sm font-medium text-destructive">{t(p.connectionIssue, locale)}</p>
          <p className="text-xs text-destructive/80">{pollError}</p>
        </div>
      )}

      {/* Rotating tips */}
      <div className="mt-6">
        <RotatingTips />
      </div>

      <div className="mt-4 flex justify-center">
        <Button variant="ghost" size="sm" onClick={onReset} className="text-muted-foreground">
          {t(p.cancel, locale)}
        </Button>
      </div>
    </div>
  );
}
