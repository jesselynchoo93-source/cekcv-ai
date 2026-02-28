"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  ChevronDown,
  ChevronRight,
  Mail,
  User,
} from "lucide-react";
import type { DashboardCandidate } from "./types";
import { WhatsAppIcon } from "./ui/whatsapp-icon";
import {
  cleanCandidateName,
  cleanOneLiner,
  statusLabel,
  statusVariant,
  whatsappUrl,
  mailtoUrl,
} from "./utils";
import { ScoreRing } from "./ui/score-ring";

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

// ── Candidate Row ──

export function CandidateRow({
  c,
  rank,
  index,
  locale,
  role,
  isSelected,
  isComparing,
  onSelect,
  onToggleCompare,
  onStatusChange,
}: {
  c: DashboardCandidate;
  rank: number;
  index: number;
  locale: "en" | "id";
  role: string;
  isSelected: boolean;
  isComparing: boolean;
  onSelect: () => void;
  onToggleCompare: () => void;
  onStatusChange: (newStatus: string) => void;
}) {
  const name = cleanCandidateName(c.name, c.fileName, rank);
  const oneLiner = cleanOneLiner(c.oneLiner || "");

  return (
    <div
      className={`group rounded-xl border bg-card transition-all hover:shadow-sm animate-in fade-in-0 slide-in-from-bottom-2 ${
        isSelected ? "ring-2 ring-blue-500/40" : ""
      } ${isComparing ? "ring-2 ring-blue-500/40" : ""}`}
      style={{ animationDelay: `${index * 60}ms`, animationFillMode: "backwards" }}
    >
      <div className="flex w-full items-center gap-2 p-3 sm:gap-3 sm:p-4">
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
        <div className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground sm:flex">
          <User className="h-4 w-4" />
        </div>

        {/* Name + oneliner (clickable to open detail) */}
        <div
          role="button"
          tabIndex={0}
          onClick={onSelect}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelect(); } }}
          className="min-w-0 flex-1 text-left cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-semibold hover:underline">{name}</span>
            <StatusBadge status={c.status} locale={locale} onStatusChange={onStatusChange} />
          </div>
          {oneLiner ? (
            <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground leading-relaxed">{oneLiner}</p>
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

        {/* Quick actions (visible on hover) */}
        <div className="hidden shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 sm:flex print:hidden">
          {c.email && (
            <a
              href={mailtoUrl(c.email, name, role)}
              onClick={(e) => e.stopPropagation()}
              className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              title="Email"
            >
              <Mail className="h-3.5 w-3.5" />
            </a>
          )}
          {c.phone && !c.phone.startsWith("#ERROR") && (
            <a
              href={whatsappUrl(c.phone, name, role)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="rounded-md p-1.5 text-green-600 hover:bg-green-50 dark:hover:bg-green-950/30 transition-colors"
              title="WhatsApp"
            >
              <WhatsAppIcon className="h-3.5 w-3.5" />
            </a>
          )}
        </div>

        {/* Score ring */}
        <button onClick={onSelect} className="shrink-0">
          <ScoreRing score={c.score} />
        </button>

        {/* Expand indicator */}
        <button onClick={onSelect} className="shrink-0">
          <ChevronRight className={`h-4 w-4 text-muted-foreground/50 transition-transform duration-200 ${isSelected ? "rotate-90" : ""}`} />
        </button>
      </div>
    </div>
  );
}
