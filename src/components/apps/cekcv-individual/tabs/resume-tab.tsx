"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, ArrowRight, Plus, Download, ExternalLink } from "lucide-react";
import type { CekCVResult } from "../types";

interface ResumeTabProps {
  result: CekCVResult;
  role: string;
}

export function ResumeTab({ result, role }: ResumeTabProps) {
  const { improved_resume } = result;

  return (
    <div className="space-y-6">
      {/* Header */}
      <p className="text-muted-foreground">
        Your CV, optimized for <span className="font-semibold text-foreground">{role || "this role"}</span>
      </p>

      {/* Download / Access CTA */}
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="flex items-center gap-4 py-5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">Your improved CV has been generated</h3>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Optimized with targeted keywords and restructured for maximum ATS compatibility
            </p>
          </div>
          {improved_resume.download_url ? (
            <Button asChild>
              <a href={improved_resume.download_url} target="_blank" rel="noopener noreferrer">
                <Download className="mr-2 h-4 w-4" />
                Download CV
              </a>
            </Button>
          ) : (
            <Button variant="outline" disabled>
              <ExternalLink className="mr-2 h-4 w-4" />
              Saved to Drive
            </Button>
          )}
        </CardContent>
      </Card>

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
            <CardTitle className="text-base">Job-specific keywords added to your CV</CardTitle>
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
