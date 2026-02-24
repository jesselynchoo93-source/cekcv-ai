"use client";

import { useState, useRef, Component, type ReactNode } from "react";
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

// Safely convert any value (string or object) to a displayable string
function toText(val: unknown): string {
  if (typeof val === "string") return val;
  if (typeof val === "number" || typeof val === "boolean") return String(val);
  if (val && typeof val === "object") {
    const obj = val as Record<string, unknown>;
    const found = obj.suggestion || obj.action || obj.text || obj.gap || obj.description || obj.name;
    if (typeof found === "string") return found;
    return JSON.stringify(val);
  }
  return String(val ?? "");
}

// Safely ensure a value is an array before calling .map()
function asArray(val: unknown): unknown[] {
  return Array.isArray(val) ? val : [];
}

// Error boundary to catch rendering crashes and show the actual error
class ResultsErrorBoundary extends Component<
  { children: ReactNode; onReset: () => void },
  { error: Error | null }
> {
  constructor(props: { children: ReactNode; onReset: () => void }) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <Card className="mx-auto max-w-2xl">
          <CardContent className="py-10 text-center">
            <p className="text-lg font-medium text-destructive">Display Error</p>
            <p className="mt-2 text-sm text-muted-foreground">
              The results were received but could not be displayed.
            </p>
            <pre className="mt-4 max-h-40 overflow-auto rounded bg-muted p-3 text-left text-xs">
              {this.state.error.message}
            </pre>
            <Button onClick={this.props.onReset} className="mt-6">Try Again</Button>
          </CardContent>
        </Card>
      );
    }
    return this.props.children;
  }
}

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
    return <ProgressView status={status} pollError={pollError} onReset={handleReset} />;
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
  return (
    <ResultsErrorBoundary onReset={handleReset}>
      <ResultsView result={result!} onReset={handleReset} />
    </ResultsErrorBoundary>
  );
}

