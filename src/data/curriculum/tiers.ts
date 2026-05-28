import type { CurriculumTierInfo } from "@/lib/types";

export const CURRICULUM_TIERS: CurriculumTierInfo[] = [
  {
    id: "core-reflex",
    name: "Core Reflex Pack",
    description: "Foundational patterns that must become reflexive — hash maps, BFS, binary search, sliding window basics.",
    targetCount: 40,
    color: "#e2b714",
  },
  {
    id: "interview-fluency",
    name: "Interview Fluency Pack",
    description: "FAANG-prep territory — canonical medium motifs, timing pressure, multi-pattern combinations.",
    targetCount: 100,
    color: "#7c5cff",
  },
  {
    id: "advanced-fluency",
    name: "Advanced Fluency Pack",
    description: "Hard DP, graph optimizations, monotonic structures — roadmap toward 200+ motifs.",
    targetCount: 200,
    color: "#f778ba",
  },
];

export function getTierInfo(id: string): CurriculumTierInfo | undefined {
  return CURRICULUM_TIERS.find((t) => t.id === id);
}
