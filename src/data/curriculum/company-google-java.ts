import { languageMirrorId, snippet } from "./builder";

/** Google track — Java mirrors of Python classic pool (Run A). */
export const GOOGLE_JAVA_SNIPPETS = [
  snippet({
    id: languageMirrorId("google-merge-sorted-arrays", "java"),
    title: "Merge Two Sorted Arrays",
    pattern: "two-pointers",
    difficulty: "medium",
    language: "java",
    tier: "interview-fluency",
    fluencyLevel: 2,
    motifs: ["two-pointer-chase"],
    packIds: ["company-google"],
    tracks: ["google"],
    levelRange: ["junior"],
    format: "classic",
    sourceStyle: "Google L3 two-pointer merge (Java).",
    description: "Linear merge of two ascending arrays with trailing pointers.",
    variantOf: "google-merge-sorted-arrays",
    code: `List<Integer> mergeSorted(int[] a, int[] b) {
    int i = 0, j = 0;
    List<Integer> out = new ArrayList<>();
    while (i < a.length && j < b.length) {
        if (a[i] <= b[j]) {
            out.add(a[i++]);
        } else {
            out.add(b[j++]);
        }
    }
    while (i < a.length) out.add(a[i++]);
    while (j < b.length) out.add(b[j++]);
    return out;
}`,
  }),
  snippet({
    id: languageMirrorId("google-grid-bfs", "java"),
    title: "Grid Shortest Path (BFS)",
    pattern: "dfs-bfs",
    difficulty: "medium",
    language: "java",
    tier: "interview-fluency",
    fluencyLevel: 2,
    motifs: ["bfs-queue"],
    packIds: ["company-google"],
    tracks: ["google"],
    levelRange: ["junior"],
    format: "classic",
    sourceStyle: "Google L3 grid BFS (Java).",
    description: "Return shortest steps from top-left to bottom-right in a binary grid.",
    variantOf: "google-grid-bfs",
    code: `int shortestPathGrid(int[][] grid) {
    if (grid.length == 0 || grid[0].length == 0) return -1;
    int rows = grid.length, cols = grid[0].length;
    if (grid[0][0] == 1 || grid[rows - 1][cols - 1] == 1) return -1;
    ArrayDeque<int[]> q = new ArrayDeque<>();
    q.add(new int[] {0, 0, 0});
    boolean[][] seen = new boolean[rows][cols];
    seen[0][0] = true;
    int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
    while (!q.isEmpty()) {
        int[] cur = q.poll();
        int r = cur[0], c = cur[1], steps = cur[2];
        if (r == rows - 1 && c == cols - 1) return steps;
        for (int[] d : dirs) {
            int nr = r + d[0], nc = c + d[1];
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols
                    && grid[nr][nc] == 0 && !seen[nr][nc]) {
                seen[nr][nc] = true;
                q.add(new int[] {nr, nc, steps + 1});
            }
        }
    }
    return -1;
}`,
  }),
  snippet({
    id: languageMirrorId("google-binary-search-capacity", "java"),
    title: "Binary Search on Answer — Ship Capacity",
    pattern: "binary-search",
    difficulty: "medium",
    language: "java",
    tier: "interview-fluency",
    fluencyLevel: 2,
    motifs: ["binary-search-answer"],
    packIds: ["company-google"],
    tracks: ["google"],
    levelRange: ["junior"],
    format: "classic",
    sourceStyle: "Google L3 binary search on capacity (Java).",
    description: "Minimum capacity to ship weights within D days.",
    variantOf: "google-binary-search-capacity",
    code: `int minCapacity(int[] weights, int days) {
    int lo = 0, hi = 0;
    for (int w : weights) {
        lo = Math.max(lo, w);
        hi += w;
    }
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (canShip(weights, days, mid)) hi = mid;
        else lo = mid + 1;
    }
    return lo;
}

boolean canShip(int[] weights, int days, int cap) {
    int used = 1, load = 0;
    for (int w : weights) {
        if (load + w > cap) {
            used++;
            load = 0;
        }
        load += w;
    }
    return used <= days;
}`,
  }),
  snippet({
    id: languageMirrorId("google-topological-sort", "java"),
    title: "Topological Sort (Kahn)",
    pattern: "graphs",
    difficulty: "medium",
    language: "java",
    tier: "interview-fluency",
    fluencyLevel: 3,
    motifs: ["graph-adjacency"],
    packIds: ["company-google"],
    tracks: ["google"],
    levelRange: ["mid"],
    format: "classic",
    sourceStyle: "Google L4 Kahn topological ordering (Java).",
    description: "Return a valid order or empty list if a cycle exists.",
    variantOf: "google-topological-sort",
    code: `List<Integer> topoSort(int n, int[][] edges) {
    int[] indeg = new int[n];
    List<List<Integer>> adj = new ArrayList<>();
    for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
    for (int[] e : edges) {
        adj.get(e[0]).add(e[1]);
        indeg[e[1]]++;
    }
    ArrayDeque<Integer> q = new ArrayDeque<>();
    for (int i = 0; i < n; i++) if (indeg[i] == 0) q.add(i);
    List<Integer> order = new ArrayList<>();
    while (!q.isEmpty()) {
        int node = q.poll();
        order.add(node);
        for (int nei : adj.get(node)) {
            if (--indeg[nei] == 0) q.add(nei);
        }
    }
    return order.size() == n ? order : List.of();
}`,
  }),
  snippet({
    id: languageMirrorId("google-merge-intervals", "java"),
    title: "Merge Overlapping Intervals",
    pattern: "arrays",
    difficulty: "medium",
    language: "java",
    tier: "interview-fluency",
    fluencyLevel: 3,
    motifs: ["two-pointer-chase"],
    packIds: ["company-google"],
    tracks: ["google"],
    levelRange: ["mid"],
    format: "classic",
    sourceStyle: "Google L4 interval merge (Java).",
    description: "Combine overlapping [start, end] intervals.",
    variantOf: "google-merge-intervals",
    code: `int[][] mergeIntervals(int[][] intervals) {
    if (intervals.length == 0) return new int[0][0];
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
    List<int[]> merged = new ArrayList<>();
    merged.add(new int[] {intervals[0][0], intervals[0][1]});
    for (int i = 1; i < intervals.length; i++) {
        int start = intervals[i][0], end = intervals[i][1];
        int[] last = merged.get(merged.size() - 1);
        if (start <= last[1]) {
            last[1] = Math.max(last[1], end);
        } else {
            merged.add(new int[] {start, end});
        }
    }
    return merged.toArray(new int[0][]);
}`,
  }),
  snippet({
    id: languageMirrorId("google-task-scheduler", "java"),
    title: "Heap Task Scheduler",
    pattern: "heap",
    difficulty: "medium",
    language: "java",
    tier: "interview-fluency",
    fluencyLevel: 3,
    motifs: ["heap-push-pop"],
    packIds: ["company-google"],
    tracks: ["google"],
    levelRange: ["mid"],
    format: "classic",
    sourceStyle: "Google L4 task cooldown formula (Java).",
    description: "Minimum intervals to finish tasks with cooldown n.",
    variantOf: "google-task-scheduler",
    code: `int leastIntervals(char[] tasks, int n) {
    int[] counts = new int[26];
    for (char t : tasks) counts[t - 'A']++;
    int maxCount = 0, maxFreq = 0;
    for (int c : counts) {
        if (c > maxCount) {
            maxCount = c;
            maxFreq = 1;
        } else if (c == maxCount) {
            maxFreq++;
        }
    }
    return Math.max(tasks.length, (maxCount - 1) * (n + 1) + maxFreq);
}`,
  }),
  snippet({
    id: languageMirrorId("google-edit-distance", "java"),
    title: "Edit Distance (Levenshtein)",
    pattern: "dynamic-programming",
    difficulty: "hard",
    language: "java",
    tier: "interview-fluency",
    fluencyLevel: 4,
    motifs: ["dp-tabulation"],
    packIds: ["company-google"],
    tracks: ["google"],
    levelRange: ["senior"],
    format: "classic",
    sourceStyle: "Google L5 2D DP tabulation (Java).",
    description: "Minimum edits to transform word a into word b.",
    variantOf: "google-edit-distance",
    code: `int editDistance(String a, String b) {
    int m = a.length(), n = b.length();
    int[][] dp = new int[m + 1][n + 1];
    for (int i = 0; i <= m; i++) dp[i][0] = i;
    for (int j = 0; j <= n; j++) dp[0][j] = j;
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            int cost = a.charAt(i - 1) == b.charAt(j - 1) ? 0 : 1;
            dp[i][j] = Math.min(
                    Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1),
                    dp[i - 1][j - 1] + cost);
        }
    }
    return dp[m][n];
}`,
  }),
  snippet({
    id: languageMirrorId("google-trie-prefix", "java"),
    title: "Prefix Trie",
    pattern: "hash-map",
    difficulty: "hard",
    language: "java",
    tier: "interview-fluency",
    fluencyLevel: 4,
    motifs: ["hash-lookup"],
    packIds: ["company-google"],
    tracks: ["google"],
    levelRange: ["senior"],
    format: "classic",
    sourceStyle: "Google L5 trie insert and prefix search (Java).",
    description: "Insert words and test prefix membership.",
    variantOf: "google-trie-prefix",
    code: `class PrefixTrie {
    private static class Node {
        Map<Character, Node> children = new HashMap<>();
        boolean end;
    }

    private final Node root = new Node();

    void insert(String word) {
        Node node = root;
        for (char ch : word.toCharArray()) {
            node = node.children.computeIfAbsent(ch, k -> new Node());
        }
        node.end = true;
    }

    boolean startsWith(String prefix) {
        Node node = root;
        for (char ch : prefix.toCharArray()) {
            node = node.children.get(ch);
            if (node == null) return false;
        }
        return true;
    }
}`,
  }),
  snippet({
    id: languageMirrorId("google-lru-cache", "java"),
    title: "LRU Cache Class",
    pattern: "hash-map",
    difficulty: "hard",
    language: "java",
    tier: "interview-fluency",
    fluencyLevel: 4,
    motifs: ["hash-lookup"],
    packIds: ["company-google"],
    tracks: ["google"],
    levelRange: ["senior"],
    format: "classic",
    sourceStyle: "Google L5 LRU via LinkedHashMap (Java).",
    description: "O(1) get/put with capacity eviction.",
    variantOf: "google-lru-cache",
    code: `class LRUCache {
    private final int cap;
    private final LinkedHashMap<String, Integer> data;

    LRUCache(int capacity) {
        cap = capacity;
        data = new LinkedHashMap<>(capacity, 0.75f, true);
    }

    int get(String key) {
        return data.getOrDefault(key, -1);
    }

    void put(String key, int value) {
        data.put(key, value);
        if (data.size() > cap) {
            Iterator<String> it = data.keySet().iterator();
            it.next();
            it.remove();
        }
    }
}`,
  }),
];
