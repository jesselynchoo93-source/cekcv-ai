"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";

export function ConfettiTrigger({ score }: { score: number }) {
  useEffect(() => {
    if (score > 80) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [score]);

  return null;
}
