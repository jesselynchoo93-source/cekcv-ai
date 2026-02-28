"use client";

import {
  HelpCircle,
  Brain,
  BarChart3,
  Target,
  Sparkles,
  MessageCircleQuestion,
} from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { useLanguage } from "@/contexts/language-context";
import { translations, t } from "@/lib/translations";

function ScoreRangeBar({ avgScore }: { avgScore: number }) {
  const pct = Math.min(Math.max(avgScore, 0), 100);
  return (
    <div className="relative mt-2 mb-10">
      <div className="flex h-3 overflow-hidden rounded-full">
        <div className="w-[50%] bg-red-400/80" />
        <div className="w-[25%] bg-yellow-400/80" />
        <div className="w-[25%] bg-blue-400/80" />
      </div>
      <div
        className="absolute -top-1 h-5 w-0.5 rounded-full bg-foreground"
        style={{ left: `${pct}%` }}
      />
      <div
        className="absolute top-6 -translate-x-1/2 rounded bg-foreground px-1.5 py-0.5 text-[10px] font-bold text-background"
        style={{ left: `${pct}%` }}
      >
        {avgScore}
      </div>
    </div>
  );
}

interface ScreeningGuideProps {
  avgScore: number;
  totalCandidates: number;
}

export function ScreeningGuide({ avgScore, totalCandidates }: ScreeningGuideProps) {
  const { locale } = useLanguage();
  const g = translations.screeningGuide;

  const faqs = [
    { q: t(g.faq1Q, locale), a: t(g.faq1A, locale) },
    { q: t(g.faq2Q, locale), a: t(g.faq2A, locale) },
    { q: t(g.faq3Q, locale), a: t(g.faq3A, locale) },
    { q: t(g.faq4Q, locale), a: t(g.faq4A, locale) },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="ml-1.5 inline-flex items-center gap-1 rounded-full border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-600 transition-colors hover:border-blue-500/50 hover:bg-blue-500/20 dark:text-blue-400"
        >
          <HelpCircle className="h-3 w-3" />
          {t(g.btnLabel, locale)}
        </button>
      </DialogTrigger>

      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <HelpCircle className="h-5 w-5 text-blue-500" />
            {t(g.title, locale)}
          </DialogTitle>
          <DialogDescription>{t(g.subtitle, locale)}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          {/* Multi-model explanation */}
          <section className="space-y-3 rounded-xl border border-purple-500/20 bg-purple-500/5 p-4">
            <h4 className="flex items-center gap-1.5 text-sm font-semibold">
              <Brain className="h-4 w-4 text-purple-500" />
              {t(g.modelsTitle, locale)}
            </h4>
            <div className="flex items-center justify-center gap-3 py-2">
              <div className="flex flex-col items-center gap-1">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#10A37F]/10 text-[#10A37F]">
                  <span className="text-xs font-bold">GPT</span>
                </div>
              </div>
              <span className="text-lg text-muted-foreground/40">+</span>
              <div className="flex flex-col items-center gap-1">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#D97706]/10 text-[#D97706]">
                  <span className="text-xs font-bold">CL</span>
                </div>
              </div>
              <span className="text-lg text-muted-foreground/40">+</span>
              <div className="flex flex-col items-center gap-1">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#4285F4]/10 text-[#4285F4]">
                  <span className="text-xs font-bold">GEM</span>
                </div>
              </div>
              <span className="text-lg text-muted-foreground/40">=</span>
              <div className="flex flex-col items-center gap-1">
                <div className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold text-white ${avgScore >= 75 ? "bg-blue-500" : avgScore >= 50 ? "bg-yellow-500" : "bg-red-500"}`}>
                  {avgScore}
                </div>
                <span className="text-[10px] text-muted-foreground">avg</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">{t(g.modelsDesc, locale)}</p>
          </section>

          {/* Score ranges */}
          <section className="space-y-3 rounded-xl border p-4">
            <h4 className="flex items-center gap-1.5 text-sm font-semibold">
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
              {t(g.scaleTitle, locale)}
            </h4>

            <ScoreRangeBar avgScore={avgScore} />

            <div className="space-y-3">
              <div className="flex gap-2.5">
                <div className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-blue-400" />
                <div>
                  <p className="text-xs font-semibold">{t(g.range75, locale)}</p>
                  <p className="text-xs text-muted-foreground">{t(g.range75Desc, locale)}</p>
                </div>
              </div>
              <div className="flex gap-2.5">
                <div className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-yellow-400" />
                <div>
                  <p className="text-xs font-semibold">{t(g.range50, locale)}</p>
                  <p className="text-xs text-muted-foreground">{t(g.range50Desc, locale)}</p>
                </div>
              </div>
              <div className="flex gap-2.5">
                <div className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-red-400" />
                <div>
                  <p className="text-xs font-semibold">{t(g.range0, locale)}</p>
                  <p className="text-xs text-muted-foreground">{t(g.range0Desc, locale)}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Must-Have vs Nice-to-Have */}
          <section className="space-y-2 rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
            <h4 className="flex items-center gap-1.5 text-sm font-semibold">
              <Target className="h-4 w-4 text-blue-500" />
              {t(g.matchTitle, locale)}
            </h4>
            <p className="text-sm leading-relaxed text-muted-foreground">{t(g.matchDesc, locale)}</p>
          </section>

          {/* Strengths & Gaps */}
          <section className="space-y-2 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
            <h4 className="flex items-center gap-1.5 text-sm font-semibold">
              <Sparkles className="h-4 w-4 text-amber-500" />
              {t(g.insightsTitle, locale)}
            </h4>
            <p className="text-sm leading-relaxed text-muted-foreground">{t(g.insightsDesc, locale)}</p>
          </section>

          {/* FAQ */}
          <section className="space-y-2">
            <h4 className="flex items-center gap-1.5 text-sm font-semibold">
              <MessageCircleQuestion className="h-4 w-4 text-muted-foreground" />
              {t(g.faqTitle, locale)}
            </h4>
            <Accordion type="single" collapsible>
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`}>
                  <AccordionTrigger className="text-sm">{faq.q}</AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
