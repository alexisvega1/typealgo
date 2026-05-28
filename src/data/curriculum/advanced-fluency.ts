import { snippet } from "./builder";
import type { Snippet } from "@/lib/types";

/** Tier 3 — advanced motifs (roadmap toward 200). */
export const ADVANCED_FLUENCY_SNIPPETS: Snippet[] = [
  snippet({
    id: "trapping-rain",
    title: "Trapping Rain Water",
    pattern: "two-pointers",
    difficulty: "hard",
    language: "python",
    tier: "advanced-fluency",
    fluencyLevel: 4,
    motifs: ["two-pointer-converge"],
    prerequisites: ["container-water"],
    leetcodeId: 42,
    code: `def trap(height):
    left, right = 0, len(height) - 1
    left_max = right_max = water = 0
    while left < right:
        if height[left] < height[right]:
            left_max = max(left_max, height[left])
            water += left_max - height[left]
            left += 1
        else:
            right_max = max(right_max, height[right])
            water += right_max - height[right]
            right -= 1
    return water`,
  }),
  snippet({
    id: "median-data-stream",
    title: "Find Median from Data Stream",
    pattern: "heap",
    difficulty: "hard",
    language: "python",
    tier: "advanced-fluency",
    fluencyLevel: 5,
    motifs: ["heap-push-pop"],
    prerequisites: ["merge-k-lists"],
    leetcodeId: 295,
    code: `import heapq

class MedianFinder:
    def __init__(self):
        self.lo = []
        self.hi = []

    def addNum(self, num):
        heapq.heappush(self.lo, -num)
        heapq.heappush(self.hi, -heapq.heappop(self.lo))
        if len(self.hi) > len(self.lo):
            heapq.heappush(self.lo, -heapq.heappop(self.hi))

    def findMedian(self):
        if len(self.lo) > len(self.hi):
            return -self.lo[0]
        return (-self.lo[0] + self.hi[0]) / 2`,
  }),
  snippet({
    id: "word-ladder",
    title: "Word Ladder",
    pattern: "graphs",
    difficulty: "hard",
    language: "python",
    tier: "advanced-fluency",
    fluencyLevel: 5,
    motifs: ["bfs-queue"],
    prerequisites: ["rotting-oranges"],
    leetcodeId: 127,
    code: `def ladderLength(beginWord, endWord, wordList):
    words = set(wordList)
    if endWord not in words:
        return 0
    queue = [(beginWord, 1)]
    while queue:
        word, steps = queue.pop(0)
        if word == endWord:
            return steps
        for i in range(len(word)):
            for c in "abcdefghijklmnopqrstuvwxyz":
                nxt = word[:i] + c + word[i + 1:]
                if nxt in words:
                    words.remove(nxt)
                    queue.append((nxt, steps + 1))
    return 0`,
  }),
  snippet({
    id: "alien-dictionary",
    title: "Alien Dictionary — Topo Sort",
    pattern: "graphs",
    difficulty: "hard",
    language: "python",
    tier: "advanced-fluency",
    fluencyLevel: 5,
    motifs: ["topological-sort", "graph-adjacency"],
    prerequisites: ["course-schedule"],
    leetcodeId: 269,
    code: `def alienOrder(words):
    graph = {c: set() for w in words for c in w}
    indegree = {c: 0 for c in graph}
    for a, b in zip(words, words[1:]):
        if len(b) < len(a) and a[: len(b)] == b:
            return ""
        for x, y in zip(a, b):
            if x != y:
                if y not in graph[x]:
                    graph[x].add(y)
                    indegree[y] += 1
                break
    queue = [c for c, d in indegree.items() if d == 0]
    order = []
    while queue:
        c = queue.pop()
        order.append(c)
        for nei in graph[c]:
            indegree[nei] -= 1
            if indegree[nei] == 0:
                queue.append(nei)
    return "" if len(order) != len(indegree) else "".join(order)`,
  }),
  snippet({
    id: "burst-balloons",
    title: "Burst Balloons — Interval DP",
    pattern: "dynamic-programming",
    difficulty: "hard",
    language: "python",
    tier: "advanced-fluency",
    fluencyLevel: 5,
    motifs: ["dp-tabulation"],
    prerequisites: ["coin-change"],
    leetcodeId: 312,
    code: `def maxCoins(nums):
    nums = [1] + nums + [1]
    n = len(nums)
    dp = [[0] * n for _ in range(n)]
    for length in range(3, n + 1):
        for left in range(n - length + 1):
            right = left + length - 1
            for k in range(left + 1, right):
                dp[left][right] = max(
                    dp[left][right],
                    dp[left][k] + dp[k][right] + nums[left] * nums[k] * nums[right],
                )
    return dp[0][n - 1]`,
  }),
  snippet({
    id: "regex-matching",
    title: "Regular Expression Matching",
    pattern: "dynamic-programming",
    difficulty: "hard",
    language: "python",
    tier: "advanced-fluency",
    fluencyLevel: 5,
    motifs: ["dp-memoization"],
    leetcodeId: 10,
    code: `def isMatch(s, p):
    m, n = len(s), len(p)
    dp = [[False] * (n + 1) for _ in range(m + 1)]
    dp[0][0] = True
    for j in range(2, n + 1):
        if p[j - 1] == "*":
            dp[0][j] = dp[0][j - 2]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if p[j - 1] == "*":
                dp[i][j] = dp[i][j - 2]
                if p[j - 2] == "." or p[j - 2] == s[i - 1]:
                    dp[i][j] = dp[i][j] or dp[i - 1][j]
            elif p[j - 1] == "." or p[j - 1] == s[i - 1]:
                dp[i][j] = dp[i - 1][j - 1]
    return dp[m][n]`,
  }),
  snippet({
    id: "n-queens",
    title: "N-Queens",
    pattern: "backtracking",
    difficulty: "hard",
    language: "python",
    tier: "advanced-fluency",
    fluencyLevel: 5,
    motifs: ["backtrack-choose-explore-unchoose"],
    prerequisites: ["permute"],
    leetcodeId: 51,
    code: `def solveNQueens(n):
    cols = set()
    diag1 = set()
    diag2 = set()
    board = []
    result = []

    def backtrack(r, path):
        if r == n:
            result.append(path[:])
            return
        for c in range(n):
            if c in cols or (r - c) in diag1 or (r + c) in diag2:
                continue
            cols.add(c)
            diag1.add(r - c)
            diag2.add(r + c)
            path.append("." * c + "Q" + "." * (n - c - 1))
            backtrack(r + 1, path)
            path.pop()
            cols.remove(c)
            diag1.remove(r - c)
            diag2.remove(r + c)

    backtrack(0, [])
    return result`,
  }),
  snippet({
    id: "shortest-path-binary",
    title: "Shortest Path in Binary Matrix",
    pattern: "graphs",
    difficulty: "medium",
    language: "python",
    tier: "advanced-fluency",
    fluencyLevel: 4,
    motifs: ["bfs-queue"],
    prerequisites: ["rotting-oranges"],
    leetcodeId: 1091,
    code: `def shortestPathBinaryMatrix(grid):
    n = len(grid)
    if grid[0][0] or grid[-1][-1]:
        return -1
    queue = [(0, 0, 1)]
    grid[0][0] = 1
    while queue:
        r, c, d = queue.pop(0)
        if r == n - 1 and c == n - 1:
            return d
        for dr in (-1, 0, 1):
            for dc in (-1, 0, 1):
                if dr == dc == 0:
                    continue
                nr, nc = r + dr, c + dc
                if 0 <= nr < n and 0 <= nc < n and not grid[nr][nc]:
                    grid[nr][nc] = 1
                    queue.append((nr, nc, d + 1))
    return -1`,
  }),
  snippet({
    id: "counting-bits",
    title: "Counting Bits — DP",
    pattern: "dynamic-programming",
    difficulty: "easy",
    language: "python",
    tier: "advanced-fluency",
    fluencyLevel: 3,
    motifs: ["dp-tabulation"],
    leetcodeId: 338,
    code: `def countBits(n):
    dp = [0] * (n + 1)
    for i in range(1, n + 1):
        dp[i] = dp[i >> 1] + (i & 1)
    return dp`,
  }),
  snippet({
    id: "segment-tree-query",
    title: "Range Sum Query — Prefix",
    pattern: "arrays",
    difficulty: "easy",
    language: "python",
    tier: "advanced-fluency",
    fluencyLevel: 3,
    motifs: ["prefix-sum"],
    description: "Foundation before segment trees — prefix sum range query.",
    leetcodeId: 303,
    code: `class NumArray:
    def __init__(self, nums):
        self.prefix = [0]
        for n in nums:
            self.prefix.append(self.prefix[-1] + n)

    def sumRange(self, left, right):
        return self.prefix[right + 1] - self.prefix[left]`,
  }),
  snippet({
    id: "dijkstra-template",
    title: "Dijkstra Shortest Path",
    pattern: "graphs",
    difficulty: "hard",
    language: "python",
    tier: "advanced-fluency",
    fluencyLevel: 5,
    motifs: ["heap-push-pop", "graph-adjacency"],
    prerequisites: ["clone-graph"],
    code: `import heapq

def dijkstra(n, edges, src):
    graph = [[] for _ in range(n)]
    for u, v, w in edges:
        graph[u].append((v, w))
    dist = [float("inf")] * n
    dist[src] = 0
    heap = [(0, src)]
    while heap:
        d, u = heapq.heappop(heap)
        if d > dist[u]:
            continue
        for v, w in graph[u]:
            nd = d + w
            if nd < dist[v]:
                dist[v] = nd
                heapq.heappush(heap, (nd, v))
    return dist`,
  }),
  snippet({
    id: "lfu-cache",
    title: "LFU Cache — Advanced Hash",
    pattern: "hash-map",
    difficulty: "hard",
    language: "python",
    tier: "advanced-fluency",
    fluencyLevel: 5,
    motifs: ["hash-lookup", "freq-counter"],
    prerequisites: ["lru-cache"],
    leetcodeId: 460,
    code: `from collections import defaultdict, OrderedDict

class LFUCache:
    def __init__(self, capacity):
        self.cap = capacity
        self.min_freq = 0
        self.key_val = {}
        self.key_freq = {}
        self.freq_keys = defaultdict(OrderedDict)

    def _update(self, key):
        f = self.key_freq[key]
        self.freq_keys[f].pop(key)
        if not self.freq_keys[f] and f == self.min_freq:
            self.min_freq += 1
        self.key_freq[key] = f + 1
        self.freq_keys[f + 1][key] = None

    def get(self, key):
        if key not in self.key_val:
            return -1
        self._update(key)
        return self.key_val[key]

    def put(self, key, value):
        if self.cap == 0:
            return
        if key in self.key_val:
            self.key_val[key] = value
            self._update(key)
            return
        if len(self.key_val) == self.cap:
            evict, _ = self.freq_keys[self.min_freq].popitem(last=False)
            del self.key_val[evict]
            del self.key_freq[evict]
        self.key_val[key] = value
        self.key_freq[key] = 1
        self.freq_keys[1][key] = None
        self.min_freq = 1`,
  }),
];