function ResultsView({
  result,
  onReset,
}: {
  result: Record<string, unknown>;
  onReset: () => void;
}) {
  const candidate = (result.candidate || {}) as Record<string, unknown>;
  const assessment = (result.current_assessment || {}) as Record<string, unknown>;
  const improvements = (result.improvements || {}) as Record<string, unknown>;
  const projection = (result.score_projection || {}) as Record<string, unknown>;
  const jobs = (result.recommended_jobs || {}) as Record<string, unknown>;
  const improvedResume = (result.improved_resume || {}) as Record<string, unknown>;
  const scoreBreakdown = asArray(result.score_breakdown);

  const score = Number(assessment.overall_score) || 0;
  const scoreColor =
    score >= 80 ? "text-green-600" : score >= 60 ? "text-yellow-600" : "text-red-600";

  const strengths = asArray(assessment.strengths);
  const gaps = asArray(assessment.gaps);
  const topActions = asArray(improvements.top_3_priority_actions);
  const missingKeywords = asArray(improvements.missing_keywords);
  const suggestions = asArray(improvements.suggestions);
  const atsTips = asArray(improvements.ats_formatting_tips);
  const changesMade = asArray(improvedResume.changes_made);
  const keywordsAdded = asArray(improvedResume.keywords_added);
  const jobList = asArray(jobs.jobs);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold">{toText(candidate.name) || "Candidate"}</h2>
          <p className="text-muted-foreground">
            {[candidate.email, candidate.phone].filter(Boolean).map(toText).join(" | ")}
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
          {typeof assessment.status === "string" && (
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
          {scoreBreakdown.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-base">Score Breakdown</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {scoreBreakdown.map((raw, i) => {
                    const item = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
                    const name = toText(item.category || item.name) || `Category ${i + 1}`;
                    const s = Number(item.score ?? item.value ?? item.weighted_current ?? item.current_score) || 0;
                    const max = Number(item.weighted_max ?? item.max_score) || 100;
                    const pct = max > 0 ? Math.round((s / max) * 100) : s;
                    return (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{name}</span>
                          <span className="font-medium">{s}/{max}</span>
                        </div>
                        <Progress value={pct} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Strengths & Gaps */}
          <div className="grid gap-6 sm:grid-cols-2">
            {strengths.length > 0 && (
              <Card>
                <CardHeader><CardTitle className="text-base">Strengths</CardTitle></CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {strengths.map((s, i) => (
                      <li key={i} className="flex gap-2 text-sm">
                        <span className="shrink-0 text-green-600">+</span>
                        {toText(s)}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
            {gaps.length > 0 && (
              <Card>
                <CardHeader><CardTitle className="text-base">Gaps</CardTitle></CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {gaps.map((g, i) => (
                      <li key={i} className="flex gap-2 text-sm">
                        <span className="shrink-0 text-red-500">-</span>
                        {toText(g)}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Score Projection */}
          {(Number(projection.current_score) > 0 || Number(projection.estimated_improved_score) > 0) && (
            <Card>
              <CardHeader><CardTitle className="text-base">Improvement Potential</CardTitle></CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{Number(projection.current_score) || 0}</p>
                    <p className="text-xs text-muted-foreground">Current</p>
                  </div>
                  <span className="text-2xl text-muted-foreground">&rarr;</span>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {Number(projection.estimated_improved_score) || 0}
                    </p>
                    <p className="text-xs text-muted-foreground">Potential</p>
                  </div>
                  <div className="ml-auto text-center">
                    <p className="text-lg font-semibold text-green-600">
                      +{Number(projection.potential_gain) || 0}
                    </p>
                    <p className="text-xs text-muted-foreground">points</p>
                  </div>
                </div>
                {typeof projection.summary === "string" && projection.summary && (
                  <p className="mt-3 text-sm text-muted-foreground">{projection.summary}</p>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Improvements Tab */}
        <TabsContent value="improvements" className="space-y-6">
          {topActions.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-base">Top Priority Actions</CardTitle></CardHeader>
              <CardContent>
                <ol className="list-decimal space-y-2 pl-5">
                  {topActions.map((a, i) => (
                    <li key={i} className="text-sm">{toText(a)}</li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          )}

          {missingKeywords.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-base">Missing Keywords</CardTitle></CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {missingKeywords.map((kw, i) => (
                    <Badge key={i} variant="secondary">{toText(kw)}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {suggestions.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-base">Improvement Suggestions</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {suggestions.map((s, i) => (
                    <li key={i} className="text-sm">{toText(s)}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {atsTips.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-base">ATS Formatting Tips</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {atsTips.map((t, i) => (
                    <li key={i} className="text-sm">{toText(t)}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Improved Resume Tab */}
        <TabsContent value="resume" className="space-y-6">
          {changesMade.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-base">Changes Made</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {changesMade.map((c, i) => (
                    <li key={i} className="text-sm">{toText(c)}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {keywordsAdded.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-base">Keywords Added</CardTitle></CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {keywordsAdded.map((kw, i) => (
                    <Badge key={i} variant="secondary">{toText(kw)}</Badge>
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
          {Number(jobs.total_found) > 0 && (
            <p className="text-sm text-muted-foreground">
              Found {Number(jobs.total_found)} relevant jobs
              {typeof jobs.search_query === "string" && jobs.search_query && <> for &ldquo;{jobs.search_query}&rdquo;</>}
              {typeof jobs.search_location === "string" && jobs.search_location && <> in {jobs.search_location}</>}
            </p>
          )}

          {jobList.map((raw, i) => {
            const job = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
            return (
              <Card key={i}>
                <CardContent className="py-4">
                  <h4 className="font-medium">{toText(job.title || job.job_title) || "Untitled"}</h4>
                  <p className="text-sm text-muted-foreground">
                    {toText(job.company || job.company_name)}
                    {job.location ? <> &mdash; {toText(job.location)}</> : null}
                  </p>
                  {typeof job.url === "string" && job.url && (
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
            );
          })}

          {jobList.length === 0 && (
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

function ProgressView({
  status,
  pollError,
  onReset,
}: {
  status: { step?: string; progress?: number; stepDescription?: string; status?: string; error?: string | null } | null;
  pollError: string | null;
  onReset: () => void;
}) {
  const currentStep = status?.step || "started";
  const progress = status?.progress || 0;
  const stepOrder = Object.keys(STEPS);
  const currentIdx = stepOrder.indexOf(currentStep);
  const description = status?.stepDescription || STEPS[currentStep]?.label || "Processing...";

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle>Analyzing Your CV</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Progress value={progress} className="h-3" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{progress}%</span>
            <span>Step {Math.min(currentIdx + 1, stepOrder.length)} of {stepOrder.length}</span>
          </div>
        </div>

        <p className="text-center text-lg font-medium">
          {description}
        </p>

        {pollError && (
          <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3">
            <p className="text-sm font-medium text-destructive">Connection issue</p>
            <p className="text-xs text-destructive/80">{pollError}</p>
          </div>
        )}

        <div className="space-y-2">
          {stepOrder.map((key, thisIdx) => {
            const { label, icon } = STEPS[key];
            const isDone = thisIdx < currentIdx;
            const isCurrent = key === currentStep;

            return (
              <div key={key} className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${isCurrent ? "bg-primary/5" : ""}`}>
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium transition-all ${
                    isDone
                      ? "bg-primary text-primary-foreground"
                      : isCurrent
                        ? "bg-primary text-primary-foreground animate-pulse"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {isDone ? "\u2713" : icon}
                </div>
                <span
                  className={`text-sm ${
                    isDone
                      ? "text-muted-foreground line-through"
                      : isCurrent
                        ? "font-semibold text-foreground"
                        : "text-muted-foreground"
                  }`}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center pt-2">
          <Button variant="ghost" size="sm" onClick={onReset} className="text-muted-foreground">
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
