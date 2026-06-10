import { comprehensionSnippet } from "@/lib/snippet-comprehension";
import { languageMirrorId } from "./builder";

/** Google track — Java comprehension mirrors (Run A). */
export const GOOGLE_COMPREHENSION_JAVA_SNIPPETS = [
  comprehensionSnippet({
    id: languageMirrorId("google-comp-merge-sorted", "java"),
    title: "Fix: Merge Two Sorted Arrays",
    pattern: "two-pointers",
    difficulty: "medium",
    language: "java",
    tier: "interview-fluency",
    fluencyLevel: 2,
    motifs: ["two-pointer-chase"],
    packIds: ["company-google"],
    tracks: ["google"],
    levelRange: ["junior"],
    sourceStyle: "Google L3 comprehension — off-by-one tail merge (Java).",
    description: "Correct the merge so both tails flush completely.",
    variantOf: "google-comp-merge-sorted",
    plantedBugKind: "off-by-one",
    buggyCode: `List<Integer> mergeSorted(int[] a, int[] b) {
    int i = 0, j = 0;
    List<Integer> out = new ArrayList<>();
    while (i < a.length && j < b.length) {
        if (a[i] <= b[j]) out.add(a[i++]);
        else out.add(b[j++]);
    }
    for (int k = i + 1; k < a.length; k++) out.add(a[k]);
    for (int k = j + 1; k < b.length; k++) out.add(b[k]);
    return out;
}`,
    code: `List<Integer> mergeSorted(int[] a, int[] b) {
    int i = 0, j = 0;
    List<Integer> out = new ArrayList<>();
    while (i < a.length && j < b.length) {
        if (a[i] <= b[j]) out.add(a[i++]);
        else out.add(b[j++]);
    }
    while (i < a.length) out.add(a[i++]);
    while (j < b.length) out.add(b[j++]);
    return out;
}`,
  }),
  comprehensionSnippet({
    id: languageMirrorId("google-comp-grid-bfs", "java"),
    title: "Fix: Grid Shortest Path (BFS)",
    pattern: "dfs-bfs",
    difficulty: "medium",
    language: "java",
    tier: "interview-fluency",
    fluencyLevel: 2,
    motifs: ["bfs-queue"],
    packIds: ["company-google"],
    tracks: ["google"],
    levelRange: ["junior"],
    sourceStyle: "Google L3 comprehension — missing visited check (Java).",
    description: "Prevent revisiting cells already in the BFS queue.",
    variantOf: "google-comp-grid-bfs",
    plantedBugKind: "missing-visited",
    buggyCode: `int shortestPathGrid(int[][] grid) {
    if (grid.length == 0 || grid[0].length == 0) return -1;
    int rows = grid.length, cols = grid[0].length;
    if (grid[0][0] == 1 || grid[rows - 1][cols - 1] == 1) return -1;
    ArrayDeque<int[]> q = new ArrayDeque<>();
    q.add(new int[] {0, 0, 0});
    boolean[][] seen = new boolean[rows][cols];
    seen[0][0] = true;
    while (!q.isEmpty()) {
        int[] cur = q.poll();
        int r = cur[0], c = cur[1], steps = cur[2];
        if (r == rows - 1 && c == cols - 1) return steps;
        for (int[] d : new int[][] {{1,0},{-1,0},{0,1},{0,-1}}) {
            int nr = r + d[0], nc = c + d[1];
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] == 0) {
                seen[nr][nc] = true;
                q.add(new int[] {nr, nc, steps + 1});
            }
        }
    }
    return -1;
}`,
    code: `int shortestPathGrid(int[][] grid) {
    if (grid.length == 0 || grid[0].length == 0) return -1;
    int rows = grid.length, cols = grid[0].length;
    if (grid[0][0] == 1 || grid[rows - 1][cols - 1] == 1) return -1;
    ArrayDeque<int[]> q = new ArrayDeque<>();
    q.add(new int[] {0, 0, 0});
    boolean[][] seen = new boolean[rows][cols];
    seen[0][0] = true;
    while (!q.isEmpty()) {
        int[] cur = q.poll();
        int r = cur[0], c = cur[1], steps = cur[2];
        if (r == rows - 1 && c == cols - 1) return steps;
        for (int[] d : new int[][] {{1,0},{-1,0},{0,1},{0,-1}}) {
            int nr = r + d[0], nc = c + d[1];
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] == 0) {
                if (!seen[nr][nc]) {
                    seen[nr][nc] = true;
                    q.add(new int[] {nr, nc, steps + 1});
                }
            }
        }
    }
    return -1;
}`,
  }),
  comprehensionSnippet({
    id: languageMirrorId("google-comp-topo-sort", "java"),
    title: "Fix: Topological Sort (Kahn)",
    pattern: "graphs",
    difficulty: "medium",
    language: "java",
    tier: "interview-fluency",
    fluencyLevel: 3,
    motifs: ["graph-adjacency"],
    packIds: ["company-google"],
    tracks: ["google"],
    levelRange: ["mid"],
    sourceStyle: "Google L4 comprehension — wrong in-degree update (Java).",
    description: "Decrement in-degree on the neighbor node, not the source.",
    variantOf: "google-comp-topo-sort",
    plantedBugKind: "inverted-condition",
    buggyCode: `List<Integer> topoSort(int n, int[][] edges) {
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
            indeg[node]--;
            if (indeg[nei] == 0) q.add(nei);
        }
    }
    return order.size() == n ? order : List.of();
}`,
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
  comprehensionSnippet({
    id: languageMirrorId("google-comp-merge-intervals", "java"),
    title: "Fix: Merge Overlapping Intervals",
    pattern: "arrays",
    difficulty: "medium",
    language: "java",
    tier: "interview-fluency",
    fluencyLevel: 3,
    motifs: ["two-pointer-chase"],
    packIds: ["company-google"],
    tracks: ["google"],
    levelRange: ["mid"],
    sourceStyle: "Google L4 comprehension — off-by-one overlap (Java).",
    description: "Treat touching intervals as overlapping when start equals last end.",
    variantOf: "google-comp-merge-intervals",
    plantedBugKind: "off-by-one",
    buggyCode: `int[][] mergeIntervals(int[][] intervals) {
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
    List<int[]> merged = new ArrayList<>();
    merged.add(new int[] {intervals[0][0], intervals[0][1]});
    for (int i = 1; i < intervals.length; i++) {
        int start = intervals[i][0], end = intervals[i][1];
        int[] last = merged.get(merged.size() - 1);
        if (start < last[1]) {
            last[1] = Math.max(last[1], end);
        } else {
            merged.add(new int[] {start, end});
        }
    }
    return merged.toArray(new int[0][]);
}`,
    code: `int[][] mergeIntervals(int[][] intervals) {
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
  comprehensionSnippet({
    id: languageMirrorId("google-comp-edit-distance", "java"),
    title: "Fix: Edit Distance (Levenshtein)",
    pattern: "dynamic-programming",
    difficulty: "hard",
    language: "java",
    tier: "interview-fluency",
    fluencyLevel: 4,
    motifs: ["dp-tabulation"],
    packIds: ["company-google"],
    tracks: ["google"],
    levelRange: ["senior"],
    sourceStyle: "Google L5 comprehension — wrong DP base case (Java).",
    description: "Initialize first-column deletion costs as i, not i - 1.",
    variantOf: "google-comp-edit-distance",
    plantedBugKind: "wrong-base-case",
    buggyCode: `int editDistance(String a, String b) {
    int m = a.length(), n = b.length();
    int[][] dp = new int[m + 1][n + 1];
    for (int i = 0; i <= m; i++) dp[i][0] = i - 1;
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
  comprehensionSnippet({
    id: languageMirrorId("google-comp-lru-cache", "java"),
    title: "Fix: LRU Cache Class",
    pattern: "hash-map",
    difficulty: "hard",
    language: "java",
    tier: "interview-fluency",
    fluencyLevel: 4,
    motifs: ["hash-lookup"],
    packIds: ["company-google"],
    tracks: ["google"],
    levelRange: ["senior"],
    sourceStyle: "Google L5 comprehension — evict MRU not LRU (Java).",
    description: "Evict least-recently-used entry from access-order map.",
    variantOf: "google-comp-lru-cache",
    plantedBugKind: "inverted-condition",
    buggyCode: `class LRUCache {
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
            String mru = null;
            for (String k : data.keySet()) mru = k;
            data.remove(mru);
        }
    }
}`,
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
