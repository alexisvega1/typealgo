"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export function AuthErrorBanner() {
  const searchParams = useSearchParams();
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const authError = searchParams.get("auth_error");
    if (authError) {
      setMessage(authError);
    }
  }, [searchParams]);

  const dismiss = useCallback(() => {
    setMessage(null);
    const url = new URL(window.location.href);
    url.searchParams.delete("auth_error");
    window.history.replaceState({}, "", url.pathname + url.search);
  }, []);

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
