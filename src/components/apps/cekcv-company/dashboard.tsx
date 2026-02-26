"use client";

import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Users,
  ArrowUp,
  ArrowDown,
  Search,
  Download,
  Mail,
  X,
  ChevronDown,
  Check,
  MessageCircle,
  FileText,
  Phone,
  TrendingUp,
  TrendingDown,
  ClipboardList,
  Copy,
  Briefcase,
  GraduationCap,
  Wrench,
  Award,
  AlertTriangle,
  ChevronRight,
  Columns3,
  MapPin,
  Sparkles,
  Target,
  ChevronsRight,
  User,
  Eye,
  EyeOff,
} from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { translations, t } from "@/lib/translations";
import { useAnimatedCounter } from "@/hooks/use-animated-counter";

// ── Types ──

interface ResumeSnapshot {
  personal?: { name?: string; email?: string; phone?: string; location?: string; links?: string[] };
  experience?: { title?: string; company?: string; start?: string; end?: string; highlights?: string[] }[];
  education?: { school?: string; degree?: string; field?: string; gradYear?: string }[];
  skills?: { hard?: string[]; soft?: string[] };
  certifications?: string[];
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
}

interface BatchInsights {
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

type SortField = "score" | "name" | "status" | "must_match_pct";
type SortDir = "asc" | "desc";
type StatusFilter = "all" | "shortlist" | "review" | "reject";

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

function cleanCandidateName(name: string, fileName?: string, rank?: number): string {
  if (!isPlaceholderName(name)) return name;
  if (fileName) {
    const base = fileName.replace(/\.[^.]+$/, "").replace(/[_-]/g, " ").replace(/\s+/g, " ").trim();
    if (base.length > 2) return base;
  }
  return rank ? `Candidate ${rank}` : "";
}

// ── Helpers ──

function scoreColor(score: number) {
  if (score >= 75) return "text-blue-600 dark:text-blue-400";
  if (score >= 50) return "text-yellow-600 dark:text-yellow-400";
  return "text-red-600 dark:text-red-400";
}

function scoreBgClass(score: number) {
  if (score >= 75) return "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800/50";
  if (score >= 50) return "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800/50";
  return "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800/50";
}

function scoreBarColor(score: number) {
  if (score >= 75) return "bg-blue-500";
  if (score >= 50) return "bg-yellow-500";
  return "bg-red-500";
}

function scoreRingStroke(score: number) {
  if (score >= 75) return "stroke-blue-500";
  if (score >= 50) return "stroke-yellow-500";
  return "stroke-red-500";
}

function statusLabel(status: string, locale: "en" | "id"): string {
  const s = status?.toLowerCase();
  if (s === "shortlist") return locale === "en" ? "Shortlisted" : "Shortlist";
  if (s === "reject") return locale === "en" ? "Not Recommended" : "Tidak Direkomendasikan";
  return locale === "en" ? "Under Review" : "Dalam Review";
}

function statusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  const s = status?.toLowerCase();
  if (s === "shortlist") return "default";
  if (s === "reject") return "destructive";
  return "secondary";
}

