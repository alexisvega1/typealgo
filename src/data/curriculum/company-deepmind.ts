import { snippet } from "./builder";
import type { Snippet } from "@/lib/types";

/** DeepMind track — classic DSA + stdlib ML primitives (June 2026 spec). */
export const DEEPMIND_SNIPPETS: Snippet[] = [
  snippet({
    id: "deepmind-dfs-components",
    title: "Count Connected Components (DFS)",
    pattern: "dfs-bfs",
    difficulty: "medium",
    language: "python",
    tier: "interview-fluency",
    fluencyLevel: 2,
    motifs: ["dfs-recursion"],
    packIds: ["company-deepmind"],
    tracks: ["deepmind"],
    levelRange: ["junior"],
    format: "classic",
    sourceStyle: "DeepMind L3 graph DFS flood-fill.",
    description: "Count connected regions in an undirected adjacency list.",
    code: `def count_components(n: int, edges: list[list[int]]) -> int:
    adj: list[list[int]] = [[] for _ in range(n)]
    for u, v in edges:
        adj[u].append(v)
        adj[v].append(u)
    seen = [False] * n

    def dfs(node: int) -> None:
        seen[node] = True
        for nei in adj[node]:
            if not seen[nei]:
                dfs(nei)

    comps = 0
    for i in range(n):
        if not seen[i]:
            dfs(i)
            comps += 1
    return comps`,
  }),
  snippet({
    id: "deepmind-kth-largest-heap",
    title: "Kth Largest via Min-Heap",
    pattern: "heap",
    difficulty: "medium",
    language: "python",
    tier: "interview-fluency",
    fluencyLevel: 2,
    motifs: ["heap-push-pop"],
    packIds: ["company-deepmind"],
    tracks: ["deepmind"],
    levelRange: ["junior"],
    format: "classic",
    sourceStyle: "DeepMind L3 heap maintenance for top-k.",
    description: "Return the kth largest value using a size-k min-heap.",
    code: `import heapq

def kth_largest(nums: list[int], k: int) -> int:
    heap: list[int] = []
    for n in nums:
        heapq.heappush(heap, n)
        if len(heap) > k:
            heapq.heappop(heap)
    return heap[0]`,
  }),
  snippet({
    id: "deepmind-first-bad-version",
    title: "First Bad Version (Binary Search)",
    pattern: "binary-search",
    difficulty: "medium",
    language: "python",
    tier: "interview-fluency",
    fluencyLevel: 2,
    motifs: ["binary-search-boundary"],
    packIds: ["company-deepmind"],
    tracks: ["deepmind"],
    levelRange: ["junior"],
    format: "classic",
    sourceStyle: "DeepMind L3 binary search on the first failing index.",
    description: "Find the earliest bad version given is_bad(v).",
    code: `def first_bad_version(n: int, is_bad) -> int:
    lo, hi = 1, n
    while lo < hi:
        mid = (lo + hi) // 2
        if is_bad(mid):
            hi = mid
        else:
            lo = mid + 1
    return lo`,
  }),
  snippet({
    id: "deepmind-running-median",
    title: "Running Median (Two Heaps)",
    pattern: "heap",
    difficulty: "hard",
    language: "python",
    tier: "interview-fluency",
    fluencyLevel: 3,
    motifs: ["heap-push-pop"],
    packIds: ["company-deepmind"],
    tracks: ["deepmind"],
    levelRange: ["mid"],
    format: "classic",
    sourceStyle: "DeepMind L4 dual-heap median maintenance.",
    description: "Stream integers and return the median after each add.",
    code: `import heapq

class RunningMedian:
    def __init__(self) -> None:
        self._low: list[int] = []
        self._high: list[int] = []

    def add(self, value: int) -> None:
        if not self._low or value <= -self._low[0]:
            heapq.heappush(self._low, -value)
        else:
            heapq.heappush(self._high, value)
        if len(self._low) > len(self._high) + 1:
            heapq.heappush(self._high, -heapq.heappop(self._low))
        elif len(self._high) > len(self._low):
            heapq.heappush(self._low, -heapq.heappop(self._high))

    def median(self) -> float:
        if len(self._low) > len(self._high):
            return float(-self._low[0])
        return (-self._low[0] + self._high[0]) / 2.0`,
  }),
  snippet({
    id: "deepmind-stream-anomaly",
    title: "Stream Anomaly Detector",
    pattern: "sliding-window",
    difficulty: "medium",
    language: "python",
    tier: "interview-fluency",
    fluencyLevel: 3,
    motifs: ["sliding-window-expand"],
    packIds: ["company-deepmind"],
    tracks: ["deepmind"],
    levelRange: ["mid"],
    format: "classic",
    sourceStyle: "DeepMind L4 bounded-memory z-score over a window.",
    description: "Flag values more than 2 std devs from the window mean.",
    code: `from collections import deque

class StreamAnomaly:
    def __init__(self, window: int) -> None:
        self._window = window
        self._buf: deque[float] = deque()

    def add(self, value: float) -> bool:
        self._buf.append(value)
        if len(self._buf) > self._window:
            self._buf.popleft()
        if len(self._buf) < 2:
            return False
        mean = sum(self._buf) / len(self._buf)
        var = sum((x - mean) ** 2 for x in self._buf) / len(self._buf)
        std = var ** 0.5
        if std == 0:
            return False
        return abs(value - mean) > 2 * std`,
  }),
  snippet({
    id: "deepmind-matrix-path-sum",
    title: "Minimum Path Sum in Grid",
    pattern: "dynamic-programming",
    difficulty: "hard",
    language: "python",
    tier: "interview-fluency",
    fluencyLevel: 3,
    motifs: ["dp-tabulation"],
    packIds: ["company-deepmind"],
    tracks: ["deepmind"],
    levelRange: ["mid"],
    format: "classic",
    sourceStyle: "DeepMind L4 matrix DP tabulation.",
    description: "Minimum cost path from top-left to bottom-right.",
    code: `def min_path_sum(grid: list[list[int]]) -> int:
    if not grid:
        return 0
    rows, cols = len(grid), len(grid[0])
    dp = [[0] * cols for _ in range(rows)]
    dp[0][0] = grid[0][0]
    for c in range(1, cols):
        dp[0][c] = dp[0][c - 1] + grid[0][c]
    for r in range(1, rows):
        dp[r][0] = dp[r - 1][0] + grid[r][0]
    for r in range(1, rows):
        for c in range(1, cols):
            dp[r][c] = min(dp[r - 1][c], dp[r][c - 1]) + grid[r][c]
    return dp[rows - 1][cols - 1]`,
  }),
  snippet({
    id: "deepmind-stable-softmax",
    title: "Numerically Stable Softmax",
    pattern: "arrays",
    difficulty: "hard",
    language: "python",
    tier: "interview-fluency",
    fluencyLevel: 4,
    motifs: ["enumerate-index"],
    packIds: ["company-deepmind"],
    tracks: ["deepmind"],
    levelRange: ["senior"],
    format: "classic",
    sourceStyle: "DeepMind L5 stdlib softmax with max subtraction.",
    description: "Return probabilities that sum to 1; stable for large logits.",
    code: `import math

def stable_softmax(logits: list[float]) -> list[float]:
    if not logits:
        return []
    m = max(logits)
    exps = [math.exp(x - m) for x in logits]
    total = sum(exps)
    if total == 0:
        return [1.0 / len(logits)] * len(logits)
    return [e / total for e in exps]`,
  }),
  snippet({
    id: "deepmind-kmeans-step",
    title: "Single K-Means Iteration",
    pattern: "arrays",
    difficulty: "hard",
    language: "python",
    tier: "interview-fluency",
    fluencyLevel: 4,
    motifs: ["enumerate-index"],
    packIds: ["company-deepmind"],
    tracks: ["deepmind"],
    levelRange: ["senior"],
    format: "classic",
    sourceStyle: "DeepMind L5 one assign-and-update k-means pass.",
    description: "Assign points to nearest centroid, then recompute means.",
    code: `def kmeans_step(points: list[list[float]], centroids: list[list[float]]) -> list[list[float]]:
    k = len(centroids)
    buckets: list[list[list[float]]] = [[] for _ in range(k)]
    for pt in points:
        best = min(range(k), key=lambda i: sum((pt[d] - centroids[i][d]) ** 2 for d in range(len(pt))))
        buckets[best].append(pt)
    new_centroids: list[list[float]] = []
    for i in range(k):
        if not buckets[i]:
            new_centroids.append(centroids[i][:])
            continue
        dim = len(points[0])
        mean = [sum(p[d] for p in buckets[i]) / len(buckets[i]) for d in range(dim)]
        new_centroids.append(mean)
    return new_centroids`,
  }),
  snippet({
    id: "deepmind-attention-scores",
    title: "Dot-Product Attention Scores",
    pattern: "arrays",
    difficulty: "hard",
    language: "python",
    tier: "interview-fluency",
    fluencyLevel: 4,
    motifs: ["enumerate-index"],
    packIds: ["company-deepmind"],
    tracks: ["deepmind"],
    levelRange: ["senior"],
    format: "classic",
    sourceStyle: "DeepMind L5 attention logits with plain loops.",
    description: "Return pre-softmax scaled query-key dot products (Q·K / √d_k).",
    code: `def attention_scores(query: list[float], keys: list[list[float]]) -> list[float]:
    if not keys:
        return []
    dim = len(query)
    scale = dim ** 0.5
    scores: list[float] = []
    for key in keys:
        dot = sum(query[i] * key[i] for i in range(dim))
        scores.append(dot / scale)
    return scores`,
  }),
];
