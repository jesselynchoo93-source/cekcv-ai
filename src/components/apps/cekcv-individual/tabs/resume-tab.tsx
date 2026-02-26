"use client";

import { useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, ArrowRight, Plus, Download, Printer, AlertCircle } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { translations, t } from "@/lib/translations";
import type { CekCVResult } from "../types";

interface ResumeTabProps {
  result: CekCVResult;
  role: string;
}

export function ResumeTab({ result, role }: ResumeTabProps) {
  const { improved_resume, score_projection } = result;
  const potentialGain = score_projection.potential_gain;
  const candidateName = result.candidate.name || "Improved";
  const { locale } = useLanguage();
  const r = translations.results;

  const handleSavePDF = useCallback(() => {
    const html = improved_resume.html;
    if (!html) return;

    // Inject print-on-load script and print-friendly styling
    const printReady = html.replace(
      /<\/head>/i,
      `<style>@media print { @page { margin: 10mm; } body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }</style>
       <script>window.onload=function(){window.focus();window.print();}<\/script>
       </head>`
    );

    const blob = new Blob([printReady], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  }, [improved_resume.html]);

  const handleDownloadDoc = useCallback(() => {
    const html = improved_resume.html;
    if (!html) return;
    const blob = new Blob([html], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Resume_${candidateName.replace(/\s+/g, "_")}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [improved_resume.html, candidateName]);

  const hasDownload = !!(improved_resume.html || improved_resume.download_url);
  const hasFailed = !hasDownload && !!improved_resume.error;

  return (
    <div className="space-y-6">
      {/* Header */}
      <p className="text-muted-foreground">
        {t(r.cvOptimizedFor, locale)}{" "}
        <span className="font-semibold text-foreground">{role || t(r.thisRole, locale)}</span>
      </p>

      {/* Download / Access CTA */}
      <div className="cekcv-glass cekcv-glow rounded-2xl p-5">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full cekcv-gradient">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">{t(r.cvGenerated, locale)}</h3>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {t(r.cvOptimizedDesc, locale)}
            </p>
          </div>
          {hasDownload ? (
            <div className="flex shrink-0 gap-2">
              {improved_resume.html ? (
                <>
                  <Button onClick={handleSavePDF}>
                    <Printer className="mr-2 h-4 w-4" />
                    {t(r.savePDF, locale)}
                  </Button>
                  <Button variant="outline" onClick={handleDownloadDoc}>
                    <Download className="mr-2 h-4 w-4" />
                    DOC
                  </Button>
                </>
              ) : (
                <Button asChild>
                  <a href={improved_resume.download_url} target="_blank" rel="noopener noreferrer">
                    <Download className="mr-2 h-4 w-4" />
                    {t(r.downloadCV, locale)}
                  </a>
                </Button>
              )}
            </div>
          ) : hasFailed ? (
            <p className="flex shrink-0 items-center gap-1.5 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              {t(r.resumeGenFailed, locale)}
            </p>
          ) : (
            <p className="shrink-0 text-sm text-muted-foreground">
              {t(r.processing, locale)}
            </p>
          )}
        </div>
      </div>

      {/* Score Impact — compact inline to avoid duplicating header scores */}
      {potentialGain > 0 && (
        <div className="flex items-center gap-3 rounded-xl border bg-green-50/50 px-4 py-3 dark:bg-green-950/10">
          <ArrowRight className="h-4 w-4 shrink-0 text-green-500" />
          <p className="text-sm">
            {t(r.scoreImpact, locale)}{" "}
            <span className="font-semibold">{score_projection.current_score}</span> {t(r.to, locale)}{" "}
            <span className="font-semibold text-green-600 dark:text-green-400">
              {score_projection.estimated_improved_score}
            </span>
          </p>
          <Badge className="ml-auto shrink-0 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
            +{potentialGain} {t(r.pts, locale)}
          </Badge>
        </div>
      )}

      {/* Changes Made */}
      {improved_resume.changes_made.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t(r.changesMade, locale)}</CardTitle>
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
            <CardTitle className="text-base">{t(r.keywordsAdded, locale)}</CardTitle>
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
