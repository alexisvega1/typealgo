"use client";

import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useClientMounted } from "@/lib/use-client-mounted";
import { useStatsStore } from "@/stores/stats-store";

export function WpmChart() {
  const mounted = useClientMounted();
  const results = useStatsStore((s) => s.results);

  const data = useMemo(() => {
    return results.slice(-30).map((r, i) => ({
      idx: i + 1,
      wpm: r.wpm,
      accuracy: r.accuracy,
      label: new Date(r.timestamp).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      }),
    }));
  }, [results]);

  return (
    <section className="card">
      <h2 className="card-title">WPM Trend</h2>
      <p className="card-subtitle">Last {Math.min(30, results.length)} sessions</p>

      <div className="mt-4 h-56">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-muted">
            Complete a session to see your trend
          </div>
        ) : mounted ? (
          <ResponsiveContainer width="100%" height="100%" minWidth={260} minHeight={140}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="wpmGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#e2b714" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#e2b714" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2e" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fill: "#71717a", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#71717a", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                domain={[0, "auto"]}
              />
              <Tooltip
                contentStyle={{
                  background: "#18181b",
                  border: "1px solid #27272a",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                labelStyle={{ color: "#a1a1aa" }}
              />
              <Area
                type="monotone"
                dataKey="wpm"
                stroke="#e2b714"
                strokeWidth={2}
                fill="url(#wpmGrad)"
                dot={{ fill: "#e2b714", r: 3 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : null}
      </div>
    </section>
  );
}
