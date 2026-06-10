# TypeAlgo — Company Fluency Tracks Audit

> Phase 1 audit (June 2026). Documents how tracks, levels, languages, and snippets
> are defined today before aligning with verified 2026 interview formats.

## 1. File map

| Area | Path | Role |
|------|------|------|
| Core types | `src/lib/types.ts` | `CompanyTrackId`, `CareerLevelId`, `CompanyTrack`, `CareerLevel`, `Snippet`, `TypingSettings` |
| Track definitions | `src/lib/curriculum-engine/tracks.ts` | `COMPANY_TRACKS` — motif/pattern weights, languages, coaching, sprint profiles |
| Level definitions | `src/lib/curriculum-engine/levels.ts` | `CAREER_LEVELS` — L0–L7+ procedural seniority ladder |
| Curriculum engine | `src/lib/curriculum-engine/engine.ts` | `filterForProfile`, `curriculumSnippetWeight`, `formatCareerGoal` |
| Engine exports | `src/lib/curriculum-engine/index.ts` | Re-exports tracks + levels + engine |
| Snippet catalog | `src/data/curriculum/index.ts` | `SNIPPETS`, `pickSnippet`, `filterSnippets` |
| Snippet tiers | `src/data/curriculum/core-reflex.ts` (39), `interview-fluency.ts` (34), `advanced-fluency.ts` (12) | ~85 single-stage snippets |
| Snippet builder | `src/data/curriculum/builder.ts` | `snippet()` helper with defaults |
| Content packs (roadmap) | `src/lib/content/packs.ts` | Planned `company-openai`, `company-anthropic`, etc. — **no live snippets tagged yet** |
| Evidence priors | `src/lib/evidence/priors.ts` | Motif/pattern → company weight tables |
| Evidence overrides | `src/lib/evidence/overrides.ts` | Curated per-snippet company weights |
| Evidence scoring | `src/lib/evidence/scoring.ts` | `getSnippetEvidence`, runtime weight computation |
| Language stacks | `src/lib/stacks/languages.ts` | `implementedLanguages()`, `TRACK_LANGUAGE_WEIGHTS` |
| Settings persistence | `src/stores/settings-store.ts` | `companyTrack`, `careerLevel`, `language` (defaults: general, mid, python) |
| Track selector UI | `src/components/curriculum/CareerTrackSelector.tsx` | Fluency track + level `<select>` in filters panel |
| Filters panel | `src/components/typing/SettingsBar.tsx` | Language, curriculum, track/level, pattern, difficulty |
| Curriculum page | `src/components/curriculum/CareerTracksPanel.tsx` | Card UI for track + level selection |
| Snippet picker | `src/components/typing/TypingTest.tsx` | `loadSnippet` → `pickSnippet` with track/level/language |
| Problem header | `src/components/typing/ProblemHeader.tsx` | Shows track goal + evidence indicators |

## 2. Data model

### Company tracks (`CompanyTrack`)

Defined in `src/lib/curriculum-engine/tracks.ts`. Active tracks:

| ID | Status | `languages` (hard filter when pool ≥ 3) | `packId` |
|----|--------|----------------------------------------|----------|
| `general` | active | python, javascript, java, cpp | — |
| `meta` | active | python only | `company-meta` |
| `google` | active | python only | `company-google` |
| `openai` | active | python only | `company-openai` |
| `anthropic` | active | python only | `company-anthropic` |
| `deepmind` | active | python only | `company-deepmind` |
| `jane-street` | planned | python | `company-jane-street` |

Each track carries: `name`, `tagline`, `cognitiveProfile`, `marketingLabel`, `evidenceDisclaimer`, `motifWeights`, `patternWeights`, `difficultyBias`, `modeWeights`, `sprintProfile`, `coaching`. **No dedicated interview-format description or default-language field yet.**

### Career levels (`CareerLevel`)

Defined in `src/lib/curriculum-engine/levels.ts`. Universal **L-level** labels:

| ID | shortLabel | difficultyFilter | fluencyLevelRange |
|----|------------|------------------|-------------------|
| foundation | L0 | easy | [1,2] |
| junior | L3 | easy, medium | [2,3] |
| mid | L4 | easy, medium, hard | [2,4] |
| senior | L5 | medium, hard | [3,5] |
| staff | L6 | medium, hard | [4,5] |
| research | L7+ | medium, hard | [4,5] |

**Meta E-levels are not modeled** — all tracks share the same L-label selector.

### Snippets (`Snippet`)

