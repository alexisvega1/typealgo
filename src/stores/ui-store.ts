"use client";

import { create } from "zustand";

interface UIState {
  filtersOpen: boolean;
  settingsOpen: boolean;
  setFiltersOpen: (open: boolean) => void;
  toggleFilters: () => void;
  setSettingsOpen: (open: boolean) => void;
  openSettings: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  filtersOpen: false,
  settingsOpen: false,
  setFiltersOpen: (filtersOpen) => set({ filtersOpen }),
  toggleFilters: () => set((state) => ({ filtersOpen: !state.filtersOpen })),
  setSettingsOpen: (settingsOpen) => set({ settingsOpen }),
  openSettings: () => set({ settingsOpen: true, filtersOpen: false }),
}));
