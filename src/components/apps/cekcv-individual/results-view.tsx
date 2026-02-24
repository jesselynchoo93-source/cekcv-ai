"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResultsHeader } from "./results-header";
import { JobContextBanner } from "./ui/job-context-banner";
import { OverviewTab } from "./tabs/overview-tab";
import { ImprovementsTab } from "./tabs/improvements-tab";
import { ResumeTab } from "./tabs/resume-tab";
import { JobsTab } from "./tabs/jobs-tab";
import type { CekCVResult } from "./types";

interface ResultsViewProps {
  result: CekCVResult;
  jobDescription: string;
  jobId?: string | null;
  onReset: () => void;
}

const tabContentClass =
  "data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-bottom-2 data-[state=active]:duration-300";

export function ResultsView({ result, jobDescription, jobId, onReset }: ResultsViewProps) {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <ResultsHeader result={result} />

      <JobContextBanner role={result.role} jobDescription={jobDescription} />

      <Tabs defaultValue="overview">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="improvements">Improvements</TabsTrigger>
          <TabsTrigger value="resume">Improved Resume</TabsTrigger>
          <TabsTrigger value="jobs">Job Matches</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className={`space-y-6 ${tabContentClass}`}>
          <OverviewTab result={result} role={result.role} />
        </TabsContent>

        <TabsContent value="improvements" className={`space-y-6 ${tabContentClass}`}>
          <ImprovementsTab
            result={result}
            role={result.role}
            jobDescription={jobDescription}
            jobId={jobId}
          />
        </TabsContent>

        <TabsContent value="resume" className={`space-y-6 ${tabContentClass}`}>
          <ResumeTab result={result} role={result.role} />
        </TabsContent>

        <TabsContent value="jobs" className={`space-y-4 ${tabContentClass}`}>
          <JobsTab result={result} role={result.role} />
        </TabsContent>
      </Tabs>

      <div className="flex justify-center pt-4">
        <Button variant="outline" onClick={onReset}>Analyze Another CV</Button>
      </div>
    </div>
  );
}
