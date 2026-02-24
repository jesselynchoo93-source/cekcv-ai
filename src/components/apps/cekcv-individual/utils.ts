import type { CekCVResult } from "./types";

/** Safely convert any value (string, object, number) to a displayable string */
export function toText(val: unknown): string {
  if (typeof val === "string") return val;
  if (typeof val === "number" || typeof val === "boolean") return String(val);
  if (val && typeof val === "object") {
    const obj = val as Record<string, unknown>;
    const found =
      obj.suggestion || obj.action || obj.text || obj.gap ||
      obj.description || obj.name || obj.keyword || obj.tip;
    if (typeof found === "string") return found;
    return JSON.stringify(val);
  }
  return String(val ?? "");
}

/** Safely ensure a value is an array before calling .map() */
export function asArray(val: unknown): unknown[] {
  return Array.isArray(val) ? val : [];
}

/** Convert raw string arrays with defensive parsing */
function toStringArray(val: unknown): string[] {
  return asArray(val).map(toText);
}

/** Parse raw n8n result into typed CekCVResult with safe defaults */
export function parseResult(raw: Record<string, unknown>): CekCVResult {
  const candidate = (raw.candidate || {}) as Record<string, unknown>;
  const assessment = (raw.current_assessment || {}) as Record<string, unknown>;
  const improvements = (raw.improvements || {}) as Record<string, unknown>;
  const projection = (raw.score_projection || {}) as Record<string, unknown>;
  const jobs = (raw.recommended_jobs || {}) as Record<string, unknown>;
  const resume = (raw.improved_resume || {}) as Record<string, unknown>;
  const scoreBreakdown = asArray(raw.score_breakdown);

  return {
    candidate: {
      name: toText(candidate.name),
      email: toText(candidate.email),
      phone: toText(candidate.phone),
    },
    current_assessment: {
      overall_score: Number(assessment.overall_score) || 0,
      status: toText(assessment.status),
      strengths: toStringArray(assessment.strengths),
      gaps: toStringArray(assessment.gaps),
    },
    score_breakdown: scoreBreakdown.map((raw) => {
      const item = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
      return {
        category: toText(item.category || item.name),
        score: Number(item.score ?? item.value ?? item.weighted_current ?? item.current_score) || 0,
        weighted_current: Number(item.weighted_current) || 0,
        weighted_max: Number(item.weighted_max ?? item.max_score) || 100,
      };
    }),
    score_projection: {
      current_score: Number(projection.current_score) || 0,
      estimated_improved_score: Number(projection.estimated_improved_score) || 0,
      potential_gain: Number(projection.potential_gain) || 0,
      summary: toText(projection.summary),
    },
    improvements: {
      top_3_priority_actions: toStringArray(improvements.top_3_priority_actions),
      missing_keywords: toStringArray(improvements.missing_keywords),
      suggestions: toStringArray(improvements.suggestions),
      ats_formatting_tips: toStringArray(improvements.ats_formatting_tips),
    },
    improved_resume: {
      changes_made: toStringArray(resume.changes_made),
      keywords_added: toStringArray(resume.keywords_added),
      download_url: typeof resume.download_url === "string" ? resume.download_url : undefined,
    },
    recommended_jobs: {
      total_found: Number(jobs.total_found) || 0,
      search_query: toText(jobs.search_query),
      search_location: toText(jobs.search_location),
      jobs: asArray(jobs.jobs).map((raw) => {
        const job = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
        return {
          title: toText(job.title || job.job_title),
          company: toText(job.company || job.company_name),
          location: toText(job.location),
          url: typeof job.url === "string" ? job.url : "",
          match_score: typeof job.match_score === "number" ? job.match_score : undefined,
        };
      }),
    },
    role: toText(raw.role),
  };
}

/** Extract key requirements from a job description for preview */
export function extractJDRequirements(jd: string): string[] {
  const lines = jd.split(/\n/).map((l) => l.trim()).filter(Boolean);
  const requirements: string[] = [];

  for (const line of lines) {
    if (requirements.length >= 8) break;
    // Lines that look like requirements
    if (/^[\u2022\-\*\u25CF\u25CB\u25AA]\s/.test(line) || /^\d+[\.\)]\s/.test(line)) {
      requirements.push(line.replace(/^[\u2022\-\*\u25CF\u25CB\u25AA\d\.)\s]+/, "").trim());
    } else if (/require|must have|experience|proficien|knowledge|skill|qualif|responsibil/i.test(line) && line.length < 200) {
      requirements.push(line);
    }
  }

  // Fallback: if no requirements found, take first few non-empty lines
  if (requirements.length === 0) {
    return lines.slice(0, 6);
  }

  return requirements;
}

/** Format bytes to human readable size */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
