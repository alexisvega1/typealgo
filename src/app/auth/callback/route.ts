import { NextResponse } from "next/server";
import { getSiteURL } from "@/lib/supabase/config";
import { getSupabaseServerClient } from "@/lib/supabase/server";

function safeNextPath(raw: string | null): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return "/";
  return raw;
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const site = getSiteURL();
  const siteOrigin = new URL(site).origin;

  // OAuth may land on *.vercel.app while the PKCE verifier cookie lives on
  // the canonical domain — forward to typealgo.com before exchanging the code.
  if (requestUrl.origin !== siteOrigin) {
    const canonical = new URL("/auth/callback", site);
    requestUrl.searchParams.forEach((value, key) => {
      canonical.searchParams.set(key, value);
    });
    return NextResponse.redirect(canonical);
  }

  const code = requestUrl.searchParams.get("code");
  const next = safeNextPath(requestUrl.searchParams.get("next"));

  if (code) {
    const supabase = await getSupabaseServerClient();
    if (!supabase) {
      return NextResponse.redirect(
        `${site}/?auth_error=${encodeURIComponent("Cloud sync is not configured on this server.")}`,
      );
    }
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return NextResponse.redirect(
        `${site}/?auth_error=${encodeURIComponent(error.message)}`,
      );
    }
  }

  return NextResponse.redirect(`${site}${next}`);
}
