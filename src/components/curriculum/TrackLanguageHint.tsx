"use client";

import { useCallback, useState, useSyncExternalStore } from "react";
import {
  trackLanguageHint,
  trackLanguageHintKey,
} from "@/lib/curriculum-engine/language-hints";
import { safeLocalStorage } from "@/lib/safe-storage";
import { useSettingsStore } from "@/stores/settings-store";

const DISMISS_PREFIX = "typealgo-dismissed-lang-hint:";

function readDismissedFromStorage(hintKey: string | null): boolean {
  if (!hintKey) return true;
  return safeLocalStorage.getItem(`${DISMISS_PREFIX}${hintKey}`) === "1";
}

export function TrackLanguageHint() {
  const companyTrack = useSettingsStore((s) => s.companyTrack);
  const language = useSettingsStore((s) => s.language);
  const [sessionDismissedKey, setSessionDismissedKey] = useState<string | null>(
    null,
  );

  const hint = trackLanguageHint(companyTrack, language);
  const hintKey = hint ? trackLanguageHintKey(companyTrack, language) : null;

  const storageDismissed = useSyncExternalStore(
    () => () => {},
    () => readDismissedFromStorage(hintKey),
    () => true,
  );

  const dismissed =
    !hintKey || storageDismissed || sessionDismissedKey === hintKey;

  const dismiss = useCallback(() => {
    if (!hintKey) return;
    safeLocalStorage.setItem(`${DISMISS_PREFIX}${hintKey}`, "1");
    setSessionDismissedKey(hintKey);
  }, [hintKey]);

  if (!hint || dismissed) return null;

  return (
    <div className="track-language-hint" role="status">
      <p>{hint}</p>
      <button type="button" className="track-language-hint-dismiss" onClick={dismiss}>
        Dismiss
      </button>
    </div>
  );
}
