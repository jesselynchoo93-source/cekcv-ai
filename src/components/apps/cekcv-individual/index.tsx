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

export function CekCVIndividual() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { jobId, status, polling, pollError, stepDescriptions, start, reset } = useJobPolling();
  const { locale } = useLanguage();
  const f = translations.form;
  const r = translations.results;

  const handleFile = useCallback((incoming: File | null) => {
    if (incoming && !incoming.name.match(/\.(pdf|docx?|doc)$/i)) {
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
    if (!file || !jobDescription.trim()) return;

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
    setFile(null);
    setJobDescription("");
    setError(null);
    setDragActive(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const result = status?.result as Record<string, unknown> | null;
  const isComplete = status?.status === "complete" && result;
  const isError = status?.status === "error" || !!pollError;
  const isProcessing = polling || (status?.status === "processing" && !pollError);

  // Show form when no job is running
  if (!isProcessing && !isComplete && !isError) {
    return (
      <div className="cekcv-glass cekcv-glow mx-auto max-w-2xl rounded-2xl p-6 sm:p-8">
        <h2 className="text-xl font-bold">{t(f.title, locale)}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {t(f.subtitle, locale)}
        </p>

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
                    ? "border-green-500 bg-green-50 dark:bg-green-950/20"
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
                </div>
                <input
                  ref={fileRef}
                  id="cv-file"
                  type="file"
                  accept=".pdf,.docx,.doc"
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
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button
            type="submit"
            disabled={!file || !jobDescription.trim() || submitting}
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
  if (isProcessing && !isComplete) {
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

  // Error state
  if (isError) {
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

  // Results display
  const parsed = parseResult(result!);

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