```typescript
interface Snippet {
  id, title, pattern, difficulty, language, code, tier,
  fluencyLevel, motifs[], description?, packIds?, evidence?, ...
}
```

**No multi-stage schema today** — each snippet is a single `code` string.

### Settings (`TypingSettings`)

Persisted in `localStorage` key `typealgo-settings` (v4). Relevant fields:

- `companyTrack: CompanyTrackId` (default `general`)
- `careerLevel: CareerLevelId` (default `mid`)
- `language: Language` (default `python`)

## 3. How snippets map to tracks today

Tracks do **not** own dedicated snippet lists. Selection pipeline in `pickSnippet()` (`src/data/curriculum/index.ts`):

1. **`filterSnippets`** — pattern, difficulty, language, tier (ignores track)
2. **`filterForProfile`** — `track.languages` + `level.difficultyFilter` (soft fallback if pool < 3)
3. **`curriculumSnippetWeight`** — motif/pattern priors + `getSnippetEvidence().companyWeights[trackId]`
4. Weighted random (adaptive) or uniform random

No snippet in `src/data/` sets `packIds`. Company packs in `src/lib/content/packs.ts` are `status: "planned"`.

## 4. Anthropic / OpenAI association today

### Explicit tags

**None.** No snippet has `packIds: ["company-anthropic"]` or inline track tags.

### Evidence engine (probabilistic)

**Motif priors** (`src/lib/evidence/priors.ts`):

- `counter-defaultdict`: openai **0.72**, anthropic **0.70** (highest cross-track signal for both)
- `hash-lookup`: openai 0.55, anthropic 0.52
- `graph-adjacency`: openai 0.38, anthropic 0.42 (low — graph-heavy ≠ infra tracks)
- `dp-memoization`: openai 0.48, anthropic 0.50

**Curated overrides** (`src/lib/evidence/overrides.ts`) with explicit openai/anthropic weights:

| Snippet ID | openai | anthropic | Notes |
|------------|--------|-----------|-------|
| `kth-largest` | 0.62 | 0.55 | Only override with meaningful anthropic weight |
| `binary-search-basic` | 0.32 | — | Low OpenAI |
| `search-insert` | 0.28 | — | Low OpenAI |
| `number-of-islands` | 0.30 | — | Graph-heavy |
| `bfs-graph-template` | 0.28 | — | Graph-heavy |
| `coin-change` | 0.35 | — | Research DP |

**Snippets with `counter-defaultdict` motif** (highest infra-track prior):

- `defaultdict-grouping` — `src/data/curriculum/core-reflex.ts`
- `group-anagrams` — `src/data/curriculum/interview-fluency.ts`

**Track motif weights** (`tracks.ts`):

- **OpenAI** emphasizes: counter-defaultdict, hash-lookup, graph-adjacency, deque-window
- **Anthropic** emphasizes: counter-defaultdict, hash-lookup, bfs-queue, dp-memoization

Both tracks hard-filter to **Python only** via `languages: ["python"]`.

### Ranked snippets (computed)

Use `topSnippetsForTrack()` in `src/lib/evidence/index.ts` to sort all ~85 snippets by `companyWeights[trackId] ?? universalScore`. High-universal snippets (e.g. `two-sum`) surface on all tracks; infra-motif snippets rank higher for openai/anthropic when adaptive weighting runs.

## 5. UI touchpoints

| Control | Location | Binds to |
|---------|----------|----------|
| Fluency track | `CareerTrackSelector` → `SettingsBar` | `companyTrack` |
| Level | `CareerTrackSelector` | `careerLevel` (always L-labels) |
| Language | `SettingsBar` | `language` |
| Track cards | `CareerTracksPanel` on `/curriculum` | track + level |

Track `tagline` / `cognitiveProfile` shown on curriculum page; **not** shown in typing filters panel.

## 6. Gaps vs 2026 interview research (input for later phases)

- No staged multi-gate problems (Anthropic KV → sorted output → TTL; OpenAI 4-gate format)
- Track descriptions reflect generic prep motifs, not verified 2026 formats
- Meta E-levels not supported in level selector
- Language hints not shown when user picks C++ on Python-only interview tracks
- Google four-language restriction not reflected in UI (only python in track.languages)
- DeepMind AI-prohibition angle not in copy
- Dedicated anthropic/openai content packs planned but empty

## Content authority

**WHAT to author:** [`TRACKS_CONTENT_SPEC.md`](./TRACKS_CONTENT_SPEC.md) — company track × level archetypes, seed quantities, quality gate. When the build phases and this spec conflict, **this spec wins on content decisions**.

