import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { siteUrl } from "@/lib/supabase/config";
import { mergeSettings, mergeUserStats } from "@/lib/sync/merge";
import {
  CLOUD_PAYLOAD_VERSION,
  type CloudProgressPayload,
  type CloudProgressRow,
} from "@/lib/sync/types";
import type { TypingSettings, UserStats } from "@/lib/types";
import { useSettingsStore } from "@/stores/settings-store";
import { useStatsStore } from "@/stores/stats-store";

function buildPayload(stats: UserStats, settings: TypingSettings): CloudProgressPayload {
  return {
    version: CLOUD_PAYLOAD_VERSION,
    clientUpdatedAt: Date.now(),
    stats,
    settings,
  };
}

function pickSettings(state: ReturnType<typeof useSettingsStore.getState>): TypingSettings {
  return {
    patternPack: state.patternPack,
    difficulty: state.difficulty,
    language: state.language,
    curriculumTier: state.curriculumTier,
    adaptiveMode: state.adaptiveMode,
    trainingMode: state.trainingMode,
    recallMode: state.recallMode,
    testDurationSec: state.testDurationSec,
    companyTrack: state.companyTrack,
    careerLevel: state.careerLevel,
  };
}

export function getLocalSnapshot(): CloudProgressPayload {
  const statsState = useStatsStore.getState();
  const settings = pickSettings(useSettingsStore.getState());
  const stats: UserStats = {
    results: statsState.results,
    dailyActivity: statsState.dailyActivity,
    streak: statsState.streak,
    totalMinutes: statsState.totalMinutes,
    totalSessions: statsState.totalSessions,
  };
  return buildPayload(stats, settings);
}

export function applyCloudPayload(payload: CloudProgressPayload): CloudProgressPayload {
  const local = getLocalSnapshot();
  const mergedStats = mergeUserStats(local.stats, payload.stats);
  const mergedSettings = mergeSettings(
    local.settings,
    payload.settings,
    local.clientUpdatedAt,
    payload.clientUpdatedAt,
  );
  const merged = buildPayload(mergedStats, mergedSettings);

  useStatsStore.getState().hydrateFromCloud(mergedStats);
  useSettingsStore.getState().hydrateFromCloud(mergedSettings);

  return merged;
}

export async function pullRemoteProgress(userId: string): Promise<CloudProgressPayload | null> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("user_progress")
    .select("payload")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;
  if (!data?.payload) return null;

  const row = data as Pick<CloudProgressRow, "payload">;
  return row.payload as CloudProgressPayload;
}

export async function pushProgress(userId: string, payload: CloudProgressPayload): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return;

  const { error } = await supabase.from("user_progress").upsert({
    user_id: userId,
    payload,
    updated_at: new Date().toISOString(),
  });

  if (error) throw error;
}

/** Pull → merge → push. Never throws to caller — returns status. */
export async function syncProgress(userId: string): Promise<{
  ok: boolean;
  merged: CloudProgressPayload;
  error?: string;
}> {
  try {
    const local = getLocalSnapshot();
    const remote = await pullRemoteProgress(userId);
    const merged = remote ? applyCloudPayload(remote) : local;
    await pushProgress(userId, merged);
    return { ok: true, merged };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Sync failed";
    return { ok: false, merged: getLocalSnapshot(), error: message };
  }
}

export function downloadLocalProgressBackup(): void {
  const payload = getLocalSnapshot();
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `typealgo-progress-${new Date().toISOString().slice(0, 10)}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export async function signInWithGitHub(): Promise<{ ok: boolean; error?: string }> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    return { ok: false, error: "Cloud sync is not configured yet." };
  }

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `${siteUrl()}/auth/callback`,
    },
  });

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function signOut(): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return;
  await supabase.auth.signOut();
}
