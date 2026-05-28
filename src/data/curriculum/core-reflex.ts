import { snippet } from "./builder";
import type { Snippet } from "@/lib/types";

/** Tier 1 — ~40 canonical reflex drills. Each teaches distinct syntax chunks. */
export const CORE_REFLEX_SNIPPETS: Snippet[] = [
  snippet({
    id: "two-sum",
    title: "Two Sum — Hash Map",
    pattern: "hash-map",
    difficulty: "easy",
    language: "python",
    tier: "core-reflex",
    fluencyLevel: 1,
    motifs: ["hash-lookup", "enumerate-index"],
    leetcodeId: 1,
    description: "Complement lookup — the foundational hash map reflex.",
    code: `def twoSum(nums, target):
    seen = {}
    for i, n in enumerate(nums):
        if target - n in seen:
            return [seen[target - n], i]
        seen[n] = i
    return []`,
  }),
  snippet({
    id: "contains-duplicate",
    title: "Contains Duplicate",
    pattern: "hash-map",
    difficulty: "easy",
    language: "python",
    tier: "core-reflex",
    fluencyLevel: 1,
    motifs: ["hash-set-membership"],
    leetcodeId: 217,
    code: `def containsDuplicate(nums):
    seen = set()
    for n in nums:
        if n in seen:
            return True
        seen.add(n)
    return False`,
  }),
  snippet({
    id: "valid-anagram",
    title: "Valid Anagram",
    pattern: "hash-map",
    difficulty: "easy",
    language: "python",
    tier: "core-reflex",
    fluencyLevel: 2,
    motifs: ["freq-counter"],
    prerequisites: ["two-sum"],
    leetcodeId: 242,
    code: `def isAnagram(s, t):
    if len(s) != len(t):
        return False
    count = {}
    for c in s:
        count[c] = count.get(c, 0) + 1
    for c in t:
        if c not in count:
            return False
        count[c] -= 1
    return all(v == 0 for v in count.values())`,
  }),
  snippet({
    id: "valid-parens",
    title: "Valid Parentheses",
    pattern: "stack",
    difficulty: "easy",
    language: "python",
    tier: "core-reflex",
    fluencyLevel: 1,
    motifs: ["stack-matching"],
    leetcodeId: 20,
    code: `def isValid(s):
    stack = []
    pairs = {")": "(", "]": "[", "}": "{"}
    for ch in s:
        if ch in pairs:
            if not stack or stack.pop() != pairs[ch]:
                return False
        else:
            stack.append(ch)
    return not stack`,
  }),
  snippet({
    id: "binary-search-basic",
    title: "Binary Search",
    pattern: "binary-search",
    difficulty: "easy",
    language: "python",
    tier: "core-reflex",
    fluencyLevel: 1,
    motifs: ["binary-search-mid"],
    variant: "exact-search",
    leetcodeId: 704,
    code: `def search(nums, target):
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = left + (right - left) // 2
        if nums[mid] == target:
            return mid
        if nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1`,
  }),
  snippet({
    id: "search-insert",
    title: "Search Insert Position",
    pattern: "binary-search",
    difficulty: "easy",
    language: "python",
    tier: "core-reflex",
    fluencyLevel: 2,
    motifs: ["binary-search-boundary"],
    variant: "lower-bound",
    prerequisites: ["binary-search-basic"],
    leetcodeId: 35,
    code: `def searchInsert(nums, target):
    left, right = 0, len(nums)
    while left < right:
        mid = left + (right - left) // 2
        if nums[mid] < target:
            left = mid + 1
        else:
            right = mid
    return left`,
  }),
  snippet({
    id: "invert-tree",
    title: "Invert Binary Tree",
    pattern: "trees",
    difficulty: "easy",
    language: "python",
    tier: "core-reflex",
    fluencyLevel: 1,
    motifs: ["tree-recursion"],
    leetcodeId: 226,
    code: `def invertTree(root):
    if not root:
        return None
    root.left, root.right = invertTree(root.right), invertTree(root.left)
    return root`,
  }),
  snippet({
    id: "max-depth",
    title: "Maximum Depth of Binary Tree",
    pattern: "trees",
    difficulty: "easy",
    language: "python",
    tier: "core-reflex",
    fluencyLevel: 1,
    motifs: ["tree-recursion"],
    prerequisites: ["invert-tree"],
    leetcodeId: 104,
    code: `def maxDepth(root):
    if not root:
        return 0
    return 1 + max(maxDepth(root.left), maxDepth(root.right))`,
  }),
  snippet({
    id: "inorder-traversal",
    title: "Binary Tree Inorder DFS",
    pattern: "trees",
    difficulty: "easy",
    language: "python",
    tier: "core-reflex",
    fluencyLevel: 2,
    motifs: ["dfs-recursion", "tree-recursion"],
    prerequisites: ["max-depth"],
    leetcodeId: 94,
    code: `def inorderTraversal(root):
    result = []

    def dfs(node):
        if not node:
            return
        dfs(node.left)
        result.append(node.val)
        dfs(node.right)

    dfs(root)
    return result`,
  }),
  snippet({
    id: "flood-fill",
    title: "Flood Fill — Grid DFS",
    pattern: "dfs-bfs",
    difficulty: "easy",
    language: "python",
    tier: "core-reflex",
    fluencyLevel: 2,
    motifs: ["dfs-recursion"],
    leetcodeId: 733,
    code: `def floodFill(image, sr, sc, color):
    orig = image[sr][sc]
    if orig == color:
        return image

    def dfs(r, c):
        if r < 0 or c < 0 or r >= len(image) or c >= len(image[0]):
            return
        if image[r][c] != orig:
            return
        image[r][c] = color
        dfs(r + 1, c)
        dfs(r - 1, c)
        dfs(r, c + 1)
        dfs(r, c - 1)

    dfs(sr, sc)
    return image`,
  }),
  snippet({
    id: "longest-substring",
    title: "Longest Substring Without Repeating",
    pattern: "sliding-window",
    difficulty: "medium",
    language: "python",
    tier: "core-reflex",
    fluencyLevel: 2,
    motifs: ["sliding-window-expand", "hash-lookup"],
    leetcodeId: 3,
    code: `def lengthOfLongestSubstring(s):
    seen = {}
    left = 0
    best = 0
    for right, ch in enumerate(s):
        if ch in seen and seen[ch] >= left:
            left = seen[ch] + 1
        seen[ch] = right
        best = max(best, right - left + 1)
    return best`,
  }),
  snippet({
    id: "max-consecutive-ones",
    title: "Max Consecutive Ones III",
    pattern: "sliding-window",
    difficulty: "medium",
    language: "python",
    tier: "core-reflex",
    fluencyLevel: 3,
    motifs: ["sliding-window-contract"],
    prerequisites: ["longest-substring"],
    leetcodeId: 1004,
    code: `def longestOnes(nums, k):
    left = zeros = 0
    best = 0
    for right, val in enumerate(nums):
        if val == 0:
            zeros += 1
        while zeros > k:
            if nums[left] == 0:
                zeros -= 1
            left += 1
        best = max(best, right - left + 1)
    return best`,
  }),
  snippet({
    id: "two-sum-ii",
    title: "Two Sum II — Sorted",
    pattern: "two-pointers",
    difficulty: "medium",
    language: "python",
    tier: "core-reflex",
    fluencyLevel: 2,
    motifs: ["two-pointer-converge"],
    prerequisites: ["two-sum"],
    leetcodeId: 167,
    code: `def twoSum(numbers, target):
    left, right = 0, len(numbers) - 1
    while left < right:
        total = numbers[left] + numbers[right]
        if total == target:
            return [left + 1, right + 1]
        if total < target:
            left += 1
        else:
            right -= 1
    return []`,
  }),
  snippet({
    id: "merge-sorted-array",
    title: "Merge Sorted Array",
    pattern: "two-pointers",
    difficulty: "easy",
    language: "python",
    tier: "core-reflex",
    fluencyLevel: 2,
    motifs: ["two-pointer-chase"],
    leetcodeId: 88,
    code: `def merge(nums1, m, nums2, n):
    i, j, k = m - 1, n - 1, m + n - 1
    while j >= 0:
        if i >= 0 and nums1[i] > nums2[j]:
            nums1[k] = nums1[i]
            i -= 1
        else:
            nums1[k] = nums2[j]
            j -= 1
        k -= 1`,
  }),
  snippet({
    id: "number-of-islands",
    title: "Number of Islands — DFS",
    pattern: "dfs-bfs",
    difficulty: "medium",
    language: "python",
    tier: "core-reflex",
    fluencyLevel: 3,
    motifs: ["dfs-recursion"],
    prerequisites: ["flood-fill"],
    leetcodeId: 200,
    code: `def numIslands(grid):
    if not grid:
        return 0
    rows, cols = len(grid), len(grid[0])
    count = 0

    def dfs(r, c):
        if r < 0 or c < 0 or r >= rows or c >= cols or grid[r][c] != "1":
            return
        grid[r][c] = "0"
        dfs(r + 1, c)
        dfs(r - 1, c)
        dfs(r, c + 1)
        dfs(r, c - 1)

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == "1":
                count += 1
                dfs(r, c)
    return count`,
  }),
  snippet({
    id: "bfs-graph-template",
    title: "BFS Graph Template",
    pattern: "dfs-bfs",
    difficulty: "medium",
    language: "python",
    tier: "core-reflex",
    fluencyLevel: 2,
    motifs: ["bfs-queue", "hash-set-membership"],
    code: `def bfs(start, graph):
    queue = [start]
    visited = {start}
    while queue:
        node = queue.pop(0)
        for nei in graph.get(node, []):
            if nei in visited:
                continue
            visited.add(nei)
            queue.append(nei)
    return visited`,
  }),
  snippet({
    id: "kth-largest",
    title: "Kth Largest Element — Heap",
    pattern: "heap",
    difficulty: "medium",
    language: "python",
    tier: "core-reflex",
    fluencyLevel: 2,
    motifs: ["heap-push-pop"],
    leetcodeId: 215,
    code: `import heapq

def findKthLargest(nums, k):
    heap = []
    for n in nums:
        heapq.heappush(heap, n)
        if len(heap) > k:
            heapq.heappop(heap)
    return heap[0]`,
  }),
  snippet({
    id: "climbing-stairs",
    title: "Climbing Stairs — DP",
    pattern: "dynamic-programming",
    difficulty: "easy",
    language: "python",
    tier: "core-reflex",
    fluencyLevel: 1,
    motifs: ["dp-tabulation"],
    leetcodeId: 70,
    code: `def climbStairs(n):
    if n <= 2:
        return n
    prev, curr = 1, 2
    for _ in range(3, n + 1):
        prev, curr = curr, prev + curr
    return curr`,
  }),
  snippet({
    id: "max-subarray",
    title: "Maximum Subarray — Kadane",
    pattern: "arrays",
    difficulty: "medium",
    language: "python",
    tier: "core-reflex",
    fluencyLevel: 2,
    motifs: ["greedy-local"],
    leetcodeId: 53,
    code: `def maxSubArray(nums):
    best = curr = nums[0]
    for n in nums[1:]:
        curr = max(n, curr + n)
        best = max(best, curr)
    return best`,
  }),
  snippet({
    id: "product-except-self",
    title: "Product of Array Except Self",
    pattern: "arrays",
    difficulty: "medium",
    language: "python",
    tier: "core-reflex",
    fluencyLevel: 3,
    motifs: ["prefix-sum", "suffix-pass"],
    leetcodeId: 238,
    code: `def productExceptSelf(nums):
    n = len(nums)
    answer = [1] * n
    prefix = 1
    for i in range(n):
        answer[i] = prefix
        prefix *= nums[i]
    suffix = 1
    for i in range(n - 1, -1, -1):
        answer[i] *= suffix
        suffix *= nums[i]
    return answer`,
  }),
  snippet({
    id: "best-time-stock",
    title: "Best Time to Buy and Sell Stock",
    pattern: "arrays",
    difficulty: "easy",
    language: "python",
    tier: "core-reflex",
    fluencyLevel: 2,
    motifs: ["greedy-local"],
    leetcodeId: 121,
    code: `def maxProfit(prices):
    min_price = float("inf")
    best = 0
    for p in prices:
        min_price = min(min_price, p)
        best = max(best, p - min_price)
    return best`,
  }),
  snippet({
    id: "merge-intervals",
    title: "Merge Intervals",
    pattern: "arrays",
    difficulty: "medium",
    language: "python",
    tier: "core-reflex",
    fluencyLevel: 3,
    motifs: ["interval-merge"],
    leetcodeId: 56,
    code: `def merge(intervals):
    intervals.sort(key=lambda x: x[0])
    merged = [intervals[0]]
    for start, end in intervals[1:]:
        if start <= merged[-1][1]:
            merged[-1][1] = max(merged[-1][1], end)
        else:
            merged.append([start, end])
    return merged`,
  }),
  snippet({
    id: "reverse-linked-list",
    title: "Reverse Linked List",
    pattern: "arrays",
    difficulty: "easy",
    language: "python",
    tier: "core-reflex",
    fluencyLevel: 2,
    motifs: ["linked-list-pointer"],
    leetcodeId: 206,
    code: `def reverseList(head):
    prev = None
    curr = head
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    return prev`,
  }),
  snippet({
    id: "linked-list-cycle",
    title: "Linked List Cycle — Fast/Slow",
    pattern: "two-pointers",
    difficulty: "easy",
    language: "python",
    tier: "core-reflex",
    fluencyLevel: 3,
    motifs: ["two-pointer-chase"],
    prerequisites: ["reverse-linked-list"],
    leetcodeId: 141,
    code: `def hasCycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:
            return True
    return False`,
  }),
  snippet({
    id: "defaultdict-grouping",
    title: "Group By Key — defaultdict",
    pattern: "hash-map",
    difficulty: "medium",
    language: "python",
    tier: "core-reflex",
    fluencyLevel: 3,
    motifs: ["counter-defaultdict"],
    prerequisites: ["valid-anagram"],
    code: `from collections import defaultdict

def groupByKey(items, key_fn):
    groups = defaultdict(list)
    for item in items:
        groups[key_fn(item)].append(item)
    return dict(groups)`,
  }),
  snippet({
    id: "deque-sliding-max",
    title: "Sliding Window Maximum — Deque",
    pattern: "sliding-window",
    difficulty: "hard",
    language: "python",
    tier: "core-reflex",
    fluencyLevel: 4,
    motifs: ["deque-window", "monotonic-stack"],
    prerequisites: ["max-consecutive-ones"],
    leetcodeId: 239,
    code: `from collections import deque

def maxSlidingWindow(nums, k):
    dq = deque()
    result = []
    for i, n in enumerate(nums):
        while dq and dq[0] <= i - k:
            dq.popleft()
        while dq and nums[dq[-1]] <= n:
            dq.pop()
        dq.append(i)
        if i >= k - 1:
            result.append(nums[dq[0]])
    return result`,
  }),
  snippet({
    id: "subarray-sum-k",
    title: "Subarray Sum Equals K",
    pattern: "hash-map",
    difficulty: "medium",
    language: "python",
    tier: "core-reflex",
    fluencyLevel: 3,
    motifs: ["prefix-sum", "hash-lookup"],
    leetcodeId: 560,
    code: `def subarraySum(nums, k):
    count = 0
    prefix = 0
    seen = {0: 1}
    for n in nums:
        prefix += n
        count += seen.get(prefix - k, 0)
        seen[prefix] = seen.get(prefix, 0) + 1
    return count`,
  }),
  snippet({
    id: "daily-temperatures",
    title: "Daily Temperatures — Monotonic Stack",
    pattern: "stack",
    difficulty: "medium",
    language: "python",
    tier: "core-reflex",
    fluencyLevel: 3,
    motifs: ["monotonic-stack"],
    prerequisites: ["valid-parens"],
    leetcodeId: 739,
    code: `def dailyTemperatures(temps):
    stack = []
    answer = [0] * len(temps)
    for i, t in enumerate(temps):
        while stack and temps[stack[-1]] < t:
            j = stack.pop()
            answer[j] = i - j
        stack.append(i)
    return answer`,
  }),
  snippet({
    id: "rotate-array",
    title: "Rotate Array",
    pattern: "arrays",
    difficulty: "medium",
    language: "python",
    tier: "core-reflex",
    fluencyLevel: 3,
    motifs: ["two-pointer-chase"],
    leetcodeId: 189,
    code: `def rotate(nums, k):
    k %= len(nums)

    def reverse(l, r):
        while l < r:
            nums[l], nums[r] = nums[r], nums[l]
            l += 1
            r -= 1

    reverse(0, len(nums) - 1)
    reverse(0, k - 1)
    reverse(k, len(nums) - 1)`,
  }),
  snippet({
    id: "same-tree",
    title: "Same Tree",
    pattern: "trees",
    difficulty: "easy",
    language: "python",
    tier: "core-reflex",
    fluencyLevel: 2,
    motifs: ["tree-recursion"],
    prerequisites: ["max-depth"],
    leetcodeId: 100,
    code: `def isSameTree(p, q):
    if not p and not q:
        return True
    if not p or not q:
        return False
    return p.val == q.val and isSameTree(p.left, q.left) and isSameTree(p.right, q.right)`,
  }),
  snippet({
    id: "symmetric-tree",
    title: "Symmetric Tree",
    pattern: "trees",
    difficulty: "easy",
    language: "python",
    tier: "core-reflex",
    fluencyLevel: 3,
    motifs: ["tree-recursion", "dfs-recursion"],
    prerequisites: ["same-tree"],
    leetcodeId: 101,
    code: `def isSymmetric(root):
    def mirror(a, b):
        if not a and not b:
            return True
        if not a or not b:
            return False
        return a.val == b.val and mirror(a.left, b.right) and mirror(a.right, b.left)
    return mirror(root, root)`,
  }),
  snippet({
    id: "min-stack",
    title: "Min Stack",
    pattern: "stack",
    difficulty: "medium",
    language: "python",
    tier: "core-reflex",
    fluencyLevel: 3,
    motifs: ["stack-matching"],
    leetcodeId: 155,
    code: `class MinStack:
    def __init__(self):
        self.stack = []
        self.mins = []

    def push(self, val):
        self.stack.append(val)
        self.mins.append(val if not self.mins else min(val, self.mins[-1]))

    def pop(self):
        self.stack.pop()
        self.mins.pop()

    def top(self):
        return self.stack[-1]

    def getMin(self):
        return self.mins[-1]`,
  }),
  snippet({
    id: "ransom-note",
    title: "Ransom Note",
    pattern: "hash-map",
    difficulty: "easy",
    language: "python",
    tier: "core-reflex",
    fluencyLevel: 2,
    motifs: ["freq-counter"],
    leetcodeId: 383,
    code: `def canConstruct(ransomNote, magazine):
    count = {}
    for c in magazine:
        count[c] = count.get(c, 0) + 1
    for c in ransomNote:
        if count.get(c, 0) == 0:
            return False
        count[c] -= 1
    return True`,
  }),
  snippet({
    id: "move-zeroes",
    title: "Move Zeroes",
    pattern: "two-pointers",
    difficulty: "easy",
    language: "python",
    tier: "core-reflex",
    fluencyLevel: 2,
    motifs: ["two-pointer-chase"],
    leetcodeId: 283,
    code: `def moveZeroes(nums):
    write = 0
    for n in nums:
        if n != 0:
            nums[write] = n
            write += 1
    for i in range(write, len(nums)):
        nums[i] = 0`,
  }),
  snippet({
    id: "palindrome-linked-list",
    title: "Palindrome Linked List",
    pattern: "two-pointers",
    difficulty: "easy",
    language: "python",
    tier: "core-reflex",
    fluencyLevel: 4,
    motifs: ["two-pointer-chase", "linked-list-pointer"],
    prerequisites: ["reverse-linked-list", "linked-list-cycle"],
    leetcodeId: 234,
    code: `def isPalindrome(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    prev = None
    while slow:
        nxt = slow.next
        slow.next = prev
        prev = slow
        slow = nxt
    while prev:
        if head.val != prev.val:
            return False
        head = head.next
        prev = prev.next
    return True`,
  }),
  snippet({
    id: "sqrt-binary-search",
    title: "Sqrt(x) — Binary Search on Answer",
    pattern: "binary-search",
    difficulty: "easy",
    language: "python",
    tier: "core-reflex",
    fluencyLevel: 3,
    motifs: ["binary-search-answer"],
    prerequisites: ["search-insert"],
    leetcodeId: 69,
    code: `def mySqrt(x):
    if x < 2:
        return x
    left, right = 2, x // 2
    while left <= right:
        mid = left + (right - left) // 2
        if mid * mid == x:
            return mid
        if mid * mid < x:
            left = mid + 1
        else:
            right = mid - 1
    return right`,
  }),
  snippet({
    id: "level-order-bfs",
    title: "BFS Level Order",
    pattern: "dfs-bfs",
    difficulty: "medium",
    language: "python",
    tier: "core-reflex",
    fluencyLevel: 3,
    motifs: ["bfs-queue", "tree-recursion"],
    prerequisites: ["bfs-graph-template"],
    leetcodeId: 102,
    code: `def levelOrder(root):
    if not root:
        return []
    queue = [root]
    result = []
    while queue:
        level = []
        for _ in range(len(queue)):
            node = queue.pop(0)
            level.append(node.val)
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        result.append(level)
    return result`,
  }),
  snippet({
    id: "house-robber",
    title: "House Robber",
    pattern: "dynamic-programming",
    difficulty: "medium",
    language: "python",
    tier: "core-reflex",
    fluencyLevel: 3,
    motifs: ["dp-tabulation"],
    prerequisites: ["climbing-stairs"],
    leetcodeId: 198,
    code: `def rob(nums):
    prev2 = prev1 = 0
    for n in nums:
        prev2, prev1 = prev1, max(prev1, prev2 + n)
    return prev1`,
  }),
  snippet({
    id: "course-schedule",
    title: "Course Schedule — Topo Sort",
    pattern: "graphs",
    difficulty: "medium",
    language: "python",
    tier: "core-reflex",
    fluencyLevel: 4,
    motifs: ["topological-sort", "graph-adjacency"],
    prerequisites: ["bfs-graph-template"],
    leetcodeId: 207,
    code: `def canFinish(numCourses, prerequisites):
    graph = [[] for _ in range(numCourses)]
    indegree = [0] * numCourses
    for a, b in prerequisites:
        graph[b].append(a)
        indegree[a] += 1
    queue = [i for i, d in enumerate(indegree) if d == 0]
    seen = 0
    while queue:
        node = queue.pop()
        seen += 1
        for nxt in graph[node]:
            indegree[nxt] -= 1
            if indegree[nxt] == 0:
                queue.append(nxt)
    return seen == numCourses`,
  }),
];
