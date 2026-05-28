"use client";

import { signOut } from "@/lib/sync/engine";
import { useSyncStore } from "@/stores/sync-store";

const STATUS_LABEL: Record<string, string> = {
  local: "Saved locally",
  syncing: "Syncing…",
  synced: "Synced",
  error: "Sync issue",
  offline: "Offline — local only",
};

export function SyncStatusIndicator() {
  const status = useSyncStore((s) => s.status);
  const userId = useSyncStore((s) => s.userId);
  const userAvatar = useSyncStore((s) => s.userAvatar);
  const error = useSyncStore((s) => s.error);

  if (!userId) {
    return (
      <span className="sync-status sync-status-local" title="Progress saved on this device">
        <span className="sync-dot" />
        <span className="hidden sm:inline">Local</span>
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span
        className={`sync-status sync-status-${status}`}
        title={error ?? STATUS_LABEL[status] ?? status}
      >
        <span className="sync-dot" />
        <span className="hidden sm:inline">{STATUS_LABEL[status] ?? status}</span>
      </span>
      {userAvatar ? (
        <button
          type="button"
          className="sync-avatar-btn"
          title="Sign out"
          onClick={() => void signOut()}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={userAvatar} alt="" className="sync-avatar" />
        </button>
      ) : (
        <button
          type="button"
          className="sync-signout-btn"
          onClick={() => void signOut()}
        >
          Sign out
        </button>
      )}
    </div>
  );
}
