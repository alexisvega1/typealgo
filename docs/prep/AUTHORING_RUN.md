# TypeAlgo content run: prioritized seed authoring

Copy this prompt to Cursor (or a cloud agent) when ready to execute the backlog in [`PREP_BACKLOG.md`](../../PREP_BACKLOG.md).

**Target candidate:** Anthropic, Google Connectomics, Janelia — **not** Meta-first.

### Delivery mode (pick one)

| Mode | Instructions |
|------|----------------|
| **Local Cursor agent** | Commit per phase on `main` (or a local branch). **Do not push** — leave commits for local review before prod. |
| **Cloud / background agent** | Work on branch `content/seed-run-1`. Commit per phase and **push the branch**. **Do not merge to `main`.** Open a PR for review (Meta phrasing, ML primitives). |

---

```
# TypeAlgo content run: prioritized seed authoring

Work phases IN ORDER, commit per phase, typecheck before each commit.
TRACKS_CONTENT_SPEC.md is authoritative on content; the quality gate
and logging rules in it apply to every problem. Log every authored
problem in TRACKS_AUDIT.md (name, track, level, format, stages,
one-line rationale).

## Phase 0 — Schema metadata (blocker for everything else)
Add level_range, format ("classic"|"staged"|"comprehension"), and
source_style (one line) to the Snippet/problem schema, backwards
compatible. Backfill the 6 shipped staged problems. Commit.

## Phase 1 — Anthropic completion (3 staged, Python)
Priority order:
1. Event log with replay (L4, 3 stages: append → replay from offset →
   compact/truncate)
2. Counter service with windowed reset (L3, 2 stages)
3. Thread-safe bounded queue (L5, 3 stages: single-thread → locking →
   backpressure/timeout) — concurrency tier per spec; use
   threading.Lock/Condition idiomatically.
Commit.

## Phase 2 — OpenAI completion (3 staged, Python, gate-styled)
1. Retry queue with exponential backoff + dead-letter (L4, 3 gates)
2. IP/CIDR iterator (L4, 2 gates: parse/expand → lazy generation)
3. Versioned KV with rollback (L5, 3 gates)
Commit.

## Phase 3 — Google classic pool (9, three per L3/L4/L5)
Per spec archetypes. Languages: author in Python; if snippets are
language-specific in the data model, Python only for now and note it.
L3: two-pointer merge, grid BFS, binary search on answer.
L4: topological sort, merge intervals, heap-based scheduling.
L5: edit-distance DP, trie insert/search, LRU as a class.
Commit.

## Phase 4 — DeepMind pool (9: 6 classic + 3 ML primitives)
Classic: per spec L3/L4 (graph traversal, heaps, median maintenance,
bounded-memory stream anomaly check, matrix DP, binary search variant).
ML primitives (L5, stdlib-only Python, no numpy): numerically stable
softmax; single k-means assignment+update iteration; attention scores
with plain loops. These must read as clean reference implementations.
Commit.

## Phase 5 — Meta classic pool (9, three per E3/E4/E5)
Per spec archetypes. CRITICAL: original phrasing only — describe each
requirement in our own words; never reproduce LeetCode/problem-bank
text. Commit.

## Phase 6 — Docs housekeeping
Ensure docs/prep/ contains the two -revised prep docs (already copied).
Confirm TRACKS_CONTENT_SPEC.md "Why these archetypes" links to them.
Update PREP_BACKLOG.md and TRACKS_AUDIT.md seed inventory: should read
12/12 staged, 27/27 classic when complete. Commit.

## House rules
Stage headers: one-line requirement voice. Stage code must implement
its own header (desync dev guard should stay quiet). 30–90s typing per
stage at 60 WPM. No regressions to engine, auth, globals.css, keep-alive.
Never push --force; stop after 3 retries and write blockers into
TRACKS_AUDIT.md.

Delivery: LOCAL agent — don't push (review locally first). CLOUD agent —
branch content/seed-run-1, push branch only, no merge to main (review via PR).
```

---

## Rationale for phase order

1. **Phases 1–2 before DSA pools** — staged pipeline is QA'd on prod; lowest-risk highest-value batch.
2. **Anthropic L5 concurrency (A3) in Phase 1** — single most prep-relevant coding item for Anthropic loop (prep docs Week 2).
3. **Google + DeepMind before Meta** — matches your interview targets; Meta is product symmetry.
4. **Local vs cloud delivery** — local: no push until reviewed; cloud: `content/seed-run-1` + PR, no merge to main.
