"use client";

import {
  CURRICULUM_TIERS,
  PATTERN_PACKS,
  curriculumStats,
  snippetsByTier,
} from "@/data/curriculum";
import { RECALL_INTENSITY_MODES } from "@/lib/training-mode";
import { useSettingsStore } from "@/stores/settings-store";
import { CareerTrackSelector } from "@/components/curriculum/CareerTrackSelector";

import type { RecallMode } from "@/lib/types";

export function SettingsBar() {
  const {
    patternPack,
    difficulty,
    language,
    curriculumTier,
    adaptiveMode,
    trainingMode,
    recallMode,
    setPatternPack,
    setDifficulty,
    setLanguage,
    setCurriculumTier,
    setAdaptiveMode,
    setRecallMode,
  } = useSettingsStore();

  const stats = curriculumStats();
  const showRecallIntensity = trainingMode === "recall";

  return (
    <div className="border-b border-border/40 bg-surface-1/50">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-6 py-3">
        <label className="settings-field">
          <span className="settings-label">Curriculum</span>
          <select
            value={curriculumTier}
            onChange={(e) => setCurriculumTier(e.target.value as typeof curriculumTier)}
            className="settings-select"
          >
            <option value="all">All tiers ({stats.total})</option>
            {CURRICULUM_TIERS.map((t) => {
              const count = snippetsByTier(t.id).length;
              return (
                <option key={t.id} value={t.id}>
                  {t.name} ({count})
                </option>
              );
            })}
          </select>
        </label>

        <CareerTrackSelector />

        {showRecallIntensity && (
          <label className="settings-field">
            <span className="settings-label">Recall intensity</span>
            <select
              value={recallMode === "full-copy" ? "token-blank" : recallMode}
              onChange={(e) => setRecallMode(e.target.value as RecallMode)}
              className="settings-select"
            >
              {RECALL_INTENSITY_MODES.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </select>
          </label>
        )}

        <label className="settings-field">
          <span className="settings-label">Pattern</span>
          <select
            value={patternPack}
            onChange={(e) => setPatternPack(e.target.value as typeof patternPack)}
            className="settings-select"
          >
            <option value="all">All patterns</option>
            {PATTERN_PACKS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>

        <label className="settings-field">
          <span className="settings-label">Difficulty</span>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as typeof difficulty)}
            className="settings-select"
          >
            <option value="all">All</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </label>

        <label className="settings-field">
          <span className="settings-label">Language</span>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as typeof language)}
            className="settings-select"
          >
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
          </select>
        </label>

        <label className="settings-field adaptive-toggle">
          <input
            type="checkbox"
            checked={adaptiveMode}
            onChange={(e) => setAdaptiveMode(e.target.checked)}
            className="adaptive-checkbox"
          />
          <span className="settings-label mb-0">Adaptive</span>
        </label>
      </div>
    </div>
  );
}
