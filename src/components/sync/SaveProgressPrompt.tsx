"use client";

import { useState } from "react";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import { signInWithGitHub } from "@/lib/sync/engine";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { useStatsStore } from "@/stores/stats-store";
import { useSyncStore } from "@/stores/sync-store";

interface SaveProgressPromptProps {
  variant?: "header" | "menu";
  onOpen?: () => void;
}

export function SaveProgressPrompt({ variant = "header", onOpen }: SaveProgressPromptProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const totalSessions = useStatsStore((s) => s.totalSessions);
  const userId = useSyncStore((s) => s.userId);
  const streak = useStatsStore((s) => s.streak);

  if (userId || totalSessions === 0) return null;

  const configured = isSupabaseConfigured();

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    const result = await signInWithGitHub();
    if (!result.ok) {
      setError(result.error ?? "Could not start sign-in");
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        className={clsx("save-progress-btn", variant === "menu" && "save-progress-btn-menu")}
        onClick={() => {
          onOpen?.();
          setOpen(true);
        }}
      >
        Save progress
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="save-progress-overlay"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.22 }}
              className="save-progress-modal"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
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
                    Your <span className="text-accent">{streak.current}-day streak</span>{" "}
                    is worth saving.
                  </>
                )}
              </p>

              {!configured ? (
                <p className="mt-4 rounded-lg bg-surface-2 px-3 py-2 text-xs text-muted">
                  Cloud sync requires Supabase env vars. Local progress is already saved
                  on this device.
                </p>
              ) : (
                <button
                  type="button"
                  className="btn-github mt-5 w-full"
                  disabled={loading}
                  onClick={handleSave}
                >
                  <GitHubIcon />
                  {loading ? "Redirecting…" : "Continue with GitHub"}
                </button>
              )}

              {error && <p className="mt-3 text-xs text-red">{error}</p>}

              <p className="mt-4 text-center text-xs text-muted">
                No account wall — keep typing locally anytime.
              </p>
              <button
                type="button"
                className="mt-3 w-full text-center text-xs text-muted hover:text-foreground"
                onClick={() => setOpen(false)}
              >
                Not now
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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
