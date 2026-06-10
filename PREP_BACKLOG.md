# Prep backlog — seed inventory & authoring queue

Living document for **what TypeAlgo still needs** vs what is shipped, ordered by **your interview targets** (not product symmetry).

**Primary targets:** Anthropic · Google Research Connectomics · Janelia-adjacent AI-for-science  
**Secondary (product completeness):** Meta classic pool last

**Authoritative content rules:** [`TRACKS_CONTENT_SPEC.md`](./TRACKS_CONTENT_SPEC.md)  
**Shipped log + file map:** [`TRACKS_AUDIT.md`](./TRACKS_AUDIT.md)  
**Prep source docs:** [`docs/prep/`](./docs/prep/)  
**Ready-to-run authoring prompt:** [`docs/prep/AUTHORING_RUN.md`](./docs/prep/AUTHORING_RUN.md)  
**Engine audit:** [`SEMANTIC_AUDIT.md`](./SEMANTIC_AUDIT.md)

Last updated: June 2026 (post staged-engine QA, 6/39 seeds shipped).

---

## Quick scan — totals

| Pool | Spec min | Shipped | Absent | Your priority |
|------|----------|---------|--------|---------------|
| Anthropic staged | 6 | **3** | **3** | **P0** — includes L5 concurrency |
| OpenAI staged | 6 | **3** | **3** | **P1** — lowest-risk batch on QA'd pipeline |
| Google classic | 9 | 0 | **9** | **P2** — Connectomics + general Google SWE |
| DeepMind | 9 (6+3 ML) | 0 | **9** | **P2** — ML primitives overlap your background |
| Meta classic | 9 | 0 | **9** | **P3** — product completeness only |
| **Total dedicated seeds** | **39** | **6** | **33** | |

General Fluency (~85 classic snippets) is unchanged — company tracks add **dedicated** seeds on top.

---

## Shipped (do not re-author)

| Name | Track | Level | Stages | ID |
|------|-------|-------|--------|-----|
| In-Memory KV Store | Anthropic | L4 | 3 | `anthropic-kv-store` |
| Token Bucket Rate Limiter | Anthropic | L4 | 2 | (see `staged-problems.ts`) |
| File-Backed Config Store | Anthropic | L4 | 2 | |
| Time-Based Key-Value Store | OpenAI | L4 | 3 | `openai-timed-kv` |
| Resumable Iterator | OpenAI | L4 | 2 | `openai-resumable-iterator` |
| Sliding-Window Rate Limiter | OpenAI | L4 | 2 | |

---

## Absent — prioritized queue

Order follows [`docs/prep/AUTHORING_RUN.md`](./docs/prep/AUTHORING_RUN.md). Check off in `TRACKS_AUDIT.md` when shipped.

### P0 — Anthropic completion (3 staged, Python)

| # | Problem | Level | Stages | Prep doc anchor |
|---|---------|-------|--------|-----------------|
| A1 | **Event log with replay** — append → replay from offset → compact/truncate | L4 | 3 | Anthropic spec L4; prep Week 2 production systems |
| A2 | **Counter service with windowed reset** | L3 | 2 | Anthropic spec L3 |
| A3 | **Thread-safe bounded queue** — single-thread → `Lock` → backpressure/timeout | L5 | 3 | Prep docs Week 2; highest Anthropic coding priority |

### P1 — OpenAI completion (3 staged, gate-styled)

| # | Problem | Level | Stages | Prep doc anchor |
|---|---------|-------|--------|-----------------|
| O1 | **Retry queue** — exponential backoff + dead-letter | L4 | 3 | Both prep docs; prompt library §4 practical |
| O2 | **IP/CIDR iterator** — parse/expand → lazy generation | L4 | 2 | OpenAI spec L4 |
| O3 | **Versioned KV with rollback** | L5 | 3 | OpenAI spec L5 |

### P2 — Google classic (9, Python for now)

| Level | Archetypes (absent) |
|-------|---------------------|
| L3 | Two-pointer merge · grid BFS · binary search on answer |
| L4 | Topological sort · merge intervals · heap-based scheduling |
| L5 | Edit-distance DP · trie insert/search · LRU as a class |

### P2 — DeepMind (9: 6 classic + 3 ML primitives)

