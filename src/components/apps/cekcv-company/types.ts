// ── Shared types for Company Screening Dashboard ──

export interface ResumeSnapshot {
  personal?: { name?: string; email?: string; phone?: string; location?: string; links?: string[] };
  experience?: { title?: string; company?: string; start?: string; end?: string; highlights?: string[] }[];
  education?: { school?: string; degree?: string; field?: string; gradYear?: string }[];
  skills?: { hard?: string[]; soft?: string[] };
  certifications?: string[];
}

export interface IndividualModelScore {
  model: string;
  score: number;
  must_match_pct?: number;
  nice_match_pct?: number;
}

export interface DashboardCandidate {
  name: string;
  email: string;
  phone?: string;
  score: number;
  must_match_pct?: number;
  nice_match_pct?: number;
  status: string;
  summary: string;
  oneLiner?: string;
  strengths: string[];
  gaps: string[];
  fileName?: string;
  weights?: Record<string, number>;
  resume?: ResumeSnapshot;
  individualScores?: IndividualModelScore[];
}

export interface BatchInsights {
  avgScore: number;
  topScore: number;
  lowScore: number;
  scoreRange: number;
  interviewReady: number;
  topGaps: { gap: string; count: number }[];
  totalCandidates: number;
  shortlisted: number;
  review: number;
  rejected: number;
}

export type SortField = "score" | "name" | "status" | "must_match_pct";
export type SortDir = "asc" | "desc";
export type StatusFilter = "all" | "shortlist" | "review" | "reject";
