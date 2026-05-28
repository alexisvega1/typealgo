import type { EvidenceSourceKind } from "@/lib/types";

export interface EvidenceSourceMeta {
  kind: EvidenceSourceKind;
  name: string;
  role: string;
  deriveFrom: string[];
  avoid: string[];
}

/**
 * Public signal sources for aggregate annotation.
 * Store references and counts — never scrape or clone copyrighted solution text.
 */
export const EVIDENCE_SOURCE_REGISTRY: EvidenceSourceMeta[] = [
  {
    kind: "leetcode-discuss-aggregate",
    name: "LeetCode Discuss (aggregate)",
    role: "company-mentions",
    deriveFrom: ["“Asked at Meta” frequency counts", "pattern tag co-occurrence"],
    avoid: ["scraping discuss posts", "copying solution threads"],
  },
  {
    kind: "blind-75-canonical",
    name: "Blind 75 ecosystem",
    role: "universal-core",
    deriveFrom: ["canonical interview core frequency", "cross-company motif density"],
    avoid: ["claiming company-specific lists"],
  },
  {
    kind: "neetcode-pattern",
    name: "NeetCode patterns",
    role: "pattern-grouping",
    deriveFrom: ["pattern progression structure", "motif grouping"],
    avoid: ["copying solution implementations"],
  },
  {
    kind: "github-repo-aggregate",
    name: "Public GitHub prep repos",
    role: "frequency",
    deriveFrom: ["company tag counts in README indexes", "motif frequency tables"],
    avoid: ["copying repo solutions"],
  },
  {
    kind: "reddit-interview-aggregate",
    name: "Reddit interview experiences",
    role: "noisy-signal",
    deriveFrom: ["experience post motif mentions", "role-level sophistication cues"],
    avoid: ["treating anecdotes as ground truth"],
  },
  {
    kind: "levels-fyi-expectations",
    name: "Levels.fyi expectations",
    role: "level-sophistication",
    deriveFrom: ["expected implementation depth by level", "role scope descriptions"],
    avoid: ["mapping problems directly to levels"],
  },
  {
    kind: "motif-prior",
    name: "Motif association priors",
    role: "derived",
    deriveFrom: ["motif × company co-occurrence in public prep literature"],
    avoid: ["presenting priors as company facts"],
  },
  {
    kind: "pattern-sophistication",
    name: "Pattern sophistication model",
    role: "derived",
    deriveFrom: ["pattern complexity", "systems depth", "pressure expectations"],
    avoid: ["conflating sophistication with company tags"],
  },
  {
    kind: "manual-curation",
    name: "Manual curation",
    role: "override",
    deriveFrom: ["reviewed aggregate signals", "motif justification"],
    avoid: ["unsourced company claims"],
  },
];

export function getEvidenceSourceMeta(kind: EvidenceSourceKind): EvidenceSourceMeta | undefined {
  return EVIDENCE_SOURCE_REGISTRY.find((s) => s.kind === kind);
}
