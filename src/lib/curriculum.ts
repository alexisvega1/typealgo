import type { CurriculumTier, Snippet, SyntaxMotif, TypingResult, CareerLevelId, CompanyTrackId } from "@/lib/types";
import {
  SNIPPETS,
  getSnippet,
  snippetsByTier,
} from "@/data/curriculum";
import { curriculumSnippetWeight } from "@/lib/curriculum-engine";
import { getMotifInfo } from "@/data/curriculum/motifs";
import { getTierInfo } from "@/data/curriculum/tiers";

export interface TierProgress {
  tier: CurriculumTier;
  name: string;
  completed: number;
  total: number;
  percent: number;
  avgFluency: number;
}

export interface MotifWeakness {
  motif: SyntaxMotif;
  label: string;
  avgDelayMs: number;
  errorRate: number;
  sessions: number;
}

export interface DailyPlanDay {
  day: number;
  label: string;
  patterns: string[];
  snippetIds: string[];
}

/** First 7 days of the Top Interview Reflexes progression. */
export const DAILY_PLAN: DailyPlanDay[] = [
  {
    day: 1,
    label: "Hash maps & lookup reflexes",
    patterns: ["hash-map"],
    snippetIds: ["two-sum", "contains-duplicate", "valid-anagram", "ransom-note"],
  },
  {
    day: 2,
    label: "Sliding window & frequency",
    patterns: ["sliding-window"],
    snippetIds: ["longest-substring", "max-consecutive-ones", "permutation-in-string"],
  },
  {
    day: 3,
    label: "BFS / DFS traversal",
    patterns: ["dfs-bfs", "trees"],
    snippetIds: ["flood-fill", "number-of-islands", "bfs-graph-template", "level-order-bfs"],
  },
  {
    day: 4,
    label: "Binary search boundaries",
    patterns: ["binary-search"],
    snippetIds: ["binary-search-basic", "search-insert", "find-min-rotated", "sqrt-binary-search"],
  },
  {
    day: 5,
    label: "Two pointers & arrays",
    patterns: ["two-pointers", "arrays"],
    snippetIds: ["two-sum-ii", "container-water", "move-zeroes", "merge-intervals"],
  },
  {
    day: 6,
    label: "Stack & heap APIs",
    patterns: ["stack", "heap"],
    snippetIds: ["valid-parens", "daily-temperatures", "kth-largest", "top-k-frequent"],
  },
  {
    day: 7,
    label: "DP foundations",
    patterns: ["dynamic-programming"],
    snippetIds: ["climbing-stairs", "house-robber", "coin-change", "unique-paths"],
  },
];

export function computeTierProgress(results: TypingResult[]): TierProgress[] {
  const completedIds = new Set(
    results.filter((r) => r.accuracy >= 90).map((r) => r.snippetId),
  );

  return (["core-reflex", "interview-fluency", "advanced-fluency"] as CurriculumTier[]).map(
    (tier) => {
      const pool = snippetsByTier(tier);
      const tierResults = results.filter((r) => getSnippet(r.snippetId)?.tier === tier);
      const completed = pool.filter((s) => completedIds.has(s.id)).length;
      const avgFluency =
        tierResults.length > 0
          ? Math.round(
              tierResults.reduce((a, r) => a + r.wpm * (r.accuracy / 100), 0) /
                tierResults.length,
            )
          : 0;
      const info = getTierInfo(tier)!;
      return {
        tier,
        name: info.name,
        completed,
        total: pool.length,
        percent: pool.length ? Math.round((completed / pool.length) * 100) : 0,
        avgFluency,
      };
    },
  );
}

export function computeMotifWeaknesses(results: TypingResult[]): MotifWeakness[] {
  const motifStats = new Map<
    SyntaxMotif,
    { delays: number[]; errors: number; sessions: number }
  >();

  for (const r of results) {
    const snip = getSnippet(r.snippetId);
    if (!snip) continue;
    for (const motif of snip.motifs) {
      const cur = motifStats.get(motif) ?? { delays: [], errors: 0, sessions: 0 };
      cur.sessions++;
      cur.errors += r.incorrectChars;
      const slow = r.keystrokes.filter((k) => k.delayMs > 300);
      cur.delays.push(...slow.map((k) => k.delayMs));
      motifStats.set(motif, cur);
    }
  }

  return Array.from(motifStats.entries())
    .map(([motif, s]) => {
      const avgDelayMs =
        s.delays.length > 0
          ? Math.round(s.delays.reduce((a, b) => a + b, 0) / s.delays.length)
          : 0;
      const totalChars = results
        .filter((r) => getSnippet(r.snippetId)?.motifs.includes(motif))
        .reduce((a, r) => a + r.totalChars, 0);
      return {
        motif,
        label: getMotifInfo(motif)?.label ?? motif,
        avgDelayMs,
        errorRate: totalChars > 0 ? Math.round((s.errors / totalChars) * 1000) / 10 : 0,
        sessions: s.sessions,
      };
    })
    .filter((m) => m.avgDelayMs > 250 || m.errorRate > 2)
    .sort((a, b) => b.avgDelayMs - a.avgDelayMs)
    .slice(0, 8);
}

export function suggestResurface(
  results: TypingResult[],
  limit = 5,
  companyTrack: CompanyTrackId = "general",
  careerLevel: CareerLevelId = "mid",
): Snippet[] {
  const weights = SNIPPETS.map((s) => ({
    snippet: s,
    weight: curriculumSnippetWeight(s, results, companyTrack, careerLevel),
  }));
  weights.sort((a, b) => b.weight - a.weight);
  return weights.slice(0, limit).map((w) => w.snippet);
}

export function dailyPlanProgress(
  day: DailyPlanDay,
  results: TypingResult[],
): { done: number; total: number } {
  const passed = new Set(
    results.filter((r) => r.accuracy >= 90).map((r) => r.snippetId),
  );
  const done = day.snippetIds.filter((id) => passed.has(id)).length;
  return { done, total: day.snippetIds.length };
}
