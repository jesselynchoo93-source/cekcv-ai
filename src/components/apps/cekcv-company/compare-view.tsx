"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { X, Mail, Check, Minus, Trophy, ArrowRight, Sparkles, AlertTriangle, Briefcase, GraduationCap, Award, User, Target } from "lucide-react";
import { WhatsAppIcon } from "./ui/whatsapp-icon";
import { useLanguage } from "@/contexts/language-context";
import { translations, t } from "@/lib/translations";
import type { DashboardCandidate } from "./types";
import {
  cleanCandidateName,
  statusLabel,
  statusVariant,
  scoreColor,
  scoreBarColor,
  initials,
  whatsappUrl,
  mailtoUrl,
  isNoGapMessage,
  yearsOfExperience,
} from "./utils";
import { ScoreRing } from "./ui/score-ring";

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

export function CompareView({
  candidates,
  role,
  onBack,
}: {
  candidates: DashboardCandidate[];
  role: string;
  onBack: () => void;
}) {
  const { locale } = useLanguage();
  const f = translations.companyForm;

  // Compute shared and unique skills
  const allSkillSets = candidates.map((c) => new Set([...(c.resume?.skills?.hard || []), ...(c.strengths || [])]));
  const sharedSkills = allSkillSets.length >= 2
    ? [...allSkillSets[0]].filter((s) => allSkillSets.every((set) => set.has(s))).slice(0, 8)
    : [];

  // All unique skills across all candidates for matrix
  const allSkills = [...new Set(candidates.flatMap((c) => [...(c.resume?.skills?.hard || [])]))].slice(0, 12);

  // Best scores for highlighting
  const bestScore = Math.max(...candidates.map((c) => c.score || 0));
  const bestMust = Math.max(...candidates.map((c) => c.must_match_pct || 0));
  const bestNice = Math.max(...candidates.map((c) => c.nice_match_pct || 0));

  const gridCols = candidates.length === 2 ? "lg:grid-cols-2" : "lg:grid-cols-3";

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t(f.compareCandidates, locale)}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {role} <span className="mx-1.5 text-muted-foreground/40">|</span> {candidates.length} {locale === "en" ? "candidates" : "kandidat"}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={onBack} className="gap-1.5">
          <X className="h-3.5 w-3.5" />
          {t(f.backToList, locale)}
        </Button>
      </div>

      {/* Score comparison — vertical bars */}
      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg cekcv-gradient">
              <Trophy className="h-3.5 w-3.5 text-white" />
            </div>
            <h3 className="text-sm font-semibold">
              {locale === "en" ? "Score Comparison" : "Perbandingan Skor"}
            </h3>
          </div>
          {/* Legend */}
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {candidates.map((c, i) => {
              const name = cleanCandidateName(c.name, c.fileName, i + 1);
              const isBest = c.score === bestScore;
              return (
                <div key={i} className="flex items-center gap-1.5">
                  <div className={`h-2.5 w-2.5 rounded-sm ${scoreBarColor(c.score)} ${isBest ? "" : "opacity-40"}`} />
                  <span className={`text-xs ${isBest ? "font-semibold" : "text-muted-foreground"}`}>{name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Vertical grouped bar chart */}
        <div className="mt-6 flex items-end justify-center gap-8 sm:gap-12">
          {/* Overall Score group */}
          <VerticalBarGroup
            label={locale === "en" ? "Overall" : "Skor"}
            candidates={candidates}
            getValue={(c) => c.score}
            bestValue={bestScore}
            max={100}
          />

          {/* Must-Have group */}
          {candidates.some((c) => c.must_match_pct != null) && (
            <VerticalBarGroup
              label={locale === "en" ? "Must-Have" : "Wajib"}
              candidates={candidates}
              getValue={(c) => c.must_match_pct ?? 0}
              bestValue={bestMust}
              max={100}
              suffix="%"
            />
          )}

          {/* Nice-to-Have group */}
          {candidates.some((c) => c.nice_match_pct != null) && (
            <VerticalBarGroup
              label={locale === "en" ? "Nice-to-Have" : "Plus"}
              candidates={candidates}
              getValue={(c) => c.nice_match_pct ?? 0}
              bestValue={bestNice}
              max={100}
              suffix="%"
            />
          )}
        </div>
      </div>

      {/* Candidate profile cards */}
      <div className={`grid items-start gap-5 ${gridCols}`}>
        {candidates.map((c, i) => {
          const name = cleanCandidateName(c.name, c.fileName, i + 1);
          const resume = c.resume || {};
          const isBestScore = c.score === bestScore;
          const filteredGaps = (c.gaps || []).filter((g) => !isNoGapMessage(g));

          return (
            <div
              key={i}
              className={`group relative overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-300 animate-in fade-in-0 slide-in-from-bottom-3 hover:shadow-md ${
                isBestScore ? "ring-2 ring-indigo-500/20 shadow-indigo-500/5" : ""
              }`}
              style={{ animationDelay: `${i * 100}ms`, animationFillMode: "backwards" }}
            >
              {/* Top candidate gradient banner / spacer for alignment */}
              {isBestScore ? (
                <div className="relative overflow-hidden cekcv-gradient px-4 py-2">
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)]" />
                  <div className="flex items-center justify-center gap-1.5">
                    <Trophy className="h-3 w-3 text-white/90" />
                    <span className="text-[11px] font-bold tracking-wider text-white uppercase">
                      {locale === "en" ? "Top Candidate" : "Kandidat Terbaik"}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="h-[34px] border-b border-muted/30" />
              )}

              <div className="p-6">
                {/* Profile header */}
                <div className="flex items-start gap-4">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    isBestScore
                      ? "cekcv-gradient text-white"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {initials(name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-base font-semibold leading-tight">{name}</h3>
                    {resume.experience?.[0] && (
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {resume.experience[0].title}{resume.experience[0].company ? ` at ${resume.experience[0].company}` : ""}
                      </p>
                    )}
                    <Badge variant={statusVariant(c.status)} className="mt-1.5 text-[10px]">
                      {statusLabel(c.status, locale)}
                    </Badge>
                  </div>
                </div>

                {/* Tabbed content */}
                <Tabs defaultValue="summary" className="mt-5 gap-0">
                  <TabsList className="w-full">
                    <TabsTrigger value="summary" className="gap-1 text-[11px] flex-1">
                      <Sparkles className="h-3 w-3" />
                      {locale === "en" ? "Summary" : "Ringkasan"}
                    </TabsTrigger>
                    <TabsTrigger value="profile" className="gap-1 text-[11px] flex-1">
                      <User className="h-3 w-3" />
                      {locale === "en" ? "Profile" : "Profil"}
                    </TabsTrigger>
                    <TabsTrigger value="scores" className="gap-1 text-[11px] flex-1">
                      <Target className="h-3 w-3" />
                      {locale === "en" ? "Scores" : "Skor"}
                    </TabsTrigger>
                  </TabsList>

                  {/* ── Summary Tab ── */}
                  <TabsContent value="summary" className="mt-4 space-y-4 animate-in fade-in-0 duration-200">
                    {/* Strengths */}
                    {c.strengths?.length > 0 && (
                      <div>
                        <div className="mb-2 flex items-center gap-1.5">
                          <Sparkles className="h-3 w-3 text-indigo-500" />
                          <span className="text-xs font-semibold cekcv-gradient-text">{t(f.strengths, locale)}</span>
                        </div>
                        <div className="space-y-1">
                          {c.strengths.slice(0, 4).map((s, j) => (
                            <div key={j} className="flex items-start gap-2 rounded-lg bg-indigo-50/70 px-3 py-1.5 text-xs dark:bg-indigo-950/20">
                              <ArrowRight className="mt-0.5 h-3 w-3 shrink-0 text-indigo-400" />
                              <span className="text-foreground/80">{s}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Gaps */}
                    {filteredGaps.length > 0 && (
                      <div>
                        <div className="mb-2 flex items-center gap-1.5">
                          <AlertTriangle className="h-3 w-3 text-amber-500" />
                          <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">{t(f.gaps, locale)}</span>
                        </div>
                        <div className="space-y-1">
                          {filteredGaps.slice(0, 3).map((g, j) => (
                            <div key={j} className="flex items-start gap-2 rounded-lg bg-amber-50/70 px-3 py-1.5 text-xs dark:bg-amber-950/20">
                              <Minus className="mt-0.5 h-3 w-3 shrink-0 text-amber-400" />
                              <span className="text-foreground/80">{g}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  {/* ── Profile Tab ── */}
                  <TabsContent value="profile" className="mt-4 space-y-4 animate-in fade-in-0 duration-200">
                    {/* Work History */}
                    {resume.experience && resume.experience.length > 0 && (
                      <div>
                        <div className="mb-2 flex items-center gap-1.5">
                          <Briefcase className="h-3 w-3 text-blue-500" />
                          <span className="text-xs font-semibold text-blue-700 dark:text-blue-400">
                            {locale === "en" ? "Work History" : "Riwayat Kerja"}
                          </span>
                          {(() => {
                            const yoe = yearsOfExperience(resume.experience);
                            return yoe ? (
                              <span className="ml-auto text-[10px] text-muted-foreground">{yoe} {locale === "en" ? "exp" : "pglmn"}</span>
                            ) : null;
                          })()}
                        </div>
                        <div className="space-y-2">
                          {resume.experience.slice(0, 4).map((exp, j) => (
                            <div key={j} className="rounded-lg border bg-muted/30 px-3 py-2">
                              <p className="text-xs font-medium">{exp.title}</p>
                              {exp.company && (
                                <p className="text-[11px] text-muted-foreground">{exp.company}</p>
                              )}
                              {(exp.start || exp.end) && (
                                <p className="text-[10px] text-muted-foreground/70">
                                  {exp.start}{exp.end ? ` – ${exp.end}` : ""}
                                </p>
                              )}
                              {exp.highlights && exp.highlights.length > 0 && (
                                <div className="mt-1.5 space-y-0.5">
                                  {exp.highlights.slice(0, 2).map((h, k) => (
                                    <p key={k} className="text-[10px] leading-relaxed text-foreground/70">
                                      <span className="text-blue-400">•</span> {h}
                                    </p>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                          {resume.experience.length > 4 && (
                            <p className="text-[10px] text-muted-foreground">
                              +{resume.experience.length - 4} {locale === "en" ? "more roles" : "posisi lain"}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Education */}
                    {resume.education && resume.education.length > 0 && (
                      <div>
                        <div className="mb-2 flex items-center gap-1.5">
                          <GraduationCap className="h-3 w-3 text-purple-500" />
                          <span className="text-xs font-semibold text-purple-700 dark:text-purple-400">
                            {locale === "en" ? "Education" : "Pendidikan"}
                          </span>
                        </div>
                        <div className="space-y-1.5">
                          {resume.education.slice(0, 3).map((edu, j) => (
                            <div key={j} className="rounded-lg border bg-purple-50/40 px-3 py-2 dark:bg-purple-950/10">
                              <p className="text-xs font-medium">
                                {edu.degree}{edu.field ? ` in ${edu.field}` : ""}
                              </p>
                              <p className="text-[10px] text-muted-foreground">
                                {edu.school}{edu.gradYear ? ` · ${edu.gradYear}` : ""}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Certifications */}
                    {resume.certifications && resume.certifications.length > 0 && (
                      <div>
                        <div className="mb-2 flex items-center gap-1.5">
                          <Award className="h-3 w-3 text-amber-500" />
                          <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                            {locale === "en" ? "Certifications & Training" : "Sertifikasi & Pelatihan"}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {resume.certifications.map((cert, j) => (
                            <span key={j} className="rounded-full border border-amber-200 bg-amber-50/60 px-2.5 py-0.5 text-[10px] font-medium text-amber-800 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                              {cert}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Empty state */}
                    {!resume.experience?.length && !resume.education?.length && !resume.certifications?.length && (
                      <div className="flex flex-col items-center justify-center py-6 text-center">
                        <User className="mb-2 h-6 w-6 text-muted-foreground/30" />
                        <p className="text-xs text-muted-foreground">
                          {locale === "en" ? "No profile data extracted" : "Data profil tidak tersedia"}
                        </p>
                      </div>
                    )}
                  </TabsContent>

                  {/* ── Scores Tab ── */}
                  <TabsContent value="scores" className="mt-4 space-y-3 animate-in fade-in-0 duration-200">
                    <div className="flex items-center justify-center gap-6 rounded-xl bg-muted/40 px-4 py-4">
                      <div className="flex flex-col items-center">
                        <ScoreRing score={c.score} size={72} />
                        <span className="mt-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                          {locale === "en" ? "Overall" : "Skor"}
                        </span>
                      </div>
                      {c.must_match_pct != null && (
                        <div className="flex flex-col items-center">
                          <span className={`text-2xl font-bold ${scoreColor(c.must_match_pct)}`}>{c.must_match_pct}%</span>
                          <span className="mt-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                            {locale === "en" ? "Must-Have" : "Wajib"}
                          </span>
                        </div>
                      )}
                      {c.nice_match_pct != null && (
                        <div className="flex flex-col items-center">
                          <span className={`text-2xl font-bold ${scoreColor(c.nice_match_pct)}`}>{c.nice_match_pct}%</span>
                          <span className="mt-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                            {locale === "en" ? "Nice-to-Have" : "Plus"}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Individual AI model scores */}
                    {c.individualScores && c.individualScores.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                          {locale === "en" ? "Score by AI Model" : "Skor Per Model AI"}
                        </p>
                        {c.individualScores.map((ms, j) => (
                          <div key={j} className="flex items-center gap-2">
                            <ModelLogo model={ms.model} className="h-4 w-4 shrink-0" />
                            <span className="w-16 truncate text-[11px] font-medium">{ms.model}</span>
                            <div className="min-w-0 flex-1">
                              <div className="h-2 w-full rounded-full bg-muted">
                                <div
                                  className={`h-full rounded-full transition-all duration-1000 ${scoreBarColor(ms.score)}`}
                                  style={{ width: `${ms.score}%` }}
                                />
                              </div>
                            </div>
                            <span className={`w-6 text-right text-xs font-bold ${scoreColor(ms.score)}`}>{ms.score}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>

                {/* Contact buttons */}
                <div className="mt-5 flex gap-2">
                  {c.email && (
                    <a href={mailtoUrl(c.email, name, role)} className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border bg-background py-2 text-xs font-medium hover:bg-muted transition-colors">
                      <Mail className="h-3.5 w-3.5" /> Email
                    </a>
                  )}
                  {c.phone && !c.phone.startsWith("#ERROR") && (
                    <a href={whatsappUrl(c.phone, name, role)} target="_blank" rel="noopener noreferrer" className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border bg-background py-2 text-xs font-medium text-green-600 hover:bg-green-50 dark:hover:bg-green-950/30 transition-colors">
                      <WhatsAppIcon className="h-3.5 w-3.5" /> WhatsApp
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Skills matrix */}
      {allSkills.length > 0 && (
        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold">
            {locale === "en" ? "Skills Comparison" : "Perbandingan Skill"}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="pb-3 pr-4 text-left text-xs font-medium text-muted-foreground">
                    {locale === "en" ? "Skill" : "Skill"}
                  </th>
                  {candidates.map((c, i) => (
                    <th key={i} className="pb-3 px-3 text-center text-xs font-semibold">
                      {cleanCandidateName(c.name, c.fileName, i + 1).split(" ")[0]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allSkills.map((skill) => (
                  <tr key={skill} className="border-b border-muted/20 transition-colors hover:bg-muted/30">
                    <td className="py-2.5 pr-4 text-xs text-muted-foreground">{skill}</td>
                    {candidates.map((c, i) => {
                      const has = (c.resume?.skills?.hard || []).includes(skill);
                      return (
                        <td key={i} className="py-2.5 px-3 text-center">
                          {has ? (
                            <div className="mx-auto flex h-5 w-5 items-center justify-center rounded-full bg-green-100 dark:bg-green-950/40">
                              <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                            </div>
                          ) : (
                            <div className="mx-auto flex h-5 w-5 items-center justify-center rounded-full bg-muted/50">
                              <Minus className="h-3 w-3 text-muted-foreground/30" />
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Shared skills */}
          {sharedSkills.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2 rounded-xl bg-indigo-50/60 px-4 py-3 dark:bg-indigo-950/20">
              <span className="text-xs font-semibold cekcv-gradient-text">
                {locale === "en" ? "Shared:" : "Bersama:"}
              </span>
              {sharedSkills.map((s, i) => (
                <span key={i} className="rounded-full bg-indigo-100/80 px-2.5 py-0.5 text-[11px] font-medium text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Vertical bar group ──

const BAR_HEIGHT = 120; // max bar height in px

function VerticalBarGroup({
  label,
  candidates,
  getValue,
  bestValue,
  max,
  suffix = "",
}: {
  label: string;
  candidates: DashboardCandidate[];
  getValue: (c: DashboardCandidate) => number;
  bestValue: number;
  max: number;
  suffix?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      {/* Bars + values */}
      <div className="flex items-end gap-2">
        {candidates.map((c, i) => {
          const val = getValue(c);
          const isBest = val === bestValue && val > 0;
          const pct = Math.max((val / max) * 100, 4);
          return (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <span className={`text-xs font-bold tabular-nums ${isBest ? scoreColor(val) : "text-muted-foreground/50"}`}>
                {val}{suffix}
              </span>
              <div
                className={`w-9 rounded-t-lg transition-all duration-1000 ease-out ${scoreBarColor(val)} ${isBest ? "opacity-100" : "opacity-30"}`}
                style={{ height: `${(pct / 100) * BAR_HEIGHT}px` }}
              />
            </div>
          );
        })}
      </div>
      {/* Label */}
      <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
    </div>
  );
}