| Bucket | Archetypes (absent) |
|--------|---------------------|
| Classic L3–L4 | Graph traversal · heaps · median maintenance · bounded-memory stream anomaly · matrix DP · binary search variant |
| ML L5 (stdlib only) | Numerically stable softmax · single k-means assign+update · attention scores (loops, no numpy) |

### P3 — Meta classic (9, E3/E4/E5)

Per spec archetypes only. **Original phrasing** — never reproduce LeetCode/problem-bank text.

---

## Blockers before authoring

| Blocker | Status | Notes |
|---------|--------|-------|
| Schema: `level_range`, `format`, `source_style` on `Snippet` | **Absent** | Phase 0 in authoring run; backfill 6 shipped |
| Meta E-levels in data model | Partial | UI uses E-labels; snippets still implicit L-band |
| Google multi-language seeds | Deferred | Spec allows 4 langs; author Python first |

---

## What prep docs cover that TypeAlgo does *not*

Use the **prompt library** for these — they will not become typing snippets.

| Tier | Examples | Where to practice |
|------|----------|-------------------|
| System design | Batch LLM eval, Connectomics ingestion, fault tolerance | `docs/prep/Interview-Prep-Prompt-Library-v2-revised.md` §4 |
| Values / behavioral | RSP, Constitutional AI, honesty-ledger STAR | Same, §3 |
| Technical deep dive | FFN/connectomics reverse system design | Same, §2E + §6 Google bridge |
| Concurrency oral | threads / processes / async / GIL | Same, §3 quiz prompt |

Once P0+P1 seeds land, **typing prep** for the Anthropic loop is covered; the bottleneck shifts to **mock reps**, not seeds.

---

## How to queue problems from new prep materials

When you get updated Claude/ChatGPT prep docs or candidate reports:

1. **Extract coding/build mentions only** — ignore loop-structure claims unless tagged [A] official.
2. **Map to an archetype** using the taxonomy in [`docs/prep/Anthropic-OpenAI-Interview-Prep-2026-revised.md`](./docs/prep/Anthropic-OpenAI-Interview-Prep-2026-revised.md) (§3–4 drill lists).
3. **Check this file** — if archetype is already shipped, skip; if absent, add a row under the right priority bucket with a one-line `Prep doc anchor`.
4. **Check overlap** — many Anthropic/OpenAI problems share shapes (rate limiter, retry/DLQ, KV); prefer **one staged implementation per shape** before duplicating.
5. **Author via** [`docs/prep/AUTHORING_RUN.md`](./docs/prep/AUTHORING_RUN.md) — do not ad-hoc seeds outside spec + quality gate.
6. **Log ship** in `TRACKS_AUDIT.md` seed table; update counts in this file's Quick scan table.

### Archetype → track routing (cheat sheet)

| If prep doc says… | TypeAlgo track | Format |
|-------------------|----------------|--------|
| Multi-tier / production / concurrency | Anthropic | staged |
| Rebuild class / gate / test-driven component | OpenAI | staged |
| LeetCode-medium speed / classic DSA | Google or Meta | classic |
| ML primitive from scratch | DeepMind L5 | classic |
| Connectomics QC / volume pipeline | Prompt library + deep dive | not TypeAlgo |

---

## Cross-reference: prep doc canonical builds

These appear in **all four** prep exports (Claude + revised) and align with TypeAlgo spec:

| Archetype | Anthropic prep | OpenAI prep | TypeAlgo |
|-----------|----------------|-------------|----------|
| Time-based KV | Week 1 | §4 practical | **Shipped** |
| Resumable iterator | — | §4 practical | **Shipped** |
| Sliding-window rate limiter | drill list | spec L4 | **Shipped** (OpenAI); token bucket **Shipped** (Anthropic) |
| Retry + DLQ | drill list | §4 practical | **Absent O1** |
| Concurrent crawler | drill list | — | **Absent** (future Anthropic L5+) |
| Thread-safe bounded queue | drill list | — | **Absent A3** |
| IP/CIDR iterator | — | spec L4 | **Absent O2** |

---

## Revision log

| Date | Change |
|------|--------|
| 2026-06 | Initial backlog from prep-doc synthesis; 6/39 shipped; authoring run sequenced Anthropic → OpenAI → Google → DeepMind → Meta |
