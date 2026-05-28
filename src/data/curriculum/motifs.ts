import type { SyntaxMotif, SyntaxMotifInfo } from "@/lib/types";

export const SYNTAX_MOTIFS: SyntaxMotifInfo[] = [
  { id: "hash-lookup", label: "Hash lookup", description: "O(1) complement / seen map", pattern: "hash-map" },
  { id: "freq-counter", label: "Frequency counter", description: "count[c] = count.get(c,0)+1", pattern: "hash-map" },
  { id: "hash-set-membership", label: "Set membership", description: "if x in seen", pattern: "hash-map" },
  { id: "counter-defaultdict", label: "defaultdict", description: "collections.defaultdict", pattern: "hash-map" },
  { id: "sliding-window-expand", label: "Window expand", description: "right++ expand window", pattern: "sliding-window" },
  { id: "sliding-window-contract", label: "Window contract", description: "while invalid: left++", pattern: "sliding-window" },
  { id: "two-pointer-converge", label: "Converging pointers", description: "left++, right-- on sorted", pattern: "two-pointers" },
  { id: "two-pointer-chase", label: "Chase pointers", description: "fast/slow or merge walks", pattern: "two-pointers" },
  { id: "binary-search-mid", label: "BS midpoint", description: "mid = left + (right-left)//2", pattern: "binary-search" },
  { id: "binary-search-boundary", label: "BS boundary", description: "left < right lower_bound", pattern: "binary-search" },
  { id: "binary-search-answer", label: "BS on answer", description: "search space over result", pattern: "binary-search" },
  { id: "dfs-recursion", label: "DFS recursion", description: "def dfs(node): base + recurse", pattern: "dfs-bfs" },
  { id: "bfs-queue", label: "BFS queue", description: "queue pop(0) / deque popleft", pattern: "dfs-bfs" },
  { id: "tree-recursion", label: "Tree recursion", description: "if not root: return base", pattern: "trees" },
  { id: "heap-push-pop", label: "Heap push/pop", description: "heapq.heappush/heappop", pattern: "heap" },
  { id: "monotonic-stack", label: "Monotonic stack", description: "while stack and condition: pop", pattern: "stack" },
  { id: "stack-matching", label: "Stack matching", description: "pairs map for brackets", pattern: "stack" },
  { id: "dp-tabulation", label: "DP tabulation", description: "dp[i] from smaller states", pattern: "dynamic-programming" },
  { id: "dp-memoization", label: "DP memo", description: "memo[(i,j)] cache", pattern: "dynamic-programming" },
  { id: "backtrack-choose-explore-unchoose", label: "Backtrack CEU", description: "append, recurse, pop", pattern: "backtracking" },
  { id: "union-find-compress", label: "Union-find", description: "path compression find", pattern: "union-find" },
  { id: "graph-adjacency", label: "Adjacency list", description: "graph[u].append(v)", pattern: "graphs" },
  { id: "topological-sort", label: "Topo sort", description: "indegree BFS Kahn", pattern: "graphs" },
  { id: "prefix-sum", label: "Prefix sum", description: "running prefix accumulation", pattern: "arrays" },
  { id: "suffix-pass", label: "Suffix pass", description: "right-to-left accumulation", pattern: "arrays" },
  { id: "deque-window", label: "Deque window", description: "collections.deque", pattern: "sliding-window" },
  { id: "linked-list-pointer", label: "List pointers", description: "prev/curr/next rewiring", pattern: "arrays" },
  { id: "interval-merge", label: "Interval merge", description: "sort + merge overlapping", pattern: "arrays" },
  { id: "greedy-local", label: "Greedy choice", description: "local optimal each step", pattern: "arrays" },
  { id: "enumerate-index", label: "enumerate", description: "for i, x in enumerate", pattern: "arrays" },
];

export function getMotifInfo(id: SyntaxMotif): SyntaxMotifInfo | undefined {
  return SYNTAX_MOTIFS.find((m) => m.id === id);
}
