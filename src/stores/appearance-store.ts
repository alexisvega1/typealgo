"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { CodeFontId, ThemeId } from "@/lib/appearance-options";
import type { SoundPackId } from "@/lib/sound-packs";
import { safeLocalStorage } from "@/lib/safe-storage";

interface AppearanceState {
  theme: ThemeId;
  codeFont: CodeFontId;
  soundPack: SoundPackId;
  soundVolume: number;
  setTheme: (theme: ThemeId) => void;
  setCodeFont: (font: CodeFontId) => void;
  setSoundPack: (pack: SoundPackId) => void;
  setSoundVolume: (volume: number) => void;
}

export const useAppearanceStore = create<AppearanceState>()(
  persist(
    (set) => ({
      theme: "typealgo-dark",
      codeFont: "geist-mono",
      soundPack: "off",
      soundVolume: 0.35,
      setTheme: (theme) => set({ theme }),
      setCodeFont: (codeFont) => set({ codeFont }),
      setSoundPack: (soundPack) => set({ soundPack }),
      setSoundVolume: (soundVolume) => set({ soundVolume }),
    }),
    {
      name: "typealgo-appearance",
      storage: createJSONStorage(() => safeLocalStorage),
      version: 2,
      migrate: (persisted, version) => {
        const state = persisted as Record<string, unknown>;
        if (version < 2) {
          const legacyOn = state.playSoundOnClick === true;
          delete state.playSoundOnClick;
          return {
            ...state,
            soundPack: legacyOn ? "blip" : "off",
          } as AppearanceState;
        }
        return persisted as AppearanceState;
      },
    },
  ),
);
