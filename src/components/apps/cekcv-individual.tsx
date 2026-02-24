"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useJobPolling } from "@/hooks/use-job-polling";

const STEPS: Record<string, { label: string; icon: string }> = {
  started: { label: "Starting analysis...", icon: "1" },
  analyzing: { label: "AI is reading your CV and job description...", icon: "2" },
  scoring_complete: { label: "3 AI models have scored your CV", icon: "3" },
  improving: { label: "Generating improvement advice...", icon: "4" },
  resume_generated: { label: "Creating your improved CV...", icon: "5" },
  jobs_found: { label: "Found relevant jobs for you", icon: "6" },
  complete: { label: "Analysis complete!", icon: "7" },
};

export function CekCVIndividual() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const { status, polling, pollError, start, reset } = useJobPolling();

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
    const currentStep = status?.step || "started";
    const progress = status?.progress || 0;

    return (
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>Analyzing Your CV</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Progress value={progress} className="h-3" />
          <p className="text-center text-lg font-medium">
            {status?.stepDescription || "Starting..."}
          </p>

          <div className="space-y-3">
            {Object.entries(STEPS).map(([key, { label, icon }]) => {
              const stepOrder = Object.keys(STEPS);
              const currentIdx = stepOrder.indexOf(currentStep);
              const thisIdx = stepOrder.indexOf(key);
              const isDone = thisIdx < currentIdx;
              const isCurrent = key === currentStep;

              return (
                <div key={key} className="flex items-center gap-3">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium ${
                      isDone
                        ? "bg-primary text-primary-foreground"
                        : isCurrent
                          ? "bg-primary/20 text-primary ring-2 ring-primary"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isDone ? "\u2713" : icon}
                  </div>
                  <span
                    className={`text-sm ${
                      isDone ? "text-foreground" : isCurrent ? "font-medium text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
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

  // Results display
  return <ResultsView result={result!} onReset={handleReset} />;
}

function ResultsView({
  result,
  onReset,
}: {
  result: Record<string, unknown>;
  onReset: () => void;
}) {
  const candidate = result.candidate as { name?: string; email?: string; phone?: string } | undefined;
  const assessment = result.current_assessment as {
    overall_score?: number; must_match_percentage?: number; nice_match_percentage?: number;
    status?: string; summary?: string; strengths?: string[]; gaps?: string[];
  } | undefined;
  const improvements = result.improvements as {
    missing_keywords?: string[]; suggestions?: string[];
    ats_formatting_tips?: string[]; top_3_priority_actions?: string[];
  } | undefined;
  const projection = result.score_projection as {
    current_score?: number; estimated_improved_score?: number;
    potential_gain?: number; summary?: string;
  } | undefined;
  const jobs = result.recommended_jobs as {
    jobs?: { title?: string; job_title?: string; company?: string; company_name?: string; location?: string; url?: string }[];
    total_found?: number; search_query?: string; search_location?: string;
  } | undefined;
  const improvedResume = result.improved_resume as {
    changes_made?: string[]; keywords_added?: string[];
  } | undefined;
  const scoreBreakdown = result.score_breakdown as { category?: string; name?: string; score?: number; value?: number }[] | undefined;

  const score = (assessment?.overall_score as number) || 0;
  const scoreColor =
    score >= 80 ? "text-green-600" : score >= 60 ? "text-yellow-600" : "text-red-600";

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold">{candidate?.name || "Candidate"}</h2>
          <p className="text-muted-foreground">
            {[candidate?.email, candidate?.phone].filter(Boolean).join(" | ")}
          </p>
          {typeof result.role === "string" && (
            <p className="mt-1 text-sm text-muted-foreground">
              Target: {result.role}
            </p>
          )}
        </div>
        <div className="text-right">
          <p className={`text-4xl font-bold ${scoreColor}`}>{score}</p>
          <p className="text-sm text-muted-foreground">Overall Score</p>
          {typeof assessment?.status === "string" && (
            <Badge className="mt-1" variant={score >= 70 ? "default" : "secondary"}>
              {assessment.status}
            </Badge>
          )}
        </div>
      </div>

      <Separator />

      <Tabs defaultValue="overview">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="improvements">Improvements</TabsTrigger>
          <TabsTrigger value="resume">Improved Resume</TabsTrigger>
          <TabsTrigger value="jobs">Job Matches</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Score Breakdown */}
          {scoreBreakdown && scoreBreakdown.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-base">Score Breakdown</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {scoreBreakdown.map((item, i) => {
                    const name = item.category || item.name || `Category ${i + 1}`;
                    const s = item.score ?? item.value ?? 0;
                    return (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{name}</span>
                          <span className="font-medium">{s}</span>
                        </div>
                        <Progress value={s} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Strengths & Gaps */}
          <div className="grid gap-6 sm:grid-cols-2">
            {assessment?.strengths && (
              <Card>
                <CardHeader><CardTitle className="text-base">Strengths</CardTitle></CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {assessment.strengths.map((s, i) => (
                      <li key={i} className="flex gap-2 text-sm">
                        <span className="shrink-0 text-green-600">+</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
            {assessment?.gaps && (
              <Card>
                <CardHeader><CardTitle className="text-base">Gaps</CardTitle></CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {assessment.gaps.map((g, i) => (
                      <li key={i} className="flex gap-2 text-sm">
                        <span className="shrink-0 text-red-500">-</span>
                        {g}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Score Projection */}
          {projection && (
            <Card>
              <CardHeader><CardTitle className="text-base">Improvement Potential</CardTitle></CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{projection.current_score}</p>
                    <p className="text-xs text-muted-foreground">Current</p>
                  </div>
                  <span className="text-2xl text-muted-foreground">&rarr;</span>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {projection.estimated_improved_score}
                    </p>
                    <p className="text-xs text-muted-foreground">Potential</p>
                  </div>
                  <div className="ml-auto text-center">
                    <p className="text-lg font-semibold text-green-600">
                      +{projection.potential_gain}
                    </p>
                    <p className="text-xs text-muted-foreground">points</p>
                  </div>
                </div>
                {projection.summary && (
                  <p className="mt-3 text-sm text-muted-foreground">{projection.summary}</p>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Improvements Tab */}
        <TabsContent value="improvements" className="space-y-6">
          {improvements?.top_3_priority_actions && (
            <Card>
              <CardHeader><CardTitle className="text-base">Top Priority Actions</CardTitle></CardHeader>
              <CardContent>
                <ol className="list-decimal space-y-2 pl-5">
                  {improvements.top_3_priority_actions.map((a, i) => (
                    <li key={i} className="text-sm">{a}</li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          )}

          {improvements?.missing_keywords && improvements.missing_keywords.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-base">Missing Keywords</CardTitle></CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {improvements.missing_keywords.map((kw, i) => (
                    <Badge key={i} variant="secondary">{kw}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {improvements?.suggestions && (
            <Card>
              <CardHeader><CardTitle className="text-base">Improvement Suggestions</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {improvements.suggestions.map((s, i) => (
                    <li key={i} className="text-sm">{s}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {improvements?.ats_formatting_tips && (
            <Card>
              <CardHeader><CardTitle className="text-base">ATS Formatting Tips</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {improvements.ats_formatting_tips.map((t, i) => (
                    <li key={i} className="text-sm">{t}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Improved Resume Tab */}
        <TabsContent value="resume" className="space-y-6">
          {improvedResume?.changes_made && (
            <Card>
              <CardHeader><CardTitle className="text-base">Changes Made</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {improvedResume.changes_made.map((c, i) => (
                    <li key={i} className="text-sm">{c}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {improvedResume?.keywords_added && improvedResume.keywords_added.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-base">Keywords Added</CardTitle></CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {improvedResume.keywords_added.map((kw, i) => (
                    <Badge key={i} variant="secondary">{kw}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <p className="text-sm text-muted-foreground">
            The full improved resume (HTML and text versions) is stored in Google Drive.
            The link can be found in the ImprovementLog sheet.
          </p>
        </TabsContent>

        {/* Jobs Tab */}
        <TabsContent value="jobs" className="space-y-4">
          {jobs?.total_found != null && (
            <p className="text-sm text-muted-foreground">
              Found {jobs.total_found} relevant jobs
              {jobs.search_query && <> for &ldquo;{jobs.search_query}&rdquo;</>}
              {jobs.search_location && <> in {jobs.search_location}</>}
            </p>
          )}

          {jobs?.jobs?.map((job, i) => (
            <Card key={i}>
              <CardContent className="py-4">
                <h4 className="font-medium">{job.title || job.job_title}</h4>
                <p className="text-sm text-muted-foreground">
                  {job.company || job.company_name}
                  {job.location && <> &mdash; {job.location}</>}
                </p>
                {job.url && (
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-block text-sm text-primary underline"
                  >
                    View Job
                  </a>
                )}
              </CardContent>
            </Card>
          ))}

          {(!jobs?.jobs || jobs.jobs.length === 0) && (
            <p className="text-center text-muted-foreground">No job recommendations available</p>
          )}
        </TabsContent>
      </Tabs>

      <div className="flex justify-center pt-4">
        <Button variant="outline" onClick={onReset}>Analyze Another CV</Button>
      </div>
    </div>
  );
}
