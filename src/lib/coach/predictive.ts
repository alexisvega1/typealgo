import { getSnippet } from "@/data/curriculum";
import { getMotifInfo } from "@/data/curriculum/motifs";
import type { SyntaxMotif, TypingResult } from "@/lib/types";
import type { MotifMasteryEstimate, PredictiveInsights, RecallTrend } from "./types";
import { clamp, confidenceLabelFromScore, linearTrend, mean, stdDev } from "./utils";

/** Project next-session WPM from recent history + momentum. */
export function predictNextWpmRange(results: TypingResult[]): { low: number; high: number } {
  const recent = results.slice(-8);
  if (recent.length === 0) return { low: 28, high: 42 };

  const wpms = recent.map((r) => r.wpm);
  const avg = mean(wpms);
  const spread = stdDev(wpms) || 4;
  const momentum = linearTrend(wpms.slice(-4)) * 0.25;

  const center = avg + momentum;
  return {
    low: Math.max(0, Math.round((center - spread) * 10) / 10),
    high: Math.round((center + spread) * 10) / 10,
  };
}

/** Compare recent vs prior recall confidence scores. */
export function predictRecallTrend(results: TypingResult[]): RecallTrend {
  const withRecall = results.filter((r) => r.recallMetrics).slice(-8);
  if (withRecall.length < 2) return "unknown";

  const scores = withRecall.map((r) => r.recallMetrics!.confidenceScore);
  if (withRecall.length < 4) {
    return linearTrend(scores) > 4 ? "rising" : linearTrend(scores) < -4 ? "falling" : "stable";
  }

  const recent = mean(scores.slice(-3));
  const prior = mean(scores.slice(0, -3));
  const delta = recent - prior;
  if (delta > 5) return "rising";
  if (delta < -5) return "falling";
  return "stable";
}

function blankHesitationForMotif(motif: SyntaxMotif, results: TypingResult[]): number {
  const relevant = results.filter((r) => getSnippet(r.snippetId)?.motifs.includes(motif));
  const hesitations = relevant
    .map((r) => r.recallMetrics?.avgBlankHesitationMs ?? 0)
    .filter((h) => h > 0);
  return hesitations.length ? mean(hesitations) : 0;
}

function improvementRateForMotif(motif: SyntaxMotif, results: TypingResult[]): number {
  const relevant = results.filter((r) => getSnippet(r.snippetId)?.motifs.includes(motif));
  if (relevant.length < 2) return 6;

  const scores = relevant.slice(-5).map((r) => {
    const recall = r.recallMetrics?.recallAccuracy ?? r.accuracy;
    return r.accuracy * 0.4 + recall * 0.6;
  });
  return Math.max(2, linearTrend(scores) / Math.max(1, scores.length - 1) + 4);
}

/** Heuristic mastery score per motif — replaceable with ML later. */
export function estimateMotifMastery(
  motif: SyntaxMotif,
  results: TypingResult[],
): MotifMasteryEstimate {
  const label = getMotifInfo(motif)?.label ?? motif;
  const relevant = results.filter((r) => getSnippet(r.snippetId)?.motifs.includes(motif));

  if (relevant.length === 0) {
    return {
      motif,
      label,
      masteryProbability: 15,
      timeToMasteryDays: null,
      confidenceLabel: "needs-reinforcement",
    };
  }

  const recent = relevant.slice(-4);
  const avgAcc = mean(recent.map((r) => r.accuracy));
  const avgRecall = mean(
    recent.map((r) => r.recallMetrics?.recallAccuracy ?? r.accuracy),
  );
  const hesitation = blankHesitationForMotif(motif, results);
  const exposure = Math.min(relevant.length * 6, 30);

  let score =
    avgAcc * 0.3 +
    avgRecall * 0.35 +
    exposure -
    Math.min(hesitation / 20, 18) -
    mean(recent.map((r) => r.incorrectChars)) * 1.5;

  score = clamp(Math.round(score), 0, 100);

  let timeToMasteryDays: number | null = null;
  if (score < 85) {
    const rate = improvementRateForMotif(motif, results);
    const sessionsNeeded = Math.ceil((85 - score) / rate);
    const sessionsPerDay = Math.max(1, estimateSessionsPerDay(results));
    timeToMasteryDays = Math.ceil(sessionsNeeded / sessionsPerDay);
  }

  return {
    motif,
    label,
    masteryProbability: score,
    timeToMasteryDays,
    confidenceLabel: confidenceLabelFromScore(score),
  };
}

function estimateSessionsPerDay(results: TypingResult[]): number {
  if (results.length < 2) return 1;
  const spanDays =
    (results[results.length - 1].timestamp - results[0].timestamp) / 86400000;
  if (spanDays < 1) return results.length;
  return Math.max(1, results.length / spanDays);
}

/** Flag flat WPM / accuracy / recall over recent sessions. */
export function detectPlateauRisk(results: TypingResult[]): {
  atRisk: boolean;
  reason?: string;
} {
  const recent = results.slice(-5);
  if (recent.length < 4) return { atRisk: false };

  const wpms = recent.map((r) => r.wpm);
  const accs = recent.map((r) => r.accuracy);
  const wpmFlat = stdDev(wpms) < 2.5 && Math.max(...wpms) - Math.min(...wpms) < 4;
  const accFlat = stdDev(accs) < 2 && Math.max(...accs) - Math.min(...accs) < 4;

  const recallSessions = recent.filter((r) => r.recallMetrics);
  let recallFlat = true;
  if (recallSessions.length >= 3) {
    const recalls = recallSessions.map((r) => r.recallMetrics!.recallAccuracy);
    recallFlat = Math.max(...recalls) - Math.min(...recalls) < 6;
  }

  if (wpmFlat && accFlat && recallFlat) {
    return {
      atRisk: true,
      reason: "WPM, accuracy, and recall have been flat over your last few sessions.",
    };
  }
  if (wpmFlat && accFlat) {
    return {
      atRisk: true,
      reason: "Speed and accuracy haven't moved — try harder recall or a weak motif drill.",
    };
  }
  return { atRisk: false };
}

export function buildPredictiveInsights(
  results: TypingResult[],
  focusMotifs: SyntaxMotif[],
): PredictiveInsights {
  const plateau = detectPlateauRisk(results);
  const motifMastery = focusMotifs
    .map((m) => estimateMotifMastery(m, results))
    .sort((a, b) => a.masteryProbability - b.masteryProbability)
    .slice(0, 3);

  return {
    nextWpmRange: predictNextWpmRange(results),
    recallTrend: predictRecallTrend(results),
    motifMastery,
    plateauRisk: plateau.atRisk,
    plateauReason: plateau.reason,
  };
}
