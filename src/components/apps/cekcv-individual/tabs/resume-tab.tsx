"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, ArrowRight, Plus, Download, ExternalLink } from "lucide-react";
import { isGoogleDriveUrl } from "../utils";
import type { CekCVResult } from "../types";

interface ResumeTabProps {
  result: CekCVResult;
  role: string;
}

export function ResumeTab({ result, role }: ResumeTabProps) {
  const { improved_resume, score_projection } = result;
  const potentialGain = score_projection.potential_gain;

  return (
    <div className="space-y-6">
      {/* Header */}
      <p className="text-muted-foreground">
        Your CV, optimized for{" "}
        <span className="font-semibold text-foreground">{role || "this role"}</span>
      </p>

      {/* Download / Access CTA */}
      <div className="cekcv-glass cekcv-glow rounded-2xl p-5">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full cekcv-gradient">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">Your improved CV has been generated</h3>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Optimized with targeted keywords and restructured for maximum ATS compatibility
            </p>
          </div>
          {improved_resume.download_url ? (
            <div className="flex shrink-0 gap-2">
              <Button asChild>
                <a href={improved_resume.download_url} target="_blank" rel="noopener noreferrer">
                  {isGoogleDriveUrl(improved_resume.download_url) ? (
                    <>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Open in Drive
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Download CV
                    </>
                  )}
                </a>
              </Button>
              {isGoogleDriveUrl(improved_resume.download_url) && (
                <Button variant="outline" asChild>
                  <a
                    href={improved_resume.download_url.replace(/\/edit.*|\/view.*/, "/export?format=pdf")}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    PDF
                  </a>
                </Button>
              )}
            </div>
          ) : (
            <p className="shrink-0 text-sm text-muted-foreground">
              Processing...
            </p>
          )}
        </div>
      </div>

      {/* Score Impact */}
      {potentialGain > 0 && (
        <div className="rounded-xl border p-5">
          <h3 className="mb-4 text-sm font-semibold">Score Impact</h3>
          <div className="flex items-center justify-center gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-muted-foreground tabular-nums">
                {score_projection.current_score}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Before</p>
            </div>
            <ArrowRight className="h-5 w-5 text-green-500" />
            <div className="text-center">
              <p className="text-3xl font-bold tabular-nums cekcv-gradient-text">
                {score_projection.estimated_improved_score}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">After improvements</p>
            </div>
            <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
              +{potentialGain} pts
            </Badge>
          </div>
        </div>
      )}

      {/* Changes Made */}
      {improved_resume.changes_made.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Changes made to match this role</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {improved_resume.changes_made.map((change, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 rounded-lg border border-l-4 border-l-green-500 p-3"
                >
                  <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                  <p className="text-sm">{change}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Keywords Added */}
      {improved_resume.keywords_added.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Keywords added to your CV</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {improved_resume.keywords_added.map((kw, i) => (
                <Badge
                  key={i}
                  className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                >
                  <Plus className="mr-1 h-3 w-3" />
                  {kw}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
