"use client";

import { useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language-context";

const emptySubscribe = () => () => {};

export function LanguageToggle() {
  const { locale, toggle } = useLanguage();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!mounted) return <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" disabled />;

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-8 px-2 text-xs font-medium"
      onClick={toggle}
    >
      <span className={locale === "en" ? "font-bold" : "text-muted-foreground"}>EN</span>
      <span className="mx-1 text-muted-foreground/50">/</span>
      <span className={locale === "id" ? "font-bold" : "text-muted-foreground"}>ID</span>
    </Button>
  );
}
