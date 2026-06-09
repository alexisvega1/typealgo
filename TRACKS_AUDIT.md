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

## CHANGES

_(Completed June 2026 — company track alignment.)_

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
