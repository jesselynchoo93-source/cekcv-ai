"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  Sparkles,
  BarChart3,
  FileText,
  Users,
  ArrowRight,
  Shield,
  Zap,
  Brain,
  Target,
  TrendingUp,
  Briefcase,
  CheckCircle2,
  FileEdit,
  Star,
  Quote,
  LayoutList,
  Scale,
  FilePlus2,
} from "lucide-react";
import { ThemeToggle } from "@/components/apps/cekcv-individual/ui/theme-toggle";
import { LanguageToggle } from "@/components/apps/cekcv-individual/ui/language-toggle";
import { CekCVLogo } from "@/components/ui/logo";
import { useLanguage } from "@/contexts/language-context";
import { translations, t } from "@/lib/translations";

type Mode = "individual" | "company";

export default function Dashboard() {
  const { locale } = useLanguage();
  const l = translations.landing;
  const [mode, setMode] = useState<Mode>("individual");
  const getStartedRef = useRef<HTMLDivElement>(null);

  const isIndividual = mode === "individual";

  // ── Mode-dependent content ──

  const headline = isIndividual
    ? t(l.headline, locale)
    : t(l.companyHeadline, locale);
  const highlight = isIndividual
    ? t(l.headlineHighlight, locale)
    : t(l.companyHighlight, locale);
  const headlineEnd = isIndividual
    ? t(l.headlineEnd, locale)
    : t(l.companyHeadlineEnd, locale);
  const subtitle = isIndividual
    ? t(l.subtitle, locale)
    : t(l.companySubtitle, locale);

  const steps = isIndividual
    ? [
        { icon: Upload, title: t(l.step1Title, locale), desc: t(l.step1Desc, locale) },
        { icon: Brain, title: t(l.step2Title, locale), desc: t(l.step2Desc, locale) },
        { icon: Target, title: t(l.step3Title, locale), desc: t(l.step3Desc, locale) },
      ]
    : [
        { icon: FilePlus2, title: t(l.companyStep1Title, locale), desc: t(l.companyStep1Desc, locale) },
        { icon: Brain, title: t(l.companyStep2Title, locale), desc: t(l.companyStep2Desc, locale) },
        { icon: LayoutList, title: t(l.companyStep3Title, locale), desc: t(l.companyStep3Desc, locale) },
      ];

  const features = isIndividual
    ? [
        { icon: Target, title: t(l.feat1Title, locale), desc: t(l.feat1Desc, locale) },
        { icon: TrendingUp, title: t(l.feat2Title, locale), desc: t(l.feat2Desc, locale) },
        { icon: FileEdit, title: t(l.feat3Title, locale), desc: t(l.feat3Desc, locale) },
        { icon: Briefcase, title: t(l.feat4Title, locale), desc: t(l.feat4Desc, locale) },
      ]
    : [
        { icon: FilePlus2, title: t(l.companyFeat1Title, locale), desc: t(l.companyFeat1Desc, locale) },
        { icon: BarChart3, title: t(l.companyFeat2Title, locale), desc: t(l.companyFeat2Desc, locale) },
        { icon: LayoutList, title: t(l.companyFeat3Title, locale), desc: t(l.companyFeat3Desc, locale) },
        { icon: Scale, title: t(l.companyFeat4Title, locale), desc: t(l.companyFeat4Desc, locale) },
      ];

  const trustItems = isIndividual
    ? [
        { icon: Shield, text: t(l.trustPrivacy, locale) },
        { icon: Zap, text: t(l.trustSpeed, locale) },
        { icon: CheckCircle2, text: t(l.trustNoSignup, locale) },
      ]
    : [
        { icon: FilePlus2, text: t(l.companyTrustBatch, locale) },
        { icon: Scale, text: t(l.companyTrustFair, locale) },
        { icon: CheckCircle2, text: t(l.trustNoSignup, locale) },
      ];

  const scrollToGetStarted = () => {
    getStartedRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const switchMode = (newMode: Mode) => {
    setMode(newMode);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <Link href="/" className="flex items-center gap-2">
            <CekCVLogo size="sm" />
            <span className="text-sm font-semibold">CekCV.Ai</span>
          </Link>
          <div className="flex items-center gap-1">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Mode toggle */}
      <div className="border-b">
        <div className="mx-auto flex max-w-5xl items-center gap-1 px-6 py-2">
          <button
            onClick={() => switchMode("individual")}
            className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              isIndividual
                ? "cekcv-gradient text-white"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            {locale === "en" ? "For Job Seekers" : "Untuk Pencari Kerja"}
          </button>
          <button
            onClick={() => switchMode("company")}
            className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              !isIndividual
                ? "cekcv-gradient text-white"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            {locale === "en" ? "For Recruiters" : "Untuk Recruiter"}
          </button>
        </div>
      </div>

      {/* Hero */}
      <section className="cekcv-hero-bg overflow-hidden">
        <div className="relative z-10 mx-auto max-w-5xl px-6 py-16 sm:py-24">
          <div className="mx-auto max-w-2xl text-center">

            <Badge variant="outline" className="mb-4">
              {t(l.badge, locale)}
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              {headline}{" "}
              <span className="cekcv-gradient-text">{highlight}</span>{" "}
              {headlineEnd}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground sm:text-xl">
              {subtitle}
            </p>
            <div className="mt-8 flex justify-center">
              <Button
                size="lg"
                className="cekcv-gradient text-white hover:opacity-90"
                onClick={scrollToGetStarted}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                {isIndividual ? t(l.ctaAnalyze, locale) : t(l.ctaScreen, locale)}
              </Button>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
              {trustItems.map((item, i) => (
                <span key={i} className="flex items-center gap-1">
                  <item.icon className="h-3.5 w-3.5" />
                  {item.text}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t bg-muted/20">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">{t(l.howTitle, locale)}</h2>
          <p className="mt-2 text-center text-base text-muted-foreground">
            {t(l.howSubtitle, locale)}
          </p>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {steps.map((step, i) => (
              <div key={i} className="relative flex flex-col items-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl cekcv-gradient text-white">
                  <step.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-3 text-lg font-semibold">
                  <span className="text-muted-foreground">{i + 1}.</span> {step.title}
                </h3>
                <p className="mt-1 text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">{t(l.featTitle, locale)}</h2>
          <p className="mt-2 text-center text-base text-muted-foreground">
            {t(l.featSubtitle, locale)}
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {features.map((feat, i) => (
              <div
                key={i}
                className="rounded-xl border bg-card p-5 transition-shadow hover:shadow-md"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg cekcv-gradient text-white">
                    <feat.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{feat.title}</h3>
                    <p className="mt-1 text-muted-foreground">{feat.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Testimonials */}
      <section className="border-t bg-muted/20">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">
            {isIndividual ? t(l.trustTitle, locale) : t(l.companyTrustTitle, locale)}
          </h2>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            <div className="text-center">
              <p className="text-3xl font-bold cekcv-gradient-text">
                {isIndividual ? t(l.trustUsersCount, locale) : t(l.companyTrustUsersCount, locale)}
              </p>
            </div>
            <div className="hidden h-8 w-px bg-border sm:block" />
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="mt-1 text-sm font-semibold">{t(l.trustRating, locale)}</p>
              <p className="text-xs text-muted-foreground">
                {isIndividual ? t(l.trustReviewCount, locale) : t(l.companyTrustReviewCount, locale)}
              </p>
            </div>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {(isIndividual ? translations.testimonials : translations.companyTestimonials).map((review, i) => (
              <div key={i} className="rounded-xl border bg-card p-5">
                <div className="flex items-center gap-0.5">
                  {[...Array(review.rating)].map((_, j) => (
                    <Star key={j} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                  ))}
                  {review.rating < 5 &&
                    [...Array(5 - review.rating)].map((_, j) => (
                      <Star key={`e-${j}`} className="h-3.5 w-3.5 text-muted-foreground/30" />
                    ))}
                </div>
                <div className="mt-3 flex items-start gap-2">
                  <Quote className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/30" />
                  <p className="text-sm text-muted-foreground">{t(review.text, locale)}</p>
                </div>
                <div className="mt-4">
                  <p className="text-sm font-semibold">{review.name}</p>
                  <p className="text-xs text-muted-foreground">{t(review.role, locale)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Get Started — only show the card for the active mode */}
      <section className="border-t bg-gradient-to-b from-blue-50/40 to-background dark:from-blue-950/10 dark:to-background" ref={getStartedRef}>
        <div className="mx-auto max-w-3xl px-6 py-16">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">{t(l.getStarted, locale)}</h2>
          <div className="mt-8">
            {isIndividual ? (
              <Link href="/apps/cekcv-individual">
                <div className="group rounded-2xl border-2 border-blue-500/30 bg-gradient-to-br from-blue-50/80 to-indigo-50/50 p-6 transition-all hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 dark:from-blue-950/30 dark:to-indigo-950/20 dark:hover:shadow-blue-500/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl cekcv-gradient text-white">
                        <FileText className="h-5 w-5" />
                      </div>
                      <h3 className="text-lg font-semibold">CekCV Individual</h3>
                    </div>
                    <Badge variant="default">individual</Badge>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {locale === "en"
                      ? "Upload your CV and job description to get AI-powered scoring, improvement advice, and job recommendations."
                      : "Upload CV dan job description untuk mendapatkan scoring AI, saran perbaikan, dan rekomendasi lowongan kerja."}
                  </p>
                  <div className="mt-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full cekcv-gradient px-4 py-1.5 text-sm font-medium text-white">
                      {t(l.startAnalysis, locale)}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ) : (
              <Link href="/apps/cekcv-company">
                <div className="group rounded-2xl border-2 border-blue-500/30 bg-gradient-to-br from-blue-50/80 to-indigo-50/50 p-6 transition-all hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 dark:from-blue-950/30 dark:to-indigo-950/20 dark:hover:shadow-blue-500/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl cekcv-gradient text-white">
                        <Users className="h-5 w-5" />
                      </div>
                      <h3 className="text-lg font-semibold">CekCV Company</h3>
                    </div>
                    <Badge variant="secondary">company</Badge>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {locale === "en"
                      ? "Upload multiple CVs to score and rank candidates against a job role using 3 AI models."
                      : "Upload banyak CV untuk menilai dan me-ranking kandidat terhadap sebuah posisi menggunakan 3 model AI."}
                  </p>
                  <div className="mt-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full cekcv-gradient px-4 py-1.5 text-sm font-medium text-white">
                      {t(l.startScreening, locale)}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 text-center">
        <div className="flex items-center justify-center gap-2">
          <CekCVLogo size="sm" />
          <p className="text-sm font-medium">CekCV.Ai</p>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {t(l.footerTagline, locale)}
        </p>
        <p className="mx-auto mt-4 max-w-xl text-[11px] leading-relaxed text-muted-foreground/50">
          {t(l.disclaimer, locale)}
        </p>
      </footer>
    </div>
  );
}
