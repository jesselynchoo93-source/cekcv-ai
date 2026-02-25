"use client";

import {
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";
import type { ScoreCategory } from "../types";

interface RadarChartProps {
  data: ScoreCategory[];
}

/** Recharts custom tick that wraps long labels across multiple lines */
function WrappedTick({
  payload,
  x,
  y,
  textAnchor,
}: {
  payload: { value: string };
  x: number;
  y: number;
  textAnchor: "start" | "middle" | "end" | "inherit" | undefined;
}) {
  const label = payload.value;
  const maxChars = 18;

  // Split into lines by word boundaries
  const words = label.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    if (current && (current + " " + word).length > maxChars) {
      lines.push(current);
      current = word;
    } else {
      current = current ? current + " " + word : word;
    }
  }
  if (current) lines.push(current);

  // Offset so multi-line labels don't overlap the chart
  const lineHeight = 14;
  const offsetY = -((lines.length - 1) * lineHeight) / 2;

  return (
    <text
      x={x}
      y={y + offsetY}
      textAnchor={textAnchor}
      fontSize={11}
      fill="hsl(var(--muted-foreground))"
    >
      {lines.map((line, i) => (
        <tspan key={i} x={x} dy={i === 0 ? 0 : lineHeight}>
          {line}
        </tspan>
      ))}
    </text>
  );
}

export function RadarChart({ data }: RadarChartProps) {
  const chartData = data.map((item) => ({
    category: item.category,
    score: item.weighted_max > 0
      ? Math.round((item.weighted_current / item.weighted_max) * 100)
      : item.score,
    fullMark: 100,
  }));

  if (chartData.length < 3) return null;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsRadarChart data={chartData} cx="50%" cy="50%" outerRadius="60%">
        <PolarGrid stroke="hsl(var(--border))" />
        <PolarAngleAxis
          dataKey="category"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          tick={WrappedTick as any}
        />
        <Radar
          dataKey="score"
          stroke="hsl(var(--primary))"
          fill="hsl(var(--primary))"
          fillOpacity={0.15}
          strokeWidth={2}
        />
      </RechartsRadarChart>
    </ResponsiveContainer>
  );
}
