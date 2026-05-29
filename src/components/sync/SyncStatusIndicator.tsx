"use client";

import clsx from "clsx";
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
  onOpenSettings?: () => void;
}

export function SyncStatusIndicator({ variant = "header", onOpenSettings }: SyncStatusIndicatorProps) {
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
    <div className={clsx("sync-status-row", variant === "menu" && "sync-status-menu-row")}>
      <span
        className={clsx(`sync-status sync-status-${status}`, variant === "menu" && "sync-status-menu")}
        title={error ?? STATUS_LABEL[status] ?? status}
      >
        <span className="sync-dot" />
        <span className={variant === "header" ? "hidden sm:inline" : undefined}>
          {STATUS_LABEL[status] ?? status}
        </span>
      </span>
      {userAvatar && onOpenSettings ? (
        <button
          type="button"
          className="sync-avatar-btn"
          title="Open settings"
          aria-label="Open settings"
          onClick={onOpenSettings}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={userAvatar} alt="" className="sync-avatar" />
        </button>
      ) : null}
    </div>
  );
}
