"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Sparkles, FileText, Briefcase, ArrowLeft, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { translations, t } from "@/lib/translations";
import { ResultsHeader } from "./results-header";
import { OverviewTab } from "./tabs/overview-tab";
import { ImprovementsTab } from "./tabs/improvements-tab";
import { ResumeTab } from "./tabs/resume-tab";
import { JobsTab } from "./tabs/jobs-tab";
import { useAutoJobSearch } from "./hooks/use-auto-job-search";
import type { CekCVResult } from "./types";

interface ResultsViewProps {
  result: CekCVResult;
  jobDescription: string;
  jobId?: string | null;
  onReset: () => void;
}

const TAB_ORDER = ["overview", "improvements", "resume", "jobs"] as const;

const tabContentClass =
  "data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-bottom-2 data-[state=active]:duration-300";

export function ResultsView({ result, jobDescription, jobId, onReset }: ResultsViewProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const { locale } = useLanguage();
  const r = translations.results;
  const jobSearch = useAutoJobSearch(jobId);

  const tabLabels: Record<string, string> = {
    overview: t(r.overview, locale),
    improvements: t(r.improvements, locale),
    resume: t(r.improvedCV, locale),
    jobs: t(r.jobMatches, locale),
  };

  const currentIdx = TAB_ORDER.indexOf(activeTab as typeof TAB_ORDER[number]);
  const prevTab = currentIdx > 0 ? TAB_ORDER[currentIdx - 1] : null;
  const nextTab = currentIdx < TAB_ORDER.length - 1 ? TAB_ORDER[currentIdx + 1] : null;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <ResultsHeader result={result} />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start">
          <TabsTrigger value="overview">
            <BarChart3 className="mr-1.5 h-4 w-4" />
            {tabLabels.overview}
          </TabsTrigger>
          <TabsTrigger value="improvements">
            <Sparkles className="mr-1.5 h-4 w-4" />
            {tabLabels.improvements}
          </TabsTrigger>
          <TabsTrigger value="resume">
            <FileText className="mr-1.5 h-4 w-4" />
            {tabLabels.resume}
          </TabsTrigger>
          <TabsTrigger value="jobs">
            <Briefcase className="mr-1.5 h-4 w-4" />
            {tabLabels.jobs}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className={`mt-6 space-y-6 ${tabContentClass}`}>
          <OverviewTab result={result} role={result.role} />
        </TabsContent>

        <TabsContent value="improvements" className={`mt-6 space-y-6 ${tabContentClass}`}>
          <ImprovementsTab
            result={result}
            role={result.role}
            jobDescription={jobDescription}
            jobId={jobId}
          />
        </TabsContent>

        <TabsContent value="resume" className={`mt-6 space-y-6 ${tabContentClass}`}>
          <ResumeTab result={result} role={result.role} />
        </TabsContent>

        <TabsContent value="jobs" className={`mt-6 space-y-4 ${tabContentClass}`}>
          <JobsTab result={result} role={result.role} jobSearch={jobSearch} />
        </TabsContent>
      </Tabs>

      {/* Tab navigation footer */}
      <div className="flex items-center justify-between border-t pt-4">
        <div>
          {prevTab ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveTab(prevTab)}
              className="text-muted-foreground"
            >
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              {tabLabels[prevTab]}
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={onReset}>
              {t(r.analyzeAnother, locale)}
            </Button>
          )}
        </div>
        <div>
          {nextTab ? (
            <Button
              variant="default"
              size="sm"
              className="cekcv-gradient text-white hover:opacity-90"
              onClick={() => setActiveTab(nextTab)}
            >
              {t(r.next, locale)}: {tabLabels[nextTab]}
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={onReset}>
              {t(r.analyzeAnother, locale)}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
