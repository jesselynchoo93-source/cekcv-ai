"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useJobPolling } from "@/hooks/use-job-polling";

interface Candidate {
  name: string;
  email: string;
  score: number;
  status: string;
  summary: string;
  strengths: string[];
  gaps: string[];
}

export function CekCVCompany() {
  const [files, setFiles] = useState<FileList | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [roleName, setRoleName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const { status, polling, start, reset } = useJobPolling();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!files || files.length === 0 || !jobDescription.trim()) return;

    setSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("jobDescription", jobDescription);
      formData.append("roleName", roleName || "Untitled Role");

      for (let i = 0; i < files.length; i++) {
        formData.append("file", files[i]);
      }

      const res = await fetch("/api/cekcv/submit-company", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!data.success) {
        setError(data.error || "Failed to start batch analysis");
        setSubmitting(false);
        return;
      }

      start(data.batchId || data.jobId);
    } catch {
      setError("Failed to connect to the server");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    reset();
    setFiles(null);
    setJobDescription("");
    setRoleName("");
    setError(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const result = status?.result as Record<string, unknown> | null;
  const isComplete = status?.status === "complete" && result;
  const isError = status?.status === "error";
  const isProcessing = polling || status?.status === "processing";

  // Form
  if (!isProcessing && !isComplete && !isError) {
    return (
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>Batch Candidate Screening</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="role-name">Role Name</Label>
              <Input
                id="role-name"
                placeholder="e.g. Senior Software Engineer"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="job-desc-company">Job Description</Label>
              <Textarea
                id="job-desc-company"
                placeholder="Paste the full job description..."
                rows={6}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cv-files">CVs / Resumes (multiple PDF or DOCX)</Label>
              <Input
                ref={fileRef}
                id="cv-files"
                type="file"
                accept=".pdf,.docx,.doc"
                multiple
                onChange={(e) => setFiles(e.target.files)}
              />
              {files && files.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  {files.length} file{files.length > 1 ? "s" : ""} selected
                </p>
              )}
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button
              type="submit"
              disabled={!files || files.length === 0 || !jobDescription.trim() || submitting}
              className="w-full"
            >
              {submitting ? "Submitting..." : `Screen ${files?.length || 0} Candidate${(files?.length || 0) !== 1 ? "s" : ""}`}
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  // Processing
  if (isProcessing && !isComplete) {
    const progress = status?.progress || 0;
    const candidateIdx = status?.candidateIndex || 0;
    const totalCandidates = status?.totalCandidates || 1;

    return (
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>Screening Candidates</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Progress value={progress} className="h-3" />
          <p className="text-center text-lg font-medium">
            {status?.stepDescription || "Starting batch analysis..."}
          </p>
          {totalCandidates > 1 && (
            <p className="text-center text-sm text-muted-foreground">
              Candidate {Math.min(candidateIdx + 1, totalCandidates)} of {totalCandidates}
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  // Error
  if (isError) {
    return (
      <Card className="mx-auto max-w-2xl">
        <CardContent className="py-10 text-center">
          <p className="text-lg font-medium text-destructive">Screening Failed</p>
          <p className="mt-2 text-muted-foreground">{status?.error || "An unknown error occurred"}</p>
          <Button onClick={handleReset} className="mt-6">Try Again</Button>
        </CardContent>
      </Card>
    );
  }

  // Results — candidate ranking
  return <BatchResults result={result!} onReset={handleReset} />;
}

function BatchResults({
  result,
  onReset,
}: {
  result: Record<string, unknown>;
  onReset: () => void;
}) {
  const candidates = (result.candidates || result.ranked_candidates || []) as Candidate[];
  const sorted = [...candidates].sort((a, b) => (b.score || 0) - (a.score || 0));

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Screening Results</h2>
          <p className="text-muted-foreground">
            {sorted.length} candidate{sorted.length !== 1 ? "s" : ""} ranked by score
          </p>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        {sorted.map((c, i) => {
          const scoreColor =
            c.score >= 80 ? "text-green-600" : c.score >= 60 ? "text-yellow-600" : "text-red-600";

          return (
            <Card key={i}>
              <CardContent className="py-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-sm font-medium">
                        {i + 1}
                      </span>
                      <h3 className="font-semibold">{c.name || `Candidate ${i + 1}`}</h3>
                      {c.status && (
                        <Badge variant={c.score >= 70 ? "default" : "secondary"}>
                          {c.status}
                        </Badge>
                      )}
                    </div>
                    {c.email && <p className="text-sm text-muted-foreground">{c.email}</p>}
                    {c.summary && <p className="mt-2 text-sm">{c.summary}</p>}
                  </div>
                  <div className="text-right">
                    <p className={`text-3xl font-bold ${scoreColor}`}>{c.score}</p>
                    <p className="text-xs text-muted-foreground">score</p>
                  </div>
                </div>

                {(c.strengths?.length > 0 || c.gaps?.length > 0) && (
                  <div className="mt-3 grid gap-4 sm:grid-cols-2">
                    {c.strengths?.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Strengths</p>
                        <ul className="mt-1 space-y-1">
                          {c.strengths.slice(0, 3).map((s, j) => (
                            <li key={j} className="flex gap-1.5 text-xs">
                              <span className="text-green-600">+</span>{s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {c.gaps?.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Gaps</p>
                        <ul className="mt-1 space-y-1">
                          {c.gaps.slice(0, 3).map((g, j) => (
                            <li key={j} className="flex gap-1.5 text-xs">
                              <span className="text-red-500">-</span>{g}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {sorted.length === 0 && (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            No candidate results available. The batch may still be processing.
          </CardContent>
        </Card>
      )}

      <div className="flex justify-center pt-4">
        <Button variant="outline" onClick={onReset}>Screen More Candidates</Button>
      </div>
    </div>
  );
}
