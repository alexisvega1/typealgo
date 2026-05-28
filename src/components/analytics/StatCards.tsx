"use client";

import { useMemo } from "react";
import { aggregatePatternStats, fluencyScore } from "@/lib/metrics";
import { getPatternPack } from "@/data/curriculum";
import { useStatsStore } from "@/stores/stats-store";

export function StatCards() {
  const results = useStatsStore((s) => s.results);
  const totalSessions = useStatsStore((s) => s.totalSessions);
  const totalMinutes = useStatsStore((s) => s.totalMinutes);
  const streak = useStatsStore((s) => s.streak);

  const summary = useMemo(() => {
    if (results.length === 0) {
      return { avgWpm: 0, avgAcc: 0, bestWpm: 0, fluency: 0 };
    }
    const avgWpm = results.reduce((a, r) => a + r.wpm, 0) / results.length;
    const avgAcc = results.reduce((a, r) => a + r.accuracy, 0) / results.length;
    const bestWpm = Math.max(...results.map((r) => r.wpm));
    return {
      avgWpm: Math.round(avgWpm * 10) / 10,
      avgAcc: Math.round(avgAcc * 10) / 10,
      bestWpm,
      fluency: fluencyScore(avgWpm, avgAcc, results.length),
    };
  }, [results]);

  const cards = [
    { label: "Fluency Score", value: summary.fluency, suffix: "/100", accent: true },
    { label: "Avg WPM", value: summary.avgWpm, suffix: "" },
    { label: "Avg Accuracy", value: summary.avgAcc, suffix: "%" },
    { label: "Best WPM", value: summary.bestWpm, suffix: "" },
    { label: "Sessions", value: totalSessions, suffix: "" },
    { label: "Time Typed", value: totalMinutes, suffix: " min" },
    { label: "Current Streak", value: streak.current, suffix: " days" },
    { label: "Best Streak", value: streak.longest, suffix: " days" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {cards.map((c) => (
        <div key={c.label} className="stat-card">
          <div className={`stat-card-value ${c.accent ? "text-accent" : ""}`}>
            {c.value}
            {c.suffix && <span className="text-base text-muted">{c.suffix}</span>}
          </div>
          <div className="stat-card-label">{c.label}</div>
        </div>
      ))}
    </div>
  );
}

export function PatternBreakdown() {
  const results = useStatsStore((s) => s.results);
  const stats = useMemo(() => aggregatePatternStats(results), [results]);

  if (stats.length === 0) {
    return (
      <section className="card">
        <h2 className="card-title">Pattern Breakdown</h2>
        <p className="mt-4 text-sm text-muted">No sessions yet — start typing to build your profile.</p>
      </section>
    );
  }

  return (
    <section className="card">
      <h2 className="card-title">Pattern Breakdown</h2>
      <p className="card-subtitle">Performance by algorithmic pattern</p>

      <div className="mt-4 space-y-3">
        {stats.map((s) => {
          const pack = getPatternPack(s.pattern);
          return (
            <div key={s.pattern} className="pattern-row">
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: pack?.color ?? "#e2b714" }}
                />
                <span className="truncate font-medium">{pack?.name ?? s.pattern}</span>
                <span className="text-xs text-muted">{s.sessions} sessions</span>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span>{s.avgWpm} wpm</span>
                <span className="text-muted">{s.avgAccuracy}%</span>
                <span className="fluency-badge">{s.fluencyScore}</span>
              </div>
              <div className="pattern-bar-track">
                <div
                  className="pattern-bar-fill"
                  style={{
                    width: `${s.fluencyScore}%`,
                    backgroundColor: pack?.color ?? "#e2b714",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function RecentSessions() {
  const results = useStatsStore((s) => s.results);
  const recent = results.slice(-10).reverse();

  return (
    <section className="card">
      <h2 className="card-title">Recent Sessions</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="sessions-table">
          <thead>
            <tr>
              <th>Pattern</th>
              <th>WPM</th>
              <th>Accuracy</th>
              <th>Difficulty</th>
              <th>When</th>
            </tr>
          </thead>
          <tbody>
            {recent.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-muted">
                  No sessions yet
                </td>
              </tr>
            ) : (
              recent.map((r) => (
                <tr key={r.id}>
                  <td>{getPatternPack(r.pattern)?.name ?? r.pattern}</td>
                  <td className="text-accent">{r.wpm}</td>
                  <td>{r.accuracy}%</td>
                  <td className="capitalize">{r.difficulty}</td>
                  <td className="text-muted">
                    {new Date(r.timestamp).toLocaleString(undefined, {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
