import type { RecallMode, SyntaxMotif, TypingResult } from "@/lib/types";

export type CoachAction =
  | "retry-same"
  | "continue-next"
  | "easier-recall"
  | "harder-recall"
  | "practice-prerequisite";

export type ConfidenceLabel =
  | "high-confidence"
  | "needs-reinforcement"
  | "likely-mastered"
  | "plateau-risk";

export type RecallTrend = "rising" | "stable" | "falling" | "unknown";

export interface MotifMasteryEstimate {
  motif: SyntaxMotif;
  label: string;
  masteryProbability: number;
  timeToMasteryDays: number | null;
  confidenceLabel: ConfidenceLabel;
}

export interface PredictiveInsights {
  nextWpmRange: { low: number; high: number };
  recallTrend: RecallTrend;
  motifMastery: MotifMasteryEstimate[];
  plateauRisk: boolean;
  plateauReason?: string;
}

export interface WeakMotifRef {
  motif: SyntaxMotif;
  label: string;
}

export interface CoachRecommendation {
  action: CoachAction;
  headline: string;
  explanation: string;
  confidenceLabel: ConfidenceLabel;
  suggestedSnippetId?: string;
  suggestedSnippetTitle?: string;
  suggestedRecallMode?: RecallMode;
  weakMotifs: WeakMotifRef[];
}

export interface CoachAnalysis {
  predictive: PredictiveInsights;
  recommendation: CoachRecommendation;
}

export type DrillPurpose = "reinforce" | "retry" | "resurface" | "new-pattern";

export interface TrainingPlanItem {
  order: number;
  snippetId: string;
  snippetTitle: string;
  purpose: DrillPurpose;
  purposeLabel: string;
  estimatedMinutes: number;
  motifLabel?: string;
}

export interface TrainingPlan {
  items: TrainingPlanItem[];
  totalEstimatedMinutes: number;
}

export interface CoachContext {
  result: TypingResult;
  snippetId: string;
  allResults: TypingResult[];
  recallMode: RecallMode;
}
