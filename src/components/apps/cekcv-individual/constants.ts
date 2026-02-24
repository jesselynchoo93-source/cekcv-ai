export const STEPS: Record<string, { label: string; icon: string }> = {
  started: { label: "Starting analysis...", icon: "1" },
  analyzing: { label: "AI is reading your CV and job description...", icon: "2" },
  scoring_complete: { label: "3 AI models have scored your CV", icon: "3" },
  improving: { label: "Generating improvement advice...", icon: "4" },
  resume_generated: { label: "Creating your improved CV...", icon: "5" },
  jobs_found: { label: "Found relevant jobs for you", icon: "6" },
  complete: { label: "Analysis complete!", icon: "7" },
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
