export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

/** Production domain — OAuth callbacks must match Supabase redirect allow-list. */
const CANONICAL_SITE = "https://typealgo.com";

/**
 * Canonical site origin for OAuth redirectTo and post-auth redirects.
 * Never derived from VERCEL_URL, request headers, or window.location —
 * PKCE verifier cookies must be set and read on the same origin.
 */
export function getSiteURL(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (configured) return configured;

  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }

  return CANONICAL_SITE;
}

/** @deprecated Prefer {@link getSiteURL}. */
export function siteUrl(): string {
  return getSiteURL();
}
