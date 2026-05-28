"use client";

import { useCallback, useState } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import {
  downloadLocalProgressBackup,
  signInWithApple,
  signInWithProvider,
  type OAuthProvider,
} from "@/lib/sync/engine";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { useStatsStore } from "@/stores/stats-store";
import { useSyncStore } from "@/stores/sync-store";

interface SaveProgressPromptProps {
  variant?: "header" | "menu";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** When false, only the dialog is rendered (trigger lives elsewhere). */
  showTrigger?: boolean;
  onTrigger?: () => void;
}

export function useSaveProgressVisible(): boolean {
  const totalSessions = useStatsStore((s) => s.totalSessions);
  const userId = useSyncStore((s) => s.userId);
  return !userId && totalSessions > 0;
}

export function SaveProgressPrompt({
  variant = "header",
  open,
  onOpenChange,
  showTrigger = true,
  onTrigger,
}: SaveProgressPromptProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<OAuthProvider | null>(null);
  const [error, setError] = useState<string | null>(null);
  const loading = loadingProvider !== null;
  const totalSessions = useStatsStore((s) => s.totalSessions);
  const userId = useSyncStore((s) => s.userId);
  const streak = useStatsStore((s) => s.streak);
  const configured = isSupabaseConfigured();

  const isControlled = open !== undefined;
  const dialogOpen = isControlled ? open : internalOpen;

  const setDialogOpen = useCallback(
    (next: boolean) => {
      if (isControlled) onOpenChange?.(next);
      else setInternalOpen(next);
      if (!next) {
        setError(null);
        setLoadingProvider(null);
      }
    },
    [isControlled, onOpenChange],
  );

  if (userId || totalSessions === 0) return null;

  const openDialog = () => {
    onTrigger?.();
    setDialogOpen(true);
  };

  const handleBackupDownload = () => {
    downloadLocalProgressBackup();
    setDialogOpen(false);
  };

  const handleCloudSave = async (provider: OAuthProvider) => {
    setLoadingProvider(provider);
    setError(null);
    // Apple prefers the native popup (Face ID / Touch ID) and resolves in-page;
    // the others redirect away. Either way, only surface an actual error.
    const result =
      provider === "apple"
        ? await signInWithApple()
        : await signInWithProvider(provider);
    if (!result.ok) {
      if (result.error) setError(result.error);
      setLoadingProvider(null);
    }
  };

  const dialog = (
    <AnimatePresence>
      {dialogOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="save-progress-overlay"
          onClick={() => setDialogOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.22 }}
            className="save-progress-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="save-progress-title"
          >
            <h2 id="save-progress-title" className="text-lg font-semibold">
              Save your progress
            </h2>
            <p className="mt-2 text-sm text-muted leading-relaxed">
              Keep your streaks, mastery history, and training data across devices.
              {streak.current > 0 && (
                <>
                  {" "}
                  Your <span className="text-accent">{streak.current}-day streak</span> is worth
                  saving.
                </>
              )}
            </p>

            {configured ? (
              <>
                <div className="mt-5 flex flex-col gap-2.5">
                  <button
                    type="button"
                    className="btn-oauth btn-github w-full"
                    disabled={loading}
                    onClick={() => void handleCloudSave("github")}
                  >
                    <GitHubIcon />
                    {loadingProvider === "github" ? "Redirecting…" : "Continue with GitHub"}
                  </button>
                  <button
                    type="button"
                    className="btn-oauth btn-google w-full"
                    disabled={loading}
                    onClick={() => void handleCloudSave("google")}
                  >
                    <GoogleIcon />
                    {loadingProvider === "google" ? "Redirecting…" : "Continue with Google"}
                  </button>
                  <button
                    type="button"
                    className="btn-oauth btn-apple w-full"
                    disabled={loading}
                    onClick={() => void handleCloudSave("apple")}
                  >
                    <AppleIcon />
                    {loadingProvider === "apple" ? "Redirecting…" : "Continue with Apple"}
                  </button>
                </div>
                <button
                  type="button"
                  className="save-progress-secondary-btn mt-3 w-full"
                  disabled={loading}
                  onClick={handleBackupDownload}
                >
                  Download backup file
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="btn-github mt-5 w-full"
                  onClick={handleBackupDownload}
                >
                  Download backup file
                </button>
                <p className="mt-4 rounded-lg bg-surface-2 px-3 py-2 text-xs text-muted leading-relaxed">
                  Cloud sync across devices needs Supabase env vars on the host
                  (<code className="text-foreground/80">NEXT_PUBLIC_SUPABASE_URL</code>,{" "}
                  <code className="text-foreground/80">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>
                  ). Your backup file can be restored later when sync is enabled.
                </p>
              </>
            )}

            {error && <p className="mt-3 text-xs text-red">{error}</p>}

            <p className="mt-4 text-center text-xs text-muted">
              No account wall — keep typing locally anytime.
            </p>
            <button
              type="button"
              className="mt-3 w-full text-center text-xs text-muted hover:text-foreground"
              onClick={() => setDialogOpen(false)}
            >
              Not now
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {showTrigger && (
        <button
          type="button"
          className={clsx("save-progress-btn", variant === "menu" && "save-progress-btn-menu")}
          onClick={openDialog}
        >
          Save progress
        </button>
      )}

      {typeof document !== "undefined" ? createPortal(dialog, document.body) : null}
    </>
  );
}

function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.18.82a7.52 7.52 0 0 1 2-.27c.68.003 1.36.09 2 .27 1.51-1.04 2.18-.82 2.18-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" aria-hidden>
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.71-1.57 2.68-3.89 2.68-6.62Z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.34A9 9 0 0 0 9 18Z"
      />
      <path
        fill="#FBBC05"
        d="M3.97 10.72A5.4 5.4 0 0 1 3.68 9c0-.6.1-1.18.29-1.72V4.94H.96A9 9 0 0 0 0 9c0 1.45.35 2.82.96 4.06l3.01-2.34Z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.94l3.01 2.34C4.68 5.16 6.66 3.58 9 3.58Z"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M11.18 8.46c-.02-1.6 1.31-2.37 1.37-2.41-.75-1.09-1.91-1.24-2.32-1.26-.99-.1-1.93.58-2.43.58-.5 0-1.27-.57-2.09-.55-1.07.02-2.06.62-2.61 1.58-1.11 1.93-.28 4.79.8 6.36.53.77 1.16 1.63 1.98 1.6.8-.03 1.1-.51 2.06-.51.96 0 1.23.51 2.07.5.86-.02 1.4-.78 1.92-1.55.61-.89.86-1.75.87-1.79-.02-.01-1.67-.64-1.69-2.55ZM9.6 3.24c.44-.53.74-1.27.66-2.01-.64.03-1.41.43-1.86.96-.4.47-.76 1.22-.66 1.94.71.06 1.43-.36 1.86-.89Z" />
    </svg>
  );
}
