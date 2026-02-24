"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useJobPolling } from "@/hooks/use-job-polling";
import { ResultsErrorBoundary } from "./error-boundary";
import { ProgressView } from "./progress-view";
import { ResultsView } from "./results-view";
import { parseResult } from "./utils";

export function CekCVIndividual() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const { jobId, status, polling, pollError, stepDescriptions, start, reset } = useJobPolling();

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
        setError(data.error || "Failed to start analysis");
        setSubmitting(false);
        return;
      }

      start(data.jobId);
    } catch {
      setError("Failed to connect to the server");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    reset();
    setFile(null);
    setJobDescription("");
    setError(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const result = status?.result as Record<string, unknown> | null;
  const isComplete = status?.status === "complete" && result;
  const isError = status?.status === "error" || !!pollError;
  const isProcessing = polling || (status?.status === "processing" && !pollError);

  // Show form when no job is running
  if (!isProcessing && !isComplete && !isError) {
    return (
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>Upload Your CV</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="cv-file">CV / Resume (PDF or DOCX)</Label>
              <Input
                ref={fileRef}
                id="cv-file"
                type="file"
                accept=".pdf,.docx,.doc"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="job-desc">Job Description / Target Role</Label>
              <Textarea
                id="job-desc"
                placeholder="Paste the job description here, or describe your target role..."
                rows={6}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <Button type="submit" disabled={!file || !jobDescription.trim() || submitting} className="w-full">
              {submitting ? "Submitting..." : "Analyze My CV"}
            </Button>
          </form>
        </CardContent>
      </Card>
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
          <p className="text-lg font-medium text-destructive">Analysis Failed</p>
          <p className="mt-2 text-muted-foreground">{pollError || status?.error || "An unknown error occurred"}</p>
          <Button onClick={handleReset} className="mt-6">Try Again</Button>
        </CardContent>
      </Card>
    );
  }

  // Results display — wrapped in error boundary
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
