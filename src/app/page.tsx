"use client";

import { useState, useRef, useEffect } from "react";
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
  CheckCircle2,
  Download,
  Star,
  Quote,
  LayoutList,
  Scale,
  FilePlus2,
  Eye,
} from "lucide-react";
import { ThemeToggle } from "@/components/apps/cekcv-individual/ui/theme-toggle";
import { LanguageToggle } from "@/components/apps/cekcv-individual/ui/language-toggle";
import { CekCVLogo } from "@/components/ui/logo";
import { useLanguage } from "@/contexts/language-context";
import { translations, t } from "@/lib/translations";

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

type Mode = "individual" | "company";

export default function Dashboard() {
  const { locale } = useLanguage();
  const l = translations.landing;
  const [mode, setMode] = useState<Mode>("individual");
  const getStartedRef = useRef<HTMLDivElement>(null);
  const individualVideoRef = useRef<HTMLVideoElement>(null);
  const companyVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const videos = [individualVideoRef.current, companyVideoRef.current].filter(Boolean) as HTMLVideoElement[];
    if (videos.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.3 }
    );
    videos.forEach((v) => observer.observe(v));
    return () => observer.disconnect();
  }, [mode]);

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
        { icon: Download, title: t(l.feat3Title, locale), desc: t(l.feat3Desc, locale), badges: ["PDF", "DOCX"] },
        { icon: LinkedInIcon, title: t(l.feat4Title, locale), desc: t(l.feat4Desc, locale) },
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

            {/* Powered by 3 AI models — with logos */}
            <div className="mb-6 inline-flex items-center gap-3 rounded-full border bg-background/80 px-5 py-2.5 shadow-sm backdrop-blur">
              <span className="text-sm font-medium text-muted-foreground">{t(l.badge, locale)}</span>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-2.5">
                {/* OpenAI */}
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"/>
                </svg>
                {/* Anthropic */}
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13.827 3.52h3.603L24 20.48h-3.603l-6.57-16.96zm-7.258 0h3.767L16.906 20.48h-3.674l-1.343-3.461H5.017l-1.344 3.46H0l6.57-16.96zm2.327 5.15L6.27 14.981h5.252L8.896 8.67z"/>
                </svg>
                {/* Google — optically smaller to match the others */}
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
                </svg>
              </div>
            </div>
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

      {/* Why 3 AI Models — dedicated section */}
      <section className="border-t">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">{t(l.whyTitle, locale)}</h2>
          <p className="mx-auto mt-2 max-w-2xl text-center text-base text-muted-foreground">
            {t(l.whySubtitle, locale)}
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {/* GPT */}
            <div className="rounded-xl border bg-card p-5 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#10a37f]/10">
                <svg className="h-6 w-6 text-[#10a37f]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"/>
                </svg>
              </div>
              <h3 className="mt-3 text-lg font-semibold">{t(l.whyGptTitle, locale)}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{t(l.whyGptDesc, locale)}</p>
            </div>

            {/* Claude */}
            <div className="rounded-xl border bg-card p-5 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#d4a574]/10">
                <svg className="h-6 w-6 text-[#d4a574]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13.827 3.52h3.603L24 20.48h-3.603l-6.57-16.96zm-7.258 0h3.767L16.906 20.48h-3.674l-1.343-3.461H5.017l-1.344 3.46H0l6.57-16.96zm2.327 5.15L6.27 14.981h5.252L8.896 8.67z"/>
                </svg>
              </div>
              <h3 className="mt-3 text-lg font-semibold">{t(l.whyClaudeTitle, locale)}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{t(l.whyClaudeDesc, locale)}</p>
            </div>

            {/* Gemini */}
            <div className="rounded-xl border bg-card p-5 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#4285F4]/10">
                <svg className="h-6 w-6 text-[#4285F4]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
                </svg>
              </div>
              <h3 className="mt-3 text-lg font-semibold">{t(l.whyGeminiTitle, locale)}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{t(l.whyGeminiDesc, locale)}</p>
            </div>
          </div>

          <p className="mx-auto mt-8 max-w-lg rounded-lg border bg-muted/30 px-4 py-3 text-center text-sm font-medium text-muted-foreground">
            {isIndividual ? t(l.whyConsensus, locale) : t(l.whyConsensusCompany, locale)}
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="border-t bg-muted/20">
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
                    {"badges" in feat && (feat as { badges?: string[] }).badges && (
                      <div className="mt-2 flex gap-1.5">
                        {(feat as { badges: string[] }).badges.map((b) => (
                          <span key={b} className="inline-flex items-center rounded-md border bg-muted/40 px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
                            {b}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* See Sample Result */}
      <section className="border-t">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border bg-muted/30 px-3 py-1 text-xs font-medium text-muted-foreground">
              <Eye className="h-3.5 w-3.5" />
              {locale === "en" ? "Preview" : "Pratinjau"}
            </div>
            <h2 className="text-2xl font-bold sm:text-3xl">
              {locale === "en" ? "See what you'll get" : "Lihat apa yang kamu dapatkan"}
            </h2>
            <p className="mt-2 text-base text-muted-foreground">
              {isIndividual
                ? (locale === "en"
                  ? "Here's a real analysis from CekCV. Your CV gets scored, gaps identified, an improved version generated, and matching jobs found — all in one go."
                  : "Ini contoh analisis nyata dari CekCV. CV kamu dinilai, gap diidentifikasi, versi perbaikan dibuat, dan lowongan yang cocok ditemukan — semuanya sekaligus.")
                : (locale === "en"
                  ? "Here's what your screening dashboard looks like. Each candidate is ranked by AI consensus score with detailed breakdowns."
                  : "Ini tampilan dashboard screening kamu. Setiap kandidat di-ranking berdasarkan skor konsensus AI dengan breakdown detail.")}
            </p>
          </div>

          {/* Sample result mockup */}
          <div className="mt-8 overflow-hidden rounded-xl border shadow-lg">
            <div className="bg-muted/30 px-4 py-2.5 text-xs text-muted-foreground flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-yellow-400" />
                <div className="h-3 w-3 rounded-full bg-green-400" />
              </div>
              <span className="ml-2">cekcv.ai{isIndividual ? "/apps/cekcv-individual" : "/apps/cekcv-company"}</span>
            </div>
            {isIndividual ? (
              <div key="individual">
                <video
                  ref={individualVideoRef}
                  className="block w-full"
                  muted
                  loop
                  playsInline
                  preload="metadata"
                >
                  <source src="/demo-individual.mp4" type="video/mp4" />
                </video>
              </div>
            ) : (
              <div key="company">
                <video
                  ref={companyVideoRef}
                  className="block w-full"
                  muted
                  loop
                  playsInline
                  preload="metadata"
                >
                  <source src="/demo-company.mp4" type="video/mp4" />
                </video>
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-center">
            <Button
              size="lg"
              className="cekcv-gradient text-white hover:opacity-90"
              onClick={scrollToGetStarted}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              {isIndividual ? t(l.ctaAnalyze, locale) : t(l.ctaScreen, locale)}
            </Button>
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
      <footer className="border-t py-6">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 px-6">
          <div className="flex items-center gap-2">
            <CekCVLogo size="sm" />
            <span className="text-sm font-medium">CekCV.Ai</span>
          </div>
          <p className="text-center text-xs text-muted-foreground">{t(l.footerTagline, locale)}</p>
          {/* Built with badges */}
          <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
            <a
              href="https://n8n.io"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 transition-colors hover:bg-muted/40"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="#ea4b71" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.4737 5.6842c-1.1772 0-2.1663.8051-2.4468 1.8947h-2.8955c-1.235 0-2.289.893-2.492 2.111l-.1038.623a1.263 1.263 0 0 1-1.246 1.0555H11.289c-.2805-1.0896-1.2696-1.8947-2.4468-1.8947s-2.1663.8051-2.4467 1.8947H4.973c-.2805-1.0896-1.2696-1.8947-2.4468-1.8947C1.1311 9.4737 0 10.6047 0 12s1.131 2.5263 2.5263 2.5263c1.1772 0 2.1663-.8051 2.4468-1.8947h1.4223c.2804 1.0896 1.2696 1.8947 2.4467 1.8947 1.1772 0 2.1663-.8051 2.4468-1.8947h1.0008a1.263 1.263 0 0 1 1.2459 1.0555l.1038.623c.203 1.218 1.257 2.111 2.492 2.111h.3692c.2804 1.0895 1.2696 1.8947 2.4468 1.8947 1.3952 0 2.5263-1.131 2.5263-2.5263s-1.131-2.5263-2.5263-2.5263c-1.1772 0-2.1664.805-2.4468 1.8947h-.3692a1.263 1.263 0 0 1-1.246-1.0555l-.1037-.623A2.52 2.52 0 0 0 13.9607 12a2.52 2.52 0 0 0 .821-1.4794l.1038-.623a1.263 1.263 0 0 1 1.2459-1.0555h2.8955c.2805 1.0896 1.2696 1.8947 2.4468 1.8947 1.3952 0 2.5263-1.131 2.5263-2.5263s-1.131-2.5263-2.5263-2.5263m0 1.2632a1.263 1.263 0 0 1 1.2631 1.2631 1.263 1.263 0 0 1-1.2631 1.2632 1.263 1.263 0 0 1-1.2632-1.2632 1.263 1.263 0 0 1 1.2632-1.2631M2.5263 10.7368A1.263 1.263 0 0 1 3.7895 12a1.263 1.263 0 0 1-1.2632 1.2632A1.263 1.263 0 0 1 1.2632 12a1.263 1.263 0 0 1 1.2631-1.2632m6.3158 0A1.263 1.263 0 0 1 10.1053 12a1.263 1.263 0 0 1-1.2632 1.2632A1.263 1.263 0 0 1 7.579 12a1.263 1.263 0 0 1 1.2632-1.2632m10.1053 3.7895a1.263 1.263 0 0 1 1.2631 1.2632 1.263 1.263 0 0 1-1.2631 1.2631 1.263 1.263 0 0 1-1.2632-1.2631 1.263 1.263 0 0 1 1.2632-1.2632"/>
              </svg>
              <span className="text-xs font-medium text-muted-foreground">
                {locale === "en" ? "Built with n8n" : "Dibangun dengan n8n"}
              </span>
            </a>
            <a
              href="https://claude.com/product/claude-code"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 transition-colors hover:bg-muted/40"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="#D97757" aria-label="Claude">
                <path d="M13.827 3.52h3.603L24 20.48h-3.603l-6.57-16.96zm-7.258 0h3.767L16.906 20.48h-3.674l-1.343-3.461H5.017l-1.344 3.46H0l6.57-16.96zm2.327 5.15L6.27 14.981h5.252L8.896 8.67z"/>
              </svg>
              <span className="text-xs font-medium text-muted-foreground">
                {locale === "en" ? "Designed with Claude" : "Didesain dengan Claude"}
              </span>
            </a>
          </div>
          <p className="mt-1 max-w-xl text-center text-[11px] leading-relaxed text-muted-foreground/50">
            {t(l.disclaimer, locale)}
          </p>
        </div>
      </footer>
    </div>
  );
}
