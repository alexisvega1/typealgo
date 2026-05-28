import { snippet } from "./builder";
import type { Snippet } from "@/lib/types";

/** Tier 2 — interview-canonical implementations (~60 snippets). */
export const INTERVIEW_FLUENCY_SNIPPETS: Snippet[] = [
  snippet({
    id: "group-anagrams",
    title: "Group Anagrams",
    pattern: "hash-map",
    difficulty: "medium",
    language: "python",
    tier: "interview-fluency",
    fluencyLevel: 2,
    motifs: ["hash-lookup", "counter-defaultdict"],
    prerequisites: ["valid-anagram"],
    leetcodeId: 49,
    code: `def groupAnagrams(strs):
    groups = {}
    for s in strs:
        key = tuple(sorted(s))
        groups.setdefault(key, []).append(s)
    return list(groups.values())`,
  }),
  snippet({
    id: "top-k-frequent",
    title: "Top K Frequent Elements",
    pattern: "heap",
    difficulty: "medium",
    language: "python",
    tier: "interview-fluency",
    fluencyLevel: 2,
    motifs: ["freq-counter", "heap-push-pop"],
    prerequisites: ["kth-largest"],
    leetcodeId: 347,
    code: `import heapq

def topKFrequent(nums, k):
    freq = {}
    for n in nums:
        freq[n] = freq.get(n, 0) + 1
    return heapq.nlargest(k, freq.keys(), key=freq.get)`,
  }),
  snippet({
    id: "container-water",
    title: "Container With Most Water",
    pattern: "two-pointers",
    difficulty: "medium",
    language: "python",
    tier: "interview-fluency",
    fluencyLevel: 2,
    motifs: ["two-pointer-converge"],
    prerequisites: ["two-sum-ii"],
    leetcodeId: 11,
    code: `def maxArea(height):
    left, right = 0, len(height) - 1
    best = 0
    while left < right:
        width = right - left
        best = max(best, min(height[left], height[right]) * width)
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1
    return best`,
  }),
  snippet({
    id: "three-sum",
    title: "3Sum",
    pattern: "two-pointers",
    difficulty: "medium",
    language: "python",
    tier: "interview-fluency",
    fluencyLevel: 3,
    motifs: ["two-pointer-converge"],
    prerequisites: ["two-sum-ii"],
    leetcodeId: 15,
    code: `def threeSum(nums):
    nums.sort()
    result = []
    for i, a in enumerate(nums):
        if i and nums[i - 1] == a:
            continue
        left, right = i + 1, len(nums) - 1
        while left < right:
            total = a + nums[left] + nums[right]
            if total == 0:
                result.append([a, nums[left], nums[right]])
                left += 1
                while left < right and nums[left] == nums[left - 1]:
                    left += 1
            elif total < 0:
                left += 1
            else:
                right -= 1
    return result`,
  }),
  snippet({
    id: "min-window",
    title: "Minimum Window Substring",
    pattern: "sliding-window",
    difficulty: "hard",
    language: "python",
    tier: "interview-fluency",
    fluencyLevel: 4,
    motifs: ["sliding-window-contract", "freq-counter"],
    prerequisites: ["longest-substring"],
    leetcodeId: 76,
    code: `def minWindow(s, t):
    need = {}
    for c in t:
        need[c] = need.get(c, 0) + 1
    missing = len(t)
    left = 0
    start = end = 0
    for right, ch in enumerate(s):
        if ch in need:
            if need[ch] > 0:
                missing -= 1
            need[ch] -= 1
        while missing == 0:
            if end == 0 or right - left < end - start:
                start, end = left, right + 1
            if s[left] in need:
                need[s[left]] += 1
                if need[s[left]] > 0:
                    missing += 1
            left += 1
    return s[start:end] if end else ""`,
  }),
  snippet({
    id: "permutation-in-string",
    title: "Permutation in String",
    pattern: "sliding-window",
    difficulty: "medium",
    language: "python",
    tier: "interview-fluency",
    fluencyLevel: 3,
    motifs: ["sliding-window-expand", "freq-counter"],
    leetcodeId: 567,
    code: `def checkInclusion(s1, s2):
    if len(s1) > len(s2):
        return False
    need = {}
    for c in s1:
        need[c] = need.get(c, 0) + 1
    missing = len(s1)
    left = 0
    for right, ch in enumerate(s2):
        if ch in need:
            if need[ch] > 0:
                missing -= 1
            need[ch] -= 1
        if right - left + 1 > len(s1):
            if s2[left] in need:
                need[s2[left]] += 1
                if need[s2[left]] > 0:
                    missing += 1
            left += 1
        if missing == 0:
            return True
    return False`,
  }),
  snippet({
    id: "find-min-rotated",
    title: "Find Minimum in Rotated Sorted Array",
    pattern: "binary-search",
    difficulty: "medium",
    language: "python",
    tier: "interview-fluency",
    fluencyLevel: 3,
    motifs: ["binary-search-mid"],
    variant: "rotated-array",
    prerequisites: ["binary-search-basic"],
    leetcodeId: 153,
    code: `def findMin(nums):
    left, right = 0, len(nums) - 1
    while left < right:
        mid = left + (right - left) // 2
        if nums[mid] > nums[right]:
            left = mid + 1
        else:
            right = mid
    return nums[left]`,
  }),
  snippet({
    id: "search-rotated",
    title: "Search in Rotated Sorted Array",
    pattern: "binary-search",
    difficulty: "medium",
    language: "python",
    tier: "interview-fluency",
    fluencyLevel: 4,
    motifs: ["binary-search-mid"],
    variant: "rotated-array",
    prerequisites: ["find-min-rotated"],
    leetcodeId: 33,
    code: `def search(nums, target):
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = left + (right - left) // 2
        if nums[mid] == target:
            return mid
        if nums[left] <= nums[mid]:
            if nums[left] <= target < nums[mid]:
                right = mid - 1
            else:
                left = mid + 1
        else:
            if nums[mid] < target <= nums[right]:
                left = mid + 1
            else:
                right = mid - 1
    return -1`,
  }),
  snippet({
    id: "lca-bst",
    title: "Lowest Common Ancestor — BST",
    pattern: "trees",
    difficulty: "medium",
    language: "python",
    tier: "interview-fluency",
    fluencyLevel: 3,
    motifs: ["tree-recursion"],
    prerequisites: ["max-depth"],
    leetcodeId: 235,
    code: `def lowestCommonAncestor(root, p, q):
    while root:
        if p.val < root.val and q.val < root.val:
            root = root.left
        elif p.val > root.val and q.val > root.val:
            root = root.right
        else:
            return root
    return None`,
  }),
  snippet({
    id: "validate-bst",
    title: "Validate Binary Search Tree",
    pattern: "trees",
    difficulty: "medium",
    language: "python",
    tier: "interview-fluency",
    fluencyLevel: 4,
    motifs: ["dfs-recursion", "tree-recursion"],
    prerequisites: ["lca-bst"],
    leetcodeId: 98,
    code: `def isValidBST(root):
    def dfs(node, low, high):
        if not node:
            return True
        if not (low < node.val < high):
            return False
        return dfs(node.left, low, node.val) and dfs(node.right, node.val, high)
    return dfs(root, float("-inf"), float("inf"))`,
  }),
  snippet({
    id: "coin-change",
    title: "Coin Change",
    pattern: "dynamic-programming",
    difficulty: "medium",
    language: "python",
    tier: "interview-fluency",
    fluencyLevel: 3,
    motifs: ["dp-tabulation"],
    prerequisites: ["climbing-stairs"],
    leetcodeId: 322,
    code: `def coinChange(coins, amount):
    dp = [float("inf")] * (amount + 1)
    dp[0] = 0
    for a in range(1, amount + 1):
        for c in coins:
            if c <= a:
                dp[a] = min(dp[a], dp[a - c] + 1)
    return dp[amount] if dp[amount] != float("inf") else -1`,
  }),
  snippet({
    id: "longest-increasing-subseq",
    title: "Longest Increasing Subsequence",
    pattern: "dynamic-programming",
    difficulty: "medium",
    language: "python",
    tier: "interview-fluency",
    fluencyLevel: 4,
    motifs: ["dp-tabulation", "binary-search-boundary"],
    leetcodeId: 300,
    code: `def lengthOfLIS(nums):
    tails = []
    for n in nums:
        lo, hi = 0, len(tails)
        while lo < hi:
            mid = lo + (hi - lo) // 2
            if tails[mid] < n:
                lo = mid + 1
            else:
                hi = mid
        if lo == len(tails):
            tails.append(n)
        else:
            tails[lo] = n
    return len(tails)`,
  }),
  snippet({
    id: "word-break",
    title: "Word Break",
    pattern: "dynamic-programming",
    difficulty: "medium",
    language: "python",
    tier: "interview-fluency",
    fluencyLevel: 3,
    motifs: ["dp-tabulation"],
    leetcodeId: 139,
    code: `def wordBreak(s, wordDict):
    words = set(wordDict)
    dp = [False] * (len(s) + 1)
    dp[0] = True
    for i in range(1, len(s) + 1):
        for j in range(i):
            if dp[j] and s[j:i] in words:
                dp[i] = True
                break
    return dp[len(s)]`,
  }),
  snippet({
    id: "merge-k-lists",
    title: "Merge K Sorted Lists",
    pattern: "heap",
    difficulty: "hard",
    language: "python",
    tier: "interview-fluency",
    fluencyLevel: 4,
    motifs: ["heap-push-pop"],
    prerequisites: ["kth-largest"],
    leetcodeId: 23,
    code: `import heapq

def mergeKLists(lists):
    heap = []
    for i, node in enumerate(lists):
        if node:
            heapq.heappush(heap, (node.val, i, node))
    dummy = curr = ListNode(0)
    while heap:
        _, i, node = heapq.heappop(heap)
        curr.next = node
        curr = curr.next
        if node.next:
            heapq.heappush(heap, (node.next.val, i, node.next))
    return dummy.next`,
  }),
  snippet({
    id: "subsets",
    title: "Subsets — Backtracking",
    pattern: "backtracking",
    difficulty: "medium",
    language: "python",
    tier: "interview-fluency",
    fluencyLevel: 2,
    motifs: ["backtrack-choose-explore-unchoose"],
    leetcodeId: 78,
    code: `def subsets(nums):
    result = []

    def backtrack(start, path):
        result.append(path[:])
        for i in range(start, len(nums)):
            path.append(nums[i])
            backtrack(i + 1, path)
            path.pop()

    backtrack(0, [])
    return result`,
  }),
  snippet({
    id: "permute",
    title: "Permutations",
    pattern: "backtracking",
    difficulty: "medium",
    language: "python",
    tier: "interview-fluency",
    fluencyLevel: 3,
    motifs: ["backtrack-choose-explore-unchoose"],
    prerequisites: ["subsets"],
    leetcodeId: 46,
    code: `def permute(nums):
    result = []

    def backtrack(path, used):
        if len(path) == len(nums):
            result.append(path[:])
            return
        for i, n in enumerate(nums):
            if used[i]:
                continue
            used[i] = True
            path.append(n)
            backtrack(path, used)
            path.pop()
            used[i] = False

    backtrack([], [False] * len(nums))
    return result`,
  }),
  snippet({
    id: "combination-sum",
    title: "Combination Sum",
    pattern: "backtracking",
    difficulty: "medium",
    language: "python",
    tier: "interview-fluency",
    fluencyLevel: 3,
    motifs: ["backtrack-choose-explore-unchoose"],
    prerequisites: ["subsets"],
    leetcodeId: 39,
    code: `def combinationSum(candidates, target):
    result = []

    def backtrack(start, path, total):
        if total == target:
            result.append(path[:])
            return
        if total > target:
            return
        for i in range(start, len(candidates)):
            path.append(candidates[i])
            backtrack(i, path, total + candidates[i])
            path.pop()

    backtrack(0, [], 0)
    return result`,
  }),
  snippet({
    id: "union-find",
    title: "Union Find — Path Compression",
    pattern: "union-find",
    difficulty: "medium",
    language: "python",
    tier: "interview-fluency",
    fluencyLevel: 3,
    motifs: ["union-find-compress"],
    leetcodeId: 684,
    code: `class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n

    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, a, b):
        ra, rb = self.find(a), self.find(b)
        if ra == rb:
            return False
        if self.rank[ra] < self.rank[rb]:
            ra, rb = rb, ra
        self.parent[rb] = ra
        if self.rank[ra] == self.rank[rb]:
            self.rank[ra] += 1
        return True`,
  }),
  snippet({
    id: "num-connected-components",
    title: "Number of Connected Components",
    pattern: "union-find",
    difficulty: "medium",
    language: "python",
    tier: "interview-fluency",
    fluencyLevel: 3,
    motifs: ["union-find-compress"],
    prerequisites: ["union-find"],
    leetcodeId: 323,
    code: `class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.count = n

    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, a, b):
        ra, rb = self.find(a), self.find(b)
        if ra == rb:
            return
        self.parent[rb] = ra
        self.count -= 1

def countComponents(n, edges):
    uf = UnionFind(n)
    for a, b in edges:
        uf.union(a, b)
    return uf.count`,
  }),
  snippet({
    id: "rotting-oranges",
    title: "Rotting Oranges — Multi-source BFS",
    pattern: "dfs-bfs",
    difficulty: "medium",
    language: "python",
    tier: "interview-fluency",
    fluencyLevel: 4,
    motifs: ["bfs-queue"],
    prerequisites: ["level-order-bfs"],
    leetcodeId: 994,
    code: `def orangesRotting(grid):
    rows, cols = len(grid), len(grid[0])
    queue = []
    fresh = 0
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 2:
                queue.append((r, c, 0))
            elif grid[r][c] == 1:
                fresh += 1
    minutes = 0
    while queue:
        r, c, t = queue.pop(0)
        minutes = max(minutes, t)
        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 1:
                grid[nr][nc] = 2
                fresh -= 1
                queue.append((nr, nc, t + 1))
    return minutes if fresh == 0 else -1`,
  }),
  snippet({
    id: "clone-graph",
    title: "Clone Graph",
    pattern: "graphs",
    difficulty: "medium",
    language: "python",
    tier: "interview-fluency",
    fluencyLevel: 3,
    motifs: ["dfs-recursion", "hash-lookup"],
    leetcodeId: 133,
    code: `def cloneGraph(node):
    if not node:
        return None
    clones = {}

    def dfs(n):
        if n in clones:
            return clones[n]
        copy = Node(n.val)
        clones[n] = copy
        for nei in n.neighbors:
            copy.neighbors.append(dfs(nei))
        return copy

    return dfs(node)`,
  }),
  snippet({
    id: "pacific-atlantic",
    title: "Pacific Atlantic Water Flow",
    pattern: "graphs",
    difficulty: "medium",
    language: "python",
    tier: "interview-fluency",
    fluencyLevel: 4,
    motifs: ["dfs-recursion"],
    leetcodeId: 417,
    code: `def pacificAtlantic(heights):
    if not heights:
        return []
    rows, cols = len(heights), len(heights[0])
    pac, atl = set(), set()

    def dfs(r, c, seen, prev):
        seen.add((r, c))
        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and (nr, nc) not in seen and heights[nr][nc] >= prev:
                dfs(nr, nc, seen, heights[nr][nc])

    for c in range(cols):
        dfs(0, c, pac, heights[0][c])
        dfs(rows - 1, c, atl, heights[rows - 1][c])
    for r in range(rows):
        dfs(r, 0, pac, heights[r][0])
        dfs(r, cols - 1, atl, heights[r][cols - 1])
    return list(pac & atl)`,
  }),
  snippet({
    id: "lru-cache",
    title: "LRU Cache",
    pattern: "hash-map",
    difficulty: "medium",
    language: "python",
    tier: "interview-fluency",
    fluencyLevel: 4,
    motifs: ["hash-lookup"],
    leetcodeId: 146,
    code: `from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity):
        self.cap = capacity
        self.cache = OrderedDict()

    def get(self, key):
        if key not in self.cache:
            return -1
        self.cache.move_to_end(key)
        return self.cache[key]

    def put(self, key, value):
        if key in self.cache:
            self.cache.move_to_end(key)
        self.cache[key] = value
        if len(self.cache) > self.cap:
            self.cache.popitem(last=False)`,
  }),
  snippet({
    id: "decode-string",
    title: "Decode String",
    pattern: "stack",
    difficulty: "medium",
    language: "python",
    tier: "interview-fluency",
    fluencyLevel: 4,
    motifs: ["stack-matching"],
    prerequisites: ["valid-parens"],
    leetcodeId: 394,
    code: `def decodeString(s):
    stack = []
    curr, num = "", 0
    for ch in s:
        if ch.isdigit():
            num = num * 10 + int(ch)
        elif ch == "[":
            stack.append((curr, num))
            curr, num = "", 0
        elif ch == "]":
            prev, k = stack.pop()
            curr = prev + curr * k
        else:
            curr += ch
    return curr`,
  }),
  snippet({
    id: "largest-rectangle",
    title: "Largest Rectangle in Histogram",
    pattern: "stack",
    difficulty: "hard",
    language: "python",
    tier: "interview-fluency",
    fluencyLevel: 5,
    motifs: ["monotonic-stack"],
    prerequisites: ["daily-temperatures"],
    leetcodeId: 84,
    code: `def largestRectangleArea(heights):
    stack = []
    best = 0
    heights.append(0)
    for i, h in enumerate(heights):
        while stack and heights[stack[-1]] > h:
            height = heights[stack.pop()]
            width = i if not stack else i - stack[-1] - 1
            best = max(best, height * width)
        stack.append(i)
    heights.pop()
    return best`,
  }),
  snippet({
    id: "edit-distance",
    title: "Edit Distance",
    pattern: "dynamic-programming",
    difficulty: "medium",
    language: "python",
    tier: "interview-fluency",
    fluencyLevel: 4,
    motifs: ["dp-tabulation"],
    leetcodeId: 72,
    code: `def minDistance(word1, word2):
    m, n = len(word1), len(word2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(m + 1):
        dp[i][0] = i
    for j in range(n + 1):
        dp[0][j] = j
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if word1[i - 1] == word2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1]
            else:
                dp[i][j] = 1 + min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
    return dp[m][n]`,
  }),
  snippet({
    id: "unique-paths",
    title: "Unique Paths",
    pattern: "dynamic-programming",
    difficulty: "medium",
    language: "python",
    tier: "interview-fluency",
    fluencyLevel: 2,
    motifs: ["dp-tabulation"],
    leetcodeId: 62,
    code: `def uniquePaths(m, n):
    dp = [1] * n
    for _ in range(1, m):
        for j in range(1, n):
            dp[j] += dp[j - 1]
    return dp[-1]`,
  }),
  snippet({
    id: "matrix-dfs-path",
    title: "Matrix DFS — All Paths",
    pattern: "backtracking",
    difficulty: "medium",
    language: "python",
    tier: "interview-fluency",
    fluencyLevel: 3,
    motifs: ["backtrack-choose-explore-unchoose", "dfs-recursion"],
    code: `def allPaths(m, n):
    result = []

    def dfs(r, c, path):
        if r == m - 1 and c == n - 1:
            result.append(path[:])
            return
        if r + 1 < m:
            path.append("D")
            dfs(r + 1, c, path)
            path.pop()
        if c + 1 < n:
            path.append("R")
            dfs(r, c + 1, path)
            path.pop()

    dfs(0, 0, [])
    return result`,
  }),
  snippet({
    id: "meeting-rooms-ii",
    title: "Meeting Rooms II",
    pattern: "heap",
    difficulty: "medium",
    language: "python",
    tier: "interview-fluency",
    fluencyLevel: 4,
    motifs: ["heap-push-pop", "interval-merge"],
    prerequisites: ["merge-intervals"],
    leetcodeId: 253,
    code: `import heapq

def minMeetingRooms(intervals):
    if not intervals:
        return 0
    intervals.sort(key=lambda x: x[0])
    heap = []
    for start, end in intervals:
        if heap and heap[0] <= start:
            heapq.heappop(heap)
        heapq.heappush(heap, end)
    return len(heap)`,
  }),
  snippet({
    id: "task-scheduler",
    title: "Task Scheduler",
    pattern: "heap",
    difficulty: "medium",
    language: "python",
    tier: "interview-fluency",
    fluencyLevel: 4,
    motifs: ["freq-counter", "heap-push-pop"],
    leetcodeId: 621,
    code: `def leastInterval(tasks, n):
    freq = {}
    for t in tasks:
        freq[t] = freq.get(t, 0) + 1
    max_freq = max(freq.values())
    max_count = sum(1 for v in freq.values() if v == max_freq)
    return max(len(tasks), (max_freq - 1) * (n + 1) + max_count)`,
  }),
  snippet({
    id: "serialize-tree",
    title: "Serialize / Deserialize Binary Tree",
    pattern: "trees",
    difficulty: "hard",
    language: "python",
    tier: "interview-fluency",
    fluencyLevel: 5,
    motifs: ["dfs-recursion", "tree-recursion"],
    leetcodeId: 297,
    code: `class Codec:
    def serialize(self, root):
        if not root:
            return "null"
        return f"{root.val},{self.serialize(root.left)},{self.serialize(root.right)}"

    def deserialize(self, data):
        vals = iter(data.split(","))

        def build():
            v = next(vals)
            if v == "null":
                return None
            node = TreeNode(int(v))
            node.left = build()
            node.right = build()
            return node

        return build()`,
  }),
  snippet({
    id: "koko-bananas",
    title: "Koko Eating Bananas",
    pattern: "binary-search",
    difficulty: "medium",
    language: "python",
    tier: "interview-fluency",
    fluencyLevel: 4,
    motifs: ["binary-search-answer"],
    prerequisites: ["sqrt-binary-search"],
    leetcodeId: 875,
    code: `def minEatingSpeed(piles, h):
    def hours(speed):
        return sum((p + speed - 1) // speed for p in piles)

    left, right = 1, max(piles)
    while left < right:
        mid = left + (right - left) // 2
        if hours(mid) <= h:
            right = mid
        else:
            left = mid + 1
    return left`,
  }),
  snippet({
    id: "two-sum-js",
    title: "Two Sum — JavaScript",
    pattern: "hash-map",
    difficulty: "easy",
    language: "javascript",
    tier: "interview-fluency",
    fluencyLevel: 1,
    motifs: ["hash-lookup"],
    leetcodeId: 1,
    code: `function twoSum(nums, target) {
    const seen = new Map();
    for (let i = 0; i < nums.length; i++) {
        const need = target - nums[i];
        if (seen.has(need)) return [seen.get(need), i];
        seen.set(nums[i], i);
    }
    return [];
}`,
  }),
  snippet({
    id: "bfs-js",
    title: "BFS — JavaScript",
    pattern: "dfs-bfs",
    difficulty: "medium",
    language: "javascript",
    tier: "interview-fluency",
    fluencyLevel: 2,
    motifs: ["bfs-queue", "hash-set-membership"],
    code: `function bfs(start, graph) {
    const queue = [start];
    const visited = new Set([start]);
    while (queue.length) {
        const node = queue.shift();
        for (const nei of graph[node] ?? []) {
            if (visited.has(nei)) continue;
            visited.add(nei);
            queue.push(nei);
        }
    }
    return visited;
}`,
  }),
];
