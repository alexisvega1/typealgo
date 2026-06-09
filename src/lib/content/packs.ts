import type { ContentPack, ContentPackStatus, SyntaxMotif } from "@/lib/types";

/** Roadmap packs — active curriculum + planned expansions. */
export const CONTENT_PACKS: ContentPack[] = [
  {
    id: "core-reflex",
    name: "Core Reflex",
    description: "Syntax fluency for foundational patterns — hash maps, windows, pointers.",
    status: "active",
    domains: ["algorithms"],
    languages: ["python", "javascript", "java", "cpp"],
    motifFocus: ["hash-lookup", "sliding-window-expand", "two-pointer-converge", "binary-search-mid"],
    targetSnippetCount: 30,
    inspiration: ["typealgo-original", "hackerrank-progression"],
  },
  {
    id: "interview-blind-track",
    name: "Interview Reflex Track",
    description: "Blind-75-style progression without cloning external problem lists.",
    status: "active",
    domains: ["algorithms", "interviews"],
    languages: ["python"],
    motifFocus: ["bfs-queue", "dfs-recursion", "dp-tabulation", "heap-push-pop"],
    targetSnippetCount: 100,
    inspiration: ["neetcode-inspired", "leetcode-pattern"],
  },
  {
    id: "advanced-competitive",
    name: "Sprint Elite (Competitive)",
    description: "Codeforces-style implementation pressure and speed cognition.",
    status: "planned",
    domains: ["competitive-programming"],
    languages: ["python", "cpp"],
    motifFocus: ["greedy-local", "topological-sort", "deque-window"],
    targetSnippetCount: 40,
    inspiration: ["codeforces-elite"],
  },
  {
    id: "ml-engineering",
    name: "ML Engineering Fluency",
    description: "NumPy, pandas, PyTorch API chunks — tensor manipulation reflexes.",
    status: "planned",
    domains: ["ml", "data-science"],
    languages: ["python"],
    motifFocus: [] as SyntaxMotif[],
    targetSnippetCount: 60,
    inspiration: ["typealgo-original"],
  },
  {
    id: "cross-language-reflex",
    name: "Cross-Language Reflex",
    description: "Same motif across Python, Rust, C++, Java — Rosetta-inspired.",
    status: "planned",
    domains: ["algorithms", "languages"],
    languages: ["python", "javascript", "java", "cpp"],
    motifFocus: ["bfs-queue", "dfs-recursion", "binary-search-mid"],
    targetSnippetCount: 48,
    inspiration: ["rosetta-code"],
  },
  {
    id: "seasonal-aoc",
    name: "Advent Sprint Season",
    description: "Holiday puzzle events with leaderboard seasons.",
    status: "seasonal",
    domains: ["puzzles"],
    languages: ["python"],
    motifFocus: [] as SyntaxMotif[],
    targetSnippetCount: 25,
    inspiration: ["advent-of-code"],
  },
  {
    id: "math-euler",
    name: "Mathematical Implementation",
    description: "Project Euler-inspired elegant algorithm training.",
    status: "planned",
    domains: ["math", "algorithms"],
    languages: ["python"],
    motifFocus: [] as SyntaxMotif[],
    targetSnippetCount: 30,
    inspiration: ["project-euler"],
  },
  // Company-specific interview reflex systems
  {
    id: "company-meta",
    name: "Meta Interview Reflex",
    description: "Classic (no-AI) LeetCode round — one of Meta's two coding rounds.",
    status: "planned",
    domains: ["interviews"],
    languages: ["python"],
    motifFocus: ["bfs-queue", "graph-adjacency", "sliding-window-expand"],
    targetSnippetCount: 25,
    inspiration: ["leetcode-pattern", "neetcode-inspired"],
  },
  {
    id: "company-google",
    name: "Google Interview Reflex",
    description: "Classic DSA plus code-comprehension fluency (read, analyze, fix buggy code).",
    status: "planned",
    domains: ["interviews"],
    languages: ["python"],
    motifFocus: ["binary-search-mid", "tree-recursion", "dp-tabulation"],
    targetSnippetCount: 25,
    inspiration: ["leetcode-pattern"],
  },
  {
    id: "company-openai",
    name: "OpenAI / Systems+ML Reflex",
    description: "Progressive four-gate system builds in Python (timed KV, iterators, rate limiters).",
    status: "active",
    domains: ["interviews", "ml", "systems"],
    languages: ["python"],
    motifFocus: [] as SyntaxMotif[],
    targetSnippetCount: 30,
    inspiration: ["typealgo-original"],
  },
  {
    id: "company-anthropic",
    name: "Anthropic Implementation Fluency",
    description: "Multi-stage Python system builds (KV store, rate limiters, config validation).",
    status: "active",
    domains: ["interviews", "ml", "systems"],
    languages: ["python"],
    motifFocus: [] as SyntaxMotif[],
    targetSnippetCount: 28,
    inspiration: ["typealgo-original", "leetcode-pattern"],
  },
  {
    id: "company-deepmind",
    name: "DeepMind Implementation Fluency",
    description: "Algorithms + ML + scientific computing motifs.",
    status: "planned",
    domains: ["interviews", "ml", "algorithms"],
    languages: ["python"],
    motifFocus: ["dp-tabulation", "binary-search-answer", "graph-adjacency"],
    targetSnippetCount: 30,
    inspiration: ["typealgo-original", "project-euler"],
  },
  {
    id: "company-jane-street",
    name: "Quant Interview Reflex",
    description: "Probability, math, and tight implementation under pressure.",
    status: "planned",
    domains: ["interviews", "math"],
    languages: ["python"],
    motifFocus: [] as SyntaxMotif[],
    targetSnippetCount: 20,
    inspiration: ["project-euler"],
  },
  {
    id: "community-motif-packs",
    name: "Community Motif Packs",
    description: "User-authored Graph Pack, DP Pack, Rust Fluency Pack, etc.",
    status: "community",
    domains: ["community"],
    languages: ["python", "javascript", "java", "cpp"],
    motifFocus: [] as SyntaxMotif[],
    inspiration: ["community-pack"],
  },
];

export function getContentPack(id: string): ContentPack | undefined {
  return CONTENT_PACKS.find((p) => p.id === id);
}

export function packsByStatus(status: ContentPackStatus): ContentPack[] {
  return CONTENT_PACKS.filter((p) => p.status === status);
}

export function activePacks(): ContentPack[] {
  return packsByStatus("active");
}

export function plannedPacks(): ContentPack[] {
  return CONTENT_PACKS.filter((p) => p.status === "planned" || p.status === "seasonal" || p.status === "community");
}
