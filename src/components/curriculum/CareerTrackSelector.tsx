"use client";

import { COMPANY_TRACKS, CAREER_LEVELS, getCompanyTrack, levelShortLabel } from "@/lib/curriculum-engine";
import { useSettingsStore } from "@/stores/settings-store";

export function CareerTrackSelector() {
  const {
    companyTrack,
    careerLevel,
    setCompanyTrack,
    setCareerLevel,
  } = useSettingsStore();

  const track = getCompanyTrack(companyTrack);
  const levelLabelPrefix = track.levelScheme === "E" ? "E-level" : "Level";

  return (
    <>
      <label className="settings-field settings-field-track">
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
        {companyTrack !== "general" && (
          <p className="track-interview-description">{track.interviewDescription}</p>
        )}
      </label>

      <label className="settings-field">
        <span className="settings-label">{levelLabelPrefix}</span>
        <select
          value={careerLevel}
          onChange={(e) => setCareerLevel(e.target.value as typeof careerLevel)}
          className="settings-select"
        >
          {CAREER_LEVELS.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name} ({levelShortLabel(l.id, companyTrack)})
            </option>
          ))}
        </select>
      </label>
    </>
  );
}
