import { languageMirrorId, snippet } from "./builder";

/** Google track — C++ mirrors of Python classic pool (Run A). */
export const GOOGLE_CPP_SNIPPETS = [
  snippet({
    id: languageMirrorId("google-merge-sorted-arrays", "cpp"),
    title: "Merge Two Sorted Arrays",
    pattern: "two-pointers",
    difficulty: "medium",
    language: "cpp",
    tier: "interview-fluency",
    fluencyLevel: 2,
    motifs: ["two-pointer-chase"],
    packIds: ["company-google"],
    tracks: ["google"],
    levelRange: ["junior"],
    format: "classic",
    sourceStyle: "Google L3 two-pointer merge (C++).",
    description: "Linear merge of two ascending arrays with trailing pointers.",
    variantOf: "google-merge-sorted-arrays",
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
  snippet({
    id: languageMirrorId("google-grid-bfs", "cpp"),
    title: "Grid Shortest Path (BFS)",
    pattern: "dfs-bfs",
    difficulty: "medium",
    language: "cpp",
    tier: "interview-fluency",
    fluencyLevel: 2,
    motifs: ["bfs-queue"],
    packIds: ["company-google"],
    tracks: ["google"],
    levelRange: ["junior"],
    format: "classic",
    sourceStyle: "Google L3 grid BFS (C++).",
    description: "Return shortest steps from top-left to bottom-right in a binary grid.",
    variantOf: "google-grid-bfs",
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
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols
                    && grid[nr][nc] == 0 && !seen[nr][nc]) {
                seen[nr][nc] = true;
                q.push({nr, nc, steps + 1});
            }
        }
    }
    return -1;
}`,
  }),
  snippet({
    id: languageMirrorId("google-binary-search-capacity", "cpp"),
    title: "Binary Search on Answer — Ship Capacity",
    pattern: "binary-search",
    difficulty: "medium",
    language: "cpp",
    tier: "interview-fluency",
    fluencyLevel: 2,
    motifs: ["binary-search-answer"],
    packIds: ["company-google"],
    tracks: ["google"],
    levelRange: ["junior"],
    format: "classic",
    sourceStyle: "Google L3 binary search on capacity (C++).",
    description: "Minimum capacity to ship weights within D days.",
    variantOf: "google-binary-search-capacity",
    code: `bool canShip(const vector<int>& weights, int days, int cap) {
    int used = 1, load = 0;
    for (int w : weights) {
        if (load + w > cap) {
            used++;
            load = 0;
        }
        load += w;
    }
    return used <= days;
}

int minCapacity(const vector<int>& weights, int days) {
    int lo = 0, hi = 0;
    for (int w : weights) {
        lo = max(lo, w);
        hi += w;
    }
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (canShip(weights, days, mid)) hi = mid;
        else lo = mid + 1;
    }
    return lo;
}`,
  }),
  snippet({
    id: languageMirrorId("google-topological-sort", "cpp"),
    title: "Topological Sort (Kahn)",
    pattern: "graphs",
    difficulty: "medium",
    language: "cpp",
    tier: "interview-fluency",
    fluencyLevel: 3,
    motifs: ["graph-adjacency"],
    packIds: ["company-google"],
    tracks: ["google"],
    levelRange: ["mid"],
    format: "classic",
    sourceStyle: "Google L4 Kahn topological ordering (C++).",
    description: "Return a valid order or empty list if a cycle exists.",
    variantOf: "google-topological-sort",
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
  snippet({
    id: languageMirrorId("google-merge-intervals", "cpp"),
    title: "Merge Overlapping Intervals",
    pattern: "arrays",
    difficulty: "medium",
    language: "cpp",
    tier: "interview-fluency",
    fluencyLevel: 3,
    motifs: ["two-pointer-chase"],
    packIds: ["company-google"],
    tracks: ["google"],
    levelRange: ["mid"],
    format: "classic",
    sourceStyle: "Google L4 interval merge (C++).",
    description: "Combine overlapping [start, end] intervals.",
    variantOf: "google-merge-intervals",
    code: `vector<vector<int>> mergeIntervals(vector<vector<int>> intervals) {
    if (intervals.empty()) return {};
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
  snippet({
    id: languageMirrorId("google-task-scheduler", "cpp"),
    title: "Heap Task Scheduler",
    pattern: "heap",
    difficulty: "medium",
    language: "cpp",
    tier: "interview-fluency",
    fluencyLevel: 3,
    motifs: ["heap-push-pop"],
    packIds: ["company-google"],
    tracks: ["google"],
    levelRange: ["mid"],
    format: "classic",
    sourceStyle: "Google L4 task cooldown formula (C++).",
    description: "Minimum intervals to finish tasks with cooldown n.",
    variantOf: "google-task-scheduler",
    code: `int leastIntervals(const vector<char>& tasks, int n) {
    array<int, 26> counts{};
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
    return max(static_cast<int>(tasks.size()), (maxCount - 1) * (n + 1) + maxFreq);
}`,
  }),
  snippet({
    id: languageMirrorId("google-edit-distance", "cpp"),
    title: "Edit Distance (Levenshtein)",
    pattern: "dynamic-programming",
    difficulty: "hard",
    language: "cpp",
    tier: "interview-fluency",
    fluencyLevel: 4,
    motifs: ["dp-tabulation"],
    packIds: ["company-google"],
    tracks: ["google"],
    levelRange: ["senior"],
    format: "classic",
    sourceStyle: "Google L5 2D DP tabulation (C++).",
    description: "Minimum edits to transform word a into word b.",
    variantOf: "google-edit-distance",
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
  snippet({
    id: languageMirrorId("google-trie-prefix", "cpp"),
    title: "Prefix Trie",
    pattern: "hash-map",
    difficulty: "hard",
    language: "cpp",
    tier: "interview-fluency",
    fluencyLevel: 4,
    motifs: ["hash-lookup"],
    packIds: ["company-google"],
    tracks: ["google"],
    levelRange: ["senior"],
    format: "classic",
    sourceStyle: "Google L5 trie insert and prefix search (C++).",
    description: "Insert words and test prefix membership.",
    variantOf: "google-trie-prefix",
    code: `class PrefixTrie {
    struct Node {
        unordered_map<char, unique_ptr<Node>> children;
        bool end = false;
    };
    unique_ptr<Node> root = make_unique<Node>();

public:
    void insert(const string& word) {
        Node* node = root.get();
        for (char ch : word) {
            auto& next = node->children[ch];
            if (!next) next = make_unique<Node>();
            node = next.get();
        }
        node->end = true;
    }

    bool startsWith(const string& prefix) const {
        const Node* node = root.get();
        for (char ch : prefix) {
            auto it = node->children.find(ch);
            if (it == node->children.end()) return false;
            node = it->second.get();
        }
        return true;
    }
};`,
  }),
  snippet({
    id: languageMirrorId("google-lru-cache", "cpp"),
    title: "LRU Cache Class",
    pattern: "hash-map",
    difficulty: "hard",
    language: "cpp",
    tier: "interview-fluency",
    fluencyLevel: 4,
    motifs: ["hash-lookup"],
    packIds: ["company-google"],
    tracks: ["google"],
    levelRange: ["senior"],
    format: "classic",
    sourceStyle: "Google L5 LRU via list + hash map (C++).",
    description: "O(1) get/put with capacity eviction.",
    variantOf: "google-lru-cache",
    code: `class LRUCache {
    int cap_;
    list<pair<string, int>> order_;
    unordered_map<string, list<pair<string, int>>::iterator> idx_;

public:
    explicit LRUCache(int capacity) : cap_(capacity) {}

    int get(const string& key) {
        auto it = idx_.find(key);
        if (it == idx_.end()) return -1;
        order_.splice(order_.begin(), order_, it->second);
        return it->second->second;
    }

    void put(const string& key, int value) {
        auto it = idx_.find(key);
        if (it != idx_.end()) {
            it->second->second = value;
            order_.splice(order_.begin(), order_, it->second);
            return;
        }
        order_.emplace_front(key, value);
        idx_[key] = order_.begin();
        if (order_.size() > static_cast<size_t>(cap_)) {
            auto last = order_.back();
            idx_.erase(last.first);
            order_.pop_back();
        }
    }
};`,
  }),
];
