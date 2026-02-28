"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Upload,
  FileText,
  X,
  Users,
  ScanSearch,
  BarChart3,
  LayoutList,
  CheckCircle2,
  Check,
  Target,
} from "lucide-react";
import { useJobPolling } from "@/hooks/use-job-polling";
import { useLanguage } from "@/contexts/language-context";
import { translations, t } from "@/lib/translations";
import { RotatingTips } from "@/components/apps/cekcv-individual/ui/rotating-tips";
import { CompanyDashboard } from "@/components/apps/cekcv-company/dashboard";

// ── Company workflow steps ──
const COMPANY_STEPS: Record<string, { label: string; icon: React.ElementType }> = {
  started:    { label: "Upload",  icon: Upload },
  analyzing:  { label: "Analyze", icon: ScanSearch },
  scoring:    { label: "Score",   icon: BarChart3 },
  ranking:    { label: "Rank",    icon: LayoutList },
  complete:   { label: "Done",    icon: CheckCircle2 },
};

// Map n8n step keys to our visual step keys
function normalizeStep(step: string, progress: number): string {
  if (step === "started" || step === "uploading") return "started";
  if (step === "analyzing" || step === "processing") return "analyzing";
  if (step === "grading" || step === "scoring" || step === "scoring_complete") return "scoring";
  if (step === "ranking" || step === "ranked" || step === "improving") return "ranking";
  if (step === "complete" || step === "done") return "complete";
  // Fallback: use progress to estimate step
  if (progress >= 95) return "ranking";
  if (progress >= 10) return "scoring";
  if (progress > 0) return "analyzing";
  return "started";
}

