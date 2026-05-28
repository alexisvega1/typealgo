"use client";

import { useMemo } from "react";
import { buildDailyPlan } from "@/lib/coach";
import type { TrainingPlan } from "@/lib/coach/types";
import { useSettingsStore } from "@/stores/settings-store";
import { useStatsStore } from "@/stores/stats-store";

export function TrainingPlanPanel() {
  const results = useStatsStore((s) => s.results);
  const settings = useSettingsStore();

  const plan: TrainingPlan = useMemo(
    () =>
      buildDailyPlan(results, {
        pattern: settings.patternPack,
        difficulty: settings.difficulty,
        language: settings.language,
        tier: settings.curriculumTier,
        companyTrack: settings.companyTrack,
        careerLevel: settings.careerLevel,
      }),
    [
      results,
      settings.patternPack,
      settings.difficulty,
      settings.language,
      settings.curriculumTier,
      settings.companyTrack,
      settings.careerLevel,
    ],
  );

  if (plan.items.length === 0) {
    return (
      <section className="card">
        <h2 className="card-title">Today&apos;s Training Plan</h2>
        <p className="card-subtitle">Complete a session to get your adaptive plan</p>
      </section>
    );
  }

  return (
    <section className="card">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="card-title">Today&apos;s Training Plan</h2>
          <p className="card-subtitle">Adaptive drills based on your weak motifs</p>
        </div>
        <div className="text-sm text-muted">
          ~{plan.totalEstimatedMinutes} min total
        </div>
      </div>

      <ol className="training-plan-list mt-5">
        {plan.items.map((item) => (
          <li key={item.snippetId} className="training-plan-item">
            <span className="training-plan-order">{item.order}</span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="font-medium">{item.purposeLabel}</span>
                <span className="text-sm text-muted">· {item.snippetTitle}</span>
              </div>
              <div className="mt-0.5 text-xs text-muted">
                ~{item.estimatedMinutes} min
                {item.motifLabel && item.purpose === "new-pattern" && (
                  <> · introduces {item.motifLabel}</>
                )}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
