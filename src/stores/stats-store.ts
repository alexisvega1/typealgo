"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { safeLocalStorage } from "@/lib/safe-storage";
import { computeStreak, localDateKey } from "@/lib/heatmap";
import type {
  DailyActivity,
  Pattern,
  TypingResult,
  UserStats,
} from "@/lib/types";

interface StatsState extends UserStats {
  recordResult: (result: TypingResult) => void;
  clearStats: () => void;
  hydrateFromCloud: (stats: UserStats) => void;
}

const emptyStats: UserStats = {
  results: [],
  dailyActivity: {},
  streak: { current: 0, longest: 0, lastActive: null },
  totalMinutes: 0,
  totalSessions: 0,
};

function dateKey(): string {
  return localDateKey(new Date());
}

function updateDaily(
  activity: Record<string, DailyActivity>,
  result: TypingResult,
): Record<string, DailyActivity> {
  const key = dateKey();
  const prev = activity[key] ?? {
    date: key,
    sessions: 0,
    minutes: 0,
    avgWpm: 0,
    avgAccuracy: 0,
    patterns: [],
  };

  const sessions = prev.sessions + 1;
  const minutes = prev.minutes + result.durationMs / 60000;
  const avgWpm = (prev.avgWpm * prev.sessions + result.wpm) / sessions;
  const avgAccuracy = (prev.avgAccuracy * prev.sessions + result.accuracy) / sessions;
  const patterns = prev.patterns.includes(result.pattern)
    ? prev.patterns
    : [...prev.patterns, result.pattern];

  return {
    ...activity,
    [key]: {
      date: key,
      sessions,
      minutes: Math.round(minutes * 10) / 10,
      avgWpm: Math.round(avgWpm * 10) / 10,
      avgAccuracy: Math.round(avgAccuracy * 10) / 10,
      patterns: patterns as Pattern[],
    },
  };
}

export const useStatsStore = create<StatsState>()(
  persist(
    (set, get) => ({
      ...emptyStats,
      recordResult: (result) => {
        const results = [...get().results, result].slice(-500);
        const dailyActivity = updateDaily(get().dailyActivity, result);
        const streak = computeStreak(dailyActivity);
        const totalMinutes =
          Math.round((get().totalMinutes + result.durationMs / 60000) * 10) / 10;
        set({
          results,
          dailyActivity,
          streak,
          totalMinutes,
          totalSessions: get().totalSessions + 1,
        });
      },
      clearStats: () => set(emptyStats),
      hydrateFromCloud: (stats) => set({ ...stats }),
    }),
    {
      name: "algotype-stats",
      storage: createJSONStorage(() => safeLocalStorage),
      version: 1,
      migrate: (state) => state ?? emptyStats,
    },
  ),
);
