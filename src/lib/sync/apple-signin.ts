import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { siteUrl } from "@/lib/supabase/config";

/**
 * Native "Sign in with Apple JS" popup flow.
 *
 * Unlike the standard OAuth redirect (which sends the user to appleid.apple.com
 * and shows a password page), the popup flow lets Apple present its own native
 * sheet. On Apple devices signed into iCloud in Safari that sheet authenticates
 * with Face ID / Touch ID automatically — the biometric prompt is owned by
 * Apple, we only opt into the popup so it can appear.
 *
 * We obtain an Apple identity token in-page and hand it to Supabase via
 * `signInWithIdToken`, so there is no full-page redirect on success.
 *
 * Hard requirements (else we must fall back to the redirect flow):
 *  - A Services ID configured as NEXT_PUBLIC_APPLE_SERVICES_ID (the web client
 *    id; NOT the App ID).
 *  - An HTTPS origin that is NOT localhost — Apple rejects http:// and
 *    127.0.0.1/localhost redirect URIs for Sign in with Apple JS.
 */

const APPLE_JS_SRC =
  "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js";

interface AppleAuthorization {
  id_token: string;
  code?: string;
  state?: string;
}

interface AppleSignInResponse {
  authorization: AppleAuthorization;
  user?: {
    name?: { firstName?: string; middleName?: string; lastName?: string };
    email?: string;
  };
}

interface AppleIDAuth {
  init: (config: {
    clientId: string;
    scope: string;
    redirectURI: string;
    usePopup: boolean;
    nonce?: string;
    state?: string;
  }) => void;
  signIn: () => Promise<AppleSignInResponse>;
}

declare global {
  interface Window {
    AppleID?: { auth: AppleIDAuth };
  }
}

export function getAppleServicesId(): string | undefined {
  return process.env.NEXT_PUBLIC_APPLE_SERVICES_ID || undefined;
}

/**
 * Whether the native popup flow can even be attempted. Face ID itself is
 * decided by Apple at runtime; here we only gate on the environment that the
 * popup flow strictly needs.
 */
export function canUseAppleNative(): boolean {
  if (typeof window === "undefined") return false;
  if (!getAppleServicesId()) return false;
  if (window.location.protocol !== "https:") return false;
  const host = window.location.hostname;
  if (host === "localhost" || host === "127.0.0.1") return false;
  return true;
}

let scriptPromise: Promise<void> | null = null;

function loadAppleScript(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Apple JS unavailable on server"));
  }
  if (window.AppleID?.auth) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${APPLE_JS_SRC}"]`,
    );
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("Failed to load Apple sign-in script")),
        { once: true },
      );
      if (window.AppleID?.auth) resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = APPLE_JS_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      scriptPromise = null;
      reject(new Error("Failed to load Apple sign-in script"));
    };
    document.head.appendChild(script);
  });

  return scriptPromise;
}

/**
 * Run the native popup flow. Returns `{ fellBack: true }` (without an error)
 * when the popup cannot run and the caller should use the redirect flow
 * instead. A real failure returns an `error` string.
 */
export async function signInWithAppleNative(): Promise<{
  ok: boolean;
  error?: string;
  fellBack?: boolean;
}> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return { ok: false, error: "Cloud sync is not configured yet." };

  const clientId = getAppleServicesId();
  if (!clientId || !canUseAppleNative()) {
    return { ok: false, fellBack: true };
  }

  try {
    await loadAppleScript();
  } catch {
    // Script blocked (adblock/offline) — let the caller redirect instead.
    return { ok: false, fellBack: true };
  }

  const auth = window.AppleID?.auth;
  if (!auth) return { ok: false, fellBack: true };

  // Supabase hashes this nonce and compares it against the sha256(nonce) Apple
  // embeds in the id_token, so the same raw value must go to both calls.
  const nonce = crypto.randomUUID();

  auth.init({
    clientId,
    scope: "name email",
    redirectURI: `${siteUrl()}/auth/callback`,
    usePopup: true,
    nonce,
  });

  let response: AppleSignInResponse;
  try {
    response = await auth.signIn();
  } catch (err) {
    // popup_closed_by_user and user_cancelled_authorize are benign cancels.
    const code =
      typeof err === "object" && err && "error" in err
        ? String((err as { error: unknown }).error)
        : "";
    if (code === "popup_closed_by_user" || code === "user_cancelled_authorize" || code === "user_trigger_new_signin_flow") {
      return { ok: false };
    }
    // Anything else (incl. popup blocked) — fall back to the redirect flow.
    return { ok: false, fellBack: true };
  }

  const idToken = response.authorization?.id_token;
  if (!idToken) return { ok: false, fellBack: true };

  const { error } = await supabase.auth.signInWithIdToken({
    provider: "apple",
    token: idToken,
    nonce,
  });

  if (error) return { ok: false, error: error.message };

  // Apple returns the user's name only on the very first authorization.
  const name = response.user?.name;
  if (name) {
    const fullName = [name.firstName, name.middleName, name.lastName]
      .filter(Boolean)
      .join(" ")
      .trim();
    if (fullName) {
      void supabase.auth.updateUser({
        data: {
          full_name: fullName,
          given_name: name.firstName,
          family_name: name.lastName,
        },
      });
    }
  }

  return { ok: true };
}
