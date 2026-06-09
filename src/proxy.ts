import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSiteURL } from "@/lib/supabase/config";

const SUPABASE_CONFIGURED = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export async function proxy(request: NextRequest) {
  const url = request.nextUrl;

  // Supabase sometimes drops the OAuth `code` on Site URL root when redirect_to
  // isn't allow-listed (e.g. signing in from a *.vercel.app host). Forward it
  // to our callback handler so the session exchange still runs.
  const code = url.searchParams.get("code");
  if (code && url.pathname !== "/auth/callback") {
    const callback = new URL("/auth/callback", getSiteURL());
    url.searchParams.forEach((value, key) => {
      callback.searchParams.set(key, value);
    });
    return NextResponse.redirect(callback);
  }

  if (!SUPABASE_CONFIGURED) {
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
