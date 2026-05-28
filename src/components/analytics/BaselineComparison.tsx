"use client";

import { useMemo, useState } from "react";
import { EnglishBaselineModal } from "@/components/baseline/EnglishBaselineModal";
import { useStatsStore } from "@/stores/stats-store";

function avg(nums: number[]): number {
  if (nums.length === 0) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

export function BaselineComparison() {
  const results = useStatsStore((s) => s.results);
  const baselines = useStatsStore((s) => s.englishBaselines ?? []);
  const [open, setOpen] = useState(false);

  const stats = useMemo(() => {
    const codeWpms = results.map((r) => r.wpm);
    const baseWpms = baselines.map((b) => b.wpm);
    const codeAvg = round1(avg(codeWpms));
    const baseAvg = round1(avg(baseWpms));
    const baseBest = baseWpms.length ? Math.max(...baseWpms) : 0;
    const ratio = codeAvg > 0 && baseAvg > 0 ? baseAvg / codeAvg : 0;
    return { codeAvg, baseAvg, baseBest, ratio, baseCount: baselines.length };
  }, [results, baselines]);

  return (
    <section className="card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="card-title">English baseline</h2>
          <p className="mt-1 text-sm text-muted">
            Plain-English typing speed as a control for your code WPM
          </p>
        </div>
        <button type="button" className="btn-secondary shrink-0" onClick={() => setOpen(true)}>
          Run 30s test
        </button>
      </div>

      {stats.baseCount === 0 ? (
        <p className="mt-5 text-sm text-muted">
          No baseline yet. Run a quick 30-second English test to see how much of your code WPM gap
          is symbols and structure vs. raw typing speed.
        </p>
      ) : (
        <>
          <div className="mt-5 grid grid-cols-3 gap-3">
            <Cell label="English avg" value={stats.baseAvg} accent />
            <Cell label="English best" value={stats.baseBest} />
            <Cell label="Code avg" value={stats.codeAvg} />
          </div>

          {stats.ratio > 0 && (
            <p className="mt-4 text-sm text-muted">
              You type{" "}
              <span className="font-semibold text-foreground">{stats.ratio.toFixed(1)}×</span>{" "}
              faster on plain English than on code. Code WPM here counts only the characters you
              actually press (indentation, newlines and auto-paired brackets are excluded), so the
              gap reflects symbol reach and problem-solving load — not a measurement error.
            </p>
          )}
          <p className="mt-2 text-xs text-muted opacity-70">
            Based on {stats.baseCount} baseline {stats.baseCount === 1 ? "run" : "runs"}.
          </p>
        </>
      )}

      <EnglishBaselineModal open={open} onClose={() => setOpen(false)} />
    </section>
  );
}

function Cell({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className="rounded-lg bg-surface-2 px-3 py-3 text-center">
      <div
        className={`text-2xl font-semibold tabular-nums ${accent ? "text-accent" : "text-foreground"}`}
      >
        {value}
      </div>
      <div className="mt-0.5 text-xs uppercase tracking-wider text-muted">{label}</div>
    </div>
  );
}
