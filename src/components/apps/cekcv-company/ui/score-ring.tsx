"use client";

import { useAnimatedCounter } from "@/hooks/use-animated-counter";
import { scoreColor, scoreRingStroke } from "../utils";

export function AnimatedStat({ value, className }: { value: number; className?: string }) {
  const animated = useAnimatedCounter(value);
  return <span className={className}>{animated}</span>;
}

export function ScoreRing({ score, size = 44 }: { score: number; size?: number }) {
  const animated = useAnimatedCounter(score);
  const isLarge = size >= 64;
  const strokeWidth = isLarge ? 4 : 3.5;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (circumference * Math.min(score, 100)) / 100;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" strokeWidth={strokeWidth}
          className="stroke-muted/30"
        />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" strokeWidth={strokeWidth}
          className={scoreRingStroke(score)}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1.2s ease-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`font-bold leading-none ${scoreColor(score)} ${isLarge ? "text-lg" : "text-sm"}`}>{animated}</span>
      </div>
    </div>
  );
}
