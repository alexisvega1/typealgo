export { CONTENT_SOURCES, getContentSource } from "./sources";
export { CANONICAL_STANDARDS, validateDraft, normalizeCode } from "./standards";
export type { ValidationIssue } from "./standards";
export {
  extractMotifsFromCode,
  decomposeIntoMotifChunks,
} from "./motif-extractor";
export type { MotifChunk } from "./motif-extractor";
export {
  buildPrerequisiteGraph,
  validatePrerequisiteGraph,
  getLearningPath,
} from "./prerequisite-graph";
export type { PrerequisiteGraph, PrerequisiteNode } from "./prerequisite-graph";
export {
  ingestDraft,
  ingestBatch,
  IngestionError,
  sortByProgression,
  DIFFICULTY_ORDER,
} from "./pipeline";
export type { IngestionResult, IngestionBatchResult } from "./pipeline";
export {
  CONTENT_PACKS,
  getContentPack,
  packsByStatus,
  activePacks,
  plannedPacks,
} from "./packs";
export {
  buildVariantIndex,
  getVariants,
  registerVariantLink,
  VARIANT_RELATIONS,
} from "./variants";
export type { VariantFamily, VariantLink, VariantRelation } from "./variants";
export {
  ML_ENGINEERING_DOMAINS,
  ML_TRAINING_MODES,
  ML_INTERVIEW_TASK_TYPES,
} from "./ml-expansion";

import { SNIPPETS } from "@/data/curriculum";
import type { CurriculumTier } from "@/lib/types";
import { buildPrerequisiteGraph, validatePrerequisiteGraph } from "./prerequisite-graph";
import { activePacks, plannedPacks } from "./packs";
import { CONTENT_SOURCES } from "./sources";

const TIER_TO_PACK: Record<CurriculumTier, string> = {
  "core-reflex": "core-reflex",
  "interview-fluency": "interview-blind-track",
  "advanced-fluency": "advanced-competitive",
};

export function snippetCountForPack(packId: string): number {
  const explicit = SNIPPETS.filter((s) => s.packIds?.includes(packId)).length;
  if (explicit > 0) return explicit;

  const tier = (Object.entries(TIER_TO_PACK).find(([, id]) => id === packId)?.[0] ??
    null) as CurriculumTier | null;
  if (tier) return SNIPPETS.filter((s) => s.tier === tier).length;

  return 0;
}

export function contentArchitectureSummary() {
  const graph = buildPrerequisiteGraph();
  const graphErrors = validatePrerequisiteGraph(graph);
  const withPrereqs = SNIPPETS.filter((s) => (s.prerequisites?.length ?? 0) > 0).length;
  const withMotifs = SNIPPETS.filter((s) => s.motifs.length > 0).length;

  return {
    snippetCount: SNIPPETS.length,
    withPrerequisites: withPrereqs,
    withMotifs,
    graphDepth: graph.maxDepth,
    graphRoots: graph.roots.length,
    graphValid: graphErrors.length === 0,
    graphErrors,
    sourceCount: CONTENT_SOURCES.length,
    activePacks: activePacks().length,
    plannedPacks: plannedPacks().length,
  };
}
