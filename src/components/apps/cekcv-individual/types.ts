export interface CandidateInfo {
  name: string;
  email: string;
  phone: string;
}

export interface ScoreCategory {
  category: string;
  score: number;
  weighted_current: number;
  weighted_max: number;
}

export interface Assessment {
  overall_score: number;
  status: string;
  strengths: string[];
  gaps: string[];
}

export interface ScoreProjection {
  current_score: number;
  estimated_improved_score: number;
  potential_gain: number;
  summary: string;
}

export interface Improvements {
  top_3_priority_actions: string[];
  missing_keywords: string[];
  suggestions: string[];
  ats_formatting_tips: string[];
}

export interface ImprovedResume {
  changes_made: string[];
  keywords_added: string[];
  download_url?: string;
}

export interface JobMatch {
  title: string;
  company: string;
  location: string;
  url: string;
  match_score?: number;
}

export interface RecommendedJobs {
  total_found: number;
  search_query: string;
  search_location: string;
  jobs: JobMatch[];
}

export interface CekCVResult {
  candidate: CandidateInfo;
  current_assessment: Assessment;
  score_breakdown: ScoreCategory[];
  score_projection: ScoreProjection;
  improvements: Improvements;
  improved_resume: ImprovedResume;
  recommended_jobs: RecommendedJobs;
  role: string;
}

export interface FormContext {
  jobDescription: string;
  fileName: string;
  fileSize: number;
}
