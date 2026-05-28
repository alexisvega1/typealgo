"use client";

import { useEffect, useRef } from "react";
import type { User } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { syncProgress } from "@/lib/sync/engine";
import { useSettingsStore } from "@/stores/settings-store";
import { useStatsStore } from "@/stores/stats-store";
import { useSyncStore } from "@/stores/sync-store";

const SYNC_DEBOUNCE_MS = 4000;

function userMeta(user: User) {
  return {
    id: user.id,
    email: user.email,
    avatar: (user.user_metadata?.avatar_url as string | undefined) ?? null,
  };
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  const setUser = useSyncStore((s) => s.setUser);
  const setStatus = useSyncStore((s) => s.setStatus);
  const markSynced = useSyncStore((s) => s.markSynced);
  const syncTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const syncing = useRef(false);

  const runSync = async (userId: string) => {
    if (syncing.current) return;
    syncing.current = true;
    setStatus("syncing");

    if (!navigator.onLine) {
      setStatus("offline");
      syncing.current = false;
      return;
    }

    const result = await syncProgress(userId);
    if (result.ok) {
      markSynced();
    } else {
      setStatus("error", result.error);
    }
    syncing.current = false;
  };

  const queueSync = (userId: string | null) => {
    if (!userId || !isSupabaseConfigured()) return;
    if (syncTimer.current) clearTimeout(syncTimer.current);
    syncTimer.current = setTimeout(() => {
      void runSync(userId);
    }, SYNC_DEBOUNCE_MS);
  };

  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(userMeta(session.user));
        void runSync(session.user.id);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(userMeta(session.user));
        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          await runSync(session.user.id);
        }
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setStatus("local");
      }
    });

    const unsubStats = useStatsStore.subscribe(() => {
      queueSync(useSyncStore.getState().userId);
    });
    const unsubSettings = useSettingsStore.subscribe(() => {
      queueSync(useSyncStore.getState().userId);
    });

    const onOnline = () => {
      const userId = useSyncStore.getState().userId;
      if (userId) void runSync(userId);
    };
    window.addEventListener("online", onOnline);

    return () => {
      subscription.unsubscribe();
      unsubStats();
      unsubSettings();
      window.removeEventListener("online", onOnline);
      if (syncTimer.current) clearTimeout(syncTimer.current);
    };
  }, [markSynced, setStatus, setUser]);

  return children;
}