const MAX_FILES = 5;

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function CekCVCompany({ initialBatchId }: { initialBatchId?: string } = {}) {
  const [files, setFiles] = useState<File[]>([]);
  const [jobDescription, setJobDescription] = useState("");
  const [roleName, setRoleName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { status, polling, pollError, stale, stepDescriptions, displayProgress, start, reset } = useJobPolling();
  const { locale } = useLanguage();
  const f = translations.companyForm;
  const initialLoadedRef = useRef(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Recover batchId from URL — covers both prop and direct URL access
  const batchIdFromUrl = initialBatchId || searchParams.get("batch") || undefined;

  // Auto-load batch results from URL parameter (recovers state after remount)
  useEffect(() => {
    if (batchIdFromUrl && !initialLoadedRef.current) {
      initialLoadedRef.current = true;
      start(batchIdFromUrl);
    }
  }, [batchIdFromUrl, start]);

  const addFiles = useCallback((incoming: FileList | File[]) => {
    const newFiles: File[] = [];
    for (let i = 0; i < incoming.length; i++) {
      const file = incoming[i];
      if (!file.name.match(/\.pdf$/i)) {
        setError(t(f.uploadError, locale));
        return;
      }
      newFiles.push(file);
    }
    setFiles((prev) => {
      const combined = [...prev, ...newFiles];
      if (combined.length > MAX_FILES) {
        setError(t(f.maxFilesError, locale));
        return prev;
      }
      setError(null);
      return combined;
    });
  }, [locale, f.uploadError, f.maxFilesError]);

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
    },
    [addFiles]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!roleName.trim() || !jobDescription.trim()) {
      setError(t(f.validationError, locale));
      return;
    }
    if (files.length === 0) {
      setError(t(f.uploadError, locale));
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("jobDescription", jobDescription);
      formData.append("roleName", roleName || "Untitled Role");

      for (const file of files) {
        formData.append("file", file);
      }

      const res = await fetch("/api/cekcv/submit-company", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!data.success) {
        setError(data.error || t(f.errorStart, locale));
        setSubmitting(false);
        return;
      }

      const id = data.batchId || data.jobId;
      start(id);
      // Persist batchId in URL so state survives component remounts
      const url = new URL(window.location.href);
      url.searchParams.set("batch", id);
      router.replace(url.pathname + url.search, { scroll: false });
    } catch {
      setError(t(f.errorConnect, locale));
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    reset();
    setFiles([]);
    setJobDescription("");
    setRoleName("");
    setError(null);
    setDragActive(false);
    setShowResults(false);
    if (fileRef.current) fileRef.current.value = "";
    // Clear batchId from URL
    const url = new URL(window.location.href);
    if (url.searchParams.has("batch")) {
      url.searchParams.delete("batch");
      router.replace(url.pathname + url.search, { scroll: false });
    }
  };

  const result = status?.result as Record<string, unknown> | null;
  const isRawComplete = status?.status === "complete" && result;

  // Show "Done" step for 2s before transitioning to results
  const [showResults, setShowResults] = useState(false);
  useEffect(() => {
    if (isRawComplete && !showResults) {
      const timer = setTimeout(() => setShowResults(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [isRawComplete, showResults]);

  const isComplete = isRawComplete && showResults;

  // Build blob URLs for uploaded PDFs so the detail panel can preview them
  const fileUrls = useMemo(() => {
    const map: Record<string, string> = {};
    for (const f of files) {
      map[f.name] = URL.createObjectURL(f);
    }
    return map;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files.length]);
  const isError = status?.status === "error" || !!pollError;
  const isCompleting = isRawComplete && !showResults; // 2s "Done" step window
  const isProcessing = polling || (status?.status === "processing" && !pollError) || isCompleting;
  // When recovering from URL (not from a fresh submit), show a loading state instead of flashing the form
  const isRecovering = !!batchIdFromUrl && !status && !pollError && !polling;

  // ── Loading (recovering from URL) ──
  if (isRecovering) {
    return (
      <div className="cekcv-glass cekcv-glow mx-auto max-w-2xl rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col items-center gap-3 py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted-foreground/20 border-t-foreground" />
          <p className="text-sm text-muted-foreground">
            {locale === "en" ? "Loading results..." : "Memuat hasil..."}
          </p>
        </div>
      </div>
    );
  }

  // ── Form ──
  if (!isProcessing && !isComplete && !isError) {
    return (
      <div className="cekcv-glass cekcv-glow mx-auto max-w-2xl rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl cekcv-gradient text-white">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold">{t(f.title, locale)}</h2>
            <p className="text-sm text-muted-foreground">{t(f.subtitle, locale)}</p>
          </div>
        </div>

        {/* Powered by 3 AI models */}
        <div className="mt-3 inline-flex items-center gap-2.5 rounded-full border bg-muted/30 px-4 py-1.5">
          <span className="text-xs font-medium text-muted-foreground">
            {locale === "en" ? "Powered by" : "Didukung"}
          </span>
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-label="OpenAI">
              <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"/>
            </svg>
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-label="Anthropic">
              <path d="M13.827 3.52h3.603L24 20.48h-3.603l-6.57-16.96zm-7.258 0h3.767L16.906 20.48h-3.674l-1.343-3.461H5.017l-1.344 3.46H0l6.57-16.96zm2.327 5.15L6.27 14.981h5.252L8.896 8.67z"/>
            </svg>
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" aria-label="Google">
              <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
            </svg>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Role name */}
          <div className="space-y-2">
            <Label htmlFor="role-name">{t(f.labelRole, locale)}</Label>
            <Input
              id="role-name"
              placeholder={t(f.rolePlaceholder, locale)}
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
            />
          </div>

          {/* Job description */}
          <div className="space-y-2">
            <Label htmlFor="job-desc-company">{t(f.labelJD, locale)}</Label>
            <Textarea
              id="job-desc-company"
              placeholder={t(f.jdPlaceholder, locale)}
              rows={6}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />

            <div className="flex items-center gap-3 py-1">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs font-medium text-muted-foreground">{t(f.jdOrLabel, locale)}</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <div className="flex items-center gap-2 rounded-lg border px-3 py-2">
              <svg className="h-4 w-4 shrink-0 text-[#0A66C2]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              <input
                type="url"
                placeholder={t(f.jdLinkedinPlaceholder, locale)}
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
                value={jobDescription.startsWith("http") ? jobDescription : ""}
                onChange={(e) => setJobDescription(e.target.value)}
                onFocus={(e) => {
                  if (jobDescription && !jobDescription.startsWith("http")) {
                    e.target.value = "";
                  }
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground/60">{t(f.jdLinkedinExample, locale)}</p>
          </div>

          {/* Drag-and-drop multi-file upload */}
          <div className="space-y-2">
            <Label>{t(f.labelCVs, locale)}</Label>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              className={`flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed p-6 transition-colors ${
                dragActive
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                  : "border-muted-foreground/25 hover:border-muted-foreground/50 hover:bg-muted/30"
              }`}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted/50">
                <Upload className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">
                  {dragActive ? t(f.dropHover, locale) : t(f.dropText, locale)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{t(f.fileTypes, locale)}</p>
                <p className="mt-0.5 text-xs text-muted-foreground/50 sm:hidden">
                  {locale === "en" ? "Tap to select from Files, Drive, or other apps" : "Ketuk untuk pilih dari Files, Drive, atau app lain"}
                </p>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept=".pdf"
                multiple
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.length) addFiles(e.target.files);
                  if (fileRef.current) fileRef.current.value = "";
                }}
              />
            </div>

            {/* File list */}
            {files.length > 0 && (
              <div className="space-y-2 pt-1">
                {files.map((file, i) => (
                  <div key={`${file.name}-${i}`} className="flex items-center gap-3 rounded-lg border bg-muted/20 px-3 py-2">
                    <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                      className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
                <p className="text-xs text-muted-foreground">
                  {t(f.filesSelected, locale).replace("{count}", String(files.length))}
                </p>
              </div>
            )}
          </div>

          {error && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3">
              <p className="text-sm font-medium text-destructive">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={submitting}
            className="w-full cekcv-gradient text-white hover:opacity-90"
            size="lg"
          >
            {submitting
              ? t(f.submitting, locale)
              : t(f.submitBtn, locale).replace("{count}", String(files.length))}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            {t(f.privacy, locale)}
          </p>
        </form>
      </div>
    );
  }

  // ── Processing ──
  if (isProcessing && !isComplete) {
    return (
      <CompanyProgressView
        status={status}
        pollError={pollError}
        stale={stale}
        onReset={handleReset}
        roleName={roleName}
        jobDescription={jobDescription}
        files={files}
        stepDescriptions={stepDescriptions}
        displayProgress={displayProgress}
      />
    );
  }

  // ── Error ──
  if (isError) {
    return (
      <div className="cekcv-glass mx-auto max-w-2xl rounded-2xl p-6 sm:p-8">
        <div className="py-6 text-center">
          <p className="text-lg font-medium text-destructive">{t(f.errorTitle, locale)}</p>
          <p className="mt-2 text-muted-foreground">
            {pollError || status?.error || t(f.errorUnknown, locale)}
          </p>
          <Button onClick={handleReset} className="mt-6 cekcv-gradient text-white hover:opacity-90">
            {t(f.tryAgain, locale)}
          </Button>
        </div>
      </div>
    );
  }

  // ── Results ──
  return (
    <CompanyDashboard
      result={result!}
      onReset={handleReset}
      roleName={roleName}
      jobDescription={jobDescription}
      fileUrls={fileUrls}
    />
  );
}

// Translated step descriptions for company progress
function getCompanyStepDescription(
  step: string,
  totalCandidates: number,
  locale: "en" | "id",
  f: typeof translations.companyForm
): string {
  switch (step) {
    case "started":
      return t(f.progressBatch, locale).replace("{count}", String(totalCandidates));
    case "analyzing":
      return t(f.progressAnalyzing, locale);
    case "scoring":
      return t(f.progressScoring, locale);
    case "ranking":
      return t(f.progressRanking, locale);
    default:
      return t(f.progressBatch, locale).replace("{count}", String(totalCandidates));
  }
}

// ── Company Progress View (matches individual design) ──

interface CompanyProgressProps {
  status: {
    step?: string;
    progress?: number;
    stepDescription?: string;
    status?: string;
    error?: string | null;
    candidateIndex?: number;
    totalCandidates?: number;
  } | null;
  pollError: string | null;
  stale: boolean;
  onReset: () => void;
  roleName: string;
  jobDescription: string;
  files: File[];
  stepDescriptions: Record<string, string>;
  displayProgress: number;
}

function CompanyProgressView({
  status,
  pollError,
  stale,
  onReset,
  roleName,
  jobDescription,
  files,
  stepDescriptions,
  displayProgress,
}: CompanyProgressProps) {
  const { locale } = useLanguage();
  const f = translations.companyForm;
  const p = translations.progress;

  const rawStep = status?.step || "started";
  const progress = Math.round(displayProgress);
  const currentStep = normalizeStep(rawStep, progress);
  const totalCandidates = status?.totalCandidates || files.length;

  const stepOrder = Object.keys(COMPANY_STEPS);
  const currentIdx = stepOrder.indexOf(currentStep);

  // Timer
  const [startTime] = useState(() => Date.now());
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  // Estimate based on number of candidates (~140s per candidate for 3-model grading)
  const estimatedDuration = Math.max(90, totalCandidates * 140);

  // Derive which CV is being processed from the time-based progress bar
  // The bar fills over estimatedDuration; each CV gets an equal share
  const timeProgress = Math.min((elapsed / estimatedDuration) * 100, 99);
  const candidateIdx = totalCandidates > 0 && elapsed > 0
    ? Math.min(Math.floor((timeProgress / 100) * totalCandidates), totalCandidates - 1)
    : -1;
  const activeCvIdx = candidateIdx >= 0 && candidateIdx < files.length ? candidateIdx : -1;
  const remaining = Math.max(0, estimatedDuration - elapsed);

  let timeDisplay: string;
  if (stale) {
    timeDisplay = locale === "en" ? "Waiting for response..." : "Menunggu respons...";
  } else if (progress >= 90) {
    timeDisplay = t(p.almostDone, locale);
  } else if (remaining <= 30 && progress >= 50) {
    timeDisplay = t(p.lessThan30, locale);
  } else if (remaining === 0 && progress >= 60) {
    timeDisplay = t(p.wrapping, locale);
  } else if (remaining === 0) {
    timeDisplay = t(p.stillWorking, locale);
  } else {
    const rounded = Math.ceil(remaining / 10) * 10;
    timeDisplay = `~${rounded}s ${t(p.remaining, locale)}`;
  }

  // Step labels (translated)
  const stepLabels: Record<string, { en: string; id: string }> = {
    started:   { en: "Upload", id: "Upload" },
    analyzing: { en: "Analyze", id: "Analisis" },
    scoring:   { en: "Score", id: "Skor" },
    ranking:   { en: "Rank", id: "Ranking" },
    complete:  { en: "Done", id: "Selesai" },
  };

  const getStepLabel = (key: string) => {
    const label = stepLabels[key];
    return label ? label[locale] : key;
  };

  const totalSize = files.reduce((sum, f) => sum + f.size, 0);

  return (
    <div className="cekcv-glass cekcv-glow mx-auto max-w-3xl rounded-2xl p-6 sm:p-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full cekcv-gradient">
          <Users className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">{t(f.progressTitle, locale)}</h2>
          <p className="text-sm text-muted-foreground">
            {files.length > 0
              ? `${files.length} CV${files.length !== 1 ? "s" : ""} (${formatFileSize(totalSize)})`
              : totalCandidates > 0
                ? `${totalCandidates} CV${totalCandidates !== 1 ? "s" : ""}`
                : locale === "en" ? "Processing..." : "Memproses..."}
          </p>
        </div>
      </div>

      {/* Progress bar (fills over 700s) */}
      <div className="mt-6">
        <div className="relative h-2.5 overflow-hidden rounded-full bg-muted/30">
          <div
            className="cekcv-progress-shimmer h-full rounded-full transition-all duration-1000 ease-linear"
            style={{ width: `${timeProgress}%` }}
          />
        </div>
        <div className="mt-1.5 text-right text-xs text-muted-foreground">
          <span>{timeDisplay}</span>
        </div>
      </div>

      {/* Horizontal stepper (desktop) */}
      <div className="mt-8 hidden sm:block">
        <div className="flex items-start justify-between">
          {stepOrder.map((key, thisIdx) => {
            const step = COMPANY_STEPS[key];
            const Icon = step.icon;
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
                    {isDone ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
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
          const step = COMPANY_STEPS[key];
          const Icon = step.icon;
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
      {currentStep !== "complete" && (
        <div className="mt-6 rounded-xl border bg-background/80 p-4 animate-in fade-in-0 slide-in-from-bottom-2">
          <p className="text-sm font-medium">
            {candidateIdx >= 0 && totalCandidates > 0
              ? (locale === "en"
                  ? `Analyzing CV ${candidateIdx + 1} of ${totalCandidates}...`
                  : `Menganalisis CV ${candidateIdx + 1} dari ${totalCandidates}...`)
              : getCompanyStepDescription(currentStep, totalCandidates, locale, f)}
          </p>
        </div>
      )}


      {/* CV files + JD context panels (only when files are in memory) */}
      {(files.length > 0 || jobDescription) && (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {files.length > 0 && (
            <div className="rounded-xl border bg-background/60 p-4">
              <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <FileText className="h-3.5 w-3.5" />
                {locale === "en" ? "Candidate CVs" : "CV Kandidat"}
              </h3>
              <ul className="mt-2 space-y-1">
                {files.slice(0, 5).map((_, i) => {
                  const isCurrent = i === activeCvIdx;
                  const isDone = activeCvIdx >= 0 && i < activeCvIdx;
                  const isPending = activeCvIdx >= 0 && i > activeCvIdx;
                  return (
                    <li
                      key={i}
                      className={`flex items-center gap-1.5 text-xs transition-all duration-300 ${
                        isCurrent
                          ? "font-semibold text-foreground"
                          : isDone
                            ? "text-muted-foreground"
                            : isPending
                              ? "text-muted-foreground/40"
                              : "text-muted-foreground"
                      }`}
                    >
                      <span className={`mt-0.5 h-1 w-1 shrink-0 rounded-full ${isCurrent ? "cekcv-gradient" : isDone ? "cekcv-gradient" : "bg-muted-foreground/30"}`} />
                      <span className="truncate">{files[i].name}</span>
                    </li>
                  );
                })}
                {files.length > 5 && (
                  <li className="text-xs text-muted-foreground/50">
                    +{files.length - 5} more
                  </li>
                )}
              </ul>
            </div>
          )}

          {jobDescription && (
            <div className="rounded-xl border bg-background/60 p-4">
              <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <Target className="h-3.5 w-3.5" />
                {locale === "en" ? "Target Role" : "Target Posisi"}
              </h3>
              <p className="mt-2 text-sm font-medium">{roleName || "—"}</p>
              <p className="mt-1 text-xs text-muted-foreground line-clamp-3">
                {jobDescription.slice(0, 200)}
                {jobDescription.length > 200 && "..."}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Stale warning */}
      {stale && !pollError && (
        <div className="mt-4 rounded-lg border border-yellow-500/50 bg-yellow-50/80 dark:bg-yellow-950/20 p-3">
          <p className="text-sm font-medium text-yellow-700 dark:text-yellow-400">
            {locale === "en"
              ? "Processing seems to be taking longer than expected"
              : "Pemrosesan tampaknya lebih lama dari biasanya"}
          </p>
          <p className="text-xs text-yellow-600/80 dark:text-yellow-500/80">
            {locale === "en"
              ? "This may be due to high AI load. You can wait or try again."
              : "Ini mungkin karena beban AI tinggi. Anda bisa menunggu atau coba lagi."}
          </p>
        </div>
      )}

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
          {t(f.cancel, locale)}
        </Button>
      </div>
    </div>
  );
}

