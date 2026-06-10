<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Cursor Cloud specific instructions

TypeAlgo is a single Next.js 16 app (npm, Node 22 per `.nvmrc`). No Docker, monorepo, or local database — progress is stored in browser `localStorage`; Supabase cloud sync is optional.

### Services

| Service | Required | Start |
|---------|----------|-------|
| Next.js dev server | Yes | `npm run dev` → http://localhost:3000 |
| Supabase (hosted) | No | Only for GitHub OAuth / cloud sync; copy `.env.example` → `.env.local` |

### Common commands

See `README.md` for full setup. Standard scripts from `package.json`:

- **Dev:** `npm run dev`
- **Lint:** `npm run lint` (may report pre-existing `react-hooks/set-state-in-effect` errors in a few files)
- **Build:** `npm run build`
- **Prod:** `npm run start` (after build)
- **Auth audit:** `npm run audit:auth` (needs Supabase env vars)

### Gotchas

- The app works fully offline without `.env.local`; auth/sync features need hosted Supabase + GitHub OAuth per `docs/auth-audit.md`.
- Apple Sign In (`NEXT_PUBLIC_APPLE_SERVICES_ID`) only works on HTTPS non-localhost origins.
- No automated test runner is configured in `package.json`; verify changes via lint, build, and manual browser testing of the typing flow on `/`.
- Request handling uses `src/proxy.ts` (Next.js 16 proxy/middleware pattern), not a separate API service.
