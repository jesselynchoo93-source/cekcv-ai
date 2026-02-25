"use client";

import Link from "next/link";
import { CekCVCompany } from "@/components/apps/cekcv-company";
import { ThemeToggle } from "@/components/apps/cekcv-individual/ui/theme-toggle";
import { LanguageToggle } from "@/components/apps/cekcv-individual/ui/language-toggle";
import { CekCVLogo } from "@/components/ui/logo";
import { useLanguage } from "@/contexts/language-context";
import { translations, t } from "@/lib/translations";

export default function CompanyPage() {
  const { locale } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto max-w-5xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                <CekCVLogo size="sm" />
                CekCV.Ai
              </Link>
              <span className="text-muted-foreground">/</span>
              <span className="text-sm font-medium">{t(translations.nav.company, locale)}</span>
            </div>
            <div className="flex items-center gap-1">
              <LanguageToggle />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <CekCVCompany />
      </main>
    </div>
  );
}
