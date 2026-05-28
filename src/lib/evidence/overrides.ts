import type { SnippetEvidenceProfile } from "@/lib/types";

/**
 * Curated evidence overrides for high-signal snippets.
 */
export const SNIPPET_EVIDENCE_OVERRIDES: Record<string, Partial<SnippetEvidenceProfile>> = {
  "two-sum": {
    universalScore: 0.95,
    popularityScore: 0.98,
    confidenceBand: "high",
    confidenceScore: 0.92,
    positioningLabels: ["Broadly used interview motif", "Universal prep core"],
    evidenceSources: [
      { kind: "blind-75-canonical", label: "Blind 75 core", mentionCount: 75 },
      { kind: "neetcode-pattern", label: "NeetCode hash map intro" },
    ],
    motifJustification: "Hash lookup is the most frequently cited foundational motif in public interview prep.",
  },
  "binary-search-basic": {
    companyWeights: { google: 0.82, meta: 0.68, deepmind: 0.65, openai: 0.32 },
    universalScore: 0.78,
    confidenceBand: "high",
    positioningLabels: ["Common binary search motif", "Broadly used interview prep"],
    evidenceSources: [
      { kind: "blind-75-canonical", label: "Blind 75 / NeetCode BS track" },
      { kind: "leetcode-discuss-aggregate", label: "Discuss: Google/Meta phone screen mentions", mentionCount: 1200 },
    ],
  },
  "search-insert": {
    companyWeights: { google: 0.8, meta: 0.72, deepmind: 0.62, openai: 0.28 },
    confidenceBand: "medium",
    positioningLabels: ["Common binary search boundary motif"],
    motifJustification: "Boundary binary search appears frequently in Meta/Google-style prep discussions; low OpenAI infra signal.",
  },
  "find-min-rotated": {
    companyWeights: { meta: 0.78, google: 0.76, deepmind: 0.58, openai: 0.25 },
    confidenceBand: "medium",
    positioningLabels: ["Common rotated array motif", "Graph-adjacent algorithmic pattern"],
    motifJustification: "Rotated sorted array is widely tagged in Meta/Google discuss aggregates; weak backend/ML infra association.",
  },
  "number-of-islands": {
    companyWeights: { meta: 0.88, google: 0.75, deepmind: 0.7, openai: 0.3 },
    confidenceBand: "high",
    positioningLabels: ["Common graph interview motif", "Graph-heavy prep pattern"],
    evidenceSources: [
      { kind: "leetcode-discuss-aggregate", label: "Discuss: Meta graph frequency", mentionCount: 890 },
    ],
  },
  "bfs-graph-template": {
    companyWeights: { meta: 0.9, google: 0.72, deepmind: 0.68, openai: 0.28 },
    positioningLabels: ["Common graph-heavy interview motif", "High-speed implementation pattern"],
  },
  "coin-change": {
    companyWeights: { google: 0.78, deepmind: 0.8, meta: 0.65, "jane-street": 0.55, openai: 0.35 },
    levelWeights: { mid: 0.78, senior: 0.82, research: 0.72 },
    positioningLabels: ["Research-heavy DP motif", "Common DP interview pattern"],
  },
  "climbing-stairs": {
    universalScore: 0.88,
    levelWeights: { foundation: 0.7, junior: 0.85, mid: 0.72 },
    positioningLabels: ["Broadly used interview motif", "DP foundation pattern"],
  },
  "kth-largest": {
    companyWeights: { meta: 0.7, google: 0.72, openai: 0.62, anthropic: 0.55 },
    sophistication: { pattern: 0.55, systems: 0.42, implementationPressure: 0.52 },
    positioningLabels: ["Backend-oriented heap pattern", "Common heap API motif"],
    motifJustification: "Heap scheduling motifs correlate with backend/infra prep; moderate OpenAI/Anthropic signal via Python API fluency.",
  },
};
