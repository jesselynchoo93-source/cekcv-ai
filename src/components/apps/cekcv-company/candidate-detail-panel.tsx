"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Mail,
  Phone,
  Check,
  Copy,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  FileText,
  Briefcase,
  GraduationCap,
  Wrench,
  Award,
  MapPin,
  Sparkles,
  Target,
  User,
  Eye,
  EyeOff,
  ChevronDown,
  ClipboardList,
  CheckCircle2,
} from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { translations, t } from "@/lib/translations";
import type { DashboardCandidate } from "./types";
import {
  cleanCandidateName,
  cleanSummary,
  cleanOneLiner,
  deduplicateList,
  scoreColor,
  scoreBgClass,
  scoreBarColor,
  statusLabel,
  statusVariant,
  whatsappUrl,
  mailtoUrl,
  yearsOfExperience,
  isNoGapMessage,
  WEIGHT_LABELS,
} from "./utils";
import { ScoreRing, AnimatedStat } from "./ui/score-ring";
import { WhatsAppIcon } from "./ui/whatsapp-icon";

// ── AI model logo SVGs ──

function OpenAILogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-label="OpenAI">
      <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" />
    </svg>
  );
}

function AnthropicLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-label="Anthropic">
      <path d="M13.827 3.52h3.603L24 20.48h-3.603l-6.57-16.96zm-7.258 0h3.767L16.906 20.48h-3.674l-1.343-3.461H5.017l-1.344 3.46H0l6.57-16.96zm2.327 5.15L6.27 14.981h5.252L8.896 8.67z" />
    </svg>
  );
}

function GoogleLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-label="Google">
      <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
    </svg>
  );
}

function ModelLogo({ model, className }: { model: string; className?: string }) {
  const m = model.toLowerCase();
  if (m.includes("gpt") || m.includes("openai") || m.includes("o1") || m.includes("o3") || m.includes("o4")) return <OpenAILogo className={className} />;
  if (m.includes("claude") || m.includes("anthropic")) return <AnthropicLogo className={className} />;
  if (m.includes("gemini") || m.includes("google")) return <GoogleLogo className={className} />;
  return <Target className={className} />;
}

// ── Main export ──

export function CandidateDetailPanel({
  candidate,
  rank,
  role,
  open,
  onClose,
  fileUrls,
}: {
  candidate: DashboardCandidate | null;
  rank: number;
  role: string;
  open: boolean;
  onClose: () => void;
  fileUrls?: Record<string, string>;
}) {
  if (!candidate) return null;

  return (
    <Sheet open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <SheetContent side="right" className="w-full overflow-y-auto px-5 pb-6 sm:max-w-xl">
        <CandidateDetailContent c={candidate} rank={rank} role={role} fileUrls={fileUrls} />
      </SheetContent>
    </Sheet>
  );
}