function initials(name: string): string {
  return name.split(" ").filter(Boolean).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

function whatsappUrl(phone: string, name: string, role: string) {
  const clean = phone.replace(/[^0-9+]/g, "");
  const msg = encodeURIComponent(`Hi ${name}, I'm reaching out regarding the ${role} position. Your profile stood out in our screening — would you be available for a brief chat?`);
  return `https://wa.me/${clean}?text=${msg}`;
}

function mailtoUrl(email: string, name: string, role: string) {
  const subject = encodeURIComponent(`Interview Invitation — ${role}`);
  const body = encodeURIComponent(`Dear ${name},\n\nThank you for applying for the ${role} position. We were impressed by your profile and would like to invite you for an interview.\n\nPlease let us know your availability for next week.\n\nBest regards`);
  return `mailto:${email}?subject=${subject}&body=${body}`;
}

function generateCSV(candidates: DashboardCandidate[]): string {
  const headers = ["Rank", "Name", "Email", "Phone", "Score", "Must-Have %", "Nice-to-Have %", "Status", "One-Liner", "Summary", "Strengths", "Gaps", "Source File"];
  const esc = (s: string) => `"${(s || "").replace(/"/g, '""')}"`;
  const rows = candidates.map((c, i) => [
    i + 1, esc(c.name), c.email || "", (c.phone || "").replace(/^'/, ""), c.score,
    c.must_match_pct ?? "", c.nice_match_pct ?? "", c.status, esc(c.oneLiner || ""),
    esc(c.summary), esc((c.strengths || []).join("; ")), esc((c.gaps || []).join("; ")), esc(c.fileName || ""),
  ]);
  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
}

function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function yearsOfExperience(exp: ResumeSnapshot["experience"]): string {
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

const WEIGHT_LABELS: Record<string, { en: string; id: string; icon: typeof Wrench }> = {
  TechnicalSkills: { en: "Technical Skills", id: "Skill Teknis", icon: Wrench },
  RelevantWorkExperience: { en: "Work Experience", id: "Pengalaman Kerja", icon: Briefcase },
  EducationalBackground: { en: "Education", id: "Pendidikan", icon: GraduationCap },
  Certifications: { en: "Certifications", id: "Sertifikasi", icon: Award },
  LocationOrWorkAuth: { en: "Location / Work Auth", id: "Lokasi / Izin Kerja", icon: ClipboardList },
};

// ── Animated Stat ──

function AnimatedStat({ value, className }: { value: number; className?: string }) {
  const animated = useAnimatedCounter(value);
  return <span className={className}>{animated}</span>;
}

// ── Score Ring (mini SVG donut) ──

function ScoreRing({ score, size = 44 }: { score: number; size?: number }) {
  const animated = useAnimatedCounter(score);
  const strokeWidth = 3.5;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (circumference * Math.min(score, 100)) / 100;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" strokeWidth={strokeWidth}
          className="stroke-muted/40"
        />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" strokeWidth={strokeWidth}
          className={scoreRingStroke(score)}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1.2s ease-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-sm font-bold leading-none ${scoreColor(score)}`}>{animated}</span>
      </div>
    </div>
  );
}

// ── Batch Overview ──

function BatchOverview({
  candidates,
  insights,
  role,
  locale,
}: {
  candidates: DashboardCandidate[];
  insights: BatchInsights | null;
  role: string;
  locale: "en" | "id";
}) {
  const total = candidates.length;
  const shortlisted = insights?.shortlisted ?? candidates.filter((c) => c.status?.toLowerCase() === "shortlist").length;
  const review = insights?.review ?? candidates.filter((c) => c.status?.toLowerCase() === "review").length;
  const rejected = insights?.rejected ?? candidates.filter((c) => c.status?.toLowerCase() === "reject").length;
  const avgScore = insights?.avgScore ?? (total ? Math.round(candidates.reduce((s, c) => s + (c.score || 0), 0) / total) : 0);
  const topScore = insights?.topScore ?? (total ? Math.max(...candidates.map((c) => c.score || 0)) : 0);
  const interviewReady = insights?.interviewReady ?? candidates.filter((c) => (c.must_match_pct || 0) >= 80).length;
  const topGaps = insights?.topGaps ?? [];

  const dist = { high: 0, mid: 0, low: 0 };
  candidates.forEach((c) => {
    if (c.score >= 75) dist.high++;
    else if (c.score >= 50) dist.mid++;
    else dist.low++;
  });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {locale === "en" ? "Screening Results" : "Hasil Screening"}
        </h1>
        <p className="mt-1 text-muted-foreground">
          <span className="font-medium text-foreground">{role}</span>
          <span className="mx-2 text-muted-foreground/50">|</span>
          {total} {locale === "en" ? "candidates screened by 3 AI models" : "kandidat discreening oleh 3 model AI"}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {/* Score distribution */}
        <div className="rounded-xl border bg-card p-4">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            {locale === "en" ? "Score Distribution" : "Distribusi Skor"}
          </p>
          <div className="mt-2 flex items-end gap-1" style={{ height: 32 }}>
            {[
              { count: dist.high, color: "bg-blue-500", label: "75+" },
              { count: dist.mid, color: "bg-yellow-500", label: "50-74" },
              { count: dist.low, color: "bg-red-400", label: "<50" },
            ].map((bucket, i) => {
              const pct = total ? (bucket.count / total) * 100 : 0;
              return (
                <div key={i} className="flex flex-1 flex-col items-center gap-0.5">
                  <span className="text-[10px] font-medium">{bucket.count}</span>
                  <div className={`w-full rounded-sm ${bucket.color}`} style={{ height: `${Math.max(pct, 8)}%` }} />
                </div>
              );
            })}
          </div>
          <div className="mt-1 flex text-[9px] text-muted-foreground">
            <span className="flex-1 text-center">75+</span>
            <span className="flex-1 text-center">50-74</span>
            <span className="flex-1 text-center">&lt;50</span>
          </div>
        </div>

        {/* Avg Score */}
        <div className="rounded-xl border bg-card p-4">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            {locale === "en" ? "Avg. Score" : "Rata-rata Skor"}
          </p>
          <p className={`mt-1 text-3xl font-bold ${scoreColor(avgScore)}`}>
            <AnimatedStat value={avgScore} />
          </p>
          <p className="text-[11px] text-muted-foreground">
            {locale === "en" ? `best: ${topScore}` : `terbaik: ${topScore}`}
          </p>
        </div>

        {/* Shortlisted */}
        <div className="rounded-xl border bg-card p-4">
          <p className="text-[11px] font-medium uppercase tracking-wider text-blue-600 dark:text-blue-400">
            {locale === "en" ? "Shortlisted" : "Shortlist"}
          </p>
          <p className="mt-1 text-3xl font-bold text-blue-600 dark:text-blue-400">
            <AnimatedStat value={shortlisted} />
          </p>
          <p className="text-[11px] text-muted-foreground">
            {review} {locale === "en" ? "review" : "review"} · {rejected} {locale === "en" ? "reject" : "tolak"}
          </p>
        </div>

        {/* Interview Ready */}
        <div className="rounded-xl border bg-card p-4">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            {locale === "en" ? "Interview Ready" : "Siap Interview"}
          </p>
          <p className="mt-1 text-3xl font-bold">
            <AnimatedStat value={interviewReady} />
          </p>
          <p className="text-[11px] text-muted-foreground">
            {locale === "en" ? "≥80% must-have match" : "≥80% syarat wajib"}
          </p>
        </div>
      </div>

      {/* Common gaps insight */}
      {topGaps.length > 0 && (
        <div className="flex items-start gap-2 rounded-lg border border-yellow-200 bg-yellow-50/50 p-3 text-sm dark:border-yellow-900/50 dark:bg-yellow-950/20">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-yellow-600 dark:text-yellow-400" />
          <div>
            <span className="font-medium">
              {locale === "en" ? "Most common skill gaps: " : "Skill gap paling umum: "}
            </span>
            {topGaps.map((g, i) => (
              <span key={i}>
                {i > 0 && ", "}
                <span className="text-muted-foreground">{g.gap}</span>
                <span className="text-xs text-muted-foreground/60"> ({g.count}/{total})</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Next Steps Action Bar ──

function NextSteps({
  candidates,
  insights,
  locale,
  onFilter,
  onJumpToCandidate,
  onExportCSV,
}: {
  candidates: DashboardCandidate[];
  insights: BatchInsights | null;
  locale: "en" | "id";
  onFilter: (filter: StatusFilter) => void;
  onJumpToCandidate: (idx: number) => void;
  onExportCSV: () => void;
}) {
  const shortlisted = insights?.shortlisted ?? candidates.filter((c) => c.status?.toLowerCase() === "shortlist").length;
  const topGaps = insights?.topGaps ?? [];
  const topCandidate = candidates[0];

  if (!topCandidate) return null;

  const steps: { icon: typeof Target; text: string; action: () => void; actionLabel: string }[] = [];

  if (shortlisted > 0) {
    steps.push({
      icon: Target,
      text: locale === "en"
        ? `Review ${shortlisted} shortlisted candidate${shortlisted > 1 ? "s" : ""}`
        : `Review ${shortlisted} kandidat shortlist`,
      action: () => onFilter("shortlist"),
      actionLabel: locale === "en" ? "View" : "Lihat",
    });
  }

  if (topGaps.length > 0) {
    const gap = topGaps[0];
    steps.push({
      icon: AlertTriangle,
      text: locale === "en"
        ? `Common gap: "${gap.gap}" (${gap.count}/${candidates.length})`
        : `Gap umum: "${gap.gap}" (${gap.count}/${candidates.length})`,
      action: () => onFilter("all"),
      actionLabel: locale === "en" ? "Details" : "Detail",
    });
  }

  steps.push({
    icon: Download,
    text: locale === "en"
      ? "Export shortlist for hiring manager"
      : "Ekspor shortlist untuk hiring manager",
    action: onExportCSV,
    actionLabel: locale === "en" ? "CSV" : "CSV",
  });

  if (topCandidate.email) {
    steps.push({
      icon: Mail,
      text: locale === "en"
        ? `Reach out to top candidate: ${cleanCandidateName(topCandidate.name, topCandidate.fileName, 1)}`
        : `Hubungi kandidat terbaik: ${cleanCandidateName(topCandidate.name, topCandidate.fileName, 1)}`,
      action: () => onJumpToCandidate(0),
      actionLabel: locale === "en" ? "Contact" : "Kontak",
    });
  }

  return (
    <div className="rounded-xl border bg-gradient-to-r from-blue-50/50 to-purple-50/50 p-4 dark:from-blue-950/20 dark:to-purple-950/20 print:hidden">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
        <Sparkles className="h-4 w-4 text-blue-500" />
        {locale === "en" ? "Suggested Next Steps" : "Langkah Selanjutnya"}
      </h3>
      <div className="grid gap-2 sm:grid-cols-2">
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <button
              key={i}
              onClick={step.action}
              className="flex items-center gap-3 rounded-lg border bg-card/80 px-3 py-2.5 text-left text-sm transition-all hover:bg-card hover:shadow-sm"
            >
              <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="flex-1 text-muted-foreground">{step.text}</span>
              <span className="shrink-0 flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400">
                {step.actionLabel}
                <ChevronsRight className="h-3 w-3" />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Candidate Row (collapsed) ──

function CandidateRow({
  c,
  rank,
  index,
  locale,
  isExpanded,
  isComparing,
  onToggleExpand,
  onToggleCompare,
  onStatusChange,
}: {
  c: DashboardCandidate;
  rank: number;
  index: number;
  locale: "en" | "id";
  isExpanded: boolean;
  isComparing: boolean;
  onToggleExpand: () => void;
  onToggleCompare: () => void;
  onStatusChange: (newStatus: string) => void;
}) {
  const name = cleanCandidateName(c.name, c.fileName, rank);

  return (
    <div
      className={`group rounded-xl border bg-card transition-all hover:shadow-sm animate-in fade-in-0 slide-in-from-bottom-2 ${
        isExpanded ? "ring-1 ring-ring/20" : ""
      } ${isComparing ? "ring-2 ring-blue-500/40" : ""}`}
      style={{ animationDelay: `${index * 60}ms`, animationFillMode: "backwards" }}
    >
      {/* Main row */}
      <div
        role="button"
        tabIndex={0}
        onClick={onToggleExpand}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onToggleExpand(); } }}
        className="flex w-full items-center gap-2 p-3 text-left transition-colors cursor-pointer sm:gap-3 sm:p-4"
      >
        {/* Compare checkbox */}
        <div
          role="checkbox"
          aria-checked={isComparing}
          tabIndex={0}
          onClick={(e) => { e.stopPropagation(); onToggleCompare(); }}
          onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") { e.stopPropagation(); e.preventDefault(); onToggleCompare(); } }}
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border text-xs transition-colors cursor-pointer ${
            isComparing ? "border-blue-500 bg-blue-500 text-white" : "border-muted-foreground/25 hover:border-muted-foreground/50"
          }`}
        >
          {isComparing && <Check className="h-3 w-3" />}
        </div>

        {/* Rank */}
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg cekcv-gradient text-xs font-bold text-white">
          {rank}
        </span>

        {/* Avatar */}
        <div className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground sm:flex">
          {initials(name)}
        </div>

        {/* Name + oneliner */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-semibold">{name}</span>
            <StatusBadge status={c.status} locale={locale} onStatusChange={onStatusChange} />
          </div>
          {c.oneLiner ? (
            <p className="mt-0.5 truncate text-xs text-muted-foreground">{c.oneLiner}</p>
          ) : c.email ? (
            <p className="mt-0.5 truncate text-xs text-muted-foreground">{c.email}</p>
          ) : null}
        </div>

        {/* Must-have % */}
        {c.must_match_pct != null && (
          <div className="hidden shrink-0 text-center sm:block" style={{ minWidth: 56 }}>
            <p className="text-sm font-semibold">{c.must_match_pct}%</p>
            <p className="text-[9px] uppercase text-muted-foreground">{locale === "en" ? "Must" : "Wajib"}</p>
          </div>
        )}

        {/* Nice-to-have % */}
        {c.nice_match_pct != null && (
          <div className="hidden shrink-0 text-center lg:block" style={{ minWidth: 56 }}>
            <p className="text-sm font-semibold">{c.nice_match_pct}%</p>
            <p className="text-[9px] uppercase text-muted-foreground">{locale === "en" ? "Nice" : "Plus"}</p>
          </div>
        )}

        {/* Score ring */}
        <ScoreRing score={c.score} />

        {/* Expand indicator */}
        <ChevronRight className={`h-4 w-4 shrink-0 text-muted-foreground/50 transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`} />
      </div>
    </div>
  );
}

// ── Editable Status Badge ──

function StatusBadge({
  status,
  locale,
  onStatusChange,
}: {
  status: string;
  locale: "en" | "id";
  onStatusChange: (newStatus: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const options = ["shortlist", "review", "reject"];
  const current = status?.toLowerCase() || "review";

  return (
    <div className="relative">
      <button onClick={(e) => { e.stopPropagation(); setOpen(!open); }} className="group/badge">
        <Badge variant={statusVariant(current)} className="cursor-pointer text-[10px] px-1.5 py-0 transition-opacity group-hover/badge:opacity-80">
          {statusLabel(current, locale)}
          <ChevronDown className="ml-0.5 h-2.5 w-2.5" />
        </Badge>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setOpen(false); }} />
          <div className="absolute left-0 top-full z-50 mt-1 rounded-lg border bg-popover p-1 shadow-md" onClick={(e) => e.stopPropagation()}>
            {options.map((opt) => (
              <button key={opt} onClick={() => { onStatusChange(opt); setOpen(false); }}
                className={`flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-xs hover:bg-muted ${current === opt ? "font-semibold" : ""}`}>
                {current === opt && <Check className="h-3 w-3" />}
                <Badge variant={statusVariant(opt)} className="text-[10px] px-1.5 py-0">{statusLabel(opt, locale)}</Badge>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── Candidate Detail Panel (Tabbed) ──

function CandidateDetail({
  c,
  rank,
  role,
  locale,
}: {
  c: DashboardCandidate;
  rank: number;
  role: string;
  locale: "en" | "id";
}) {
  const f = translations.companyForm;
  const name = cleanCandidateName(c.name, c.fileName, rank);
  const resume = c.resume || {};
  const weights = c.weights || {};
  const hasWeights = Object.keys(weights).length > 0;
  const yoe = yearsOfExperience(resume.experience);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showAllStrengths, setShowAllStrengths] = useState(false);
  const [showAllGaps, setShowAllGaps] = useState(false);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1500);
  };

  const visibleStrengths = showAllStrengths ? c.strengths : c.strengths?.slice(0, 5);
  const hiddenStrengthCount = Math.max(0, (c.strengths?.length || 0) - 5);
  const visibleGaps = showAllGaps ? c.gaps : c.gaps?.slice(0, 3);
  const hiddenGapCount = Math.max(0, (c.gaps?.length || 0) - 3);

  return (
    <div className="border-t bg-muted/5 px-4 py-5 animate-in fade-in-0 slide-in-from-top-2 duration-300 sm:px-5">
      <Tabs defaultValue="summary" className="gap-0">
        <TabsList className="mb-4 w-full sm:w-auto">
          <TabsTrigger value="summary" className="gap-1.5 text-xs">
            <Sparkles className="h-3.5 w-3.5" />
            {locale === "en" ? "Summary" : "Ringkasan"}
          </TabsTrigger>
          <TabsTrigger value="scores" className="gap-1.5 text-xs">
            <Target className="h-3.5 w-3.5" />
            {locale === "en" ? "Scores" : "Skor"}
          </TabsTrigger>
          <TabsTrigger value="profile" className="gap-1.5 text-xs">
            <User className="h-3.5 w-3.5" />
            {locale === "en" ? "Profile" : "Profil"}
          </TabsTrigger>
        </TabsList>

        {/* ── Summary Tab ── */}
        <TabsContent value="summary" className="animate-in fade-in-0 slide-in-from-bottom-1 duration-200">
          <div className="space-y-4">
            {/* One-liner verdict */}
            {c.oneLiner && (
              <div className="rounded-lg border-l-4 border-l-blue-500 bg-blue-50/30 p-4 dark:bg-blue-950/10">
                <p className="text-sm font-medium leading-relaxed">{c.oneLiner}</p>
              </div>
            )}

            {/* Quick scores inline */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <ScoreRing score={c.score} size={36} />
                <div>
                  <p className="text-xs font-semibold">{t(f.overall, locale)}</p>
                </div>
              </div>
              {c.must_match_pct != null && (
                <div className="flex items-center gap-2">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold border ${scoreBgClass(c.must_match_pct)}`}>
                    <span className={scoreColor(c.must_match_pct)}>{c.must_match_pct}%</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{t(f.mustHave, locale)}</p>
                </div>
              )}
              {c.nice_match_pct != null && (
                <div className="flex items-center gap-2">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold border ${scoreBgClass(c.nice_match_pct)}`}>
                    <span className={scoreColor(c.nice_match_pct)}>{c.nice_match_pct}%</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{t(f.niceToHave, locale)}</p>
                </div>
              )}
              {/* Quick action buttons */}
              <div className="ml-auto flex gap-2 print:hidden">
                {c.email && (
                  <a href={mailtoUrl(c.email, name, role)} onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors">
                    <Mail className="h-3.5 w-3.5" /> {locale === "en" ? "Invite" : "Undang"}
                  </a>
                )}
                {c.phone && !c.phone.startsWith("#ERROR") && (
                  <a href={whatsappUrl(c.phone, name, role)} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium text-green-600 hover:bg-green-50 dark:hover:bg-green-950/30 transition-colors">
                    <MessageCircle className="h-3.5 w-3.5" /> WA
                  </a>
                )}
              </div>
            </div>

            {/* Strengths & Gaps side by side */}
            <div className="grid gap-3 sm:grid-cols-2">
              {/* Strengths */}
              {visibleStrengths && visibleStrengths.length > 0 && (
                <div className="rounded-lg border border-blue-200/50 bg-blue-50/30 p-4 dark:border-blue-900/30 dark:bg-blue-950/10">
                  <h4 className="mb-2.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-400">
                    <TrendingUp className="h-3.5 w-3.5" />
                    {t(f.strengths, locale)} ({c.strengths.length})
                  </h4>
                  <div className="space-y-1.5">
                    {visibleStrengths.map((s, j) => (
                      <div key={j} className="flex items-start gap-2 text-xs animate-in fade-in-0" style={{ animationDelay: `${j * 30}ms`, animationFillMode: "backwards" }}>
                        <Check className="mt-0.5 h-3 w-3 shrink-0 text-blue-500" />
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                  {hiddenStrengthCount > 0 && (
                    <button onClick={() => setShowAllStrengths(!showAllStrengths)}
                      className="mt-2 flex items-center gap-1 text-[11px] font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400">
                      {showAllStrengths ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      {showAllStrengths
                        ? (locale === "en" ? "Show less" : "Lebih sedikit")
                        : (locale === "en" ? `+${hiddenStrengthCount} more` : `+${hiddenStrengthCount} lagi`)}
                    </button>
                  )}
                </div>
              )}

              {/* Gaps */}
              {visibleGaps && visibleGaps.length > 0 && (
                <div className="rounded-lg border border-red-200/50 bg-red-50/30 p-4 dark:border-red-900/30 dark:bg-red-950/10">
                  <h4 className="mb-2.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-red-700 dark:text-red-400">
                    <TrendingDown className="h-3.5 w-3.5" />
                    {t(f.gaps, locale)} ({c.gaps.length})
                  </h4>
                  <div className="space-y-1.5">
                    {visibleGaps.map((g, j) => (
                      <div key={j} className="flex items-start gap-2 text-xs animate-in fade-in-0" style={{ animationDelay: `${j * 30}ms`, animationFillMode: "backwards" }}>
                        <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0 text-red-500" />
                        <span>{g}</span>
                        {j === 0 && (c.must_match_pct ?? 100) < 80 && (
                          <Badge variant="destructive" className="ml-auto shrink-0 text-[9px] px-1 py-0">
                            {locale === "en" ? "KEY" : "UTAMA"}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                  {hiddenGapCount > 0 && (
                    <button onClick={() => setShowAllGaps(!showAllGaps)}
                      className="mt-2 flex items-center gap-1 text-[11px] font-medium text-red-600 hover:text-red-700 dark:text-red-400">
                      {showAllGaps ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      {showAllGaps
                        ? (locale === "en" ? "Show less" : "Lebih sedikit")
                        : (locale === "en" ? `+${hiddenGapCount} more` : `+${hiddenGapCount} lagi`)}
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Collapsible full AI assessment */}
            {c.summary && (
              <Collapsible>
                <CollapsibleTrigger className="flex w-full items-center gap-2 rounded-lg border px-4 py-2.5 text-xs font-medium text-muted-foreground hover:bg-muted/50 transition-colors">
                  <FileText className="h-3.5 w-3.5" />
                  {locale === "en" ? "Full AI Assessment" : "Penilaian AI Lengkap"}
                  <ChevronDown className="ml-auto h-3.5 w-3.5 transition-transform [[data-state=open]>&]:rotate-180" />
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-3">
                  <div className="rounded-lg border bg-card p-4">
                    <p className="text-sm leading-relaxed text-muted-foreground">{c.summary}</p>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )}
          </div>
        </TabsContent>

        {/* ── Scores Tab ── */}
        <TabsContent value="scores" className="animate-in fade-in-0 slide-in-from-bottom-1 duration-200">
          <div className="space-y-4">
            {/* Score breakdown */}
            <div className="grid gap-3 sm:grid-cols-3">
              <div className={`rounded-lg border p-4 text-center ${scoreBgClass(c.score)}`}>
                <p className={`text-3xl font-bold ${scoreColor(c.score)}`}>
                  <AnimatedStat value={c.score} />
                </p>
                <p className="text-[11px] text-muted-foreground">{t(f.overall, locale)}</p>
              </div>
              {c.must_match_pct != null && (
                <div className="rounded-lg border bg-card p-4 text-center">
                  <p className="text-3xl font-bold">
                    <AnimatedStat value={c.must_match_pct} />%
                  </p>
                  <p className="text-[11px] text-muted-foreground">{t(f.mustHave, locale)}</p>
                  <div className="mt-2 h-2 w-full rounded-full bg-muted">
                    <div className={`h-full rounded-full transition-all duration-1000 ${scoreBarColor(c.must_match_pct)}`} style={{ width: `${c.must_match_pct}%` }} />
                  </div>
                </div>
              )}
              {c.nice_match_pct != null && (
                <div className="rounded-lg border bg-card p-4 text-center">
                  <p className="text-3xl font-bold">
                    <AnimatedStat value={c.nice_match_pct} />%
                  </p>
                  <p className="text-[11px] text-muted-foreground">{t(f.niceToHave, locale)}</p>
                  <div className="mt-2 h-2 w-full rounded-full bg-muted">
                    <div className={`h-full rounded-full transition-all duration-1000 ${scoreBarColor(c.nice_match_pct)}`} style={{ width: `${c.nice_match_pct}%` }} />
                  </div>
                </div>
              )}
            </div>

            {/* Priority weight breakdown */}
            {hasWeights && (
              <div className="rounded-lg border bg-card p-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {locale === "en" ? "Scoring Priorities" : "Prioritas Penilaian"}
                </p>
                <div className="space-y-2.5">
                  {Object.entries(weights)
                    .sort(([, a], [, b]) => (b as number) - (a as number))
                    .map(([key, weight]) => {
                      const label = WEIGHT_LABELS[key];
                      const Icon = label?.icon || ClipboardList;
                      const w = weight as number;
                      return (
                        <div key={key} className="flex items-center gap-3">
                          <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-medium">{label ? (locale === "en" ? label.en : label.id) : key}</span>
                              <span className="font-bold">{w}/10</span>
                            </div>
                            <div className="mt-1 h-1.5 w-full rounded-full bg-muted">
                              <div
                                className={`h-full rounded-full transition-all duration-1000 ${w >= 7 ? "bg-blue-500" : w >= 4 ? "bg-yellow-500" : "bg-gray-400"}`}
                                style={{ width: `${(w / 10) * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        {/* ── Profile Tab ── */}
        <TabsContent value="profile" className="animate-in fade-in-0 slide-in-from-bottom-1 duration-200">
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Contact card */}
            <div className="rounded-lg border bg-card p-4">
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {locale === "en" ? "Contact" : "Kontak"}
              </h4>
              <div className="space-y-2.5">
                {c.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    <span className="flex-1 truncate text-sm">{c.email}</span>
                    <button onClick={() => copyToClipboard(c.email, "email")} className="rounded p-1 hover:bg-muted" title="Copy">
                      {copiedField === "email" ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3 text-muted-foreground" />}
                    </button>
                  </div>
                )}
                {c.phone && !c.phone.startsWith("#ERROR") && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    <span className="flex-1 text-sm">{c.phone.replace(/^'/, "")}</span>
                    <button onClick={() => copyToClipboard(c.phone!.replace(/^'/, ""), "phone")} className="rounded p-1 hover:bg-muted" title="Copy">
                      {copiedField === "phone" ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3 text-muted-foreground" />}
                    </button>
                  </div>
                )}
                {resume.personal?.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{resume.personal.location}</span>
                  </div>
                )}
              </div>
              <div className="mt-3 flex gap-2">
                {c.email && (
                  <a href={mailtoUrl(c.email, name, role)} className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border py-2 text-xs font-medium hover:bg-muted transition-colors" onClick={(e) => e.stopPropagation()}>
                    <Mail className="h-3.5 w-3.5" /> {locale === "en" ? "Invite" : "Undang"}
                  </a>
                )}
                {c.phone && !c.phone.startsWith("#ERROR") && (
                  <a href={whatsappUrl(c.phone, name, role)} target="_blank" rel="noopener noreferrer" className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border py-2 text-xs font-medium text-green-600 hover:bg-green-50 dark:hover:bg-green-950/30 transition-colors" onClick={(e) => e.stopPropagation()}>
                    <MessageCircle className="h-3.5 w-3.5" /> WA
                  </a>
                )}
              </div>
            </div>

            {/* Resume Snapshot */}
            <div className="space-y-4">
              {(resume.experience?.length || resume.education?.length || resume.skills?.hard?.length) && (
                <div className="rounded-lg border bg-card p-4">
                  <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {locale === "en" ? "Resume Snapshot" : "Ringkasan CV"}
                  </h4>
                  <div className="space-y-3">
                    {resume.experience?.[0] && (
                      <div className="flex gap-2">
                        <Briefcase className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                        <div className="text-sm">
                          <p className="font-medium">{resume.experience[0].title}</p>
                          <p className="text-xs text-muted-foreground">
                            {resume.experience[0].company}
                            {resume.experience[0].start && ` · ${resume.experience[0].start}`}
                            {resume.experience[0].end && `–${resume.experience[0].end}`}
                          </p>
                          {yoe && <p className="text-[10px] text-muted-foreground">{yoe} {locale === "en" ? "total experience" : "total pengalaman"}</p>}
                        </div>
                      </div>
                    )}
                    {resume.education?.[0] && (
                      <div className="flex gap-2">
                        <GraduationCap className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                        <div className="text-sm">
                          <p className="font-medium">{resume.education[0].degree} {resume.education[0].field && `in ${resume.education[0].field}`}</p>
                          <p className="text-xs text-muted-foreground">{resume.education[0].school} {resume.education[0].gradYear && `· ${resume.education[0].gradYear}`}</p>
                        </div>
                      </div>
                    )}
                    {(resume.skills?.hard?.length || 0) > 0 && (
                      <div className="flex gap-2">
                        <Wrench className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                        <TooltipProvider>
                          <div className="flex flex-wrap gap-1">
                            {resume.skills!.hard!.slice(0, 8).map((s, i) => (
                              <Tooltip key={i}>
                                <TooltipTrigger asChild>
                                  <span className="cursor-default rounded-full border bg-muted/40 px-2 py-0.5 text-[10px] transition-colors hover:bg-muted">{s}</span>
                                </TooltipTrigger>
                                <TooltipContent>{locale === "en" ? "Hard skill" : "Skill teknis"}</TooltipContent>
                              </Tooltip>
                            ))}
                            {(resume.skills!.hard!.length || 0) > 8 && (
                              <span className="text-[10px] text-muted-foreground">+{resume.skills!.hard!.length - 8}</span>
                            )}
                          </div>
                        </TooltipProvider>
                      </div>
                    )}
                    {(resume.certifications?.length || 0) > 0 && (
                      <div className="flex gap-2">
                        <Award className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">
                          {resume.certifications!.slice(0, 3).join(", ")}
                          {(resume.certifications!.length || 0) > 3 && ` +${resume.certifications!.length - 3}`}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Source file */}
              {c.fileName && (
                <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <FileText className="h-3 w-3" />
                  {c.fileName}
                </p>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ── Compare View ──

function CompareView({
  candidates,
  role,
  locale,
  onBack,
}: {
  candidates: DashboardCandidate[];
  role: string;
  locale: "en" | "id";
  onBack: () => void;
}) {
  const f = translations.companyForm;

  const allSkillSets = candidates.map((c) => new Set([...(c.resume?.skills?.hard || []), ...(c.strengths || [])]));
  const sharedSkills = allSkillSets.length >= 2
    ? [...allSkillSets[0]].filter((s) => allSkillSets.every((set) => set.has(s))).slice(0, 6)
    : [];

  // Find best score for highlighting
  const bestScore = Math.max(...candidates.map((c) => c.score || 0));
  const bestMust = Math.max(...candidates.map((c) => c.must_match_pct || 0));
  const bestNice = Math.max(...candidates.map((c) => c.nice_match_pct || 0));

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">{t(f.compareCandidates, locale)}</h2>
          <p className="text-sm text-muted-foreground">{role} · {candidates.length} {locale === "en" ? "candidates" : "kandidat"}</p>
        </div>
        <Button variant="outline" size="sm" onClick={onBack}>
          <X className="mr-1.5 h-3.5 w-3.5" />
          {t(f.backToList, locale)}
        </Button>
      </div>

      {/* Shared skills */}
      {sharedSkills.length > 0 && (
        <div className="rounded-lg border bg-blue-50/50 p-3 text-sm dark:bg-blue-950/20">
          <span className="font-medium">{locale === "en" ? "Shared skills: " : "Skill bersama: "}</span>
          {sharedSkills.map((s, i) => (
            <span key={i}>{i > 0 && ", "}<span className="text-muted-foreground">{s}</span></span>
          ))}
        </div>
      )}

      {/* Comparison grid */}
      <div className={`grid gap-4 ${candidates.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3"}`}>
        {candidates.map((c, i) => {
          const name = cleanCandidateName(c.name, c.fileName, i + 1);
          const resume = c.resume || {};
          const uniqueSkills = allSkillSets[i] ? [...allSkillSets[i]].filter((s) => !sharedSkills.includes(s)).slice(0, 5) : [];
          const isBestScore = c.score === bestScore;
          return (
            <Card key={i} className={`overflow-hidden animate-in fade-in-0 slide-in-from-bottom-2 ${isBestScore ? "ring-2 ring-blue-500/30" : ""}`}
              style={{ animationDelay: `${i * 80}ms`, animationFillMode: "backwards" }}>
              {isBestScore && (
                <div className="bg-blue-500 px-3 py-1 text-center text-[10px] font-semibold text-white">
                  {locale === "en" ? "TOP CANDIDATE" : "KANDIDAT TERBAIK"}
                </div>
              )}
              <CardContent className="space-y-4 p-5">
                {/* Header */}
                <div className="text-center">
                  <div className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-muted text-sm font-semibold">{initials(name)}</div>
                  <h3 className="font-semibold">{name}</h3>
                  <Badge variant={statusVariant(c.status)} className="mt-1 text-[10px]">{statusLabel(c.status, locale)}</Badge>
                </div>

                {/* Score ring */}
                <div className="flex justify-center">
                  <ScoreRing score={c.score} size={64} />
                </div>

                {/* Score bars with winner highlighting */}
                <div className="space-y-2">
                  {c.must_match_pct != null && (
                    <div>
                      <div className="flex justify-between text-[10px]">
                        <span className="text-muted-foreground">{t(f.mustHave, locale)}</span>
                        <span className={`font-semibold ${c.must_match_pct === bestMust ? "text-blue-600 dark:text-blue-400" : ""}`}>{c.must_match_pct}%</span>
                      </div>
                      <div className="mt-0.5 h-2 rounded-full bg-muted">
                        <div className={`h-full rounded-full transition-all duration-1000 ${scoreBarColor(c.must_match_pct)}`} style={{ width: `${c.must_match_pct}%` }} />
                      </div>
                    </div>
                  )}
                  {c.nice_match_pct != null && (
                    <div>
                      <div className="flex justify-between text-[10px]">
                        <span className="text-muted-foreground">{t(f.niceToHave, locale)}</span>
                        <span className={`font-semibold ${c.nice_match_pct === bestNice ? "text-blue-600 dark:text-blue-400" : ""}`}>{c.nice_match_pct}%</span>
                      </div>
                      <div className="mt-0.5 h-2 rounded-full bg-muted">
                        <div className={`h-full rounded-full transition-all duration-1000 ${scoreBarColor(c.nice_match_pct)}`} style={{ width: `${c.nice_match_pct}%` }} />
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Resume quick-view */}
                {resume.experience?.[0] && (
                  <div className="text-sm">
                    <p className="font-medium">{resume.experience[0].title}</p>
                    <p className="text-xs text-muted-foreground">{resume.experience[0].company}</p>
                  </div>
                )}

                {/* Strengths */}
                {c.strengths?.length > 0 && (
                  <div>
                    <p className="mb-1 text-[10px] font-semibold uppercase text-blue-700 dark:text-blue-400">{t(f.strengths, locale)}</p>
                    <div className="flex flex-wrap gap-1">
                      {c.strengths.slice(0, 4).map((s, j) => (
                        <span key={j} className="rounded border border-blue-200 bg-blue-50 px-1.5 py-0.5 text-[10px] dark:border-blue-800 dark:bg-blue-900/30">{s}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Gaps */}
                {c.gaps?.length > 0 && (
                  <div>
                    <p className="mb-1 text-[10px] font-semibold uppercase text-red-700 dark:text-red-400">{t(f.gaps, locale)}</p>
                    <div className="flex flex-wrap gap-1">
                      {c.gaps.slice(0, 4).map((g, j) => (
                        <span key={j} className="rounded border border-red-200 bg-red-50 px-1.5 py-0.5 text-[10px] dark:border-red-800 dark:bg-red-900/30">{g}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Unique skills */}
                {uniqueSkills.length > 0 && (
                  <div>
                    <p className="mb-1 text-[10px] font-semibold uppercase text-blue-700 dark:text-blue-400">
                      {locale === "en" ? "Unique Skills" : "Skill Unik"}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {uniqueSkills.map((s, j) => (
                        <span key={j} className="rounded border border-blue-200 bg-blue-50 px-1.5 py-0.5 text-[10px] dark:border-blue-800 dark:bg-blue-900/30">{s}</span>
                      ))}
                    </div>
                  </div>
                )}

                <Separator />

                {/* Contact */}
                <div className="flex gap-2">
                  {c.email && (
                    <a href={mailtoUrl(c.email, name, role)} className="flex flex-1 items-center justify-center gap-1 rounded-lg border py-1.5 text-xs hover:bg-muted">
                      <Mail className="h-3 w-3" /> {locale === "en" ? "Email" : "Email"}
                    </a>
                  )}
                  {c.phone && (
                    <a href={whatsappUrl(c.phone, name, role)} target="_blank" rel="noopener noreferrer" className="flex flex-1 items-center justify-center gap-1 rounded-lg border py-1.5 text-xs text-green-600 hover:bg-green-50 dark:hover:bg-green-950/30">
                      <MessageCircle className="h-3 w-3" /> WA
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════
// ── Main Dashboard Export ──
// ══════════════════════════════════════════════════

export function CompanyDashboard({
  result,
  onReset,
  roleName,
}: {
  result: Record<string, unknown>;
  onReset: () => void;
  roleName?: string;
}) {
  const { locale } = useLanguage();
  const f = translations.companyForm;

  const candidates = useMemo(() => {
    const raw = (result.candidates || result.ranked_candidates || []) as DashboardCandidate[];
    return [...raw].sort((a, b) => (b.score || 0) - (a.score || 0));
  }, [result]);

  const insights = (result.insights || null) as BatchInsights | null;

  const [sortField, setSortField] = useState<SortField>("score");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [compareSet, setCompareSet] = useState<Set<number>>(new Set());
  const [showCompare, setShowCompare] = useState(false);
  const [localStatuses, setLocalStatuses] = useState<Record<number, string>>({});

  const getCandidateStatus = useCallback((idx: number) => localStatuses[idx] || candidates[idx]?.status || "review", [localStatuses, candidates]);

  const filtered = useMemo(() => {
    let list = candidates.map((c, i) => ({ ...c, _idx: i, status: getCandidateStatus(i) }));
    if (statusFilter !== "all") list = list.filter((c) => c.status?.toLowerCase() === statusFilter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((c) => c.name?.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q) || c.summary?.toLowerCase().includes(q) || c.oneLiner?.toLowerCase().includes(q));
    }
    list.sort((a, b) => {
      let cmp = 0;
      if (sortField === "score") cmp = (a.score || 0) - (b.score || 0);
      else if (sortField === "name") cmp = (a.name || "").localeCompare(b.name || "");
      else if (sortField === "status") cmp = (a.status || "").localeCompare(b.status || "");
      else if (sortField === "must_match_pct") cmp = (a.must_match_pct || 0) - (b.must_match_pct || 0);
      return sortDir === "desc" ? -cmp : cmp;
    });
    return list;
  }, [candidates, statusFilter, searchQuery, sortField, sortDir, getCandidateStatus]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("desc"); }
  };

  const toggleCompare = (idx: number) => {
    setCompareSet((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else if (next.size < 5) next.add(idx);
      return next;
    });
  };

  const role = roleName || (result.roleName as string) || (locale === "en" ? "Open Role" : "Posisi Terbuka");

  const statusCounts = useMemo(() => {
    const counts = { all: candidates.length, shortlist: 0, review: 0, reject: 0 };
    candidates.forEach((_, i) => {
      const s = getCandidateStatus(i).toLowerCase() as keyof typeof counts;
      if (s in counts) counts[s]++;
    });
    return counts;
  }, [candidates, getCandidateStatus]);

  const handleExportCSV = useCallback(() => {
    downloadFile(generateCSV(filtered), `screening-${role.replace(/\s+/g, "-")}.csv`, "text/csv");
  }, [filtered, role]);

  // ── Compare mode ──
  if (showCompare && compareSet.size >= 2) {
    const compareList = [...compareSet].map((i) => ({ ...candidates[i], status: getCandidateStatus(i) })).filter(Boolean);
    return <CompareView candidates={compareList} role={role} locale={locale} onBack={() => setShowCompare(false)} />;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 print:space-y-4">
      {/* Batch Overview */}
      <BatchOverview candidates={candidates} insights={insights} role={role} locale={locale} />

      {/* Next Steps */}
      <NextSteps
        candidates={candidates}
        insights={insights}
        locale={locale}
        onFilter={setStatusFilter}
        onJumpToCandidate={(idx) => setExpandedIdx(idx)}
        onExportCSV={handleExportCSV}
      />

      {/* Actions bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between print:hidden">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder={t(f.searchPlaceholder, locale)} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 h-9" />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {compareSet.size >= 2 && (
            <Button size="sm" onClick={() => setShowCompare(true)} className="cekcv-gradient text-white">
              <Columns3 className="mr-1.5 h-3.5 w-3.5" />
              {t(f.compare, locale)} ({compareSet.size})
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={handleExportCSV}>
            <Download className="mr-1.5 h-3.5 w-3.5" />
            {t(f.exportCSV, locale)}
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Download className="mr-1.5 h-3.5 w-3.5" />
            PDF
          </Button>
        </div>
      </div>

      {/* Filters + Sort */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between print:hidden">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {(["all", "shortlist", "review", "reject"] as StatusFilter[]).map((s) => {
            const labels: Record<StatusFilter, { en: string; id: string }> = { all: f.filterAll, shortlist: f.filterShortlist, review: f.filterReview, reject: f.filterReject };
            const count = statusCounts[s];
            return (
              <button key={s} onClick={() => setStatusFilter(s)} disabled={count === 0 && s !== "all"}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  statusFilter === s ? "cekcv-gradient text-white" : count === 0 && s !== "all" ? "bg-muted/20 text-muted-foreground/40" : "bg-muted/50 text-muted-foreground hover:bg-muted"
                }`}>
                {t(labels[s], locale)} ({count})
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>{t(f.sortBy, locale)}</span>
          {([["score", f.sortScore], ["must_match_pct", f.mustHave], ["name", f.sortName], ["status", f.sortStatus]] as [SortField, { en: string; id: string }][]).map(([field, lbl]) => (
            <button key={field} onClick={() => toggleSort(field)}
              className={`flex items-center gap-0.5 transition-colors hover:text-foreground ${sortField === field ? "font-semibold text-foreground" : ""}`}>
              {t(lbl, locale)}
              {sortField === field && (sortDir === "desc" ? <ArrowDown className="h-3 w-3" /> : <ArrowUp className="h-3 w-3" />)}
            </button>
          ))}
        </div>
      </div>

      {/* Candidate ranking list */}
      <div className="space-y-2">
        {filtered.map((c, listIndex) => (
          <div key={c._idx}>
            <CandidateRow
              c={c}
              rank={c._idx + 1}
              index={listIndex}
              locale={locale}
              isExpanded={expandedIdx === c._idx}
              isComparing={compareSet.has(c._idx)}
              onToggleExpand={() => setExpandedIdx(expandedIdx === c._idx ? null : c._idx)}
              onToggleCompare={() => toggleCompare(c._idx)}
              onStatusChange={(newStatus) => setLocalStatuses((prev) => ({ ...prev, [c._idx]: newStatus }))}
            />
            {expandedIdx === c._idx && (
              <CandidateDetail c={{ ...c, status: getCandidateStatus(c._idx) }} rank={c._idx + 1} role={role} locale={locale} />
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-2xl border-2 border-dashed p-10 text-center text-muted-foreground">
          <Users className="mx-auto mb-3 h-8 w-8 opacity-40" />
          <p className="font-medium">{searchQuery || statusFilter !== "all" ? t(f.noFilterMatch, locale) : t(f.noResults, locale)}</p>
        </div>
      )}

      <div className="flex justify-center gap-3 pt-4 print:hidden">
        <Button variant="outline" onClick={onReset} size="lg">{t(f.screenMore, locale)}</Button>
      </div>
    </div>
  );
}
