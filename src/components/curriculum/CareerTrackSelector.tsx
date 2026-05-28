"use client";

import { COMPANY_TRACKS, CAREER_LEVELS } from "@/lib/curriculum-engine";
import { useSettingsStore } from "@/stores/settings-store";

export function CareerTrackSelector() {
  const {
    companyTrack,
    careerLevel,
    setCompanyTrack,
    setCareerLevel,
  } = useSettingsStore();

  return (
    <>
      <label className="settings-field">
        <span className="settings-label">Fluency track</span>
        <select
          value={companyTrack}
          onChange={(e) => setCompanyTrack(e.target.value as typeof companyTrack)}
          className="settings-select"
        >
          {COMPANY_TRACKS.map((t) => (
            <option key={t.id} value={t.id} disabled={t.status === "planned"}>
              {t.name}
              {t.status === "planned" ? " (soon)" : ""}
            </option>
          ))}
        </select>
      </label>

      <label className="settings-field">
        <span className="settings-label">Level</span>
        <select
          value={careerLevel}
          onChange={(e) => setCareerLevel(e.target.value as typeof careerLevel)}
          className="settings-select"
        >
          {CAREER_LEVELS.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name} ({l.shortLabel})
            </option>
          ))}
        </select>
      </label>
    </>
  );
}
