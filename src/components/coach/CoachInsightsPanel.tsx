"use client";

import { useMemo } from "react";
import { getSnippet } from "@/data/curriculum";
import { analyzeSession } from "@/lib/coach";
import { useSettingsStore } from "@/stores/settings-store";
import { useStatsStore } from "@/stores/stats-store";
import { CoachSection } from "./CoachSection";

export function CoachInsightsPanel() {
  const results = useStatsStore((s) => s.results);
  const settings = useSettingsStore();

  const analysis = useMemo(() => {
    const last = results[results.length - 1];
    if (!last) return null;
    const snippet = getSnippet(last.snippetId);
    if (!snippet) return null;
    return analyzeSession({
      result: last,
      snippet,
      allResults: results,
      recallMode: last.recallMode ?? settings.recallMode,
      filterOpts: {
        pattern: settings.patternPack,
        difficulty: settings.difficulty,
        language: settings.language,
        tier: settings.curriculumTier,
      },
    });
  }, [results, settings]);

  if (!analysis) {
    return (
      <section className="card">
        <h2 className="card-title">Coach</h2>
        <p className="card-subtitle">Complete a session for personalized recommendations</p>
      </section>
    );
  }

  return (
    <section className="card">
      <CoachSection analysis={analysis} />
    </section>
  );
}
