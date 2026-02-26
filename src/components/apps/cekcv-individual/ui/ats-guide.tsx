"use client";

import { HelpCircle, TrendingUp, BarChart3, MessageCircleQuestion } from "lucide-react";
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

interface AtsGuideProps {
  currentScore: number;
  potentialScore: number;
}

function ScoreRangeBar({ score }: { score: number }) {
  const pct = Math.min(Math.max(score, 0), 100);
  return (
    <div className="relative mt-2 mb-10">
      <div className="flex h-3 overflow-hidden rounded-full">
        <div className="w-[49%] bg-red-400/80" />
        <div className="w-[20%] bg-yellow-400/80" />
        <div className="w-[31%] bg-blue-400/80" />
      </div>
      {/* Score marker */}
      <div
        className="absolute -top-1 h-5 w-0.5 rounded-full bg-foreground"
        style={{ left: `${pct}%` }}
      />
      <div
        className="absolute top-6 -translate-x-1/2 rounded bg-foreground px-1.5 py-0.5 text-[10px] font-bold text-background"
        style={{ left: `${pct}%` }}
      >
        {score}
      </div>
    </div>
  );
}

export function AtsGuide({ currentScore, potentialScore }: AtsGuideProps) {
  const { locale } = useLanguage();
  const g = translations.atsGuide;

  const verdictKey =
    currentScore >= 70 ? "verdictHigh" : currentScore >= 50 ? "verdictMid" : "verdictLow";

  const potentialKey =
    potentialScore >= 70
      ? "potentialExplainGood"
      : potentialScore >= 50
        ? "potentialExplainOk"
        : "potentialExplainLow";

  const potentialText = t(g[potentialKey], locale).replace("{potential}", String(potentialScore));

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
          className="ml-1 inline-flex items-center gap-1 rounded-full border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-600 transition-colors hover:border-blue-500/50 hover:bg-blue-500/20 dark:text-blue-400"
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
          {/* Personalized verdict */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white ${
                  currentScore >= 70
                    ? "bg-blue-500"
                    : currentScore >= 50
                      ? "bg-yellow-500"
                      : "bg-red-500"
                }`}
              >
                {currentScore}
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                {t(g.yourScore, locale)}
              </span>
            </div>
            <p className="text-sm leading-relaxed">{t(g[verdictKey], locale)}</p>
          </section>

          {/* Score ranges */}
          <section className="space-y-3 rounded-xl border p-4">
            <h4 className="flex items-center gap-1.5 text-sm font-semibold">
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
              {t(g.scaleTitle, locale)}
            </h4>

            <ScoreRangeBar score={currentScore} />

            <div className="space-y-3">
              <div className="flex gap-2.5">
                <div className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-blue-400" />
                <div>
                  <p className="text-xs font-semibold">{t(g.range70, locale)}</p>
                  <p className="text-xs text-muted-foreground">{t(g.range70Desc, locale)}</p>
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

          {/* Potential score explanation */}
          {potentialScore > currentScore && (
            <section className="space-y-2 rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
              <h4 className="flex items-center gap-1.5 text-sm font-semibold">
                <TrendingUp className="h-4 w-4 text-blue-500" />
                {t(g.potentialTitle, locale)}
              </h4>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold tabular-nums text-blue-500">
                  {currentScore}
                </span>
                <span className="text-muted-foreground">&rarr;</span>
                <span className="text-2xl font-bold tabular-nums text-blue-500">
                  {potentialScore}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">{potentialText}</p>
            </section>
          )}

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
