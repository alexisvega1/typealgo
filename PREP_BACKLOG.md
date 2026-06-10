# Prep backlog — seed inventory & authoring queue

Living document for **what TypeAlgo still needs** vs what is shipped, ordered by **your interview targets** (not product symmetry).

**Primary targets:** Anthropic · Google Research Connectomics · Janelia-adjacent AI-for-science  
**Secondary (product completeness):** Meta classic pool last

**Authoritative content rules:** [`TRACKS_CONTENT_SPEC.md`](./TRACKS_CONTENT_SPEC.md)  
**Shipped log + file map:** [`TRACKS_AUDIT.md`](./TRACKS_AUDIT.md)  
**Prep source docs:** [`docs/prep/`](./docs/prep/)  
**Ready-to-run authoring prompt:** [`docs/prep/AUTHORING_RUN.md`](./docs/prep/AUTHORING_RUN.md)  
**Engine audit:** [`SEMANTIC_AUDIT.md`](./SEMANTIC_AUDIT.md)

Last updated: June 2026 (local authoring run complete — **39/39** dedicated seeds).

---

## Quick scan — totals

| Pool | Spec min | Shipped | Absent | Your priority |
|------|----------|---------|--------|---------------|
| Anthropic staged | 6 | **6** | 0 | **P0** — complete |
| OpenAI staged | 6 | **6** | 0 | **P1** — complete |
| Google classic | 9 | **9** | 0 | **P2** — complete |
| DeepMind | 9 (6+3 ML) | **9** | 0 | **P2** — complete |
| Meta classic | 9 | **9** | 0 | **P3** — complete |
| **Total dedicated seeds** | **39** | **39** | **0** | |

General Fluency (~85 classic snippets) is unchanged — company tracks add **dedicated** seeds on top.

**Staged pool:** 12/12 · **Classic dedicated pool:** 27/27

---

## Shipped (do not re-author)

### Anthropic staged (6)

| Name | Level | Stages | ID |
|------|-------|--------|-----|
| In-Memory KV Store | L4 | 3 | `anthropic-kv-store` |
| Token Bucket Rate Limiter | L4 | 2 | `anthropic-rate-limiter` |
| File-Backed Config Store | L4 | 2 | `anthropic-config-store` |
| Append-Only Event Log | L4 | 3 | `anthropic-event-log` |
| Windowed Counter Service | L3 | 2 | `anthropic-counter-service` |
| Thread-Safe Bounded Queue | L5 | 3 | `anthropic-bounded-queue` |

### OpenAI staged (6)

| Name | Level | Stages | ID |
|------|-------|--------|-----|
| Time-Based Key-Value Store | L4 | 3 | `openai-timed-kv` |
| Resumable Iterator | L4 | 2 | `openai-resumable-iterator` |
| Sliding-Window Rate Limiter | L4 | 2 | `openai-sliding-rate-limiter` |
| Retry Queue with Dead Letter | L4 | 3 | `openai-retry-queue` |
| IP Address Iterator | L4 | 2 | `openai-ip-iterator` |
| Versioned Key-Value Store | L5 | 3 | `openai-versioned-kv` |

### Google classic (9) — `company-google.ts`

L3: merge sorted · grid BFS · binary search on capacity  
L4: topological sort · merge intervals · task scheduler  
L5: edit distance · trie · LRU cache class

### DeepMind (9) — `company-deepmind.ts`

Classic: DFS components · kth largest heap · first bad version · running median · stream anomaly · matrix path sum  
ML L5: stable softmax · k-means step · attention scores

### Meta classic (9) — `company-meta.ts`

E3: balanced brackets · two-sum indices · rolling average  
E4: k closest points · subarray sum k · LCA  
E5: merge k lists · tree max path · add operators

---

## Absent — prioritized queue

**None.** Minimum viable seed inventory is complete. Next passes (optional):

- Google multi-language mirrors (Java/C++/JS per spec)
- Google comprehension “planted bug” variants (needs review content model)
- Double-each-track quality expansion after human review

---

## Blockers before authoring

| Blocker | Status | Notes |
|---------|--------|-------|
| Schema: `level_range`, `format`, `source_style` on `Snippet` | **Shipped** | Phase 0; 6 original staged backfilled |
| Meta E-levels in data model | Partial | UI uses E-labels; snippets use `levelRange` career IDs |
| Google multi-language seeds | Deferred | Spec allows 4 langs; Python pool shipped |

---

## What prep docs cover that TypeAlgo does *not*

Use the **prompt library** for these — they will not become typing snippets.

| Tier | Examples | Where to practice |
|------|----------|-------------------|
| System design | Batch LLM eval, Connectomics ingestion, fault tolerance | `docs/prep/Interview-Prep-Prompt-Library-v2-revised.md` §4 |
| Values / behavioral | RSP, Constitutional AI, honesty-ledger STAR | Same, §3 |
| Technical deep dive | FFN/connectomics reverse system design | Same, §2E + §6 Google bridge |
| Concurrency oral | threads / processes / async / GIL | Same, §3 quiz prompt |

Typing prep for the Anthropic/OpenAI loops is covered by staged seeds; the bottleneck shifts to **mock reps**, not seeds.

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

| Archetype | Anthropic prep | OpenAI prep | TypeAlgo |
|-----------|----------------|-------------|----------|
| Time-based KV | Week 1 | §4 practical | **Shipped** |
| Resumable iterator | — | §4 practical | **Shipped** |
| Sliding-window rate limiter | drill list | spec L4 | **Shipped** |
| Retry + DLQ | drill list | §4 practical | **Shipped** |
| Thread-safe bounded queue | drill list | — | **Shipped** |
| IP/CIDR iterator | — | spec L4 | **Shipped** |
| Event log with replay | spec L4 | — | **Shipped** |
| Versioned KV / rollback | — | spec L5 | **Shipped** |

---

## Revision log

| Date | Change |
|------|--------|
| 2026-06 | Initial backlog from prep-doc synthesis; 6/39 shipped; authoring run sequenced Anthropic → OpenAI → Google → DeepMind → Meta |
| 2026-06 | Local authoring run complete: 39/39 dedicated seeds (12 staged + 27 classic) |
