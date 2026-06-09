"use client";

import { useCallback, useEffect, useState } from "react";
import {
  trackLanguageHint,
  trackLanguageHintKey,
} from "@/lib/curriculum-engine/language-hints";
import { safeLocalStorage } from "@/lib/safe-storage";
import { useSettingsStore } from "@/stores/settings-store";

const DISMISS_PREFIX = "typealgo-dismissed-lang-hint:";

export function TrackLanguageHint() {
  const companyTrack = useSettingsStore((s) => s.companyTrack);
  const language = useSettingsStore((s) => s.language);
  const [dismissed, setDismissed] = useState(true);

  const hint = trackLanguageHint(companyTrack, language);
  const hintKey = hint ? trackLanguageHintKey(companyTrack, language) : null;

  useEffect(() => {
    if (!hintKey) {
      setDismissed(true);
      return;
    }
    setDismissed(safeLocalStorage.getItem(`${DISMISS_PREFIX}${hintKey}`) === "1");
  }, [hintKey]);

  const dismiss = useCallback(() => {
    if (!hintKey) return;
    safeLocalStorage.setItem(`${DISMISS_PREFIX}${hintKey}`, "1");
    setDismissed(true);
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
