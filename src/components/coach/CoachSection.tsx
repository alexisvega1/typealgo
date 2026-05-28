"use client";

import type { CoachAnalysis, ConfidenceLabel, RecallTrend } from "@/lib/coach/types";

const CONFIDENCE_LABELS: Record<ConfidenceLabel, string> = {
  "high-confidence": "High confidence",
  "needs-reinforcement": "Needs reinforcement",
  "likely-mastered": "Likely mastered",
  "plateau-risk": "Plateau risk",
};

const TREND_LABELS: Record<RecallTrend, string> = {
  rising: "Rising",
  stable: "Stable",
  falling: "Falling",
  unknown: "Building baseline",
};

interface CoachSectionProps {
  analysis: CoachAnalysis;
  compact?: boolean;
}

export function CoachSection({ analysis, compact = false }: CoachSectionProps) {
  const { recommendation, predictive } = analysis;
  const primaryMotif = predictive.motifMastery[0];

  return (
    <section className="coach-section">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-sm font-medium text-muted">Coach</h3>
        <span className={`coach-badge coach-badge-${recommendation.confidenceLabel}`}>
          {CONFIDENCE_LABELS[recommendation.confidenceLabel]}
        </span>
        {predictive.plateauRisk && (
          <span className="coach-badge coach-badge-plateau-risk">Plateau risk</span>
        )}
      </div>

      <p className="coach-headline mt-3">{recommendation.headline}</p>
      <p className="coach-explanation mt-1">{recommendation.explanation}</p>

      {!compact && (
        <div className="coach-predictive mt-4 grid gap-3 sm:grid-cols-2">
          <PredictiveTile
            label="Next session WPM"
            value={`${predictive.nextWpmRange.low}–${predictive.nextWpmRange.high}`}
          />
          <PredictiveTile
            label="Recall trend"
            value={TREND_LABELS[predictive.recallTrend]}
          />
          {primaryMotif && (
            <PredictiveTile
              label={`${primaryMotif.label} mastery`}
              value={`${primaryMotif.masteryProbability}%`}
              hint={
                primaryMotif.timeToMasteryDays
                  ? `~${primaryMotif.timeToMasteryDays}d to mastery`
                  : undefined
              }
            />
          )}
          {predictive.plateauRisk && predictive.plateauReason && (
            <PredictiveTile label="Plateau" value="Likely" hint={predictive.plateauReason} />
          )}
        </div>
      )}

      {compact && (
        <p className="coach-predictive-compact mt-3 text-xs text-muted">
          Next WPM {predictive.nextWpmRange.low}–{predictive.nextWpmRange.high}
          {predictive.recallTrend !== "unknown" && (
            <> · Recall {TREND_LABELS[predictive.recallTrend].toLowerCase()}</>
          )}
          {primaryMotif && <> · {primaryMotif.label} {primaryMotif.masteryProbability}% mastery</>}
        </p>
      )}

      {recommendation.weakMotifs.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {recommendation.weakMotifs.map((m) => (
            <span key={m.motif} className="coach-motif-chip">
              {m.label}
            </span>
          ))}
        </div>
      )}

      {recommendation.suggestedRecallMode && (
        <p className="mt-3 text-xs text-muted">
          Suggested mode:{" "}
          <span className="text-foreground">{formatRecallMode(recommendation.suggestedRecallMode)}</span>
        </p>
      )}
    </section>
  );
}

function PredictiveTile({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="coach-predictive-tile">
      <div className="text-xs uppercase tracking-wider text-muted">{label}</div>
      <div className="mt-1 text-lg font-semibold tabular-nums">{value}</div>
      {hint && <div className="mt-0.5 text-xs text-muted">{hint}</div>}
    </div>
  );
}

function formatRecallMode(mode: string): string {
  switch (mode) {
    case "full-copy":
      return "Full Copy";
    case "token-blank":
      return "Token Recall";
    case "line-blank":
      return "Line Recall";
    case "skeleton":
      return "Skeleton Mode";
    default:
      return mode;
  }
}

export function recommendedActionIsRetry(action: CoachAnalysis["recommendation"]["action"]): boolean {
  return action === "retry-same" || action === "practice-prerequisite";
}
