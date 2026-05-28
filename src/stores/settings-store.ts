"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { migrateLegacyStorageKeys } from "@/lib/migrate-storage";
import { safeLocalStorage } from "@/lib/safe-storage";

migrateLegacyStorageKeys();
import type { RecallMode, TrainingMode, TypingSettings } from "@/lib/types";

interface SettingsState extends TypingSettings {
  setPatternPack: (pack: TypingSettings["patternPack"]) => void;
  setDifficulty: (d: TypingSettings["difficulty"]) => void;
  setLanguage: (l: TypingSettings["language"]) => void;
  setCurriculumTier: (t: TypingSettings["curriculumTier"]) => void;
  setAdaptiveMode: (on: boolean) => void;
  setTrainingMode: (mode: TrainingMode) => void;
  setRecallMode: (mode: RecallMode) => void;
  setTestDuration: (sec: number) => void;
  setCompanyTrack: (track: TypingSettings["companyTrack"]) => void;
  setCareerLevel: (level: TypingSettings["careerLevel"]) => void;
  hydrateFromCloud: (settings: TypingSettings) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      patternPack: "all",
      difficulty: "all",
      language: "python",
      curriculumTier: "all",
      adaptiveMode: true,
      trainingMode: "type",
      recallMode: "token-blank",
      testDurationSec: 0,
      companyTrack: "general",
      careerLevel: "mid",
      setPatternPack: (patternPack) => set({ patternPack }),
      setDifficulty: (difficulty) => set({ difficulty }),
      setLanguage: (language) => set({ language }),
      setCurriculumTier: (curriculumTier) => set({ curriculumTier }),
      setAdaptiveMode: (adaptiveMode) => set({ adaptiveMode }),
      setTrainingMode: (trainingMode) => set({ trainingMode }),
      setRecallMode: (recallMode) => set({ recallMode }),
      setTestDuration: (testDurationSec) => set({ testDurationSec }),
      setCompanyTrack: (companyTrack) => set({ companyTrack }),
      setCareerLevel: (careerLevel) => set({ careerLevel }),
      hydrateFromCloud: (settings) => set({ ...settings }),
    }),
    {
      name: "typealgo-settings",
      storage: createJSONStorage(() => safeLocalStorage),
      version: 3,
      migrate: (state) => {
        const s = (state ?? {}) as TypingSettings;
        if (!s.trainingMode) {
          s.trainingMode = s.recallMode === "full-copy" ? "type" : "recall";
        }
        if (!s.companyTrack) s.companyTrack = "general";
        if (!s.careerLevel) s.careerLevel = "mid";
        if (!s.language) s.language = "python";
        if (!s.patternPack) s.patternPack = "all";
        if (!s.difficulty) s.difficulty = "all";
        if (!s.curriculumTier) s.curriculumTier = "all";
        if (s.adaptiveMode === undefined) s.adaptiveMode = true;
        if (!s.recallMode) s.recallMode = "token-blank";
        if (s.testDurationSec === undefined) s.testDurationSec = 0;
        return s;
      },
    },
  ),
);
