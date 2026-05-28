# TypeAlgo

**Type something that matters.** — algorithmic fluency training.

> Most interview prep focuses on problem exposure.
>
> TypeAlgo focuses on procedural fluency: turning common implementation patterns into reflexes through retrieval, repetition, and pressure-tested execution.

**Implementation cognition, not problem dumps.**

TypeAlgo is a performance-first typing trainer for algorithmic implementation. It trains **syntax motifs** — reusable chunks like BFS queue loops, binary search boundaries, and DP tabulation — across four cognitive modes designed to mirror how engineers actually learn.

![TypeAlgo typing session](./docs/screenshots/typing-session.png)

---

## Why TypeAlgo exists

| Platform | What it optimizes |
|----------|-------------------|
| LeetCode / HackerRank | Problem exposure & catalog breadth |
| Monkeytype | Raw typing speed on random text |
| algotype.net | Programmer typing / syntax practice |
| **TypeAlgo** | **Implementation reflexes, retrieval strength, pressure execution** |

TypeAlgo is **not** a LeetCode clone. All curriculum content is independently authored. The ingestion pipeline enforces canonical standards, motif extraction, and evidence-weighted track associations — inspired by public patterns, never mirrored verbatim.

---

## Cognitive training modes

| Mode | Cognitive phase | What you train |
|------|-----------------|----------------|
| **Type** | Flow | Visible code — rhythm, syntax, muscle memory |
| **Recall** | Retrieval | Token / line / skeleton blanks — active memory |
| **Review** | Consolidation | Motif study, hesitation analysis, line stepping |
| **Sprint** | Pressure | Interview simulation — type from memory under timer |

---

## Curriculum architecture

```
Tracks (evidence-weighted cognitive profiles)
  × Levels (Foundation → Research)
  × Modes (Type / Recall / Review / Sprint)
  × Motifs (reusable implementation chunks)
  × Languages (Python live → TypeScript, Go, Rust roadmap)
```

### Tiers

| Tier | Snippets | Focus |
|------|----------|-------|
| Core Reflex | 39 | Hash maps, windows, pointers |
| Interview Fluency | 34 | Independently authored interview motifs |
| Advanced Fluency | 12 | Hard DP, graphs, heaps |

---

## Quick start

```bash
nvm use          # Node 22 (.nvmrc)
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Optional: cloud sync

```bash
cp .env.example .env.local
# Add Supabase credentials — app works fully offline without them
```

---

## Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/alexisvega1/typealgo)

Recommended Vercel subdomain: **`typealgo.vercel.app`**

Future domain: **`typealgo.ai`**

---

## Stack

Next.js 16 · TypeScript · Tailwind v4 · Zustand · Framer Motion · Recharts · Supabase (optional)

---

## License

MIT — see [LICENSE](./LICENSE).

All curriculum implementations are independently authored.
