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

export function RadarChart({ data }: RadarChartProps) {
  const chartData = data.map((item) => ({
    category: item.category.length > 20
      ? item.category.slice(0, 18) + "..."
      : item.category,
    score: item.weighted_max > 0
      ? Math.round((item.weighted_current / item.weighted_max) * 100)
      : item.score,
    fullMark: 100,
  }));

  if (chartData.length < 3) return null;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsRadarChart data={chartData} cx="50%" cy="50%" outerRadius="75%">
        <PolarGrid stroke="hsl(var(--border))" />
        <PolarAngleAxis
          dataKey="category"
          tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
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
