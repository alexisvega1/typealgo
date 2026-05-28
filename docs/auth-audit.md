# Auth audit checklist

TypeAlgo uses **GitHub OAuth via Supabase** for cloud sync. There is no email/password signup — the first “Continue with GitHub” creates the account.

Run automated pre-flight checks:

```bash
npm run audit:auth
# against production:
npm run audit:auth -- --url=https://typealgo.vercel.app
```

---

## One-time production setup

Complete these before auditing login/signup.

### 1. Supabase project

- [ ] Create project at [supabase.com](https://supabase.com)
- [ ] Run migration in **SQL Editor**:

  `supabase/migrations/001_user_progress.sql`

- [ ] Confirm table `public.user_progress` exists with RLS enabled

### 2. GitHub OAuth provider (Supabase)

- [ ] **Authentication → Providers → GitHub** → Enable
- [ ] Create a [GitHub OAuth App](https://github.com/settings/developers):
  - **Homepage URL:** `https://typealgo.vercel.app`
  - **Authorization callback URL:** `https://<project-ref>.supabase.co/auth/v1/callback`
    (Use the callback URL shown in Supabase GitHub provider settings)
- [ ] Paste GitHub **Client ID** and **Client Secret** into Supabase

### 3. Supabase URL configuration

- [ ] **Authentication → URL Configuration**
- [ ] **Site URL:** `https://typealgo.vercel.app`
- [ ] **Redirect URLs** (add all):
  - `https://typealgo.vercel.app/auth/callback`
  - `http://localhost:3000/auth/callback` (local dev)

### 4. Vercel environment variables

| Variable | Value |
|----------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://<project-ref>.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `NEXT_PUBLIC_SITE_URL` | `https://typealgo.vercel.app` |

Redeploy after setting env vars.

---

## Manual audit matrix (run tomorrow)

### A. Configuration smoke test

| Step | Expected |
|------|----------|
| `npm run audit:auth` | All automated checks pass |
| Open site in incognito | App loads without auth (local mode) |
| Burger menu before any session | No “Save progress” yet (expected) |

### B. Sign up (first-time GitHub user)

| Step | Expected |
|------|----------|
| Complete **one typing session** | Session finishes, results show |
| Open burger menu | **Save progress** button visible |
| Tap **Save progress** | Modal opens with **Continue with GitHub** |
| Tap **Continue with GitHub** | Redirect to GitHub authorize |
| Approve on GitHub | Redirect to `typealgo.vercel.app` |
| No `?auth_error=` in URL | If error, red banner explains failure |
| Open burger menu | GitHub avatar + **Synced** (or Syncing → Synced) |
| Supabase → Authentication → Users | New user row appears |

### C. Login (returning user)

| Step | Expected |
|------|----------|
| Sign out from menu | Status returns to **Local** |
| Complete another session OR open Save progress if visible | GitHub button available |
| **Continue with GitHub** again | GitHub may skip consent (already authorized) |
| Return to app | Avatar back, **Synced** |
| Stats from prior session | Still present (local + cloud merge) |

### D. Cross-device sync

| Step | Expected |
|------|----------|
| Device A: signed in, complete sessions | Cloud row updates in Supabase `user_progress` |
| Device B: incognito, sign in with same GitHub | Progress merges (stats, streak, settings) |
| Device B: complete new session | Device A syncs merged data after refresh |

### E. Failure cases

| Scenario | Expected |
|----------|----------|
| OAuth denied on GitHub | Redirect with error banner |
| Supabase env missing on Vercel | Modal shows backup-only mode, no GitHub button |
| Offline while signed in | Status **Offline**; no crash |
| `user_progress` table missing | Sync status **Sync issue** with error |

---

## Where auth lives in the app

| Surface | Location |
|---------|----------|
| Save progress / Sign in | Burger menu (after ≥1 session) |
| Sync status + Sign out | Burger menu footer |
| OAuth callback | `/auth/callback` |
| Session refresh | `src/middleware.ts` |
| Error banner | Top of page when `?auth_error=` |

---

## Troubleshooting

| Symptom | Likely cause |
|---------|----------------|
| Redirect loop or blank after GitHub | `NEXT_PUBLIC_SITE_URL` mismatch |
| `invalid redirect_uri` on GitHub | Callback URL not in Supabase/GitHub app |
| Sync issue / 42P01 | Migration not applied |
| No GitHub button | Env vars not set on Vercel |
| Session lost on refresh | Middleware missing (should be fixed in repo) |

---

## Notes

- **Local backup download** works without auth; **restore from backup** is not implemented yet.
- Auth UI is currently **mobile menu only** — desktop audit uses the same burger menu.
- For local dev: copy `.env.example` → `.env.local` and use `http://localhost:3000/auth/callback` in Supabase redirect URLs.
