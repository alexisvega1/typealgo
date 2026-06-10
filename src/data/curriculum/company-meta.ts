import { snippet } from "./builder";
import type { Snippet } from "@/lib/types";

/** Meta track — classic speed drills, original phrasing only (June 2026 spec). */
export const META_SNIPPETS: Snippet[] = [
  snippet({
    id: "meta-balanced-brackets",
    title: "Balanced Bracket Checker",
    pattern: "stack",
    difficulty: "easy",
    language: "python",
    tier: "interview-fluency",
    fluencyLevel: 2,
    motifs: ["stack-matching"],
    packIds: ["company-meta"],
    tracks: ["meta"],
    levelRange: ["junior"],
    format: "classic",
    sourceStyle: "Meta E3 stack scan for matching open/close pairs.",
    description: "Return whether a string of (), {}, and [] brackets is properly nested.",
    code: `def is_balanced(s: str) -> bool:
    pairs = {")": "(", "]": "[", "}": "{"}
    stack: list[str] = []
    for ch in s:
        if ch in "([{":
            stack.append(ch)
        elif ch in ")]}":
            if not stack or stack[-1] != pairs[ch]:
                return False
            stack.pop()
    return not stack`,
  }),
  snippet({
    id: "meta-two-sum-indices",
    title: "Indices That Sum to Target",
    pattern: "hash-map",
    difficulty: "easy",
    language: "python",
    tier: "interview-fluency",
    fluencyLevel: 2,
    motifs: ["hash-lookup"],
    packIds: ["company-meta"],
    tracks: ["meta"],
    levelRange: ["junior"],
    format: "classic",
    sourceStyle: "Meta E3 one-pass complement lookup.",
    description: "Find two distinct indices whose values add up to the target.",
    code: `def two_indices(nums: list[int], target: int) -> tuple[int, int]:
    seen: dict[int, int] = {}
    for i, n in enumerate(nums):
        need = target - n
        if need in seen:
            return seen[need], i
        seen[n] = i
    raise ValueError("no pair")`,
  }),
  snippet({
    id: "meta-rolling-average",
    title: "Rolling Average Stream",
    pattern: "sliding-window",
    difficulty: "easy",
    language: "python",
    tier: "interview-fluency",
    fluencyLevel: 2,
    motifs: ["sliding-window-expand"],
    packIds: ["company-meta"],
    tracks: ["meta"],
    levelRange: ["junior"],
    format: "classic",
    sourceStyle: "Meta E3 fixed-window mean after each append.",
    description: "Maintain the mean of the last k values as new numbers arrive.",
    code: `from collections import deque

class RollingAverage:
    def __init__(self, window: int) -> None:
        self._window = window
        self._buf: deque[float] = deque()
        self._sum = 0.0

    def add(self, value: float) -> float | None:
        self._buf.append(value)
        self._sum += value
        if len(self._buf) > self._window:
            self._sum -= self._buf.popleft()
        if len(self._buf) < self._window:
            return None
        return self._sum / self._window`,
  }),
  snippet({
    id: "meta-k-closest-points",
    title: "K Nearest Points by Distance",
    pattern: "heap",
    difficulty: "medium",
    language: "python",
    tier: "interview-fluency",
    fluencyLevel: 3,
    motifs: ["heap-push-pop"],
    packIds: ["company-meta"],
    tracks: ["meta"],
    levelRange: ["mid"],
    format: "classic",
    sourceStyle: "Meta E4 max-heap trim to k smallest squared distances.",
    description: "Return the k coordinate pairs closest to the origin.",
    code: `import heapq

def k_closest(points: list[list[int]], k: int) -> list[list[int]]:
    heap: list[tuple[int, list[int]]] = []
    for x, y in points:
        dist = x * x + y * y
        heapq.heappush(heap, (-dist, [x, y]))
        if len(heap) > k:
            heapq.heappop(heap)
    return [p for _, p in heap]`,
  }),
  snippet({
    id: "meta-subarray-sum-k",
    title: "Count Subarrays Summing to K",
    pattern: "hash-map",
    difficulty: "medium",
    language: "python",
    tier: "interview-fluency",
    fluencyLevel: 3,
    motifs: ["prefix-sum"],
    packIds: ["company-meta"],
    tracks: ["meta"],
    levelRange: ["mid"],
    format: "classic",
    sourceStyle: "Meta E4 prefix-sum frequency map.",
    description: "Count contiguous slices whose elements add up to k.",
    code: `def subarray_sum_count(nums: list[int], k: int) -> int:
    prefix = 0
    freq: dict[int, int] = {0: 1}
    count = 0
    for n in nums:
        prefix += n
        count += freq.get(prefix - k, 0)
        freq[prefix] = freq.get(prefix, 0) + 1
    return count`,
  }),
  snippet({
    id: "meta-lowest-common-ancestor",
    title: "Lowest Common Ancestor in Binary Tree",
    pattern: "trees",
    difficulty: "medium",
    language: "python",
    tier: "interview-fluency",
    fluencyLevel: 3,
    motifs: ["tree-recursion"],
    packIds: ["company-meta"],
    tracks: ["meta"],
    levelRange: ["mid"],
    format: "classic",
    sourceStyle: "Meta E4 recursive LCA with early return on match.",
    description: "Find the deepest node that is an ancestor of both p and q.",
    code: `class TreeNode:
    def __init__(self, val: int = 0, left=None, right=None) -> None:
        self.val = val
        self.left = left
        self.right = right

def lowest_common_ancestor(root: TreeNode, p: TreeNode, q: TreeNode) -> TreeNode:
    if root is None or root is p or root is q:
        return root
    left = lowest_common_ancestor(root.left, p, q)
    right = lowest_common_ancestor(root.right, p, q)
    if left and right:
        return root
    return left or right`,
  }),
  snippet({
    id: "meta-merge-k-sorted",
    title: "Merge K Sorted Lists",
    pattern: "heap",
    difficulty: "hard",
    language: "python",
    tier: "interview-fluency",
    fluencyLevel: 4,
    motifs: ["heap-push-pop"],
    packIds: ["company-meta"],
    tracks: ["meta"],
    levelRange: ["senior"],
    format: "classic",
    sourceStyle: "Meta E5 min-heap sweep across list heads.",
    description: "Combine k ascending linked lists into one sorted list.",
    code: `import heapq

class ListNode:
    def __init__(self, val: int = 0, nxt=None) -> None:
        self.val = val
        self.next = nxt

def merge_k_lists(lists: list[ListNode | None]) -> ListNode | None:
    heap: list[tuple[int, int, ListNode]] = []
    for i, node in enumerate(lists):
        if node:
            heapq.heappush(heap, (node.val, i, node))
    dummy = ListNode()
    tail = dummy
    while heap:
        val, i, node = heapq.heappop(heap)
        tail.next = node
        tail = tail.next
        if node.next:
            heapq.heappush(heap, (node.next.val, i, node.next))
    return dummy.next`,
  }),
  snippet({
    id: "meta-tree-max-path",
    title: "Maximum Path Sum in Binary Tree",
    pattern: "trees",
    difficulty: "hard",
    language: "python",
    tier: "interview-fluency",
    fluencyLevel: 4,
    motifs: ["tree-recursion"],
    packIds: ["company-meta"],
    tracks: ["meta"],
    levelRange: ["senior"],
    format: "classic",
    sourceStyle: "Meta E5 post-order gain with global best path.",
    description: "Return the largest sum of any downward path through the tree.",
    code: `class TreeNode:
    def __init__(self, val: int = 0, left=None, right=None) -> None:
        self.val = val
        self.left = left
        self.right = right

def max_path_sum(root: TreeNode) -> int:
    best = float("-inf")

    def gain(node: TreeNode | None) -> int:
        nonlocal best
        if node is None:
            return 0
        left = max(gain(node.left), 0)
        right = max(gain(node.right), 0)
        best = max(best, node.val + left + right)
        return node.val + max(left, right)

    gain(root)
    return int(best)`,
  }),
  snippet({
    id: "meta-add-operators",
    title: "Insert Operators to Reach Target",
    pattern: "backtracking",
    difficulty: "hard",
    language: "python",
    tier: "interview-fluency",
    fluencyLevel: 4,
    motifs: ["backtrack-choose-explore-unchoose"],
    packIds: ["company-meta"],
    tracks: ["meta"],
    levelRange: ["senior"],
    format: "classic",
    sourceStyle: "Meta E5 DFS over digit splits with + and - only.",
    description: "Insert plus or minus between digits so the expression equals target.",
    code: `def add_operators(num: str, target: int) -> list[str]:
    results: list[str] = []

    def dfs(index: int, path: str, value: int, prev: int) -> None:
        if index == len(num):
            if value == target:
                results.append(path)
            return
        for end in range(index + 1, len(num) + 1):
            chunk = num[index:end]
            if len(chunk) > 1 and chunk[0] == "0":
                break
            n = int(chunk)
            if index == 0:
                dfs(end, chunk, n, n)
            else:
                dfs(end, path + "+" + chunk, value + n, n)
                dfs(end, path + "-" + chunk, value - n, -n)

    dfs(0, "", 0, 0)
    return results`,
  }),
];
