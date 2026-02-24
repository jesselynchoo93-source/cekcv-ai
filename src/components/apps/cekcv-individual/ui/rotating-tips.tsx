"use client";

import { useEffect, useState } from "react";
import { Lightbulb } from "lucide-react";
import { ROTATING_TIPS } from "../constants";

export function RotatingTips() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % ROTATING_TIPS.length);
        setVisible(true);
      }, 300);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-start gap-2 rounded-lg bg-muted/50 px-4 py-3">
      <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-yellow-500" />
      <p
        className={`text-sm text-muted-foreground transition-opacity duration-300 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      >
        {ROTATING_TIPS[index]}
      </p>
    </div>
  );
}
