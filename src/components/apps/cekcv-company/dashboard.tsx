"use client";

import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Users,
  ArrowUp,
  ArrowDown,
  Search,
  Download,
  Mail,
  Columns3,
  Check,
} from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { translations, t } from "@/lib/translations";

import type { DashboardCandidate, BatchInsights, SortField, SortDir, StatusFilter } from "./types";
import {
  generateCSV,
  generateAndDownloadXLSX,
  downloadFile,
} from "./utils";
import { BatchOverview } from "./batch-overview";
import { NextSteps } from "./next-steps";
import { CandidateRow } from "./candidate-row";
import { CandidateDetailPanel } from "./candidate-detail-panel";
import { CompareView } from "./compare-view";
import { JDContextPanel } from "./jd-context-panel";

// ══════════════════════════════════════════════════
// ── Main Dashboard Export ──
// ══════════════════════════════════════════════════

export function CompanyDashboard({
  result,
  onReset,
  roleName,
  jobDescription,
  fileUrls,
}: {
  result: Record<string, unknown>;
  onReset: () => void;
  roleName?: string;
  jobDescription?: string;
  fileUrls?: Record<string, string>;
}) {
  const { locale } = useLanguage();
  const f = translations.companyForm;

  // ── Parse candidates from result ──
  const candidates = useMemo(() => {
    const raw = (result.candidates || result.ranked_candidates || []) as DashboardCandidate[];
    return [...raw].sort((a, b) => (b.score || 0) - (a.score || 0));
  }, [result]);

  const insights = (result.insights || null) as BatchInsights | null;

  // ── Resolve JD: prop first, then try extracting from result (URL recovery fallback) ──
  const resolvedJD = jobDescription
    || (result.jobDescription as string | undefined)
    || (result.job_description as string | undefined)
    || "";

  // ── State ──
  const [sortField, setSortField] = useState<SortField>("score");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [minScore, setMinScore] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [compareSet, setCompareSet] = useState<Set<number>>(new Set());
  const [showCompare, setShowCompare] = useState(false);
  const [localStatuses, setLocalStatuses] = useState<Record<number, string>>({});
  const [copiedLink, setCopiedLink] = useState(false);

  const getCandidateStatus = useCallback(
    (idx: number) => localStatuses[idx] || candidates[idx]?.status || "review",
    [localStatuses, candidates]
  );

  // ── Weights from first candidate (same for all in a batch) ──
  const batchWeights = candidates[0]?.weights;

  // ── Filtered + sorted candidates ──
  const filtered = useMemo(() => {
    let list = candidates.map((c, i) => ({ ...c, _idx: i, status: getCandidateStatus(i) }));
    if (statusFilter !== "all") list = list.filter((c) => c.status?.toLowerCase() === statusFilter);
    if (minScore > 0) list = list.filter((c) => c.score >= minScore);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (c) =>
          c.name?.toLowerCase().includes(q) ||
          c.email?.toLowerCase().includes(q) ||
          c.summary?.toLowerCase().includes(q) ||
          c.oneLiner?.toLowerCase().includes(q)
      );
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
  }, [candidates, statusFilter, minScore, searchQuery, sortField, sortDir, getCandidateStatus]);

  // ── Actions ──
  const role = roleName || (result.roleName as string) || (locale === "en" ? "Open Role" : "Posisi Terbuka");

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

  const selectAllShortlisted = () => {
    const shortlistedIndices = candidates
      .map((_, i) => (getCandidateStatus(i).toLowerCase() === "shortlist" ? i : -1))
      .filter((i) => i >= 0);
    setCompareSet(new Set(shortlistedIndices));
  };

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

  const handleExportExcel = useCallback(async () => {
    await generateAndDownloadXLSX(filtered, role, insights);
  }, [filtered, role, insights]);

  const handleShareLink = useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  }, []);

  const handleEmailAll = useCallback(() => {
    const selected = [...compareSet].map((i) => candidates[i]).filter((c) => c?.email);
    if (selected.length === 0) return;
    const emails = selected.map((c) => c.email).join(",");
    const subject = encodeURIComponent(`Interview Invitation — ${role}`);
    window.location.href = `mailto:${emails}?subject=${subject}`;
  }, [compareSet, candidates, role]);

  const handleExportSelected = useCallback(() => {
    const selected = [...compareSet].map((i) => ({ ...candidates[i], status: getCandidateStatus(i) })).filter(Boolean);
    if (selected.length === 0) return;
    downloadFile(generateCSV(selected), `screening-selected-${role.replace(/\s+/g, "-")}.csv`, "text/csv");
  }, [compareSet, candidates, getCandidateStatus, role]);

  // ── Compare mode ──
  if (showCompare && compareSet.size >= 2) {
    const compareList = [...compareSet].map((i) => ({ ...candidates[i], status: getCandidateStatus(i) })).filter(Boolean);
    return <CompareView candidates={compareList} role={role} onBack={() => setShowCompare(false)} />;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 print:space-y-4">
      {/* Batch Overview */}
      <BatchOverview
        candidates={candidates}
        insights={insights}
        role={role}
        compareCount={compareSet.size}
        onExportExcel={handleExportExcel}
        onExportPDF={() => window.print()}
        onShareLink={handleShareLink}
        onCompare={() => {
          if (compareSet.size < 2) {
            // Auto-select shortlisted candidates so compare works immediately
            const shortlistedIndices = candidates
              .map((_, i) => (getCandidateStatus(i).toLowerCase() === "shortlist" ? i : -1))
              .filter((i) => i >= 0);
            if (shortlistedIndices.length >= 2) {
              setCompareSet(new Set(shortlistedIndices));
              setShowCompare(true);
            } else {
              // Not enough shortlisted — select top 2 by score
              setCompareSet(new Set([0, 1]));
              setShowCompare(true);
            }
          } else {
            setShowCompare(true);
          }
        }}
      />

      {/* Copied link toast */}
      {copiedLink && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg border bg-card px-4 py-2 text-sm font-medium shadow-lg animate-in fade-in-0 slide-in-from-bottom-4">
          <Check className="mr-1.5 inline-block h-3.5 w-3.5 text-green-500" />
          {t(f.copiedLink, locale)}
        </div>
      )}

      {/* JD Context Panel */}
      <JDContextPanel jobDescription={resolvedJD} weights={batchWeights} />

      {/* Next Steps */}
      <NextSteps
        candidates={candidates}
        insights={insights}
        onFilter={setStatusFilter}
        onJumpToCandidate={(idx) => setSelectedIdx(idx)}
        onExportCSV={handleExportCSV}
      />

      {/* Search + export bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between print:hidden">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder={t(f.searchPlaceholder, locale)} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 h-9" />
        </div>
        <Button variant="outline" size="sm" onClick={handleExportCSV}>
          <Download className="mr-1.5 h-3.5 w-3.5" />
          {t(f.exportCSV, locale)}
        </Button>
      </div>

      {/* Filters + Sort */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between print:hidden">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {(["all", "shortlist", "review", "reject"] as StatusFilter[]).map((s) => {
            const labels: Record<StatusFilter, { en: string; id: string }> = { all: f.filterAll, shortlist: f.filterShortlist, review: f.filterReview, reject: f.filterReject };
            const count = statusCounts[s];
            return (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                disabled={count === 0 && s !== "all"}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  statusFilter === s
                    ? "cekcv-gradient text-white"
                    : count === 0 && s !== "all"
                      ? "bg-muted/20 text-muted-foreground/40"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted"
                }`}
              >
                {t(labels[s], locale)} ({count})
              </button>
            );
          })}

          {/* Select all shortlisted */}
          {statusCounts.shortlist > 0 && (
            <button
              onClick={selectAllShortlisted}
              className="shrink-0 rounded-full border border-dashed px-3 py-1.5 text-[11px] font-medium text-muted-foreground hover:bg-muted/50 transition-colors"
            >
              {t(f.selectAllShortlisted, locale)}
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {/* Min score slider */}
          <div className="flex items-center gap-2">
            <span>{t(f.minScore, locale)}:</span>
            <Slider
              value={[minScore]}
              onValueChange={([v]) => setMinScore(v)}
              min={0}
              max={100}
              step={5}
              className="w-20"
            />
            <span className="w-6 text-center font-semibold text-foreground">{minScore}</span>
          </div>

          <span className="text-muted-foreground/30">|</span>

          <span>{t(f.sortBy, locale)}</span>
          {([["score", f.sortScore], ["must_match_pct", f.mustHave], ["name", f.sortName], ["status", f.sortStatus]] as [SortField, { en: string; id: string }][]).map(([field, lbl]) => (
            <button
              key={field}
              onClick={() => toggleSort(field)}
              className={`flex items-center gap-0.5 transition-colors hover:text-foreground ${sortField === field ? "font-semibold text-foreground" : ""}`}
            >
              {t(lbl, locale)}
              {sortField === field && (sortDir === "desc" ? <ArrowDown className="h-3 w-3" /> : <ArrowUp className="h-3 w-3" />)}
            </button>
          ))}
        </div>
      </div>

      {/* Candidate ranking list */}
      <div className="space-y-2">
        {filtered.map((c, listIndex) => (
          <CandidateRow
            key={c._idx}
            c={c}
            rank={c._idx + 1}
            index={listIndex}
            locale={locale}
            role={role}
            isSelected={selectedIdx === c._idx}
            isComparing={compareSet.has(c._idx)}
            onSelect={() => setSelectedIdx(selectedIdx === c._idx ? null : c._idx)}
            onToggleCompare={() => toggleCompare(c._idx)}
            onStatusChange={(newStatus) => setLocalStatuses((prev) => ({ ...prev, [c._idx]: newStatus }))}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-2xl border-2 border-dashed p-10 text-center text-muted-foreground">
          <Users className="mx-auto mb-3 h-8 w-8 opacity-40" />
          <p className="font-medium">{searchQuery || statusFilter !== "all" || minScore > 0 ? t(f.noFilterMatch, locale) : t(f.noResults, locale)}</p>
        </div>
      )}

      {/* Bulk action bar (floating) */}
      {compareSet.size > 0 && (
        <div className="sticky bottom-4 z-30 mx-auto flex max-w-fit items-center gap-3 rounded-xl border bg-card/95 backdrop-blur px-4 py-3 shadow-lg print:hidden animate-in fade-in-0 slide-in-from-bottom-4">
          <span className="text-sm font-medium">
            {compareSet.size} {t(f.selected, locale)}
          </span>
          <Button size="sm" variant="outline" onClick={handleEmailAll}>
            <Mail className="mr-1.5 h-3.5 w-3.5" />
            {t(f.emailAll, locale)}
          </Button>
          <Button size="sm" variant="outline" onClick={handleExportSelected}>
            <Download className="mr-1.5 h-3.5 w-3.5" />
            {t(f.exportSelected, locale)}
          </Button>
          {compareSet.size >= 2 && (
            <Button size="sm" onClick={() => setShowCompare(true)} className="cekcv-gradient text-white">
              <Columns3 className="mr-1.5 h-3.5 w-3.5" />
              {t(f.compare, locale)}
            </Button>
          )}
        </div>
      )}

      {/* Side panel for candidate detail */}
      <CandidateDetailPanel
        candidate={selectedIdx !== null ? { ...candidates[selectedIdx], status: getCandidateStatus(selectedIdx) } : null}
        rank={selectedIdx !== null ? selectedIdx + 1 : 0}
        role={role}
        open={selectedIdx !== null}
        onClose={() => setSelectedIdx(null)}
        fileUrls={fileUrls}
      />

      {/* Start over */}
      <div className="flex justify-center gap-3 pt-4 print:hidden">
        <Button variant="outline" onClick={onReset} size="lg">{t(f.screenMore, locale)}</Button>
      </div>
    </div>
  );
}
