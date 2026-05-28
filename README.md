# AlgoType

**Implementation cognition training** — not problem exposure, procedural fluency.

> Most interview prep focuses on problem exposure.
>
> AlgoType focuses on procedural fluency: turning common implementation patterns into reflexes through retrieval, repetition, and pressure-tested execution.

AlgoType is a performance-first typing trainer for algorithmic implementation. It trains **syntax motifs** — reusable chunks like BFS queue loops, binary search boundaries, and DP tabulation — across four cognitive modes designed to mirror how engineers actually learn.

![AlgoType typing session](./docs/screenshots/typing-session.png)
<!-- Screenshot placeholder: capture Type mode with syntax highlighting -->

---

## Why AlgoType exists

| Platform | What it optimizes |
|----------|-------------------|
| LeetCode / HackerRank | Problem exposure & catalog breadth |
| Monkeytype | Raw typing speed on random text |
| NeetCode | Video + solution walkthroughs |
| **AlgoType** | **Implementation reflexes, retrieval strength, pressure execution** |

AlgoType is **not** a LeetCode clone. All curriculum content is independently authored. The ingestion pipeline enforces canonical standards, motif extraction, and prerequisite validation — inspired by public patterns, never mirrored verbatim.

---

## Cognitive training modes

| Mode | Cognitive phase | What you train |
|------|-----------------|----------------|
| **Type** | Flow | Visible code — rhythm, syntax, muscle memory |
| **Recall** | Retrieval | Token / line / skeleton blanks — active memory |
| **Review** | Consolidation | Motif study, hesitation analysis, line stepping |
| **Sprint** | Pressure | Interview simulation — type from memory under timer |

Each mode targets a different phase of procedural learning. Switch modes from the header toggle.

---

## Curriculum architecture

```
Tracks (company cognitive profiles)
  × Levels (Foundation → Research)
  × Modes (Type / Recall / Review / Sprint)
  × Motifs (reusable implementation chunks)
```

### Tiers

| Tier | Snippets | Focus |
|------|----------|-------|
| Core Reflex | 39 | Hash maps, windows, pointers — syntax fluency |
| Interview Fluency | 34 | Blind-75-style progression (independently authored) |
| Advanced Fluency | 12 | Hard DP, graphs, heaps |

### Motif system

Every snippet is tagged with **syntax motifs** — e.g. `bfs-queue`, `binary-search-boundary`, `dp-tabulation`. Motifs power:

- Adaptive resurfacing (weak motifs resurface sooner)
- Predictive coaching (session-end recommendations)
- Review mode decomposition (line-range motif focus)
- Company track weighting (Meta → graphs; Google → correctness)

### Content ingestion pipeline

```
Draft → validate standards → extract motifs → normalize code
      → check prerequisite graph → register snippet
```

Key safeguards in `src/lib/content/`:

- **Derive vs avoid rules** per inspiration source (NeetCode, LeetCode patterns, Codeforces, etc.)
- **Independent authorship enforcement** — no verbatim cloning
- **Prerequisite graph validation** — cycle detection, learning paths
- **Motif extraction** — heuristic decomposition (AST/ML hook point)

### Company implementation fluency tracks

Train toward a cognitive profile, not a problem dump:

- **Meta** — speed + graphs + sprint tempo
- **Google** — breadth + correctness + edge cases
- **OpenAI / Anthropic** — Python backend + ML infra
- **DeepMind** — algorithms + scientific computing
- **Jane Street** — probability + precision (planned)

Levels follow a Levels.fyi-inspired ladder: Foundation → Junior → Mid → Senior → Staff → Research.

---

## Adaptive resurfacing

When **Adaptive** is enabled, snippet selection weights:

1. Weak accuracy / low WPM on prior sessions
2. Keystroke hesitation hotspots (>350ms delays)
3. Spacing — snippets not seen recently get boosted
4. Track + level profile — company motifs and difficulty bias

This optimizes for **fluency density**, not catalog size.

---

## Performance-first philosophy

- **DOM-direct typing updates** — no per-keystroke React re-renders
- **Local-first** — full functionality offline; network never blocks typing
- **Optional cloud sync** — GitHub OAuth + Supabase background merge
- **Lightweight tokenizer** — no Monaco/CodeMirror overhead

---

## Quick start

```bash
nvm use          # Node 22 (.nvmrc)
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Optional: cloud sync

Copy `.env.example` to `.env.local` and add Supabase credentials. The app works fully without them.

```bash
cp .env.example .env.local
```

---

## Controls

| Key | Type / Recall | Review | Sprint |
|-----|---------------|--------|--------|
| `Tab` | Indent | — | — |
| `Shift+Tab` | Next snippet | Next snippet | Next snippet |
| `↑` / `↓` | — | Step lines | — |
| `[` / `]` | — | Cycle motifs | — |
| `?` | Reveal blank | — | Disabled |
| `Esc` | Restart | Restart | Restart |

---

## Project structure

```
src/
├── app/                    # Next.js App Router pages
├── components/
│   ├── typing/             # TypingTest, modes, results
│   ├── curriculum/         # Curriculum + track panels
│   ├── coach/              # Predictive coaching UI
│   └── analytics/          # Stats, heatmap, radar
├── data/curriculum/        # Canonical snippet registry (~85)
├── lib/
│   ├── content/            # Ingestion pipeline, packs, standards
│   ├── curriculum-engine/  # Company tracks, levels, weighting
│   ├── coach/              # Training plans, recommendations
│   └── modes/              # Review analytics, sprint metrics
└── stores/                 # Zustand + safe localStorage persistence
```

---

## Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/alexisvega1/algotype)

```bash
npm run build
npm run start
```

Works on Vercel out of the box. Set `NEXT_PUBLIC_*` env vars for optional Supabase sync.

---

## Roadmap

- [ ] Expand Interview Fluency tier toward 100 snippets
- [ ] ML engineering fluency packs (NumPy, pandas, PyTorch)
- [ ] Sprint replay analysis ("At 01:22 you hesitated on…")
- [ ] Community-authored motif packs
- [ ] AI motif decomposition (replace heuristic extractor)
- [ ] Seasonal Advent of Code sprint events

---

## Stack

- Next.js 16 (App Router) · TypeScript · Tailwind CSS v4
- Zustand (persisted state) · Framer Motion · Recharts
- Supabase (optional auth + sync)

---

## License

MIT — see [LICENSE](./LICENSE).

All curriculum implementations are independently authored. AlgoType derives structural inspiration from public algorithm education resources without copying copyrighted solution text.
