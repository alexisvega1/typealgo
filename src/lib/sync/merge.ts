import { computeStreak } from "@/lib/heatmap";
import type {
  BaselineResult,
  DailyActivity,
  Pattern,
  TypingResult,
  TypingSettings,
  UserStats,
} from "@/lib/types";

function mergeBaselines(local: BaselineResult[], remote: BaselineResult[]): BaselineResult[] {
  const map = new Map<string, BaselineResult>();
  for (const b of remote) map.set(b.id, b);
  for (const b of local) {
    const existing = map.get(b.id);
    if (!existing || b.timestamp >= existing.timestamp) map.set(b.id, b);
  }
  return Array.from(map.values())
    .sort((a, b) => a.timestamp - b.timestamp)
    .slice(-200);
}

function mergeResults(local: TypingResult[], remote: TypingResult[]): TypingResult[] {
  const map = new Map<string, TypingResult>();
  for (const r of remote) map.set(r.id, r);
  for (const r of local) {
    const existing = map.get(r.id);
    if (!existing || r.timestamp >= existing.timestamp) {
      map.set(r.id, r);
    }
  }
  return Array.from(map.values())
    .sort((a, b) => a.timestamp - b.timestamp)
    .slice(-500);
}

function mergeDaily(
  local: Record<string, DailyActivity>,
  remote: Record<string, DailyActivity>,
): Record<string, DailyActivity> {
  const dates = new Set([...Object.keys(local), ...Object.keys(remote)]);
  const merged: Record<string, DailyActivity> = {};

  for (const date of dates) {
    const a = local[date];
    const b = remote[date];
    if (!a) {
      merged[date] = b!;
      continue;
    }
    if (!b) {
      merged[date] = a;
      continue;
    }

    const sessions = a.sessions + b.sessions;
    const minutes = Math.round((a.minutes + b.minutes) * 10) / 10;
    const avgWpm =
      Math.round(((a.avgWpm * a.sessions + b.avgWpm * b.sessions) / sessions) * 10) / 10;
    const avgAccuracy =
      Math.round(
        ((a.avgAccuracy * a.sessions + b.avgAccuracy * b.sessions) / sessions) * 10,
      ) / 10;
    const patterns = Array.from(new Set([...a.patterns, ...b.patterns])) as Pattern[];

    merged[date] = {
      date,
      sessions,
      minutes,
      avgWpm,
      avgAccuracy,
      patterns,
    };
  }

  return merged;
}

/** Conflict-safe merge — union sessions, recompute aggregates from merged results. */
export function mergeUserStats(local: UserStats, remote: UserStats): UserStats {
  const results = mergeResults(local.results, remote.results);
  const dailyActivity = mergeDaily(local.dailyActivity, remote.dailyActivity);
  const streak = computeStreak(dailyActivity);
  const totalSessions = results.length;
  const totalMinutes =
    Math.round(results.reduce((sum, r) => sum + r.durationMs / 60000, 0) * 10) / 10;
  const englishBaselines = mergeBaselines(
    local.englishBaselines ?? [],
    remote.englishBaselines ?? [],
  );

  return {
    results,
    dailyActivity,
    streak,
    totalMinutes,
    totalSessions,
    englishBaselines,
  };
}

/** Prefer newer client timestamp; tie-break toward local mode preferences. */
export function mergeSettings(
  local: TypingSettings,
  remote: TypingSettings,
  localUpdatedAt: number,
  remoteUpdatedAt: number,
): TypingSettings {
  if (remoteUpdatedAt > localUpdatedAt + 5000) return remote;
  if (localUpdatedAt > remoteUpdatedAt + 5000) return local;
  return { ...remote, ...local };
}

export function statsFromResults(results: TypingResult[]): Pick<UserStats, "totalMinutes" | "totalSessions"> {
  return {
    totalSessions: results.length,
    totalMinutes:
      Math.round(results.reduce((sum, r) => sum + r.durationMs / 60000, 0) * 10) / 10,
  };
}
