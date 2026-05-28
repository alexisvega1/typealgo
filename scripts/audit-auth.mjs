#!/usr/bin/env node
/**
 * Pre-flight checks for TypeAlgo GitHub OAuth + Supabase sync.
 * Usage: npm run audit:auth [-- --url https://typealgo.vercel.app]
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const args = process.argv.slice(2);
const urlFlag = args.find((a) => a.startsWith("--url="));
const siteUrl = urlFlag?.split("=")[1] ?? process.env.NEXT_PUBLIC_SITE_URL ?? "https://typealgo.vercel.app";

function loadEnvFile(path) {
  if (!existsSync(path)) return {};
  const out = {};
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    out[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
  return out;
}

const envLocal = loadEnvFile(resolve(root, ".env.local"));
const env = {
  NEXT_PUBLIC_SUPABASE_URL:
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? envLocal.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY:
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? envLocal.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_SITE_URL:
    process.env.NEXT_PUBLIC_SITE_URL ?? envLocal.NEXT_PUBLIC_SITE_URL ?? siteUrl,
};

const results = [];

function pass(label, detail) {
  results.push({ ok: true, label, detail });
  console.log(`✓ ${label}${detail ? ` — ${detail}` : ""}`);
}

function fail(label, detail) {
  results.push({ ok: false, label, detail });
  console.log(`✗ ${label}${detail ? ` — ${detail}` : ""}`);
}

function warn(label, detail) {
  results.push({ ok: null, label, detail });
  console.log(`⚠ ${label}${detail ? ` — ${detail}` : ""}`);
}

async function main() {
  console.log("\nTypeAlgo auth audit\n");

  const { NEXT_PUBLIC_SUPABASE_URL: supabaseUrl, NEXT_PUBLIC_SUPABASE_ANON_KEY: anonKey, NEXT_PUBLIC_SITE_URL: configuredSiteUrl } = env;

  if (supabaseUrl && !supabaseUrl.includes("your-project")) {
    pass("NEXT_PUBLIC_SUPABASE_URL", supabaseUrl);
  } else {
    fail("NEXT_PUBLIC_SUPABASE_URL", "Missing or placeholder — set in .env.local and Vercel");
  }

  if (anonKey && anonKey !== "your-anon-key" && anonKey.length > 20) {
    pass("NEXT_PUBLIC_SUPABASE_ANON_KEY", "Set (redacted)");
  } else {
    fail("NEXT_PUBLIC_SUPABASE_ANON_KEY", "Missing or placeholder");
  }

  if (configuredSiteUrl) {
    pass("NEXT_PUBLIC_SITE_URL", configuredSiteUrl);
  } else {
    warn("NEXT_PUBLIC_SITE_URL", "Not set — OAuth may use wrong redirect in SSR");
  }

  const callbackUrl = `${configuredSiteUrl.replace(/\/$/, "")}/auth/callback`;
  console.log(`\nExpected OAuth callback: ${callbackUrl}\n`);

  if (supabaseUrl && anonKey && !supabaseUrl.includes("your-project")) {
    try {
      const health = await fetch(`${supabaseUrl}/auth/v1/health`, {
        headers: { apikey: anonKey },
      });
      if (health.ok) pass("Supabase Auth API", `HTTP ${health.status}`);
      else fail("Supabase Auth API", `HTTP ${health.status}`);
    } catch (err) {
      fail("Supabase Auth API", err instanceof Error ? err.message : "Unreachable");
    }

    try {
      const { data, error } = await fetch(
        `${supabaseUrl}/rest/v1/user_progress?select=user_id&limit=1`,
        {
          headers: {
            apikey: anonKey,
            Authorization: `Bearer ${anonKey}`,
          },
        },
      ).then(async (res) => ({
        data: res.ok,
        error: res.ok ? null : `${res.status} ${await res.text()}`,
      }));

      if (data) pass("user_progress table", "Reachable (RLS may block rows — expected)");
      else if (error?.includes("PGRST205") || error?.includes("does not exist")) {
        fail("user_progress table", "Table missing — run supabase/migrations/001_user_progress.sql");
      } else {
        warn("user_progress table", error ?? "Unexpected response");
      }
    } catch (err) {
      fail("user_progress table", err instanceof Error ? err.message : "Check failed");
    }
  }

  try {
    const res = await fetch(configuredSiteUrl, { redirect: "follow" });
    if (res.ok) pass("Production site", `${configuredSiteUrl} → HTTP ${res.status}`);
    else fail("Production site", `HTTP ${res.status}`);
  } catch (err) {
    fail("Production site", err instanceof Error ? err.message : "Unreachable");
  }

  try {
    const res = await fetch(`${configuredSiteUrl.replace(/\/$/, "")}/auth/callback`, {
      redirect: "manual",
    });
    const ok = res.status === 307 || res.status === 308 || res.status === 302 || res.status === 200;
    if (ok) pass("Auth callback route", `HTTP ${res.status}`);
    else fail("Auth callback route", `HTTP ${res.status}`);
  } catch (err) {
    fail("Auth callback route", err instanceof Error ? err.message : "Unreachable");
  }

  const migrationPath = resolve(root, "supabase/migrations/001_user_progress.sql");
  if (existsSync(migrationPath)) {
    pass("Migration file", "supabase/migrations/001_user_progress.sql");
  } else {
    fail("Migration file", "Missing");
  }

  const failed = results.filter((r) => r.ok === false).length;
  const warnings = results.filter((r) => r.ok === null).length;

  console.log("\n--- Manual checks (tomorrow) ---");
  console.log("1. Supabase → Authentication → Providers → GitHub: enabled");
  console.log("2. Supabase → URL Configuration → Redirect URLs includes:", callbackUrl);
  console.log(
    "3. GitHub OAuth App → Authorization callback URL: https://<project-ref>.supabase.co/auth/v1/callback",
  );
  console.log("4. Complete one typing session → burger menu → Save progress → Continue with GitHub");
  console.log("5. After redirect: avatar in menu, status shows Synced");
  console.log("6. Sign out → sign in again on same device");
  console.log("7. Second browser/device: sign in → progress merges from cloud");
  console.log("\nFull checklist: docs/auth-audit.md\n");

  if (failed > 0) {
    console.log(`Result: ${failed} failed, ${warnings} warnings\n`);
    process.exit(1);
  }
  console.log(`Result: all automated checks passed${warnings ? ` (${warnings} warnings)` : ""}\n`);
}

main();
