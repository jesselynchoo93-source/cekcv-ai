import {
  Wrench,
  Briefcase,
  GraduationCap,
  Award,
  ClipboardList,
} from "lucide-react";
import type { DashboardCandidate, BatchInsights, ResumeSnapshot } from "./types";

// ── Name sanitization ──

const PLACEHOLDER_NAME_PATTERNS = [
  /^data\s+tidak/i, /^tidak\s+tersedia/i, /^\[.*kandidat.*\]$/i,
  /^\[.*candidate.*\]$/i, /^\[.*nama.*\]$/i, /^\[.*name.*\]$/i,
  /^n\/a$/i, /^unknown$/i, /^not\s+available/i, /^tidak\s+diketahui/i,
];

function isPlaceholderName(name: string): boolean {
  if (!name || name.trim().length === 0) return true;
  return PLACEHOLDER_NAME_PATTERNS.some((p) => p.test(name.trim()));
}

export function cleanCandidateName(name: string, fileName?: string, rank?: number): string {
  if (!isPlaceholderName(name)) return name;
  if (fileName) {
    const base = fileName.replace(/\.[^.]+$/, "").replace(/[_-]/g, " ").replace(/\s+/g, " ").trim();
    if (base.length > 2) return base;
  }
  return rank ? `Candidate ${rank}` : "";
}

// ── Summary deduplication ──

function wordSet(text: string): Set<string> {
  return new Set(text.toLowerCase().replace(/[^\w\s]/g, "").split(/\s+/).filter(Boolean));
}

function textSimilarity(a: string, b: string): number {
  const setA = wordSet(a);
  const setB = wordSet(b);
  if (setA.size === 0 || setB.size === 0) return 0;
  let overlap = 0;
  for (const w of setA) if (setB.has(w)) overlap++;
  return overlap / Math.max(setA.size, setB.size);
}

export function cleanSummary(text: string): string {
  if (!text) return "";
  if (!text.includes(" | ")) return text;
  return text.split(" | ").map((s) => s.trim()).filter(Boolean).join(" ");
}

/** Deduplicate a list of AI-generated strings (strengths/gaps from 3 models). */
export function deduplicateList(items: string[], threshold = 0.45): string[] {
  const unique: string[] = [];
  for (const item of items) {
    if (!unique.some((u) => textSimilarity(u, item) > threshold)) {
      unique.push(item);
    }
  }
  return unique;
}

export function cleanOneLiner(text: string): string {
  if (!text) return "";
  if (text.includes(" | ")) return text.split(" | ")[0].trim();
  return text;
}

// ── Score styling ──

export function scoreColor(score: number) {
  if (score >= 75) return "text-blue-600 dark:text-blue-400";
  if (score >= 50) return "text-yellow-600 dark:text-yellow-400";
  return "text-red-600 dark:text-red-400";
}

export function scoreBgClass(score: number) {
  if (score >= 75) return "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800/50";
  if (score >= 50) return "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800/50";
  return "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800/50";
}

export function scoreBarColor(score: number) {
  if (score >= 75) return "bg-blue-500";
  if (score >= 50) return "bg-yellow-500";
  return "bg-red-500";
}

export function scoreRingStroke(score: number) {
  if (score >= 75) return "stroke-blue-500";
  if (score >= 50) return "stroke-yellow-500";
  return "stroke-red-500";
}

// ── Status helpers ──

export function statusLabel(status: string, locale: "en" | "id"): string {
  const s = status?.toLowerCase();
  if (s === "shortlist") return locale === "en" ? "Shortlisted" : "Shortlist";
  if (s === "reject") return locale === "en" ? "Rejected" : "Ditolak";
  return locale === "en" ? "Under Review" : "Dalam Review";
}

export function statusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  const s = status?.toLowerCase();
  if (s === "shortlist") return "default";
  if (s === "reject") return "destructive";
  return "secondary";
}

// ── Display helpers ──

