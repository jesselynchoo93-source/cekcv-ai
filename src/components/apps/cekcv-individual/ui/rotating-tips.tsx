"use client";

import { useEffect, useState, useCallback } from "react";
import { Lightbulb } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { translations } from "@/lib/translations";

export function RotatingTips() {
  const { locale } = useLanguage();
  const tips = translations.tips;
  const [index, setIndex] = useState(0);
  const [fading, setFading] = useState(false);

  const advance = useCallback(() => {
    setFading(true);
  }, []);

  // Rotate every 8 seconds
  useEffect(() => {
    const interval = setInterval(advance, 8000);
    return () => clearInterval(interval);
  }, [advance]);

  // When fade-out completes, swap text and fade back in
  const handleTransitionEnd = useCallback(() => {
    if (fading) {
      setIndex((prev) => (prev + 1) % tips.length);
      setFading(false);
    }
  }, [fading, tips.length]);

  return (
    <div className="flex items-start gap-2 rounded-lg bg-muted/50 px-4 py-3">
      <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-yellow-500" />
      <p
        className={`text-sm text-muted-foreground transition-opacity duration-300 ${
          fading ? "opacity-0" : "opacity-100"
        }`}
        onTransitionEnd={handleTransitionEnd}
      >
        {tips[index][locale]}
      </p>
    </div>
  );
}
