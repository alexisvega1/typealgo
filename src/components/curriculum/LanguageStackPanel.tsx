"use client";

import {
  expansionRoadmap,
  FRAMEWORK_FLUENCY_TRACKS,
  implementedLanguages,
  languagesByTier,
  liveAdaptationPreview,
  REPO_INTELLIGENCE_SOURCES,
} from "@/lib/stacks";
import { useSettingsStore } from "@/stores/settings-store";

export function LanguageStackPanel() {
  const { companyTrack } = useSettingsStore();
  const adaptations = liveAdaptationPreview(companyTrack === "general" ? "openai" : companyTrack);

  return (
    <section className="card">
      <h2 className="card-title">Technical stack architecture</h2>
      <p className="card-subtitle leading-relaxed">
        Language → framework → domain hierarchy. Eight excellent ecosystems beat thirty
        shallow ones — expansion follows hiring demand and track relevance.
      </p>

      <div className="mt-5">
        <h3 className="text-sm font-medium">Tier 1 — Essential (ship order)</h3>
        <div className="mt-2 flex flex-wrap gap-2">
          {languagesByTier("tier-1").map((lang) => (
            <span
              key={lang.id}
              className={`stack-chip ${lang.implemented ? "stack-chip-live" : "stack-chip-planned"}`}
              title={lang.description}
            >
              {lang.name}
              {lang.implemented ? " · live" : lang.expansionPriority ? ` · P${lang.expansionPriority}` : " · planned"}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <h3 className="text-sm font-medium">Framework fluency (not languages)</h3>
        <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {FRAMEWORK_FLUENCY_TRACKS.map((fw) => (
            <div key={fw.id} className="rounded-lg bg-surface-2 px-3 py-2 text-xs">
              <span className="font-medium">{fw.name}</span>
              <span className="text-muted"> · {fw.parentLanguage}</span>
              <p className="mt-1 text-muted truncate">{fw.exampleMotifs.join(" · ")}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <h3 className="text-sm font-medium">Expansion roadmap</h3>
        <p className="mt-1 text-xs text-muted">
          Next: {expansionRoadmap(5).map((l) => l.name).join(" → ")}
        </p>
        <p className="mt-1 text-xs text-muted">
          Implemented today: {implementedLanguages().map((l) => l.name).join(", ")}
        </p>
      </div>

      <div className="mt-5 border-t border-border/40 pt-4">
        <h3 className="text-sm font-medium">Repo intelligence (living curriculum)</h3>
        <p className="mt-1 text-xs text-muted leading-relaxed">
          Statistical signals from public repos — motif frequency, API recurrence, momentum.
          Never clones copyrighted content.
        </p>
        {adaptations.length > 0 && (
          <ul className="mt-3 space-y-2 text-xs">
            {adaptations.slice(0, 3).map((a) => (
              <li key={a.targetId} className="text-muted">
                <span className="text-foreground capitalize">{a.targetId}</span>
                {" "}{a.delta > 0 ? "↑" : "↓"} {Math.abs(Math.round(a.delta * 100))}% — {a.reason}
              </li>
            ))}
          </ul>
        )}
        <p className="mt-2 text-xs text-muted">
          Sources: {REPO_INTELLIGENCE_SOURCES.slice(0, 4).map((s) => s.name).join(" · ")}
        </p>
      </div>
    </section>
  );
}