function CandidateDetailContent({
  c,
  rank,
  role,
  fileUrls,
}: {
  c: DashboardCandidate;
  rank: number;
  role: string;
  fileUrls?: Record<string, string>;
}) {
  const { locale } = useLanguage();
  const f = translations.companyForm;
  const name = cleanCandidateName(c.name, c.fileName, rank);
  const resume = c.resume || {};
  const weights = c.weights || {};
  const hasWeights = Object.keys(weights).length > 0;
  const yoe = yearsOfExperience(resume.experience);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showAllStrengths, setShowAllStrengths] = useState(false);
  const [showAllGaps, setShowAllGaps] = useState(false);
  const summary = cleanSummary(c.summary);
  const oneLiner = cleanOneLiner(c.oneLiner || "");

  // Deduplicate strengths & gaps (3 AI models often say the same thing)
  const dedupedStrengths = useMemo(() => deduplicateList(c.strengths || []), [c.strengths]);
  const rawGaps = useMemo(() => (c.gaps || []).filter((g) => !isNoGapMessage(g)), [c.gaps]);
  const dedupedGaps = useMemo(() => deduplicateList(rawGaps), [rawGaps]);
  const hasNoGaps = (c.gaps || []).length > 0 && rawGaps.length === 0;

  const visibleStrengths = showAllStrengths ? dedupedStrengths : dedupedStrengths.slice(0, 5);
  const hiddenStrengthCount = Math.max(0, dedupedStrengths.length - 5);
  const visibleGaps = showAllGaps ? dedupedGaps : dedupedGaps.slice(0, 3);
  const hiddenGapCount = Math.max(0, dedupedGaps.length - 3);


  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1500);
  };

  return (
    <div className="flex flex-col gap-5 pt-2">
      {/* ── 1. WHO — Name, score, status ── */}
      <SheetHeader className="p-0">
        <div className="flex items-start gap-4">
          <ScoreRing score={c.score} size={52} />
          <div className="min-w-0 flex-1">
            <SheetTitle className="text-xl leading-tight">{name}</SheetTitle>
            <SheetDescription className="mt-1.5 flex flex-wrap items-center gap-2">
              <Badge variant={statusVariant(c.status)} className="text-[10px] px-1.5 py-0">
                {statusLabel(c.status, locale)}
              </Badge>
              {oneLiner && (
                <span className="text-xs text-muted-foreground">{oneLiner}</span>
              )}
            </SheetDescription>
          </div>
        </div>
      </SheetHeader>

      {/* ── 2. Contact — compact row ── */}
      <div className="flex flex-wrap items-center gap-2">
        {c.email && (
          <button
            onClick={() => copyToClipboard(c.email, "email")}
            className="flex items-center gap-1.5 rounded-full border bg-muted/30 px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted transition-colors"
          >
            <Mail className="h-3 w-3" />
            <span className="max-w-[180px] truncate">{c.email}</span>
            {copiedField === "email" ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3 opacity-40" />}
          </button>
        )}
        {c.phone && !c.phone.startsWith("#ERROR") && (
          <button
            onClick={() => copyToClipboard(c.phone!.replace(/^'/, ""), "phone")}
            className="flex items-center gap-1.5 rounded-full border bg-muted/30 px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted transition-colors"
          >
            <Phone className="h-3 w-3" />
            <span>{c.phone.replace(/^'/, "")}</span>
            {copiedField === "phone" ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3 opacity-40" />}
          </button>
        )}
        {resume.personal?.location && (
          <span className="flex items-center gap-1 rounded-full border bg-muted/30 px-3 py-1.5 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            {resume.personal.location}
          </span>
        )}
      </div>

      {/* ── 3. Quick actions — interview invite ── */}
      <div className="flex gap-2">
        {c.email && (
          <a
            href={mailtoUrl(c.email, name, role)}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-2 text-xs font-medium text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/30 transition-colors"
          >
            <Mail className="h-3.5 w-3.5" />
            {locale === "en" ? "Send Interview Invite" : "Kirim Undangan Interview"}
          </a>
        )}
        {c.phone && !c.phone.startsWith("#ERROR") && (
          <a
            href={whatsappUrl(c.phone, name, role)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-lg border px-4 py-2 text-xs font-medium text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-950/30 transition-colors"
          >
            <WhatsAppIcon className="h-3.5 w-3.5" />
            WhatsApp
          </a>
        )}
      </div>

      {/* ── 4. Tabs ── */}
      <Tabs defaultValue="summary" className="gap-0">
        <TabsList className="w-full">
          <TabsTrigger value="summary" className="gap-1.5 text-xs flex-1">
            <Sparkles className="h-3.5 w-3.5" />
            {locale === "en" ? "Summary" : "Ringkasan"}
          </TabsTrigger>
          <TabsTrigger value="scores" className="gap-1.5 text-xs flex-1">
            <Target className="h-3.5 w-3.5" />
            {locale === "en" ? "Scores" : "Skor"}
          </TabsTrigger>
          <TabsTrigger value="profile" className="gap-1.5 text-xs flex-1">
            <User className="h-3.5 w-3.5" />
            {locale === "en" ? "Profile" : "Profil"}
          </TabsTrigger>
        </TabsList>

        {/* ── Summary Tab ── */}
        <TabsContent value="summary" className="mt-4 space-y-4 animate-in fade-in-0 slide-in-from-bottom-1 duration-200">
          {/* Strengths (deduplicated) */}
          {visibleStrengths.length > 0 && (
            <div className="rounded-lg border border-blue-200/50 bg-blue-50/30 p-3.5 dark:border-blue-900/30 dark:bg-blue-950/10">
              <h4 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-400">
                <TrendingUp className="h-3.5 w-3.5" />
                {t(f.strengths, locale)} ({dedupedStrengths.length})
              </h4>
              <div className="space-y-1.5">
                {visibleStrengths.map((s, j) => (
                  <div key={j} className="flex items-start gap-2 text-xs leading-relaxed animate-in fade-in-0" style={{ animationDelay: `${j * 30}ms`, animationFillMode: "backwards" }}>
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

          {/* Gaps (deduplicated) */}
          <div className="rounded-lg border border-red-200/50 bg-red-50/30 p-3.5 dark:border-red-900/30 dark:bg-red-950/10">
            <h4 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-red-700 dark:text-red-400">
              <TrendingDown className="h-3.5 w-3.5" />
              {t(f.gaps, locale)} ({dedupedGaps.length})
            </h4>
            {hasNoGaps ? (
              <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
                <CheckCircle2 className="h-4 w-4" />
                <span className="font-medium">{t(f.noGaps, locale)}</span>
              </div>
            ) : (
              <>
                <div className="space-y-1.5">
                  {visibleGaps.map((g, j) => (
                    <div key={j} className="flex items-start gap-2 text-xs leading-relaxed animate-in fade-in-0" style={{ animationDelay: `${j * 30}ms`, animationFillMode: "backwards" }}>
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
              </>
            )}
          </div>

        </TabsContent>

        {/* ── Scores Tab ── */}
        <TabsContent value="scores" className="mt-4 space-y-4 animate-in fade-in-0 slide-in-from-bottom-1 duration-200">
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

          {/* Individual AI model scores — with logos */}
          {c.individualScores && c.individualScores.length > 0 && (
            <div className="rounded-lg border bg-card p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {locale === "en" ? "Score by AI Model" : "Skor Per Model AI"}
              </p>
              <div className="space-y-3">
                {c.individualScores.map((ms, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <ModelLogo model={ms.model} className="h-5 w-5 shrink-0" />
                    <span className="w-20 text-xs font-medium truncate">{ms.model}</span>
                    <div className="min-w-0 flex-1">
                      <div className="h-2.5 w-full rounded-full bg-muted">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ${scoreBarColor(ms.score)}`}
                          style={{ width: `${ms.score}%` }}
                        />
                      </div>
                    </div>
                    <span className={`w-8 text-right text-sm font-bold ${scoreColor(ms.score)}`}>{ms.score}</span>
                  </div>
                ))}
              </div>
              {c.individualScores.length >= 2 && (() => {
                const scores = c.individualScores!.map((s) => s.score);
                const range = Math.max(...scores) - Math.min(...scores);
                return (
                  <p className={`mt-3 text-[11px] ${range <= 5 ? "text-green-600 dark:text-green-400" : range <= 15 ? "text-yellow-600 dark:text-yellow-400" : "text-red-600 dark:text-red-400"}`}>
                    {range <= 5
                      ? (locale === "en" ? "Strong agreement between models" : "Model AI sangat sepakat")
                      : range <= 15
                        ? (locale === "en" ? "Moderate agreement between models" : "Model AI cukup sepakat")
                        : (locale === "en" ? "Models disagree — review manually" : "Model AI berbeda pendapat — tinjau manual")}
                  </p>
                );
              })()}
            </div>
          )}

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

        </TabsContent>

        {/* ── Profile Tab ── */}
        <TabsContent value="profile" className="mt-4 space-y-4 animate-in fade-in-0 slide-in-from-bottom-1 duration-200">
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
                  <div className="flex flex-wrap gap-1">
                    {resume.skills!.hard!.slice(0, 10).map((s, i) => (
                      <span key={i} className="rounded-full border bg-muted/40 px-2 py-0.5 text-[10px] transition-colors hover:bg-muted">{s}</span>
                    ))}
                    {(resume.skills!.hard!.length || 0) > 10 && (
                      <span className="text-[10px] text-muted-foreground">+{resume.skills!.hard!.length - 10}</span>
                    )}
                  </div>
                </div>
              )}
              {(resume.skills?.soft?.length || 0) > 0 && (
                <div className="flex gap-2">
                  <User className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <div className="flex flex-wrap gap-1">
                    {resume.skills!.soft!.slice(0, 6).map((s, i) => (
                      <span key={i} className="rounded-full border border-purple-200 bg-purple-50/50 px-2 py-0.5 text-[10px] dark:border-purple-800 dark:bg-purple-900/30">{s}</span>
                    ))}
                  </div>
                </div>
              )}
              {(resume.certifications?.length || 0) > 0 && (
                <div className="flex gap-2">
                  <Award className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <div className="flex flex-wrap gap-1">
                    {resume.certifications!.slice(0, 4).map((cert, i) => (
                      <span key={i} className="rounded-full border border-amber-200 bg-amber-50/50 px-2 py-0.5 text-[10px] dark:border-amber-800 dark:bg-amber-900/30">{cert}</span>
                    ))}
                    {(resume.certifications!.length || 0) > 4 && (
                      <span className="text-[10px] text-muted-foreground">+{resume.certifications!.length - 4}</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {c.fileName && fileUrls?.[c.fileName] ? (
            <div className="mt-4">
              <p className="mb-2 flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                <FileText className="h-3 w-3" />
                {c.fileName}
              </p>
              <iframe
                src={fileUrls[c.fileName]}
                title={c.fileName}
                className="h-[500px] w-full rounded-lg border"
              />
            </div>
          ) : c.fileName ? (
            <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <FileText className="h-3 w-3" />
              {c.fileName}
            </p>
          ) : null}
        </TabsContent>
      </Tabs>
    </div>
  );
}
