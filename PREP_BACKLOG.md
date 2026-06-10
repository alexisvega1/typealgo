# Prep backlog — seed inventory & authoring queue

Living document for **what TypeAlgo still needs** vs what is shipped, ordered by **your interview targets** (not product symmetry).

**Primary targets:** Anthropic · Google Research Connectomics · Janelia-adjacent AI-for-science  
**Secondary (product completeness):** Meta classic pool last

**Authoritative content rules:** [`TRACKS_CONTENT_SPEC.md`](./TRACKS_CONTENT_SPEC.md)  
**Shipped log + file map:** [`TRACKS_AUDIT.md`](./TRACKS_AUDIT.md)  
**Prep source docs:** [`docs/prep/`](./docs/prep/)  
**Ready-to-run authoring prompt:** [`docs/prep/AUTHORING_RUN.md`](./docs/prep/AUTHORING_RUN.md)  
**Engine audit:** [`SEMANTIC_AUDIT.md`](./SEMANTIC_AUDIT.md)

Last updated: June 2026 (run #4 complete — **91** dedicated seed rows; 55 logical + 36 language mirrors).  
**Queued runs:** [`AUTHORING_RUN_4_LANDING.md`](./docs/prep/AUTHORING_RUN_4_LANDING.md) (hero — **ready**, watch-it design run; Phase 1 stop-gate)

---

## Quick scan — totals

| Pool | Run #1 min | Shipped | Notes |
|------|------------|---------|-------|
| Anthropic staged | 6 | **11** | +2 L3 (run #4: KV basics, simple LRU) |
| OpenAI staged | 6 | **11** | +2 L3 (run #4: iterator protocol, fixed-window limiter) |
| Google classic | 9 | **27** | 9 Python + 9 Java + 9 C++ mirrors |
| Google comprehension | — | **18** | 6 × 3 langs (run #2 + #3 mirrors) |
| DeepMind | 9 | **9** | unchanged |
| Meta classic | 9 | **9** | unchanged |
| **Total dedicated seeds** | **39** | **91** | 55 logical + 36 mirror rows |

**Staged pool:** 22/22 · **Classic dedicated:** 27/27 · **Comprehension:** 18/18 (6 logical × 3 langs)

---

## Shipped (do not re-author)

### Anthropic staged (11)

Run #1 (6): KV store · rate limiter · config store · event log · counter · bounded queue  
Run #2 (+3): concurrent crawler · producer-consumer buffer · DAG scheduler  
Run #4 (+2 L3): KV basics (`anthropic-kv-basics`) · simple LRU (`anthropic-simple-lru`) — counter skipped (`anthropic-counter-service` already at L3)

### OpenAI staged (11)

Run #1 (6): timed KV · resumable iterator · sliding rate limiter · retry queue · IP iterator · versioned KV  
Run #2 (+3): webhook delivery queue · stream deduplicator · LRU staged build (`openai-lru-cache-staged`)  
Run #4 (+2 L3): iterator protocol (`openai-iterator-protocol`) · fixed-window limiter (`openai-fixed-window-limiter`)

**Note:** `openai-lru-cache-staged` pairs with `google-lru-cache` classic — different formats, not duplicates.

### Google classic (9) — `company-google.ts`

L3: merge sorted · grid BFS · binary search on capacity  
L4: topological sort · merge intervals · task scheduler  
L5: edit distance · trie · LRU cache class

### Google comprehension (6) — `company-google-comprehension.ts`

L3: fix merge sorted · fix grid BFS  
L4: fix topo sort · fix merge intervals  
L5: fix edit distance · fix LRU eviction

Each links to a classic via `variantOf`. Java/C++ mirrors in `company-google-comprehension-{java,cpp}.ts` link to Python comprehension ids.

### Google language mirrors (36) — run #3

Classic: `company-google-{java,cpp}.ts` (9 each) · Comprehension: `company-google-comprehension-{java,cpp}.ts` (6 each).  
Python remains canonical; mirrors use `variantOf` + `languageMirrorId()` suffix `-java` / `-cpp`.

### DeepMind (9) · Meta classic (9)

Unchanged from run #1 — see [`TRACKS_AUDIT.md`](./TRACKS_AUDIT.md).

---

## Absent — next optional passes

| Item | Status |
|------|--------|
| Double-each-track quality expansion | Optional after human review |
| Stage header voice polish | Optional |

**Canonical prep-doc builds now shipped:** concurrent crawler · webhook/DLQ path · DAG scheduler · comprehension round · producer-consumer · stream dedup · staged LRU.

---

## Blockers before authoring

| Blocker | Status | Notes |
|---------|--------|-------|
| Comprehension format engine path | **Shipped** | Run #2 Phase 0 — display panel only |
| Schema: `buggyCode`, `plantedBugKind` | **Shipped** | On `Snippet` |
| Google multi-language seeds | **Shipped** | Run #3 — Java + C++ mirrors (JS skipped) |

---

## Cross-reference: prep doc canonical builds

| Archetype | TypeAlgo |
|-----------|----------|
| Concurrent crawler | **Shipped** (`anthropic-concurrent-crawler`) |
| Producer-consumer / bounded buffer | **Shipped** (`anthropic-producer-consumer`) |
| Job DAG scheduler | **Shipped** (`anthropic-dag-scheduler`) |
| Webhook delivery + idempotency | **Shipped** (`openai-webhook-delivery`) |
| Memory-bounded stream dedup | **Shipped** (`openai-stream-deduplicator`) |
| Staged LRU (OpenAI gate build) | **Shipped** (`openai-lru-cache-staged`) |
| Google code comprehension | **Shipped** (6 variants) |
| Time-based KV · retry/DLQ · etc. | **Shipped** (run #1) |

---

## Revision log

| Date | Change |
|------|--------|
| 2026-06 | Run #1: 39/39 minimum viable seeds |
| 2026-06 | Run #2: comprehension format + 6 canonical staged + 6 comprehension → 51 total |
