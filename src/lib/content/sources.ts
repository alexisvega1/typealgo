import type { ContentSourceId } from "@/lib/types";

export interface ContentSourceMeta {
  id: ContentSourceId;
  name: string;
  role: "progression" | "patterns" | "beginner" | "elite" | "seasonal" | "cross-language" | "community";
  /** What we derive — never clone verbatim. */
  deriveFrom: string[];
  avoid: string[];
  url?: string;
}

/**
 * Registry of inspiration sources.
 * TypeAlgo derives motifs and progression structure — never mirrors copyrighted solution text.
 */
export const CONTENT_SOURCES: ContentSourceMeta[] = [
  {
    id: "typealgo-original",
    name: "TypeAlgo Original",
    role: "patterns",
    deriveFrom: ["canonical motifs", "retrieval decomposition", "fluency tiers"],
    avoid: ["bulk problem dumps"],
  },
  {
    id: "neetcode-inspired",
    name: "NeetCode (inspired)",
    role: "progression",
    deriveFrom: ["pattern grouping", "Blind 75 prioritization", "interview sequencing"],
    avoid: ["copying solution code", "replicating exact problem lists"],
    url: "https://neetcode.io",
  },
  {
    id: "leetcode-pattern",
    name: "LeetCode Patterns",
    role: "patterns",
    deriveFrom: ["canonical templates", "discuss weak spots", "company tag priorities"],
    avoid: ["scraping discuss", "verbatim solutions"],
    url: "https://leetcode.com",
  },
  {
    id: "hackerrank-progression",
    name: "HackerRank",
    role: "beginner",
    deriveFrom: ["onboarding progression", "beginner syntax fluency"],
    avoid: ["elite interview reliance"],
    url: "https://www.hackerrank.com",
  },
  {
    id: "codeforces-elite",
    name: "Codeforces",
    role: "elite",
    deriveFrom: ["implementation pressure", "competitive motifs", "speed cognition"],
    avoid: ["beginner-first content"],
    url: "https://codeforces.com",
  },
  {
    id: "advent-of-code",
    name: "Advent of Code",
    role: "seasonal",
    deriveFrom: ["seasonal events", "puzzle narratives", "shareable challenges"],
    avoid: ["year-round core curriculum mixing"],
    url: "https://adventofcode.com",
  },
  {
    id: "project-euler",
    name: "Project Euler",
    role: "elite",
    deriveFrom: ["mathematical implementation fluency", "elegant algorithm motifs"],
    avoid: ["mainstream beginner onboarding"],
    url: "https://projecteuler.net",
  },
  {
    id: "rosetta-code",
    name: "Rosetta Code",
    role: "cross-language",
    deriveFrom: ["same algorithm across languages", "syntax comparison chunks"],
    avoid: ["direct multi-file copies"],
    url: "https://rosettacode.org",
  },
  {
    id: "github-community",
    name: "Public GitHub Repos",
    role: "community",
    deriveFrom: ["motif structures", "prerequisite graphs", "canonical patterns"],
    avoid: ["copying repo solutions verbatim"],
  },
  {
    id: "community-pack",
    name: "Community Motif Packs",
    role: "community",
    deriveFrom: ["user-authored packs", "company-specific drills", "domain packs"],
    avoid: ["unmoderated copyright content"],
  },
];

export function getContentSource(id: ContentSourceId): ContentSourceMeta | undefined {
  return CONTENT_SOURCES.find((s) => s.id === id);
}
