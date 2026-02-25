"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { Locale } from "@/lib/translations";

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggle: () => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  locale: "en",
  setLocale: () => {},
  toggle: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  // Load saved preference on mount
  useEffect(() => {
    const saved = localStorage.getItem("cekcv-locale") as Locale | null;
    if (saved === "en" || saved === "id") {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem("cekcv-locale", l);
  }, []);

  const toggle = useCallback(() => {
    setLocale(locale === "en" ? "id" : "en");
  }, [locale, setLocale]);

  return (
    <LanguageContext.Provider value={{ locale, setLocale, toggle }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
