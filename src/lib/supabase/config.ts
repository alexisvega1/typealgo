export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

/** Production domain — OAuth callbacks must match Supabase redirect allow-list. */
const CANONICAL_SITE = "https://typealgo.com";

export function siteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (configured) return configured;

  if (typeof window !== "undefined") {
    const { origin, hostname } = window.location;
    // *.vercel.app preview URLs usually aren't registered in Supabase — finish OAuth
    // on the canonical domain so the session lands where users actually browse.
    if (hostname.endsWith(".vercel.app")) return CANONICAL_SITE;
    return origin;
  }

  return "http://localhost:3000";
}
