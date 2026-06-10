import { comprehensionSnippet } from "@/lib/snippet-comprehension";

/** Google track — code-comprehension variants (read buggy code, type the fix). */
export const GOOGLE_COMPREHENSION_SNIPPETS = [
  comprehensionSnippet({
    id: "google-comp-merge-sorted",
    title: "Fix: Merge Two Sorted Arrays",
    pattern: "two-pointers",
    difficulty: "medium",
    language: "python",
    tier: "interview-fluency",
    fluencyLevel: 2,
    motifs: ["two-pointer-chase"],
    packIds: ["company-google"],
    tracks: ["google"],
    levelRange: ["junior"],
    sourceStyle: "Google L3 comprehension — off-by-one in trailing merge.",
    description: "Correct the merge so both tails flush completely.",
    variantOf: "google-merge-sorted-arrays",
    plantedBugKind: "off-by-one",
    buggyCode: `def merge_sorted(a: list[int], b: list[int]) -> list[int]:
    i, j = 0, 0
    out: list[int] = []
    while i < len(a) and j < len(b):
        if a[i] <= b[j]:
            out.append(a[i])
            i += 1
        else:
            out.append(b[j])
            j += 1
    out.extend(a[i + 1:])
    out.extend(b[j + 1:])
    return out`,
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
  comprehensionSnippet({
    id: "google-comp-grid-bfs",
    title: "Fix: Grid Shortest Path (BFS)",
    pattern: "dfs-bfs",
    difficulty: "medium",
    language: "python",
    tier: "interview-fluency",
    fluencyLevel: 2,
    motifs: ["bfs-queue"],
    packIds: ["company-google"],
    tracks: ["google"],
    levelRange: ["junior"],
    sourceStyle: "Google L3 comprehension — missing visited check on enqueue.",
    description: "Prevent revisiting cells already in the BFS queue.",
    variantOf: "google-grid-bfs",
    plantedBugKind: "missing-visited",
    buggyCode: `from collections import deque

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
                seen.add((nr, nc))
                q.append((nr, nc, steps + 1))
    return -1`,
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
  comprehensionSnippet({
    id: "google-comp-topo-sort",
    title: "Fix: Topological Sort (Kahn)",
    pattern: "graphs",
    difficulty: "medium",
    language: "python",
    tier: "interview-fluency",
    fluencyLevel: 3,
    motifs: ["graph-adjacency"],
    packIds: ["company-google"],
    tracks: ["google"],
    levelRange: ["mid"],
    sourceStyle: "Google L4 comprehension — wrong in-degree update target.",
    description: "Decrement in-degree on the neighbor node, not the source.",
    variantOf: "google-topological-sort",
    plantedBugKind: "inverted-condition",
    buggyCode: `from collections import deque

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
            indeg[node] -= 1
            if indeg[nei] == 0:
                q.append(nei)
    return order if len(order) == n else []`,
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
  comprehensionSnippet({
    id: "google-comp-merge-intervals",
    title: "Fix: Merge Overlapping Intervals",
    pattern: "arrays",
    difficulty: "medium",
    language: "python",
    tier: "interview-fluency",
    fluencyLevel: 3,
    motifs: ["two-pointer-chase"],
    packIds: ["company-google"],
    tracks: ["google"],
    levelRange: ["mid"],
    sourceStyle: "Google L4 comprehension — off-by-one overlap boundary.",
    description: "Treat touching intervals as overlapping when start equals last end.",
    variantOf: "google-merge-intervals",
    plantedBugKind: "off-by-one",
    buggyCode: `def merge_intervals(intervals: list[list[int]]) -> list[list[int]]:
    if not intervals:
        return []
    intervals.sort(key=lambda x: x[0])
    merged = [intervals[0][:]]
    for start, end in intervals[1:]:
        last_end = merged[-1][1]
        if start < last_end:
            merged[-1][1] = max(last_end, end)
        else:
            merged.append([start, end])
    return merged`,
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
  comprehensionSnippet({
    id: "google-comp-edit-distance",
    title: "Fix: Edit Distance (Levenshtein)",
    pattern: "dynamic-programming",
    difficulty: "hard",
    language: "python",
    tier: "interview-fluency",
    fluencyLevel: 4,
    motifs: ["dp-tabulation"],
    packIds: ["company-google"],
    tracks: ["google"],
    levelRange: ["senior"],
    sourceStyle: "Google L5 comprehension — wrong DP base case on rows.",
    description: "Initialize first-column deletion costs as i, not i - 1.",
    variantOf: "google-edit-distance",
    plantedBugKind: "wrong-base-case",
    buggyCode: `def edit_distance(a: str, b: str) -> int:
    m, n = len(a), len(b)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(m + 1):
        dp[i][0] = i - 1
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
  comprehensionSnippet({
    id: "google-comp-lru-cache",
    title: "Fix: LRU Cache Class",
    pattern: "hash-map",
    difficulty: "hard",
    language: "python",
    tier: "interview-fluency",
    fluencyLevel: 4,
    motifs: ["hash-lookup"],
    packIds: ["company-google"],
    tracks: ["google"],
    levelRange: ["senior"],
    sourceStyle: "Google L5 comprehension — evict from wrong end of OrderedDict.",
    description: "Evict least-recently-used with popitem(last=False).",
    variantOf: "google-lru-cache",
    plantedBugKind: "inverted-condition",
    buggyCode: `from collections import OrderedDict

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
            self._data.popitem(last=True)`,
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
