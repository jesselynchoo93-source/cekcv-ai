"use client";

import { useAnimatedCounter } from "@/hooks/use-animated-counter";

interface ScoreGaugeProps {
  currentScore: number;
  potentialScore: number;
  size?: number;
}

export function ScoreGauge({ currentScore, potentialScore, size = 200 }: ScoreGaugeProps) {
  const animatedScore = useAnimatedCounter(currentScore);
  const center = size / 2;
  const strokeWidth = 12;
  const radius = center - strokeWidth;
  // Semicircle: half circumference
  const circumference = Math.PI * radius;

  const currentOffset = circumference - (circumference * Math.min(currentScore, 100)) / 100;
  const potentialOffset = circumference - (circumference * Math.min(potentialScore, 100)) / 100;

  const scoreColor =
    currentScore >= 80
      ? "stroke-green-500"
      : currentScore >= 60
        ? "stroke-yellow-500"
        : "stroke-red-500";

  const textColor =
    currentScore >= 80
      ? "text-green-500"
      : currentScore >= 60
        ? "text-yellow-500"
        : "text-red-500";

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size / 2 + 20} viewBox={`0 0 ${size} ${size / 2 + 20}`}>
        {/* Background track */}
        <path
          d={`M ${strokeWidth} ${center} A ${radius} ${radius} 0 0 1 ${size - strokeWidth} ${center}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/30"
          strokeLinecap="round"
        />
        {/* Potential score arc (lighter) */}
        <path
          d={`M ${strokeWidth} ${center} A ${radius} ${radius} 0 0 1 ${size - strokeWidth} ${center}`}
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-green-500/20"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={potentialOffset}
          style={{ transition: "stroke-dashoffset 1.5s ease-out" }}
        />
        {/* Current score arc */}
        <path
          d={`M ${strokeWidth} ${center} A ${radius} ${radius} 0 0 1 ${size - strokeWidth} ${center}`}
          fill="none"
          strokeWidth={strokeWidth}
          className={scoreColor}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={currentOffset}
          style={{ transition: "stroke-dashoffset 1.5s ease-out" }}
        />
        {/* Score text */}
        <text
          x={center}
          y={center - 10}
          textAnchor="middle"
          className={`fill-current ${textColor}`}
          style={{ fontSize: size * 0.22, fontWeight: 700 }}
        >
          {animatedScore}
        </text>
        <text
          x={center}
          y={center + 12}
          textAnchor="middle"
          className="fill-muted-foreground"
          style={{ fontSize: size * 0.07 }}
        >
          out of 100
        </text>
      </svg>
      {potentialScore > currentScore && (
        <p className="mt-1 text-sm text-muted-foreground">
          Potential: <span className="font-semibold text-green-500">{potentialScore}</span>
          <span className="ml-1 text-xs">(+{potentialScore - currentScore} points)</span>
        </p>
      )}
    </div>
  );
}
