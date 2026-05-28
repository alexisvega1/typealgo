"use client";

import type { TrainingMode } from "@/lib/types";

interface MobileActionBarProps {
  visible: boolean;
  finished?: boolean;
  trainingMode: TrainingMode;
  reviewLine?: number;
  reviewLineCount?: number;
  onRetry?: () => void;
  onNext?: () => void;
  onReviewLinePrev?: () => void;
  onReviewLineNext?: () => void;
  onSetMode?: (mode: TrainingMode) => void;
}

export function MobileActionBar({
  visible,
  finished,
  trainingMode,
  reviewLine = 0,
  reviewLineCount = 0,
  onRetry,
  onNext,
  onReviewLinePrev,
  onReviewLineNext,
  onSetMode,
}: MobileActionBarProps) {
  if (!visible) return null;

  if (finished) {
    return (
      <div className="mobile-action-bar md:hidden" role="toolbar" aria-label="Session actions">
        <button type="button" className="mobile-action-btn mobile-action-primary" onClick={onNext}>
          Next snippet
        </button>
        <button type="button" className="mobile-action-btn mobile-action-secondary" onClick={onRetry}>
          Retry
        </button>
      </div>
    );
  }

  if (trainingMode === "review") {
    return (
      <div className="mobile-action-bar md:hidden" role="toolbar" aria-label="Review controls">
        <button
          type="button"
          className="mobile-action-btn mobile-action-secondary"
          onClick={onReviewLinePrev}
          aria-label="Previous line"
        >
          ↑ Line
        </button>
        <span className="mobile-action-meta">
          {reviewLineCount > 0 ? `${reviewLine + 1} / ${reviewLineCount}` : "Review"}
        </span>
        <button
          type="button"
          className="mobile-action-btn mobile-action-secondary"
          onClick={onReviewLineNext}
          aria-label="Next line"
        >
          Line ↓
        </button>
        {onSetMode && (
          <button
            type="button"
            className="mobile-action-btn mobile-action-primary"
            onClick={() => onSetMode("recall")}
          >
            Recall
          </button>
        )}
      </div>
    );
  }

  if (onSetMode && (trainingMode === "type" || trainingMode === "recall")) {
    return (
      <div className="mobile-action-bar md:hidden" role="toolbar" aria-label="Mode shortcuts">
        {trainingMode === "type" && (
          <button
            type="button"
            className="mobile-action-btn mobile-action-secondary"
            onClick={() => onSetMode("review")}
          >
            Review
          </button>
        )}
        {trainingMode === "recall" && (
          <button
            type="button"
            className="mobile-action-btn mobile-action-secondary"
            onClick={() => onSetMode("review")}
          >
            Review
          </button>
        )}
        {trainingMode === "type" && (
          <button
            type="button"
            className="mobile-action-btn mobile-action-primary"
            onClick={() => onSetMode("recall")}
          >
            Recall
          </button>
        )}
      </div>
    );
  }

  return null;
}
