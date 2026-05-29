"use client";

import { useEffect } from "react";
import { codeFontStack } from "@/lib/appearance-options";
import { preloadSoundPack, setSoundVolume } from "@/lib/typing-sound";
import { useAppearanceStore } from "@/stores/appearance-store";

/** Syncs persisted appearance prefs to the document root (theme + code font). */
export function AppearanceApplier() {
  const theme = useAppearanceStore((s) => s.theme);
  const codeFont = useAppearanceStore((s) => s.codeFont);
  const soundPack = useAppearanceStore((s) => s.soundPack);
  const soundVolume = useAppearanceStore((s) => s.soundVolume);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    root.style.setProperty("--font-mono", codeFontStack(codeFont));
    root.style.colorScheme = theme === "light" ? "light" : "dark";
  }, [theme, codeFont]);

  useEffect(() => {
    setSoundVolume(soundVolume);
    void preloadSoundPack(soundPack, soundVolume);
  }, [soundPack, soundVolume]);

  return null;
}
