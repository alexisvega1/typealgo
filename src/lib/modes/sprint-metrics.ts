import { hesitationHotspots } from "@/lib/metrics";
import type { KeystrokeEvent, SprintGradingProfile, SprintMetrics } from "@/lib/types";

const DEFAULT_PROFILE: SprintGradingProfile = {
  targetWpm: 40,
  minAccuracy: 88,
  speedWeight: 0.3,
  accuracyWeight: 0.45,
  hesitationPenaltyFactor: 3,
  readinessThresholds: { ready: 85, strong: 72, developing: 58 },
  gradeLabels: {
    ready: "Interview ready",
    strong: "Strong under pressure",
    developing: "Developing",
  },
};

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

/** Heuristic sprint grading — replaceable with ML later. */
export function computeSprintMetrics(
  keystrokes: KeystrokeEvent[],
  code: string,
  accuracy: number,
  wpm: number,
  durationMs: number,
  incorrectChars: number,
  profile: SprintGradingProfile = DEFAULT_PROFILE,
): SprintMetrics {
  const typed = keystrokes.filter((k) => !k.autoIndent);
  const hesitations = typed.filter((k) => k.delayMs > 350);
  const corrections = typed.filter((k) => !k.correct).length;
  const minutes = Math.max(durationMs / 60000, 0.01);
  const hesitationDensity = Math.round(hesitations.length / minutes);

  const hotspots = hesitationHotspots(keystrokes, code);
  const insights: string[] = [];

  if (accuracy >= profile.minAccuracy && hesitationDensity <= 4) {
    insights.push("Likely strong under pressure");
  }
  if (accuracy >= profile.minAccuracy - 2 && wpm >= profile.targetWpm * 0.75) {
    insights.push("Implementation fluency trending positive");
  }
  if (hesitationDensity > 8) {
    insights.push("High hesitation density — boundary syntax needs drill");
  }
  if (corrections >= 5) {
    insights.push("Correction count elevated — review weak tokens");
  }

  for (const h of hotspots.slice(0, 2)) {
    if (h.avgDelayMs > 400) {
      insights.push(`Boundary hesitation on "${h.token}" (${h.avgDelayMs}ms)`);
    } else if (h.errors > 0) {
      insights.push(`Syntax correction pressure on "${h.token}"`);
    }
  }

  if (insights.length === 0) {
    insights.push(
      accuracy >= 90
        ? "Clean execution — push harder snippets next"
        : "Solid attempt — one more rep for fluency",
    );
  }

  const wpmFactor = clamp(wpm / profile.targetWpm, 0, 1) * 100;
  const accFactor = accuracy;
  const hesitationPenalty = clamp(hesitationDensity * profile.hesitationPenaltyFactor, 0, 35);
  const correctionPenalty = clamp(corrections * 2.5, 0, 25);

  const interviewReadiness = Math.round(
    clamp(
      accFactor * profile.accuracyWeight +
        wpmFactor * profile.speedWeight +
        (100 - hesitationPenalty) * 0.15 +
        (100 - correctionPenalty) * 0.1,
      0,
      100,
    ),
  );

  const implementationConfidence = Math.round(
    clamp(
      accuracy * 0.5 +
        Math.max(0, 100 - hesitationDensity * 4) * 0.3 +
        Math.max(0, 100 - corrections * 5) * 0.2,
      0,
      100,
    ),
  );

  let gradeLabel = profile.gradeLabels.developing;
  const { ready, strong } = profile.readinessThresholds;
  if (interviewReadiness >= ready) gradeLabel = profile.gradeLabels.ready;
  else if (interviewReadiness >= strong) gradeLabel = profile.gradeLabels.strong;

  return {
    interviewReadiness,
    implementationConfidence,
    hesitationDensity,
    correctionCount: corrections,
    gradeLabel,
    insights: insights.slice(0, 4),
  };
}
