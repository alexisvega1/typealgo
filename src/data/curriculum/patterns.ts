import type { PatternPack } from "@/lib/types";

/** Pattern packs grouped by reusable implementation archetype. */
export const PATTERN_PACKS: PatternPack[] = [
  { id: "hash-map", name: "Hash Map", description: "Lookup, frequency, grouping", color: "#e2b714" },
  { id: "sliding-window", name: "Sliding Window", description: "Expand/contract windows", color: "#7c5cff" },
  { id: "two-pointers", name: "Two Pointers", description: "Sorted arrays, merging", color: "#58a6ff" },
  { id: "binary-search", name: "Binary Search", description: "Mid, bounds, answer space", color: "#3fb950" },
  { id: "dfs-bfs", name: "DFS / BFS", description: "Traversal templates", color: "#f778ba" },
  { id: "trees", name: "Trees", description: "Recursion, BST, construction", color: "#79c0ff" },
  { id: "dynamic-programming", name: "Dynamic Programming", description: "Tabulation & memo", color: "#ffa657" },
  { id: "heap", name: "Heap", description: "Top-k, merge streams", color: "#d2a8ff" },
  { id: "stack", name: "Stack", description: "Matching, monotonic", color: "#ff7b72" },
  { id: "graphs", name: "Graphs", description: "Adjacency, topo, shortest", color: "#a5d6ff" },
  { id: "backtracking", name: "Backtracking", description: "Subsets, perms, search", color: "#56d364" },
  { id: "union-find", name: "Union Find", description: "Components, Kruskal-style", color: "#e3b341" },
  { id: "arrays", name: "Arrays", description: "Prefix, intervals, in-place", color: "#8b949e" },
];

export function getPatternPack(id: string): PatternPack | undefined {
  return PATTERN_PACKS.find((p) => p.id === id);
}
