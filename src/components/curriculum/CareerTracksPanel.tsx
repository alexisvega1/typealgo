"use client";

import {
  activeCompanyTracks,
  CAREER_LEVELS,
  computeTrackReadiness,
  formatCareerGoal,
  recommendedTrainingMode,
  resolveProfile,
} from "@/lib/curriculum-engine";
import { useSettingsStore } from "@/stores/settings-store";
import { useStatsStore } from "@/stores/stats-store";
import { trainingModeLabel } from "@/lib/training-mode";

export function CareerTracksPanel() {
  const results = useStatsStore((s) => s.results);
  const { companyTrack, careerLevel, setCompanyTrack, setCareerLevel } = useSettingsStore();
  const profile = resolveProfile(companyTrack, careerLevel);
  const readiness = computeTrackReadiness(results, companyTrack, careerLevel);
  const suggestedMode = recommendedTrainingMode(companyTrack, careerLevel);

  return (
    <section className="card">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="card-title">Implementation Fluency Tracks</h2>
          <p className="card-subtitle">
            What kind of engineer are you training to become?
          </p>
        </div>
        <div className="text-right text-sm">
          <p className="font-medium">{formatCareerGoal(companyTrack, careerLevel)}</p>
          <p className="text-muted">{readiness.label} · {readiness.score}%</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {activeCompanyTracks().map((track) => {
          const active = companyTrack === track.id;
          return (
            <button
              key={track.id}
              type="button"
              onClick={() => setCompanyTrack(track.id)}
              className={`rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
                active
                  ? "border-accent bg-accent/10"
                  : "border-border/60 bg-surface-2 hover:border-accent/40"
              }`}
            >
              <p className="font-medium">{track.name}</p>
              <p className="mt-1 text-xs text-muted">{track.tagline}</p>
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => setCompanyTrack("general")}
          className={`rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
            companyTrack === "general"
              ? "border-accent bg-accent/10"
              : "border-border/60 bg-surface-2 hover:border-accent/40"
          }`}
        >
          <p className="font-medium">General Fluency</p>
          <p className="mt-1 text-xs text-muted">Balanced — no company cognitive bias</p>
        </button>
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-medium">Procedural seniority ladder</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {CAREER_LEVELS.map((level) => (
            <button
              key={level.id}
              type="button"
              onClick={() => setCareerLevel(level.id)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                careerLevel === level.id
                  ? "bg-accent text-accent-foreground"
                  : "bg-surface-2 text-muted hover:text-foreground"
              }`}
            >
              {level.name}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-muted">{profile.level.characteristics}</p>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3 text-sm">
        <div className="rounded-lg bg-surface-2 px-3 py-2">
          <p className="text-xs text-muted">Suggested mode</p>
          <p className="font-medium">{trainingModeLabel(suggestedMode)}</p>
        </div>
        <div className="rounded-lg bg-surface-2 px-3 py-2">
          <p className="text-xs text-muted">Motif coverage</p>
          <p className="font-medium tabular-nums">{readiness.motifCoverage}%</p>
        </div>
        <div className="rounded-lg bg-surface-2 px-3 py-2">
          <p className="text-xs text-muted">Sprint sessions</p>
          <p className="font-medium tabular-nums">{readiness.sprintSessions}</p>
        </div>
      </div>

      {companyTrack !== "general" && (
        <p className="mt-4 text-xs text-muted leading-relaxed">
          {profile.track.coaching.sprintEmphasis}. This is{" "}
          <span className="text-foreground">{profile.track.marketingLabel}</span>
          {" "}— not a problem dump.
        </p>
      )}
    </section>
  );
}
