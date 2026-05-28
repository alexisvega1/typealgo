#!/usr/bin/env node
/**
 * Generate the "Sign in with Apple" client secret (a JWT) for Supabase Auth.
 *
 * Apple does not give you a static secret — you sign a short-lived JWT with the
 * private .p8 key. Supabase pastes this into the Apple provider's
 * "Secret Key (for OAuth)" field. Apple caps the lifetime at 6 months, so
 * re-run this and update Supabase before it expires.
 *
 * Usage:
 *   APPLE_TEAM_ID=ABCDE12345 \
 *   APPLE_KEY_ID=XYZ9876543 \
 *   APPLE_CLIENT_ID=com.typealgo.web \
 *   APPLE_P8_PATH=./AuthKey_XYZ9876543.p8 \
 *   node scripts/generate-apple-secret.mjs
 *
 * Prints the JWT to stdout. Copy it into Supabase → Authentication →
 * Sign In / Providers → Apple → Secret Key (for OAuth).
 */
import { readFileSync } from "node:fs";
import crypto from "node:crypto";

const TEAM_ID = process.env.APPLE_TEAM_ID;
const KEY_ID = process.env.APPLE_KEY_ID;
const CLIENT_ID = process.env.APPLE_CLIENT_ID;
const P8_PATH = process.env.APPLE_P8_PATH;

const missing = Object.entries({ APPLE_TEAM_ID: TEAM_ID, APPLE_KEY_ID: KEY_ID, APPLE_CLIENT_ID: CLIENT_ID, APPLE_P8_PATH: P8_PATH })
  .filter(([, v]) => !v)
  .map(([k]) => k);

if (missing.length) {
  console.error(`Missing required env vars: ${missing.join(", ")}`);
  process.exit(1);
}

const base64url = (input) => Buffer.from(input).toString("base64url");

const now = Math.floor(Date.now() / 1000);
// Apple allows up to ~6 months (15777000s). Use 180 days for headroom.
const exp = now + 60 * 60 * 24 * 180;

const header = { alg: "ES256", kid: KEY_ID };
const payload = {
  iss: TEAM_ID,
  iat: now,
  exp,
  aud: "https://appleid.apple.com",
  sub: CLIENT_ID,
};

const signingInput = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(payload))}`;

let privateKey;
try {
  privateKey = readFileSync(P8_PATH, "utf8");
} catch (err) {
  console.error(`Could not read .p8 key at ${P8_PATH}: ${err.message}`);
  process.exit(1);
}

const signature = crypto
  .sign("sha256", Buffer.from(signingInput), { key: privateKey, dsaEncoding: "ieee-p1363" })
  .toString("base64url");

const jwt = `${signingInput}.${signature}`;

console.error(`\nApple client secret (valid until ${new Date(exp * 1000).toISOString()}):\n`);
console.log(jwt);
