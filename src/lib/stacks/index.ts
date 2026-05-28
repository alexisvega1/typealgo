export {
  LANGUAGE_ECOSYSTEMS,
  TRACK_LANGUAGE_WEIGHTS,
  TIER3_PLANNED,
  getLanguageEcosystem,
  implementedLanguages,
  languagesByTier,
  expansionRoadmap,
  trackLanguageWeight,
  isImplementedLanguage,
} from "./languages";
export type { LanguageEcosystem } from "./languages";

export {
  FRAMEWORK_FLUENCY_TRACKS,
  getFrameworkTrack,
  frameworksForLanguage,
  frameworkTrackWeight,
} from "./frameworks";
export type { FrameworkFluencyTrack } from "./frameworks";

export {
  REPO_INTELLIGENCE_SOURCES,
  SEED_REPO_SIGNALS,
  aggregateLanguageMomentum,
  proposeCurriculumAdaptations,
} from "./repo-intelligence";
export type {
  RepoIntelligenceSource,
  RepoIntelligenceSourceKind,
  RepoSignal,
  CurriculumAdaptation,
} from "./repo-intelligence";

import { expansionRoadmap, implementedLanguages, languagesByTier } from "./languages";
import { FRAMEWORK_FLUENCY_TRACKS } from "./frameworks";
import { proposeCurriculumAdaptations, SEED_REPO_SIGNALS } from "./repo-intelligence";
import { TRACK_LANGUAGE_WEIGHTS } from "./languages";
import type { CompanyTrackId, LanguageId } from "@/lib/types";

export function stackArchitectureSummary() {
  return {
    tier1: languagesByTier("tier-1").length,
    tier2: languagesByTier("tier-2").length,
    implemented: implementedLanguages().length,
    frameworks: FRAMEWORK_FLUENCY_TRACKS.length,
    roadmapNext: expansionRoadmap(3).map((l) => l.id),
  };
}

export function liveAdaptationPreview(trackId: CompanyTrackId = "openai") {
  const weights = (TRACK_LANGUAGE_WEIGHTS[trackId] ?? {}) as Partial<Record<LanguageId, number>>;
  return proposeCurriculumAdaptations(SEED_REPO_SIGNALS, weights);
}
