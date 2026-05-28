"use client";

import Link from "next/link";
import { CURRICULUM_TIERS, PATTERN_PACKS, SNIPPETS, snippetsByTier } from "@/data/curriculum";
import { getMotifInfo } from "@/data/curriculum/motifs";
import {
  DAILY_PLAN,
  computeMotifWeaknesses,
  computeTierProgress,
  dailyPlanProgress,
  suggestResurface,
} from "@/lib/curriculum";
import { useStatsStore } from "@/stores/stats-store";
import { ContentStrategyPanel } from "./ContentStrategyPanel";
import { CareerTracksPanel } from "./CareerTracksPanel";
import { LanguageStackPanel } from "./LanguageStackPanel";
import { EvidenceCredibilityPanel } from "./EvidenceCredibilityPanel";
import { useSettingsStore } from "@/stores/settings-store";

export function CurriculumOverview() {
  const results = useStatsStore((s) => s.results);
  const { companyTrack, careerLevel } = useSettingsStore();
  const tierProgress = computeTierProgress(results);
  const weaknesses = computeMotifWeaknesses(results);
  const resurface = suggestResurface(results, 6, companyTrack, careerLevel);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Curriculum</h1>
        <p className="mt-1 text-muted hero-tagline">
          {SNIPPETS.length} canonical snippets · fluency density over breadth
        </p>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        {CURRICULUM_TIERS.map((tier) => {
          const prog = tierProgress.find((p) => p.tier === tier.id)!;
          const count = snippetsByTier(tier.id).length;
          return (
            <div key={tier.id} className="card">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="card-title" style={{ color: tier.color }}>
                    {tier.name}
                  </h2>
                  <p className="card-subtitle">{tier.description}</p>
                </div>
                <span className="fluency-badge">{count}</span>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Mastered (≥90% acc)</span>
                  <span>
                    {prog.completed}/{prog.total}
                  </span>
                </div>
                <div className="pattern-bar-track mt-2">
                  <div
                    className="pattern-bar-fill"
                    style={{ width: `${prog.percent}%`, backgroundColor: tier.color }}
                  />
                </div>
              </div>
              <p className="mt-3 text-xs text-muted">
                Roadmap target: {tier.targetCount} motifs
              </p>
            </div>
          );
        })}
      </section>

      <section className="mt-8 card">
        <h2 className="card-title">7-Day Interview Reflex Plan</h2>
        <p className="card-subtitle">Daily pattern focus — repetition over novelty</p>
        <div className="mt-4 space-y-3">
          {DAILY_PLAN.map((day) => {
            const { done, total } = dailyPlanProgress(day, results);
            return (
              <div key={day.day} className="daily-plan-row">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="daily-plan-day">Day {day.day}</span>
                  <span className="truncate font-medium">{day.label}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-muted">
                    {done}/{total}
                  </span>
                  <div className="w-24 pattern-bar-track">
                    <div
                      className="pattern-bar-fill"
                      style={{ width: `${total ? (done / total) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {weaknesses.length > 0 && (
        <section className="mt-8 card">
          <h2 className="card-title">Syntax Motif Weaknesses</h2>
          <p className="card-subtitle">Adaptive resurfacing targets these next</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {weaknesses.map((w) => (
              <span key={w.motif} className="hotspot-chip">
                <code>{w.label}</code>
                <span className="text-muted">{w.avgDelayMs}ms</span>
                {w.errorRate > 0 && <span className="text-red">{w.errorRate}% err</span>}
              </span>
            ))}
          </div>
        </section>
      )}

      <section className="mt-8 card">
        <h2 className="card-title">Suggested Resurface Queue</h2>
        <p className="card-subtitle">Enable Adaptive mode on the Type page to prioritize these</p>
        <div className="mt-4 space-y-2">
          {resurface.map((s) => (
            <div key={s.id} className="curriculum-snippet-row">
              <span className="font-medium">{s.title}</span>
              <span className="text-xs text-muted capitalize">{s.pattern.replace("-", " ")}</span>
              <span className="text-xs capitalize">{s.difficulty}</span>
              <div className="flex flex-wrap gap-1 justify-end">
                {s.motifs.slice(0, 2).map((m) => (
                  <span key={m} className="motif-tag">
                    {getMotifInfo(m)?.label ?? m}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 card">
        <h2 className="card-title">Pattern Coverage</h2>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {PATTERN_PACKS.map((p) => {
            const count = SNIPPETS.filter((s) => s.pattern === p.id).length;
            return (
              <div key={p.id} className="flex items-center justify-between rounded-lg bg-surface-2 px-3 py-2 text-sm">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
                  {p.name}
                </span>
                <span className="text-muted">{count}</span>
              </div>
            );
          })}
        </div>
      </section>

      <div className="mt-8">
        <LanguageStackPanel />
      </div>

      <div className="mt-8">
        <EvidenceCredibilityPanel />
      </div>

      <div className="mt-8">
        <CareerTracksPanel />
      </div>

      <div className="mt-8">
        <ContentStrategyPanel />
      </div>

      <p className="mt-8 text-center text-sm text-muted">
        <Link href="/" className="text-accent hover:underline">
          Start typing →
        </Link>
      </p>
    </main>
  );
}
