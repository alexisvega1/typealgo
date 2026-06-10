import { snippet } from "./builder";
import type { Snippet } from "@/lib/types";

/** Google track — classic DSA, Python-first (June 2026 spec). */
export const GOOGLE_SNIPPETS: Snippet[] = [
  snippet({
    id: "google-merge-sorted-arrays",
    title: "Merge Two Sorted Arrays",
    pattern: "two-pointers",
    difficulty: "medium",
    language: "python",
    tier: "interview-fluency",
    fluencyLevel: 2,
    motifs: ["two-pointer-chase"],
    packIds: ["company-google"],
    tracks: ["google"],
    levelRange: ["junior"],
    format: "classic",
    sourceStyle: "Google L3 two-pointer merge into a single sorted output.",
    description: "Linear merge of two ascending arrays with a trailing pointer.",
    code: `def merge_sorted(a: list[int], b: list[int]) -> list[int]:
    i, j = 0, 0
    out: list[int] = []
    while i < len(a) and j < len(b):
        if a[i] <= b[j]:
            out.append(a[i])
            i += 1
        else:
            out.append(b[j])
            j += 1
    out.extend(a[i:])
    out.extend(b[j:])
    return out`,
  }),
  snippet({
    id: "google-grid-bfs",
    title: "Grid Shortest Path (BFS)",
    pattern: "dfs-bfs",
    difficulty: "medium",
    language: "python",
    tier: "interview-fluency",
    fluencyLevel: 2,
    motifs: ["bfs-queue"],
    packIds: ["company-google"],
    tracks: ["google"],
    levelRange: ["junior"],
    format: "classic",
    sourceStyle: "Google L3 grid BFS with 4-direction expansion.",
    description: "Return shortest steps from top-left to bottom-right in a binary grid.",
    code: `from collections import deque

def shortest_path_grid(grid: list[list[int]]) -> int:
    if not grid or not grid[0]:
        return -1
    rows, cols = len(grid), len(grid[0])
    if grid[0][0] == 1 or grid[rows - 1][cols - 1] == 1:
        return -1
    q: deque[tuple[int, int, int]] = deque([(0, 0, 0)])
    seen = {(0, 0)}
    while q:
        r, c, steps = q.popleft()
        if r == rows - 1 and c == cols - 1:
            return steps
        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 0:
                if (nr, nc) not in seen:
                    seen.add((nr, nc))
                    q.append((nr, nc, steps + 1))
    return -1`,
  }),
  snippet({
    id: "google-binary-search-capacity",
    title: "Binary Search on Answer — Ship Capacity",
    pattern: "binary-search",
    difficulty: "medium",
    language: "python",
    tier: "interview-fluency",
    fluencyLevel: 2,
    motifs: ["binary-search-answer"],
    packIds: ["company-google"],
    tracks: ["google"],
    levelRange: ["junior"],
    format: "classic",
    sourceStyle: "Google L3 binary search on the feasible capacity.",
    description: "Minimum capacity to ship weights within D days.",
    code: `def min_capacity(weights: list[int], days: int) -> int:
    def can_ship(cap: int) -> bool:
        used, load = 1, 0
        for w in weights:
            if w > cap:
                return False
            if load + w > cap:
                used += 1
                load = 0
            load += w
        return used <= days

    lo, hi = max(weights), sum(weights)
    while lo < hi:
        mid = (lo + hi) // 2
        if can_ship(mid):
            hi = mid
        else:
            lo = mid + 1
    return lo`,
  }),
  snippet({
    id: "google-topological-sort",
    title: "Topological Sort (Kahn)",
    pattern: "graphs",
    difficulty: "medium",
    language: "python",
    tier: "interview-fluency",
    fluencyLevel: 3,
    motifs: ["graph-adjacency"],
    packIds: ["company-google"],
    tracks: ["google"],
    levelRange: ["mid"],
    format: "classic",
    sourceStyle: "Google L4 Kahn topological ordering.",
    description: "Return a valid order or empty list if a cycle exists.",
    code: `from collections import deque

def topo_sort(n: int, edges: list[list[int]]) -> list[int]:
    indeg = [0] * n
    adj: list[list[int]] = [[] for _ in range(n)]
    for u, v in edges:
        adj[u].append(v)
        indeg[v] += 1
    q = deque(i for i in range(n) if indeg[i] == 0)
    order: list[int] = []
    while q:
        node = q.popleft()
        order.append(node)
        for nei in adj[node]:
            indeg[nei] -= 1
            if indeg[nei] == 0:
                q.append(nei)
    return order if len(order) == n else []`,
  }),
  snippet({
    id: "google-merge-intervals",
    title: "Merge Overlapping Intervals",
    pattern: "arrays",
    difficulty: "medium",
    language: "python",
    tier: "interview-fluency",
    fluencyLevel: 3,
    motifs: ["two-pointer-chase"],
    packIds: ["company-google"],
    tracks: ["google"],
    levelRange: ["mid"],
    format: "classic",
    sourceStyle: "Google L4 interval merge after sorting by start.",
    description: "Combine overlapping [start, end] intervals.",
    code: `def merge_intervals(intervals: list[list[int]]) -> list[list[int]]:
    if not intervals:
        return []
    intervals.sort(key=lambda x: x[0])
    merged = [intervals[0][:]]
    for start, end in intervals[1:]:
        last_end = merged[-1][1]
        if start <= last_end:
            merged[-1][1] = max(last_end, end)
        else:
            merged.append([start, end])
    return merged`,
  }),
  snippet({
    id: "google-task-scheduler",
    title: "Heap Task Scheduler",
    pattern: "heap",
    difficulty: "medium",
    language: "python",
    tier: "interview-fluency",
    fluencyLevel: 3,
    motifs: ["heap-push-pop"],
    packIds: ["company-google"],
    tracks: ["google"],
    levelRange: ["mid"],
    format: "classic",
    sourceStyle: "Google L4 heap-based task ordering with cooldown.",
    description: "Minimum intervals to finish tasks with cooldown n.",
    code: `from collections import Counter

def least_intervals(tasks: list[str], n: int) -> int:
    counts = Counter(tasks)
    max_count = max(counts.values())
    max_freq = sum(1 for c in counts.values() if c == max_count)
    return max(len(tasks), (max_count - 1) * (n + 1) + max_freq)`,
  }),
  snippet({
    id: "google-edit-distance",
    title: "Edit Distance (Levenshtein)",
    pattern: "dynamic-programming",
    difficulty: "hard",
    language: "python",
    tier: "interview-fluency",
    fluencyLevel: 4,
    motifs: ["dp-tabulation"],
    packIds: ["company-google"],
    tracks: ["google"],
    levelRange: ["senior"],
    format: "classic",
    sourceStyle: "Google L5 classic 2D DP tabulation.",
    description: "Minimum edits to transform word a into word b.",
    code: `def edit_distance(a: str, b: str) -> int:
    m, n = len(a), len(b)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(m + 1):
        dp[i][0] = i
    for j in range(n + 1):
        dp[0][j] = j
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            cost = 0 if a[i - 1] == b[j - 1] else 1
            dp[i][j] = min(
                dp[i - 1][j] + 1,
                dp[i][j - 1] + 1,
                dp[i - 1][j - 1] + cost,
            )
    return dp[m][n]`,
  }),
  snippet({
    id: "google-trie-prefix",
    title: "Prefix Trie",
    pattern: "hash-map",
    difficulty: "hard",
    language: "python",
    tier: "interview-fluency",
    fluencyLevel: 4,
    motifs: ["hash-lookup"],
    packIds: ["company-google"],
    tracks: ["google"],
    levelRange: ["senior"],
    format: "classic",
    sourceStyle: "Google L5 trie insert and prefix search.",
    description: "Insert words and test prefix membership.",
    code: `class TrieNode:
    __slots__ = ("children", "end")

    def __init__(self) -> None:
        self.children: dict[str, TrieNode] = {}
        self.end = False

class PrefixTrie:
    def __init__(self) -> None:
        self._root = TrieNode()

    def insert(self, word: str) -> None:
        node = self._root
        for ch in word:
            node = node.children.setdefault(ch, TrieNode())
        node.end = True

    def starts_with(self, prefix: str) -> bool:
        node = self._root
        for ch in prefix:
            if ch not in node.children:
                return False
            node = node.children[ch]
        return True`,
  }),
  snippet({
    id: "google-lru-cache",
    title: "LRU Cache Class",
    pattern: "hash-map",
    difficulty: "hard",
    language: "python",
    tier: "interview-fluency",
    fluencyLevel: 4,
    motifs: ["hash-lookup"],
    packIds: ["company-google"],
    tracks: ["google"],
    levelRange: ["senior"],
    format: "classic",
    sourceStyle: "Google L5 design-as-class LRU with OrderedDict.",
    description: "O(1) get/put with capacity eviction.",
    code: `from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity: int) -> None:
        self._cap = capacity
        self._data: OrderedDict[str, int] = OrderedDict()

    def get(self, key: str) -> int:
        if key not in self._data:
            return -1
        self._data.move_to_end(key)
        return self._data[key]

    def put(self, key: str, value: int) -> None:
        if key in self._data:
            self._data.move_to_end(key)
        self._data[key] = value
        if len(self._data) > self._cap:
            self._data.popitem(last=False)`,
  }),
];
