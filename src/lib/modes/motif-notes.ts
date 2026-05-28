import type { SyntaxMotif } from "@/lib/types";

/** Why this motif matters in interviews — consolidation notes for Review mode. */
export const MOTIF_WHY_IT_MATTERS: Partial<Record<SyntaxMotif, string>> = {
  "hash-lookup":
    "Complement and seen-set lookups appear in nearly every array/hash interview. Muscle memory here saves minutes.",
  "binary-search-boundary":
    "Lower/upper bound templates are the #1 source of off-by-one bugs — internalizing the loop invariant is critical.",
  "heap-push-pop":
    "Top-k and streaming median problems always reduce to heap API fluency under time pressure.",
  "sliding-window-contract":
    "The shrink loop is where window problems break — knowing when to move left separates fluency from guessing.",
  "backtrack-choose-explore-unchoose":
    "The choose → recurse → undo rhythm is the skeleton of subsets, permutations, and combinatorial search.",
  "graph-adjacency":
    "Adjacency iteration is the gateway to BFS, DFS, and Dijkstra — you should write it without thinking.",
  "dfs-recursion":
    "Base case + recursive step is the universal graph/tree template — hesitation here cascades.",
  "dp-tabulation":
    "State transition loops are graded on whether you can write the recurrence without pausing.",
  "bfs-queue":
    "Level-order and shortest-path BFS both hinge on queue discipline and visited tracking.",
  "prefix-sum":
    "Prefix accumulation unlocks range-sum and subarray problems in O(1) per query.",
};

/** Keywords to locate motif-related lines in source code. */
export const MOTIF_KEYWORDS: Partial<Record<SyntaxMotif, string[]>> = {
  "hash-lookup": ["get(", "in ", "dict", "map", "seen", "complement"],
  "freq-counter": ["count", "freq", "Counter", "defaultdict"],
  "heap-push-pop": ["heappush", "heappop", "heapq", "heap"],
  "binary-search-boundary": ["left", "right", "mid", "while left"],
  "binary-search-mid": ["mid", "// 2", "left +"],
  "sliding-window-expand": ["right", "expand", "while right"],
  "sliding-window-contract": ["left", "while ", "shrink"],
  "dfs-recursion": ["def dfs", "dfs(", "return dfs"],
  "bfs-queue": ["deque", "popleft", "queue", "pop(0)"],
  "backtrack-choose-explore-unchoose": ["append", "pop()", "backtrack"],
  "graph-adjacency": ["graph[", "adj", "neighbors", "nei"],
  "dp-tabulation": ["dp[", "for i in range"],
  "prefix-sum": ["prefix", "presum", "running"],
  "enumerate-index": ["enumerate"],
  "stack-matching": ["stack", "pairs", "pop()"],
  "monotonic-stack": ["stack", "while stack"],
};
