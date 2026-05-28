"use client";

import { useMemo } from "react";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { getPatternPack } from "@/data/curriculum";
import { aggregatePatternStats } from "@/lib/metrics";
import type { Pattern } from "@/lib/types";
import { useStatsStore } from "@/stores/stats-store";

/** Fixed axes so the radar keeps its polygon shape even with sparse data. */
const RADAR_PATTERNS: Pattern[] = [
  "hash-map",
  "sliding-window",
  "two-pointers",
  "binary-search",
  "dfs-bfs",
  "dynamic-programming",
  "heap",
  "graphs",
];

/** Compact axis labels — long names split across two lines. */
function radarAxisLines(pattern: Pattern): string[] {
  switch (pattern) {
    case "dynamic-programming":
      return ["Dynamic", "Programming"];
    case "sliding-window":
      return ["Sliding", "Window"];
    default:
      return [getPatternPack(pattern)?.name ?? pattern];
  }
}

interface RadarTickProps {
  x?: string | number;
  y?: string | number;
  cx?: string | number;
  cy?: string | number;
  payload?: { value: string; payload?: { patternLines?: string[] } };
}

function RadarAxisTick(props: RadarTickProps) {
  const x = Number(props.x ?? 0);
  const y = Number(props.y ?? 0);
  const cx = Number(props.cx ?? 0);
  void Number(props.cy ?? 0);
  const { payload } = props;
  const lines = payload?.payload?.patternLines ?? [payload?.value ?? ""];
  const dx = x - cx;
  const textAnchor = dx > 12 ? "start" : dx < -12 ? "end" : "middle";

  return (
    <text
      x={x}
      y={y}
      textAnchor={textAnchor}
      dominantBaseline="central"
      fill="#71717a"
      fontSize={10}
    >
      {lines.map((line, i) => (
        <tspan key={line} x={x} dy={i === 0 ? 0 : 11}>
          {line}
        </tspan>
      ))}
    </text>
  );
}

export function SkillRadar() {
  const results = useStatsStore((s) => s.results);

  const data = useMemo(() => {
    const statsMap = new Map(
      aggregatePatternStats(results).map((s) => [s.pattern, s.fluencyScore]),
    );

    return RADAR_PATTERNS.map((pattern) => {
      const patternFull = getPatternPack(pattern)?.name ?? pattern;
      const patternLines = radarAxisLines(pattern);
      return {
        pattern: patternFull,
        patternLines,
        patternFull,
        score: statsMap.get(pattern) ?? 0,
        fullMark: 100,
      };
    });
  }, [results]);

  const hasData = results.length > 0;

  return (
    <section className="card h-full">
      <h2 className="card-title">Pattern Fluency</h2>
      <p className="card-subtitle">Algorithmic recall by pattern pack</p>

      <div className="chart-radar-shell mt-4">
        <ResponsiveContainer width="100%" height="100%" minWidth={260} minHeight={260}>
          <RadarChart
            data={data}
            cx="50%"
            cy="50%"
            outerRadius="62%"
            margin={{ top: 12, right: 28, bottom: 12, left: 28 }}
          >
            <PolarGrid stroke="#2a2a2e" gridType="polygon" />
            <PolarAngleAxis
              dataKey="pattern"
              tick={(props) => <RadarAxisTick {...props} />}
              tickLine={false}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tickCount={5}
              tick={{ fill: "#52525b", fontSize: 9 }}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                background: "#18181b",
                border: "1px solid #27272a",
                borderRadius: 8,
                fontSize: 12,
              }}
              labelFormatter={(_, payload) =>
                (payload?.[0]?.payload as { patternFull?: string })?.patternFull ?? ""
              }
              formatter={(value) => [`${value}`, "Fluency"]}
            />
            <Radar
              name="Fluency"
              dataKey="score"
              stroke="#e2b714"
              fill="#e2b714"
              fillOpacity={hasData ? 0.25 : 0.05}
              strokeWidth={2}
              dot={hasData ? { fill: "#e2b714", r: 3 } : false}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {!hasData && (
        <p className="mt-2 text-center text-xs text-muted">
          Complete sessions across patterns to fill the radar
        </p>
      )}
    </section>
  );
}
