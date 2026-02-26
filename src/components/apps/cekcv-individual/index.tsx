"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, X } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { translations, t } from "@/lib/translations";
import { useJobPolling } from "@/hooks/use-job-polling";
import { ResultsErrorBoundary } from "./error-boundary";
import { ProgressView } from "./progress-view";
import { ResultsView } from "./results-view";
import { parseResult, formatFileSize } from "./utils";
import type { CekCVResult } from "./types";

export function CekCVIndividual() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const completedResultRef = useRef<CekCVResult | null>(null);
  const { jobId, status, polling, pollError, stepDescriptions, start, reset } = useJobPolling();
  const { locale } = useLanguage();
  const f = translations.form;
  const r = translations.results;

  const handleFile = useCallback((incoming: File | null) => {
    if (incoming && !incoming.name.match(/\.pdf$/i)) {
      setError(t(f.uploadError, locale));
      return;
    }
    setFile(incoming);
    setError(null);
  }, [locale, f.uploadError]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      const droppedFile = e.dataTransfer.files?.[0];
      if (droppedFile) handleFile(droppedFile);
    },
    [handleFile]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file || !jobDescription.trim()) {
      setError(t(f.validationError, locale));
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("jobtarget", jobDescription);

      const res = await fetch("/api/cekcv/submit-individual", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!data.success || !data.jobId) {
        setError(data.error || t(f.errorStart, locale));
        setSubmitting(false);
        return;
      }

      start(data.jobId);
    } catch {
      setError(t(f.errorConnect, locale));
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    reset();
    completedResultRef.current = null;
    setFile(null);
    setJobDescription("");
    setError(null);
    setDragActive(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const result = status?.result as Record<string, unknown> | null;
  const isError = status?.status === "error" || !!pollError;
  const isProcessing = polling || (status?.status === "processing" && !pollError);

  // Capture result in ref once complete — survives any future state changes
  if (status?.status === "complete" && result && !completedResultRef.current) {
    completedResultRef.current = parseResult(result);
  }

  const hasCompletedResult = !!completedResultRef.current;

  // Show form when no job is running and no saved result
  if (!isProcessing && !hasCompletedResult && !isError) {
    return (
      <div className="cekcv-glass cekcv-glow mx-auto max-w-2xl rounded-2xl p-6 sm:p-8">
        <h2 className="text-xl font-bold">{t(f.title, locale)}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {t(f.subtitle, locale)}
        </p>

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
            <div className="h-3 w-px bg-border" />
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" aria-label="LinkedIn">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Drag and drop zone */}
          <div className="space-y-2">
            <Label htmlFor="cv-file">{t(f.labelCV, locale)}</Label>
            {!file ? (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
                className={`flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed p-8 transition-colors ${
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
                  id="cv-file"
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
                />
              </div>
            ) : (
              <div className="flex items-center gap-3 rounded-xl border bg-muted/20 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted/50">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    if (fileRef.current) fileRef.current.value = "";
                  }}
                  className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="job-desc">{t(f.labelJD, locale)}</Label>
            <Textarea
              id="job-desc"
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
            {submitting ? t(f.submitting, locale) : t(f.submitBtn, locale)}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            {t(f.privacy, locale)}
          </p>
        </form>
      </div>
    );
  }

  // Show progress while processing
  if (isProcessing && !hasCompletedResult) {
    return (
      <ProgressView
        status={status}
        pollError={pollError}
        onReset={handleReset}
        jobDescription={jobDescription}
        fileName={file?.name || "resume.pdf"}
        fileSize={file?.size || 0}
        stepDescriptions={stepDescriptions}
      />
    );
  }

  // Error state (only if we don't already have a completed result)
  if (isError && !hasCompletedResult) {
    return (
      <Card className="mx-auto max-w-2xl">
        <CardContent className="py-10 text-center">
          <p className="text-lg font-medium text-destructive">{t(r.analysisFailed, locale)}</p>
          <p className="mt-2 text-muted-foreground">
            {pollError || status?.error || t(r.unknownError, locale)}
          </p>
          <Button onClick={handleReset} className="mt-6">
            {t(r.tryAgain, locale)}
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Results display — use persisted ref
  const parsed = completedResultRef.current ?? parseResult(result!);

  return (
    <ResultsErrorBoundary onReset={handleReset}>
      <ResultsView
        result={parsed}
        jobDescription={jobDescription}
        jobId={jobId}
        onReset={handleReset}
      />
    </ResultsErrorBoundary>
  );
}
