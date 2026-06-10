# Prep backlog — seed inventory & authoring queue

Living document for **what TypeAlgo still needs** vs what is shipped, ordered by **your interview targets** (not product symmetry).

**Primary targets:** Anthropic · Google Research Connectomics · Janelia-adjacent AI-for-science  
**Secondary (product completeness):** Meta classic pool last

**Authoritative content rules:** [`TRACKS_CONTENT_SPEC.md`](./TRACKS_CONTENT_SPEC.md)  
**Shipped log + file map:** [`TRACKS_AUDIT.md`](./TRACKS_AUDIT.md)  
**Prep source docs:** [`docs/prep/`](./docs/prep/)  
**Ready-to-run authoring prompt:** [`docs/prep/AUTHORING_RUN.md`](./docs/prep/AUTHORING_RUN.md)  
**Engine audit:** [`SEMANTIC_AUDIT.md`](./SEMANTIC_AUDIT.md)

Last updated: June 2026 (run #2 complete — **51** dedicated seeds).

---

## Quick scan — totals

| Pool | Run #1 min | Shipped | Notes |
|------|------------|---------|-------|
| Anthropic staged | 6 | **9** | +3 canonical (crawler, producer-consumer, DAG) |
| OpenAI staged | 6 | **9** | +3 canonical (webhook, dedup, staged LRU) |
| Google classic | 9 | **9** | unchanged |
| Google comprehension | — | **6** | new format (run #2) |
| DeepMind | 9 | **9** | unchanged |
| Meta classic | 9 | **9** | unchanged |
| **Total dedicated seeds** | **39** | **51** | |

**Staged pool:** 18/18 · **Classic dedicated:** 27/27 · **Comprehension:** 6/6

---

## Shipped (do not re-author)

### Anthropic staged (9)

Run #1 (6): KV store · rate limiter · config store · event log · counter · bounded queue  
Run #2 (+3): concurrent crawler · producer-consumer buffer · DAG scheduler

### OpenAI staged (9)

Run #1 (6): timed KV · resumable iterator · sliding rate limiter · retry queue · IP iterator · versioned KV  
Run #2 (+3): webhook delivery queue · stream deduplicator · LRU staged build (`openai-lru-cache-staged`)

**Note:** `openai-lru-cache-staged` pairs with `google-lru-cache` classic — different formats, not duplicates.

### Google classic (9) — `company-google.ts`

L3: merge sorted · grid BFS · binary search on capacity  
L4: topological sort · merge intervals · task scheduler  
L5: edit distance · trie · LRU cache class

### Google comprehension (6) — `company-google-comprehension.ts`

L3: fix merge sorted · fix grid BFS  
L4: fix topo sort · fix merge intervals  
L5: fix edit distance · fix LRU eviction

Each links to a classic via `variantOf`.

### DeepMind (9) · Meta classic (9)

Unchanged from run #1 — see [`TRACKS_AUDIT.md`](./TRACKS_AUDIT.md).

---

## Absent — next optional passes

| Item | Status |
|------|--------|
| Google multi-language mirrors (Java/C++/JS) | **Deferred** |
| Double-each-track quality expansion | Optional after human review |
| Stage header voice polish | Optional |

**Canonical prep-doc builds now shipped:** concurrent crawler · webhook/DLQ path · DAG scheduler · comprehension round · producer-consumer · stream dedup · staged LRU.

---

## Blockers before authoring

| Blocker | Status | Notes |
|---------|--------|-------|
| Comprehension format engine path | **Shipped** | Run #2 Phase 0 — display panel only |
| Schema: `buggyCode`, `plantedBugKind` | **Shipped** | On `Snippet` |
| Google multi-language seeds | Deferred | Python pool + comprehension shipped |

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
