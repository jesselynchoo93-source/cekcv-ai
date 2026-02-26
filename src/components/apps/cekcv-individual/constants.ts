export const STEPS: Record<string, { label: string; activeDescription: string; icon: string }> = {
  started:          { label: "Upload",  activeDescription: "Sending your CV to our servers...",  icon: "Upload" },
  analyzing:        { label: "Analyze", activeDescription: "3 AI models reading your CV...",     icon: "ScanSearch" },
  scoring_complete: { label: "Score",   activeDescription: "Calculating match against job...",   icon: "BarChart3" },
  improving:        { label: "Improve", activeDescription: "Generating personalized advice...",  icon: "Sparkles" },
  resume_generated: { label: "Rewrite", activeDescription: "Building your optimized CV...",      icon: "FileEdit" },
  complete:         { label: "Done",    activeDescription: "",                                   icon: "CheckCircle2" },
};

export const ROTATING_TIPS = [
  "75% of resumes are rejected by ATS before a human sees them",
  "Quantifying achievements can increase your interview callback rate by 40%",
  "CekCV.Ai uses 3 different AI models to reduce scoring bias",
  "Matching keywords from the job description is the #1 ATS optimization",
  "Recruiters spend an average of 7 seconds on initial resume screening",
  "Tailoring your resume for each application can double your response rate",
  "Using action verbs like 'Led', 'Delivered', 'Increased' makes your resume stand out",
  "A well-structured resume with clear sections scores 30% higher in ATS systems",
  "Including measurable results (e.g., 'Grew revenue by 25%') catches a recruiter's eye",
  "Your resume is being analyzed by GPT, Claude, and Gemini simultaneously",
];
