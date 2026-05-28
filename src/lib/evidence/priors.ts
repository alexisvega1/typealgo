import type { CareerLevelId, CompanyTrackId, Pattern, SyntaxMotif } from "@/lib/types";

/**
 * Motif → company association priors (0–1).
 * Derived from publicly discussed prep patterns — probabilistic, not deterministic.
 */
export const MOTIF_COMPANY_PRIORS: Partial<
  Record<SyntaxMotif, Partial<Record<CompanyTrackId, number>>>
> = {
  "hash-lookup": { general: 0.95, google: 0.78, meta: 0.72, openai: 0.55, anthropic: 0.52, deepmind: 0.48, "jane-street": 0.35 },
  "bfs-queue": { meta: 0.86, google: 0.74, deepmind: 0.72, openai: 0.32, anthropic: 0.38, "jane-street": 0.28 },
  "dfs-recursion": { meta: 0.82, google: 0.8, deepmind: 0.78, openai: 0.35, anthropic: 0.4, "jane-street": 0.3 },
  "graph-adjacency": { meta: 0.84, google: 0.76, deepmind: 0.74, openai: 0.38, anthropic: 0.42, "jane-street": 0.25 },
  "binary-search-mid": { google: 0.82, meta: 0.7, deepmind: 0.68, openai: 0.4, anthropic: 0.38, "jane-street": 0.45 },
  "binary-search-boundary": { google: 0.85, meta: 0.72, deepmind: 0.7, openai: 0.35, anthropic: 0.36, "jane-street": 0.42 },
  "binary-search-answer": { google: 0.78, deepmind: 0.76, meta: 0.68, openai: 0.38, "jane-street": 0.55 },
  "dp-tabulation": { google: 0.8, deepmind: 0.82, meta: 0.7, openai: 0.42, anthropic: 0.45, "jane-street": 0.62 },
  "dp-memoization": { google: 0.78, deepmind: 0.8, openai: 0.48, anthropic: 0.5, meta: 0.65, "jane-street": 0.58 },
  "heap-push-pop": { meta: 0.72, google: 0.7, openai: 0.58, anthropic: 0.52, deepmind: 0.55, "jane-street": 0.48 },
  "sliding-window-expand": { meta: 0.78, google: 0.72, openai: 0.45, anthropic: 0.42, deepmind: 0.4, "jane-street": 0.35 },
  "two-pointer-converge": { google: 0.76, meta: 0.7, deepmind: 0.55, openai: 0.4, anthropic: 0.38, "jane-street": 0.42 },
  "counter-defaultdict": { openai: 0.72, anthropic: 0.7, google: 0.62, meta: 0.48, deepmind: 0.52, "jane-street": 0.38 },
  "tree-recursion": { google: 0.8, meta: 0.68, deepmind: 0.65, openai: 0.42, anthropic: 0.44, "jane-street": 0.32 },
  "greedy-local": { google: 0.68, meta: 0.62, "jane-street": 0.72, deepmind: 0.58, openai: 0.35 },
  "topological-sort": { google: 0.72, deepmind: 0.74, meta: 0.68, openai: 0.55, anthropic: 0.52, "jane-street": 0.4 },
  "union-find-compress": { google: 0.74, meta: 0.7, deepmind: 0.68, openai: 0.4, anthropic: 0.38, "jane-street": 0.35 },
  "monotonic-stack": { google: 0.7, meta: 0.65, deepmind: 0.55, openai: 0.38, "jane-street": 0.45 },
};

export const PATTERN_COMPANY_PRIORS: Partial<
  Record<Pattern, Partial<Record<CompanyTrackId, number>>>
> = {
  "hash-map": { general: 0.92, google: 0.75, meta: 0.7, openai: 0.55, anthropic: 0.52 },
  graphs: { meta: 0.85, google: 0.78, deepmind: 0.76, openai: 0.35 },
  "dfs-bfs": { meta: 0.84, google: 0.76, deepmind: 0.74, openai: 0.32 },
  "binary-search": { google: 0.84, meta: 0.72, deepmind: 0.7, openai: 0.38 },
  "dynamic-programming": { google: 0.8, deepmind: 0.82, meta: 0.68, "jane-street": 0.6 },
  heap: { meta: 0.7, google: 0.68, openai: 0.55, anthropic: 0.5 },
  "sliding-window": { meta: 0.76, google: 0.72, openai: 0.42 },
  trees: { google: 0.8, meta: 0.68, deepmind: 0.65 },
};

/** Pattern sophistication — separate from company emphasis. */
export const PATTERN_SOPHISTICATION: Record<
  Pattern,
  { pattern: number; systems: number; implementationPressure: number }
> = {
  arrays: { pattern: 0.22, systems: 0.1, implementationPressure: 0.25 },
  "hash-map": { pattern: 0.28, systems: 0.15, implementationPressure: 0.3 },
  "sliding-window": { pattern: 0.42, systems: 0.12, implementationPressure: 0.45 },
  "two-pointers": { pattern: 0.38, systems: 0.1, implementationPressure: 0.4 },
  "binary-search": { pattern: 0.48, systems: 0.12, implementationPressure: 0.42 },
  trees: { pattern: 0.52, systems: 0.18, implementationPressure: 0.48 },
  graphs: { pattern: 0.62, systems: 0.22, implementationPressure: 0.58 },
  "dfs-bfs": { pattern: 0.58, systems: 0.2, implementationPressure: 0.55 },
  "dynamic-programming": { pattern: 0.72, systems: 0.15, implementationPressure: 0.65 },
  heap: { pattern: 0.55, systems: 0.35, implementationPressure: 0.52 },
  stack: { pattern: 0.4, systems: 0.18, implementationPressure: 0.42 },
  backtracking: { pattern: 0.68, systems: 0.12, implementationPressure: 0.6 },
  "union-find": { pattern: 0.65, systems: 0.2, implementationPressure: 0.55 },
};

export const LEVEL_SOPHISTICATION_EXPECTATION: Record<CareerLevelId, number> = {
  foundation: 0.2,
  junior: 0.35,
  mid: 0.55,
  senior: 0.72,
  staff: 0.85,
  research: 0.88,
};
