"use client";

import { create } from "zustand";
import type { SyncStatus } from "@/lib/sync/types";

interface SyncState {
  status: SyncStatus;
  lastSyncedAt: number | null;
  error: string | null;
  userId: string | null;
  userEmail: string | null;
  userAvatar: string | null;
  setUser: (user: {
    id: string;
    email?: string | null;
    avatar?: string | null;
  } | null) => void;
  setStatus: (status: SyncStatus, error?: string | null) => void;
  markSynced: () => void;
}

export const useSyncStore = create<SyncState>((set) => ({
  status: "local",
  lastSyncedAt: null,
  error: null,
  userId: null,
  userEmail: null,
  userAvatar: null,
  setUser: (user) =>
    set({
      userId: user?.id ?? null,
      userEmail: user?.email ?? null,
      userAvatar: user?.avatar ?? null,
      status: user ? "syncing" : "local",
      error: null,
    }),
  setStatus: (status, error = null) => set({ status, error }),
  markSynced: () =>
    set({ status: "synced", lastSyncedAt: Date.now(), error: null }),
}));
