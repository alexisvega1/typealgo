import type { RecallMode, Snippet, TrainingMode, TypingResult, CareerLevelId, CompanyTrackId } from "@/lib/types";
import type { FilterOptions } from "@/data/curriculum";
import { applyTrackCoaching } from "@/lib/curriculum-engine";
import { buildPredictiveInsights } from "./predictive";
import { buildRecommendation } from "./suggestive";
import { generateTrainingPlan } from "./training-plan";
import type { CoachAnalysis, TrainingPlan } from "./types";

export type { CoachAnalysis, CoachRecommendation, PredictiveInsights, TrainingPlan } from "./types";
export { generateTrainingPlan } from "./training-plan";
export { pickTopSnippet } from "./suggestive";

export interface AnalyzeSessionOptions {
  result: TypingResult;
  snippet: Snippet;
  allResults: TypingResult[];
  recallMode: RecallMode;
  filterOpts: FilterOptions;
  companyTrack?: CompanyTrackId;
  careerLevel?: CareerLevelId;
}

/** Main entry — session-end coaching from heuristics over existing stats. */
export function analyzeSession(opts: AnalyzeSessionOptions): CoachAnalysis {
  const { result, snippet, allResults, recallMode, filterOpts, companyTrack = "general", careerLevel = "mid" } = opts;
  const history = allResults.some((r) => r.id === result.id)
    ? allResults
    : [...allResults, result];

  const baseRecommendation = buildRecommendation({
    result,
    snippet,
    allResults: history,
    recallMode,
    filterOpts: { ...filterOpts, companyTrack, careerLevel },
  });

  const recommendation = applyTrackCoaching(baseRecommendation, companyTrack);

  const predictive = buildPredictiveInsights(history, snippet.motifs);

  return { predictive, recommendation };
}

export function buildDailyPlan(
  allResults: TypingResult[],
  filterOpts: FilterOptions,
): TrainingPlan {
  return generateTrainingPlan(allResults, filterOpts);
}

export function applySuggestedRecallMode(
  analysis: CoachAnalysis,
  setRecallMode: (mode: RecallMode) => void,
  setTrainingMode?: (mode: TrainingMode) => void,
): void {
  const mode = analysis.recommendation.suggestedRecallMode;
  if (!mode) return;
  if (mode === "full-copy") {
    setTrainingMode?.("type");
  } else {
    setTrainingMode?.("recall");
    setRecallMode(mode);
  }
}
