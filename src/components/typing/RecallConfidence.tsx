"use client";

interface RecallConfidenceProps {
  score: number;
  recallAccuracy: number;
  visible: boolean;
  showRevealHint: boolean;
}

export function RecallConfidence({
  score,
  recallAccuracy,
  visible,
  showRevealHint,
}: RecallConfidenceProps) {
  if (!visible) return null;

  return (
    <div className="recall-confidence" aria-live="polite">
      <div className="recall-confidence-row">
        <span className="recall-confidence-label">Recall</span>
        <span className="recall-confidence-value">{recallAccuracy.toFixed(0)}%</span>
        <div className="recall-confidence-track">
          <div
            className="recall-confidence-fill"
            style={{ width: `${Math.min(100, score)}%` }}
          />
        </div>
      </div>
      {showRevealHint && (
        <p className="recall-hint">
          Hesitating? Press <kbd className="kbd">?</kbd> to reveal
        </p>
      )}
    </div>
  );
}
