# TypeAlgo run #4: Anthropic + OpenAI level depth (L3/L5 spread)

Copy to Cursor when ready. Makes the **level selector** meaningful on your top two tracks.

**Prerequisite:** Runs #1–#2 complete. Anthropic already has `anthropic-counter-service` at L3 — Phase 1 must check audit and skip duplicates.

### Delivery mode

| Mode | Instructions |
|------|----------------|
| **Local Cursor agent** | Commit per phase on `main`. **Do not push** — review locally first. |
| **Cloud / background agent** | Branch `content/l3-l5-depth`. Push branch only; PR for review. |

---

```
# TypeAlgo: Anthropic + OpenAI level depth (LOCAL)

Read TRACKS_CONTENT_SPEC.md and PREP_BACKLOG.md first. Commit per phase,
typecheck (npx tsc --noEmit) before each, DO NOT PUSH.

Context: Anthropic and OpenAI staged problems cluster at L4-L5. Add L3
(approachable) and fill gaps so the level selector spans the range per
spec.

## Phase 1 — Anthropic L3 staged (Python, up to 2 problems, 2 stages each)
1. In-memory KV store basics (set/get → delete) — the L3 entry the spec
   names but isn't shipped at L3 band.
2. Counter service with reset — CHECK TRACKS_AUDIT first: if
   anthropic-counter-service already covers this at L3, skip and note
   in audit; author a different L3 archetype from spec (e.g. simple LRU
   with OrderedDict) instead.
Commit.

## Phase 2 — OpenAI L3 staged (Python, 2 problems, gates)
1. Basic iterator protocol (__iter__/__next__ → exhaustion handling).
2. Fixed-window rate limiter (allow/deny → window reset) — simpler
   precursor to the sliding-window limiter already shipped.
Commit.

## Phase 3 — Docs
Update inventory in PREP_BACKLOG.md and TRACKS_AUDIT.md. Commit.

## House rules
Stage headers: one-line requirement voice. Stage code must match header
(desync guard stays quiet). 30–90s typing per stage at 60 WPM. No
regressions to engine/auth/globals.css/keep-alive. Never push --force;
blocked phase after 3 retries → log, commit, skip, continue. DO NOT PUSH.
```

---

## Review focus

- **Phase 1 dedup** — Don't ship a second counter if L3 counter already exists; substitute LRU or spec L3 archetype.
- **L3 vs L4 overlap** — New L3 KV should be simpler than `anthropic-kv-store` (no sorted keys/TTL).

## Inventory target

| Track | Staged before | +This run |
|-------|---------------|-----------|
| Anthropic | 9 | +1–2 L3 |
| OpenAI | 9 | +2 L3 |