export function initials(name: string): string {
  return name.split(" ").filter(Boolean).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

export function yearsOfExperience(exp: ResumeSnapshot["experience"]): string {
  if (!exp?.length) return "";
  const earliest = exp[exp.length - 1];
  const latest = exp[0];
  if (!earliest?.start) return "";
  const startYear = parseInt(earliest.start);
  const endYear = latest?.end?.toLowerCase() === "present" ? new Date().getFullYear() : parseInt(latest?.end || String(new Date().getFullYear()));
  if (isNaN(startYear) || isNaN(endYear)) return "";
  const years = endYear - startYear;
  return years > 0 ? `${years}y` : "";
}

// ── Contact URLs ──

export function whatsappUrl(phone: string, name: string, role: string) {
  const clean = phone.replace(/[^0-9+]/g, "");
  const msg = encodeURIComponent(`Hi ${name}, I'm reaching out regarding the ${role} position. Your profile stood out in our screening — would you be available for a brief chat?`);
  return `https://wa.me/${clean}?text=${msg}`;
}

export function mailtoUrl(email: string, name: string, role: string) {
  const subject = encodeURIComponent(`Interview Invitation — ${role}`);
  const body = encodeURIComponent(`Dear ${name},\n\nThank you for applying for the ${role} position. We were impressed by your profile and would like to invite you for an interview.\n\nPlease let us know your availability for next week.\n\nBest regards`);
  return `mailto:${email}?subject=${subject}&body=${body}`;
}

// ── Export helpers ──

export function generateCSV(candidates: DashboardCandidate[]): string {
  const headers = ["Rank", "Name", "Email", "Phone", "Score", "Must-Have %", "Nice-to-Have %", "Status", "One-Liner", "Summary", "Strengths", "Gaps", "Source File"];
  const esc = (s: string) => `"${(s || "").replace(/"/g, '""')}"`;
  const rows = candidates.map((c, i) => [
    i + 1, esc(c.name), c.email || "", (c.phone || "").replace(/^'/, ""), c.score,
    c.must_match_pct ?? "", c.nice_match_pct ?? "", c.status, esc(cleanOneLiner(c.oneLiner || "")),
    esc(cleanSummary(c.summary)), esc((c.strengths || []).join("; ")), esc((c.gaps || []).join("; ")), esc(c.fileName || ""),
  ]);
  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
}

export async function generateAndDownloadXLSX(
  candidates: DashboardCandidate[],
  role: string,
  insights: BatchInsights | null
): Promise<void> {
  const XLSX = await import("xlsx");
  const wb = XLSX.utils.book_new();

  const data = candidates.map((c, i) => ({
    Rank: i + 1,
    Name: cleanCandidateName(c.name, c.fileName, i + 1),
    Email: c.email || "",
    Phone: (c.phone || "").replace(/^'/, ""),
    Score: c.score,
    "Must-Have %": c.must_match_pct ?? "",
    "Nice-to-Have %": c.nice_match_pct ?? "",
    Status: c.status,
    Summary: cleanSummary(c.summary),
    Strengths: (c.strengths || []).join("; "),
    Gaps: (c.gaps || []).join("; "),
    "Source File": c.fileName || "",
  }));
  const ws = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, "Candidates");

  if (insights) {
    const summary = [
      { Metric: "Total Candidates", Value: insights.totalCandidates },
      { Metric: "Average Score", Value: insights.avgScore },
      { Metric: "Top Score", Value: insights.topScore },
      { Metric: "Shortlisted", Value: insights.shortlisted },
      { Metric: "Under Review", Value: insights.review },
      { Metric: "Rejected", Value: insights.rejected },
      { Metric: "Interview Ready (≥80% must-have)", Value: insights.interviewReady },
    ];
    const ws2 = XLSX.utils.json_to_sheet(summary);
    XLSX.utils.book_append_sheet(wb, ws2, "Summary");
  }

  XLSX.writeFile(wb, `screening-${role.replace(/\s+/g, "-")}.xlsx`);
}

export function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Weight labels ──

export const WEIGHT_LABELS: Record<string, { en: string; id: string; icon: typeof Wrench }> = {
  TechnicalSkills: { en: "Technical Skills", id: "Skill Teknis", icon: Wrench },
  RelevantWorkExperience: { en: "Work Experience", id: "Pengalaman Kerja", icon: Briefcase },
  EducationalBackground: { en: "Education", id: "Pendidikan", icon: GraduationCap },
  Certifications: { en: "Certifications", id: "Sertifikasi", icon: Award },
  LocationOrWorkAuth: { en: "Location / Work Auth", id: "Lokasi / Izin Kerja", icon: ClipboardList },
};

// ── Gap detection ──

const NO_GAP_PATTERNS = [
  /no\s+(significant\s+)?gaps?\s+(were\s+)?(identified|found|detected)/i,
  /meets\s+or\s+exceeds\s+all\s+(stated\s+)?requirements/i,
  /no\s+(notable\s+|major\s+|clear\s+)?gaps/i,
  /tidak\s+ada\s+kekurangan/i,
  /tidak\s+ada\s+gap/i,
  /none\s+identified/i,
  /^none$/i,
  /^n\/a$/i,
  /^-$/,
];

export function isNoGapMessage(gap: string): boolean {
  return NO_GAP_PATTERNS.some((p) => p.test(gap.trim()));
}