**Backlog queue (shipped vs absent, priority order):** [`PREP_BACKLOG.md`](./PREP_BACKLOG.md)  
**Authoring run prompt:** [`docs/prep/AUTHORING_RUN.md`](./docs/prep/AUTHORING_RUN.md)  
**Prep source docs:** [`docs/prep/`](./docs/prep/)

---

## Seed inventory (vs minimum viable)

> **Scannable absent list + prep-doc crosswalk:** [`PREP_BACKLOG.md`](./PREP_BACKLOG.md)

| Track | Spec minimum | Shipped | Gap |
|-------|-------------|---------|-----|
| Anthropic | 6 staged (+ canonical) | **9 staged** | 0 |
| OpenAI | 6 staged (+ canonical) | **9 staged** | 0 |
| Google | 9 classic + comprehension | **9 classic + 6 comprehension** | 0 |
| DeepMind | 9 (6+3 ML) | **9** | 0 |
| Meta | 9 classic | **9 classic** | 0 |

Schema fields `levelRange`, `format`, `sourceStyle`, `buggyCode`, `plantedBugKind` on `Snippet`. Comprehension format uses read-only buggy context + corrected typing target (run #2, commit `34483d6`).

### Shipped seed log — run #2 (canonical builds + comprehension, June 2026)

| Name | Track | Level | Format | Stages | Rationale |
|------|-------|-------|--------|--------|-----------|
| Concurrent Web Crawler | anthropic | L5 | staged | 3 | fetch/parse → politeness lock → visited dedup |
| Producer-Consumer Buffer | anthropic | L5 | staged | 2 | Lock/Condition buffer → asyncio.Queue |
| Job DAG Scheduler | anthropic | L4 | staged | 3 | run single → topo run_all → cycle detect |
| Webhook Delivery Queue | openai | L5 | staged | 3 | schedule → backoff → idempotency keys |
| Memory-Bounded Stream Deduplicator | openai | L4 | staged | 2 | seen-set → bounded eviction |
| LRU Cache (Staged Build) | openai | L4 | staged | 2 | capacity LRU → thread-safe; pairs with `google-lru-cache` classic |
| Fix: Merge Two Sorted Arrays | google | L3 | comprehension | 1 | off-by-one trailing slice (`i+1` bug) |
| Fix: Grid Shortest Path | google | L3 | comprehension | 1 | missing visited check before enqueue |
| Fix: Topological Sort | google | L4 | comprehension | 1 | wrong in-degree decrement target |
| Fix: Merge Overlapping Intervals | google | L4 | comprehension | 1 | off-by-one overlap (`<` vs `<=`) |
| Fix: Edit Distance | google | L5 | comprehension | 1 | wrong base case `dp[i][0] = i - 1` |
| Fix: LRU Cache Class | google | L5 | comprehension | 1 | inverted eviction `popitem(last=True)` |

**Run #2 totals:** 18/18 staged · 6/6 comprehension · multi-language Google mirrors still deferred

### Shipped seed log — run #1 (minimum viable, June 2026)

| Name | Track | Level | Format | Stages | Rationale |
|------|-------|-------|--------|--------|-----------|
| In-Memory KV Store | anthropic | L4 (mid) | staged | 3 | Canonical Anthropic KV → sorted keys → TTL escalation |
| Token Bucket Rate Limiter | anthropic | L4 | staged | 2 | Fixed-window allow → retry-after |
| File-Backed Config Store | anthropic | L4 | staged | 2 | Load key=value → required-key validation |
| Append-Only Event Log | anthropic | L4 | staged | 3 | Append → replay from offset → compact/truncate |
| Windowed Counter Service | anthropic | L3 (junior) | staged | 2 | increment/get → reset_all for new window |
| Thread-Safe Bounded Queue | anthropic | L5 (senior) | staged | 3 | busy-wait → Lock → Condition + timeout |
| Time-Based Key-Value Store | openai | L4 | staged | 3 | Timestamped set/get → delete → absent-key edge case |
| Resumable Iterator | openai | L4 | staged | 2 | Iterate → checkpoint/resume |
| Sliding-Window Rate Limiter | openai | L4 | staged | 2 | Sliding allow → remaining slots |
| Retry Queue with Dead Letter | openai | L4 | staged | 3 | Enqueue → exponential backoff → DLQ |
| IP Address Iterator | openai | L4 | staged | 2 | parse_cidr → lazy IpIterator |
| Versioned Key-Value Store | openai | L5 (senior) | staged | 3 | Versioned set → get at version → rollback |
| Merge Two Sorted Arrays | google | L3 | classic | 1 | Two-pointer merge into sorted output |
| Grid Shortest Path (BFS) | google | L3 | classic | 1 | 4-direction BFS on binary grid |
| Binary Search on Answer — Ship Capacity | google | L3 | classic | 1 | Feasibility check + binary search on capacity |
| Topological Sort (Kahn) | google | L4 | classic | 1 | In-degree queue for DAG ordering |
| Merge Overlapping Intervals | google | L4 | classic | 1 | Sort by start → merge in one pass |
| Task Scheduler Cooldown | google | L4 | classic | 1 | Counter formula for min intervals with cooldown |
| Edit Distance (Levenshtein) | google | L5 | classic | 1 | 2D DP tabulation |
| Trie Insert and Search | google | L5 | classic | 1 | Prefix tree with end-of-word marker |
| LRU Cache Class | google | L5 | classic | 1 | OrderedDict get/move + eviction |
| Count Connected Components (DFS) | deepmind | L3 | classic | 1 | DFS flood-fill on adjacency list |
| Kth Largest via Min-Heap | deepmind | L3 | classic | 1 | Size-k min-heap for top-k |
| First Bad Version | deepmind | L3 | classic | 1 | Binary search on first failing index |
| Running Median (Two Heaps) | deepmind | L4 | classic | 1 | Dual-heap median maintenance |
| Stream Anomaly Detector | deepmind | L4 | classic | 1 | Bounded-window z-score flag |
| Minimum Path Sum in Grid | deepmind | L4 | classic | 1 | Matrix DP tabulation |
| Numerically Stable Softmax | deepmind | L5 | classic | 1 | Max-subtraction before exp normalization |
| Single K-Means Iteration | deepmind | L5 | classic | 1 | Assign to nearest centroid → recompute means |
| Dot-Product Attention Scores | deepmind | L5 | classic | 1 | Scaled dot products with plain loops |
| Balanced Bracket Checker | meta | E3 | classic | 1 | Stack scan for nested bracket pairs |
| Indices That Sum to Target | meta | E3 | classic | 1 | One-pass complement hash lookup |
| Rolling Average Stream | meta | E3 | classic | 1 | Fixed-window mean after each append |
| K Nearest Points by Distance | meta | E4 | classic | 1 | Max-heap trim to k smallest distances |
| Count Subarrays Summing to K | meta | E4 | classic | 1 | Prefix-sum frequency map |
| Lowest Common Ancestor | meta | E4 | classic | 1 | Recursive LCA with early return |
| Merge K Sorted Lists | meta | E5 | classic | 1 | Min-heap sweep across list heads |
| Maximum Path Sum in Binary Tree | meta | E5 | classic | 1 | Post-order gain with global best |
| Insert Operators to Reach Target | meta | E5 | classic | 1 | DFS over digit splits with +/− |

**Totals (run #1):** 12/12 staged · 27/27 classic dedicated · **39/39 minimum viable**

**Combined inventory:** 18 staged · 27 classic · 6 comprehension · **51 dedicated seeds**

**Review notes:** Stage headers may be tightened to spec voice in a follow-up polish pass. `openai-lru-cache-staged` and `google-lru-cache` are intentional pairs (staged build vs classic one-shot).

---

## CHANGES

### Run #4 — Anthropic + OpenAI L3 depth (local, not pushed)

**Phase 1 — Anthropic L3 (+2 staged, 2 gates each):**
- `anthropic-kv-basics` — set/get → delete (junior band; simpler than L4 `anthropic-kv-store`)
- `anthropic-simple-lru` — OrderedDict recency → capacity eviction
- **Dedup:** counter archetype skipped — `anthropic-counter-service` already at L3/junior

**Phase 2 — OpenAI L3 (+2 staged, 2 gates each):**
- `openai-iterator-protocol` — `__iter__`/`__next__` over range → list with StopIteration
- `openai-fixed-window-limiter` — allow/deny → manual `reset()` (precursor to sliding limiter)

**Inventory:** staged 18 → **22** · logical dedicated 51 → **55** · total rows **91** (incl. 36 Google mirrors)

---

### Run #3 — Google multi-language mirrors (Phase 0 report)

**Verdict: contained extension — proceeding without engine changes.**

Each language is a separate `Snippet` row with `language` set to `java` | `cpp`.
Mirrors link to the Python canonical id via `variantOf`. The existing language
selector in `filterSnippets` / `pickSnippet` already routes by `language`; no
multi-code payload on one snippet, no typing-engine fork.

Convention: mirror ids use suffix `-java` / `-cpp` via `languageMirrorId()` in
`src/data/curriculum/builder.ts`.

**Phases 1–3 shipped (pushed):**
- +9 Java classic + 6 Java comprehension (`company-google-java.ts`, `company-google-comprehension-java.ts`)
- +9 C++ classic + 6 C++ comprehension (`company-google-cpp.ts`, `company-google-comprehension-cpp.ts`)
- Comprehension mirrors link to Python comprehension ids; classic mirrors link to Python classic ids
- **Inventory:** 51 logical seeds → **87** snippet rows (+36 mirrors; JS intentionally skipped)

---

### Run #2 — Comprehension format + canonical builds (June 2026, local)

**Phase 0 — Comprehension format (contained; no typing-engine fork):**
- Added `buggyCode`, `plantedBugKind` to `Snippet`; `comprehensionSnippet()` helper.
- `ComprehensionBugContext` read-only panel above typing area; corrected `code` remains typing target.
- No changes to `typeChar`, stage advancement, or metrics pipeline.

**Phases 1–3 — Content:**
- +3 Anthropic staged (crawler, producer-consumer, DAG scheduler).
- +3 OpenAI staged (webhook queue, stream dedup, staged LRU).
- +6 Google comprehension variants in `company-google-comprehension.ts`.

**Deferred:** ~~Google multi-language mirrors (Java/C++/JS).~~ **Shipped run #3** (Java + C++ only).

---

_(Completed June 2026 — company track alignment, run #1.)_

### Phase 2 — Track metadata
- Added `interviewDescription`, `defaultLanguage`, `levelScheme` to `CompanyTrack` (`src/lib/types.ts`, `src/lib/curriculum-engine/tracks.ts`).
- Meta track uses **E3–E6+** labels via `metaShortLabel` on career levels; others use L-levels (`levelShortLabel()` in `engine.ts`).
- Google track `languages` expanded to Python/Java/C++/JS for profile filtering.
- UI: track description in filters panel + curriculum page (`CareerTrackSelector`, `CareerTracksPanel`).

### Phase 3 — Language hints
- Dismissible hints for Anthropic/OpenAI (non-Python) and Google (outside four allowed langs).
- `TrackLanguageHint` in filters panel; dismissals persist per track+language key.

### Phase 4 — Staged schema
- `SnippetStage` type + `stagedSnippet()` helper (`src/lib/snippet-stages.ts`).
- Backwards compatible: single-stage snippets unchanged; `code` mirrors stage 1.

### Phase 5 — Staged content
- Six new Python problems in `src/data/curriculum/staged-problems.ts` (3 Anthropic, 3 OpenAI).
- `pickSnippet()` prefers staged problems on `anthropic` / `openai` tracks; classic pool fallback.
- `TypingTest` advances stages on completion; `ProblemHeader` shows requirement header.

### Phase 6 — Meta/Google notes
- Meta/OpenAI/Anthropic/Google pack descriptions updated in `src/lib/content/packs.ts`.
- **Skipped:** Google code-comprehension “planted bug” Review variant — would require new review content model beyond a small change.

### Judgment calls
- Meta **foundation/junior** both map to **E3** (Meta public leveling rarely distinguishes below E4).
- Staged problems use **medium** difficulty and `interview-fluency` tier regardless of career level filter (profile filter still applies language).
- Per-stage typing metrics recorded only on **final stage** completion (single `TypingResult` per problem).
- Build verification: `tsc --noEmit` passes locally; `next build` requires Node ≥20 (environment had 18.x).

### Files touched (summary)
| Area | Key paths |
|------|-----------|
| Types | `src/lib/types.ts` |
| Tracks/levels | `src/lib/curriculum-engine/tracks.ts`, `levels.ts`, `engine.ts`, `language-hints.ts` |
| Staged schema | `src/lib/snippet-stages.ts`, `src/data/curriculum/builder.ts` |
| Content | `src/data/curriculum/staged-problems.ts`, `index.ts` |
| UI | `CareerTrackSelector.tsx`, `CareerTracksPanel.tsx`, `TrackLanguageHint.tsx`, `SettingsBar.tsx`, `TypingTest.tsx`, `ProblemHeader.tsx` |
| Styles | `src/app/globals.css` (track hint, stage header — no dvh/safe-area regressions) |
| Packs | `src/lib/content/packs.ts` |
