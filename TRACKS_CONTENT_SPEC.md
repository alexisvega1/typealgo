# TypeAlgo Content Spec: Company Track × Level

This spec governs all problem/snippet authoring for company-oriented
fluency tracks. The build prompt defines HOW (schema, phases); this
defines WHAT. When the two conflict, this spec wins on content
decisions.

## Global rules

- Every snippet is a typing-fluency target: code must be idiomatic,
  clean, and correct — something a senior engineer at that company
  would actually write. No placeholder logic, no `pass`, no TODOs.
- Length budget per snippet: 8–25 lines (single-stage), 10–20 lines
  per stage (staged). Longer than that fatigues typing practice.
- Each problem carries metadata: track[], level_range, language[],
  pattern_tag (existing taxonomy), format ("classic" | "staged" |
  "comprehension"), source_style (one line: what real interview
  format this mirrors).
- Stage headers are one sentence, requirement-voiced: "Now expire
  keys after a TTL." Never paragraphs.
- No copyrighted problem text. Describe requirements in our own
  words; never reproduce LeetCode/HackerRank problem statements.
  Classic algorithms (BST validation, two-pointer merge) are fine —
  they're common knowledge — but write original phrasing.

## ANTHROPIC track — "build a small system, evolve it"

Language: Python only (their interviews use a shared Python env).
Format: staged (2–4 stages). Style: production-quality, explicit
edge-case handling, light use of stdlib (collections, heapq,
dataclasses). Concurrency primitives appear at L5+.

- L3 (Junior): single-class state machines. Archetypes: in-memory
  KV store (set/get/delete → sorted listing), counter service with
  reset, simple LRU using OrderedDict. 2 stages.
- L4 (Mid): the canonical band. Archetypes: KV store → strict output
  formatting → TTL/timestamps; rate limiter (fixed window → sliding
  window); event log with replay; config store with validation.
  3 stages. Edge cases must be explicit in the code (empty input,
  duplicate keys, expired-at-boundary).
- L5 (Senior): add concurrency or resource pressure. Archetypes:
  thread-safe cache (locks), async task queue with retries
  (asyncio), bounded buffer producer/consumer, KV store with
  snapshot/restore. 3–4 stages.

## OPENAI track — "recreate a real component, gate by gate"

Language: Python primary; optionally mirror 1–2 problems in Go at
L5 for infra flavor. Format: staged, explicitly gate-styled (each
stage = one gate; 4 gates max).

- L3: time-based KV store (2 gates: set/get with timestamp → get at
  timestamp); basic iterator protocol (__iter__/__next__).
- L4: time-based KV store full (3 gates, add range queries);
  resumable iterator (2 gates: iterate → checkpoint/resume);
  sliding-window rate limiter (3 gates); IP-address iterator
  (2 gates: CIDR expansion → lazy generation).
- L5: versioned KV store (get at version, rollback); memory-bounded
  deduplicator over a stream; webhook delivery queue with
  exponential backoff. 3–4 gates. Caching/invalidation layered on a
  working baseline is the signature move — at least one L5 problem
  must do exactly that.

## GOOGLE track — "classic DSA, tight and correct"

Languages: Python, Java, C++, JavaScript ONLY (their interview
restriction). Format: classic single-stage, plus comprehension
variants if Phase 6 ships them.

- L3: medium DSA. Archetypes: two-pointer (merge sorted arrays,
  container variants), BFS/DFS on grids, hashmap frequency
  problems, binary search on answer.
- L4: medium-hard. Archetypes: graph algorithms (topological sort,
  union-find), heap-based scheduling, intervals (merge/insert),
  sliding window with constraints, trees (LCA, serialize).
- L5: hard + design-flavored. Archetypes: DP (edit distance,
  partitioning), tries, segment-tree-lite problems, design
  questions as classes (LRU, median finder).
- Comprehension variants (if shipped): same archetypes but served
  as "snippet with one planted bug" — bug types: off-by-one,
  wrong comparison operator, missing visited-check, mutation
  during iteration. The fixed version is the typing target.

## META track — "tagged-list fluency, speed is the point"

Languages: any supported. Format: classic single-stage. Levels are
E-LEVELS in all UI and metadata for this track: E3/E4/E5 (map
internally to L3/L4/L5 if the data model needs it).

- E3: top-frequency easy-mediums. Archetypes: valid parentheses
  family, merge intervals, binary tree traversals, two-sum
  variants, moving average.
- E4: the Meta-tagged-medium canon. Archetypes: K closest points,
  subarray sum equals K, lowest common ancestor, basic calculator
  (no parens), random pick with weight, valid palindrome II,
  buildings with ocean view, nested list weight sum.
- E5: mediums under harder constraints + select hards. Archetypes:
  merge K sorted lists, expression add operators, alien dictionary,
  binary tree max path sum.
- Track description must state this trains the CLASSIC (no-AI)
  round — one of Meta's two coding rounds; the other is AI-enabled
  and out of scope here.

## DEEPMIND track — "unaided algorithmic depth + ML primitives"

Languages: any; Python default. Format: classic single-stage at
L3–L4; L5 adds ML-primitive implementations. Track description MUST
note: DeepMind prohibits AI tools in technical rounds, so unaided
typing fluency is directly what they filter for.

- L3: LeetCode-medium core: graph traversal, heaps, binary search
  variants.
- L4: medium-hard pairs (their loop is 1 medium + 1 hard):
  median-maintenance structure, anomaly detection over a stream
  with bounded memory, matrix DP.
- L5: ML primitives implemented from scratch in clean NumPy-free
  Python (stdlib only, so it types cleanly): softmax with numerical
  stability, k-means single iteration, attention score computation
  (loops, no libraries), gradient descent step for linear
  regression, top-k sampling.

## Seed quantities (minimum viable per track)

Anthropic 6 staged · OpenAI 6 staged · Google 9 classic (3/level) ·
Meta 9 classic (3/E-level) · DeepMind 9 (6 classic + 3 ML-primitive).
General Fluency track: untouched.

## Quality gate (apply to every authored snippet before commit)

1. Code runs (paste into a REPL / node / compiler mentally or
   actually — no syntax errors).
2. Handles the edge case its own stage header implies.
3. Idiomatic for its language (PEP 8 for Python; no C-style Java).
4. A senior engineer at the target company would not wince.
5. Typing duration sanity: 30–90 seconds at 60 WPM per stage.

Log each problem in `TRACKS_AUDIT.md`: name, track, level, format,
stages, and a one-line rationale tying it to the company's real
interview style.
