"use client";

import { useCallback, useState } from "react";
import { useSearchParams } from "next/navigation";

export function AuthErrorBanner() {
  const searchParams = useSearchParams();
  const authError = searchParams.get("auth_error");
  const [dismissedError, setDismissedError] = useState<string | null>(null);

  const message =
    authError && dismissedError !== authError ? authError : null;

  const dismiss = useCallback(() => {
    if (!authError) return;
    setDismissedError(authError);
    const url = new URL(window.location.href);
    url.searchParams.delete("auth_error");
    window.history.replaceState({}, "", url.pathname + url.search);
  }, [authError]);

  if (!message) return null;

  return (
    <div className="auth-error-banner" role="alert">
      <p className="auth-error-banner-text">
        <strong>Sign-in failed.</strong> {message}
      </p>
      <button type="button" className="auth-error-banner-dismiss" onClick={dismiss}>
        Dismiss
      </button>
    </div>
  );
}
