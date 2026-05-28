"use client";

import clsx from "clsx";
import { signOut } from "@/lib/sync/engine";
import { useSyncStore } from "@/stores/sync-store";

const STATUS_LABEL: Record<string, string> = {
  local: "Saved locally",
  syncing: "Syncing…",
  synced: "Synced",
  error: "Sync issue",
  offline: "Offline — local only",
};

interface SyncStatusIndicatorProps {
  variant?: "header" | "menu";
}

export function SyncStatusIndicator({ variant = "header" }: SyncStatusIndicatorProps) {
  const status = useSyncStore((s) => s.status);
  const userId = useSyncStore((s) => s.userId);
  const userAvatar = useSyncStore((s) => s.userAvatar);
  const error = useSyncStore((s) => s.error);

  if (!userId) {
    return (
      <span
        className={clsx(
          "sync-status sync-status-local",
          variant === "menu" && "sync-status-menu",
        )}
        title="Progress saved on this device"
      >
        <span className="sync-dot" />
        <span className={variant === "header" ? "hidden sm:inline" : undefined}>Local</span>
      </span>
    );
  }

  return (
    <div className={clsx("flex items-center gap-2", variant === "menu" && "sync-status-menu-row")}>
      <span
        className={clsx(`sync-status sync-status-${status}`, variant === "menu" && "sync-status-menu")}
        title={error ?? STATUS_LABEL[status] ?? status}
      >
        <span className="sync-dot" />
        <span className={variant === "header" ? "hidden sm:inline" : undefined}>
          {STATUS_LABEL[status] ?? status}
        </span>
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
          className={clsx("sync-signout-btn", variant === "menu" && "sync-signout-btn-menu")}
          onClick={() => void signOut()}
        >
          Sign out
        </button>
      )}
    </div>
  );
}
