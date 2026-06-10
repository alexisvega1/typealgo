import { comprehensionSnippet } from "@/lib/snippet-comprehension";
import { languageMirrorId } from "./builder";

/** Google track — C++ comprehension mirrors (Run A). */
export const GOOGLE_COMPREHENSION_CPP_SNIPPETS = [
  comprehensionSnippet({
    id: languageMirrorId("google-comp-merge-sorted", "cpp"),
    title: "Fix: Merge Two Sorted Arrays",
    pattern: "two-pointers",
    difficulty: "medium",
    language: "cpp",
    tier: "interview-fluency",
    fluencyLevel: 2,
    motifs: ["two-pointer-chase"],
    packIds: ["company-google"],
    tracks: ["google"],
    levelRange: ["junior"],
    sourceStyle: "Google L3 comprehension — off-by-one tail merge (C++).",
    description: "Correct the merge so both tails flush completely.",
    variantOf: "google-comp-merge-sorted",
    plantedBugKind: "off-by-one",
    buggyCode: `vector<int> mergeSorted(const vector<int>& a, const vector<int>& b) {
    size_t i = 0, j = 0;
    vector<int> out;
    while (i < a.size() && j < b.size()) {
        if (a[i] <= b[j]) out.push_back(a[i++]);
        else out.push_back(b[j++]);
    }
    for (size_t k = i + 1; k < a.size(); k++) out.push_back(a[k]);
    for (size_t k = j + 1; k < b.size(); k++) out.push_back(b[k]);
    return out;
}`,
    code: `vector<int> mergeSorted(const vector<int>& a, const vector<int>& b) {
    size_t i = 0, j = 0;
    vector<int> out;
    while (i < a.size() && j < b.size()) {
        if (a[i] <= b[j]) out.push_back(a[i++]);
        else out.push_back(b[j++]);
    }
    while (i < a.size()) out.push_back(a[i++]);
    while (j < b.size()) out.push_back(b[j++]);
    return out;
}`,
  }),
  comprehensionSnippet({
    id: languageMirrorId("google-comp-grid-bfs", "cpp"),
    title: "Fix: Grid Shortest Path (BFS)",
    pattern: "dfs-bfs",
    difficulty: "medium",
    language: "cpp",
    tier: "interview-fluency",
    fluencyLevel: 2,
    motifs: ["bfs-queue"],
    packIds: ["company-google"],
    tracks: ["google"],
    levelRange: ["junior"],
    sourceStyle: "Google L3 comprehension — missing visited check (C++).",
    description: "Prevent revisiting cells already in the BFS queue.",
    variantOf: "google-comp-grid-bfs",
    plantedBugKind: "missing-visited",
    buggyCode: `int shortestPathGrid(const vector<vector<int>>& grid) {
    if (grid.empty() || grid[0].empty()) return -1;
    const int rows = grid.size(), cols = grid[0].size();
    if (grid[0][0] == 1 || grid[rows - 1][cols - 1] == 1) return -1;
    queue<array<int, 3>> q;
    q.push({0, 0, 0});
    vector<vector<bool>> seen(rows, vector<bool>(cols, false));
    seen[0][0] = true;
    const array<int, 2> dirs[] = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
    while (!q.empty()) {
        auto [r, c, steps] = q.front();
        q.pop();
        if (r == rows - 1 && c == cols - 1) return steps;
        for (auto [dr, dc] : dirs) {
            int nr = r + dr, nc = c + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] == 0) {
                seen[nr][nc] = true;
                q.push({nr, nc, steps + 1});
            }
        }
    }
    return -1;
}`,
    code: `int shortestPathGrid(const vector<vector<int>>& grid) {
    if (grid.empty() || grid[0].empty()) return -1;
    const int rows = grid.size(), cols = grid[0].size();
    if (grid[0][0] == 1 || grid[rows - 1][cols - 1] == 1) return -1;
    queue<array<int, 3>> q;
    q.push({0, 0, 0});
    vector<vector<bool>> seen(rows, vector<bool>(cols, false));
    seen[0][0] = true;
    const array<int, 2> dirs[] = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
    while (!q.empty()) {
        auto [r, c, steps] = q.front();
        q.pop();
        if (r == rows - 1 && c == cols - 1) return steps;
        for (auto [dr, dc] : dirs) {
            int nr = r + dr, nc = c + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] == 0) {
                if (!seen[nr][nc]) {
                    seen[nr][nc] = true;
                    q.push({nr, nc, steps + 1});
                }
            }
        }
    }
    return -1;
}`,
  }),
  comprehensionSnippet({
    id: languageMirrorId("google-comp-topo-sort", "cpp"),
    title: "Fix: Topological Sort (Kahn)",
    pattern: "graphs",
    difficulty: "medium",
    language: "cpp",
    tier: "interview-fluency",
    fluencyLevel: 3,
    motifs: ["graph-adjacency"],
    packIds: ["company-google"],
    tracks: ["google"],
    levelRange: ["mid"],
    sourceStyle: "Google L4 comprehension — wrong in-degree update (C++).",
    description: "Decrement in-degree on the neighbor node, not the source.",
    variantOf: "google-comp-topo-sort",
    plantedBugKind: "inverted-condition",
    buggyCode: `vector<int> topoSort(int n, const vector<vector<int>>& edges) {
    vector<int> indeg(n, 0);
    vector<vector<int>> adj(n);
    for (const auto& e : edges) {
        adj[e[0]].push_back(e[1]);
        indeg[e[1]]++;
    }
    queue<int> q;
    for (int i = 0; i < n; i++) if (indeg[i] == 0) q.push(i);
    vector<int> order;
    while (!q.empty()) {
        int node = q.front();
        q.pop();
        order.push_back(node);
        for (int nei : adj[node]) {
            indeg[node]--;
            if (indeg[nei] == 0) q.push(nei);
        }
    }
    return order.size() == static_cast<size_t>(n) ? order : vector<int>{};
}`,
    code: `vector<int> topoSort(int n, const vector<vector<int>>& edges) {
    vector<int> indeg(n, 0);
    vector<vector<int>> adj(n);
    for (const auto& e : edges) {
        adj[e[0]].push_back(e[1]);
        indeg[e[1]]++;
    }
    queue<int> q;
    for (int i = 0; i < n; i++) if (indeg[i] == 0) q.push(i);
    vector<int> order;
    while (!q.empty()) {
        int node = q.front();
        q.pop();
        order.push_back(node);
        for (int nei : adj[node]) {
            if (--indeg[nei] == 0) q.push(nei);
        }
    }
    return order.size() == static_cast<size_t>(n) ? order : vector<int>{};
}`,
  }),
  comprehensionSnippet({
    id: languageMirrorId("google-comp-merge-intervals", "cpp"),
    title: "Fix: Merge Overlapping Intervals",
    pattern: "arrays",
    difficulty: "medium",
    language: "cpp",
    tier: "interview-fluency",
    fluencyLevel: 3,
    motifs: ["two-pointer-chase"],
    packIds: ["company-google"],
    tracks: ["google"],
    levelRange: ["mid"],
    sourceStyle: "Google L4 comprehension — off-by-one overlap (C++).",
    description: "Treat touching intervals as overlapping when start equals last end.",
    variantOf: "google-comp-merge-intervals",
    plantedBugKind: "off-by-one",
    buggyCode: `vector<vector<int>> mergeIntervals(vector<vector<int>> intervals) {
    sort(intervals.begin(), intervals.end(),
         [](const vector<int>& a, const vector<int>& b) { return a[0] < b[0]; });
    vector<vector<int>> merged = {intervals[0]};
    for (size_t i = 1; i < intervals.size(); i++) {
        int start = intervals[i][0], end = intervals[i][1];
        auto& last = merged.back();
        if (start < last[1]) {
            last[1] = max(last[1], end);
        } else {
            merged.push_back({start, end});
        }
    }
    return merged;
}`,
    code: `vector<vector<int>> mergeIntervals(vector<vector<int>> intervals) {
    sort(intervals.begin(), intervals.end(),
         [](const vector<int>& a, const vector<int>& b) { return a[0] < b[0]; });
    vector<vector<int>> merged = {intervals[0]};
    for (size_t i = 1; i < intervals.size(); i++) {
        int start = intervals[i][0], end = intervals[i][1];
        auto& last = merged.back();
        if (start <= last[1]) {
            last[1] = max(last[1], end);
        } else {
            merged.push_back({start, end});
        }
    }
    return merged;
}`,
  }),
  comprehensionSnippet({
    id: languageMirrorId("google-comp-edit-distance", "cpp"),
    title: "Fix: Edit Distance (Levenshtein)",
    pattern: "dynamic-programming",
    difficulty: "hard",
    language: "cpp",
    tier: "interview-fluency",
    fluencyLevel: 4,
    motifs: ["dp-tabulation"],
    packIds: ["company-google"],
    tracks: ["google"],
    levelRange: ["senior"],
    sourceStyle: "Google L5 comprehension — wrong DP base case (C++).",
    description: "Initialize first-column deletion costs as i, not i - 1.",
    variantOf: "google-comp-edit-distance",
    plantedBugKind: "wrong-base-case",
    buggyCode: `int editDistance(const string& a, const string& b) {
    int m = a.size(), n = b.size();
    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
    for (int i = 0; i <= m; i++) dp[i][0] = i - 1;
    for (int j = 0; j <= n; j++) dp[0][j] = j;
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            int cost = a[i - 1] == b[j - 1] ? 0 : 1;
            dp[i][j] = min({dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost});
        }
    }
    return dp[m][n];
}`,
    code: `int editDistance(const string& a, const string& b) {
    int m = a.size(), n = b.size();
    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
    for (int i = 0; i <= m; i++) dp[i][0] = i;
    for (int j = 0; j <= n; j++) dp[0][j] = j;
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            int cost = a[i - 1] == b[j - 1] ? 0 : 1;
            dp[i][j] = min({dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost});
        }
    }
    return dp[m][n];
}`,
  }),
  comprehensionSnippet({
    id: languageMirrorId("google-comp-lru-cache", "cpp"),
    title: "Fix: LRU Cache Class",
    pattern: "hash-map",
    difficulty: "hard",
    language: "cpp",
    tier: "interview-fluency",
    fluencyLevel: 4,
    motifs: ["hash-lookup"],
    packIds: ["company-google"],
    tracks: ["google"],
    levelRange: ["senior"],
    sourceStyle: "Google L5 comprehension — evict MRU not LRU (C++).",
    description: "Evict least-recently-used entry from the list tail.",
    variantOf: "google-comp-lru-cache",
    plantedBugKind: "inverted-condition",
    buggyCode: `class LRUCache {
    int cap_;
    list<pair<string, int>> order_;
    unordered_map<string, list<pair<string, int>>::iterator> idx_;

public:
    explicit LRUCache(int capacity) : cap_(capacity) {}

    void put(const string& key, int value) {
        auto it = idx_.find(key);
        if (it != idx_.end()) {
            it->second->second = value;
            order_.splice(order_.begin(), order_, it->second);
        } else {
            order_.emplace_front(key, value);
            idx_[key] = order_.begin();
        }
        if (order_.size() > static_cast<size_t>(cap_)) {
            auto mru = order_.front();
            idx_.erase(mru.first);
            order_.pop_front();
        }
    }
};`,
    code: `class LRUCache {
    int cap_;
    list<pair<string, int>> order_;
    unordered_map<string, list<pair<string, int>>::iterator> idx_;

public:
    explicit LRUCache(int capacity) : cap_(capacity) {}

    void put(const string& key, int value) {
        auto it = idx_.find(key);
        if (it != idx_.end()) {
            it->second->second = value;
            order_.splice(order_.begin(), order_, it->second);
        } else {
            order_.emplace_front(key, value);
            idx_[key] = order_.begin();
        }
        if (order_.size() > static_cast<size_t>(cap_)) {
            auto lru = order_.back();
            idx_.erase(lru.first);
            order_.pop_back();
        }
    }
};`,
  }),
];
