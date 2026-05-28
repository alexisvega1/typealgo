"use client";

import { create } from "zustand";

interface UIState {
  filtersOpen: boolean;
  setFiltersOpen: (open: boolean) => void;
  toggleFilters: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  filtersOpen: false,
  setFiltersOpen: (filtersOpen) => set({ filtersOpen }),
  toggleFilters: () => set((state) => ({ filtersOpen: !state.filtersOpen })),
}));
