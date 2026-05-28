import type { TypingSettings, UserStats } from "@/lib/types";

export const CLOUD_PAYLOAD_VERSION = 1;

export type SyncStatus = "local" | "syncing" | "synced" | "error" | "offline";

/** Serializable snapshot synced to Supabase. */
export interface CloudProgressPayload {
  version: typeof CLOUD_PAYLOAD_VERSION;
  clientUpdatedAt: number;
  stats: UserStats;
  settings: TypingSettings;
}

export interface CloudProgressRow {
  user_id: string;
  payload: CloudProgressPayload;
  updated_at: string;
}
