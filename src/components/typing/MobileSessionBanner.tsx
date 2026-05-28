"use client";

import type { DeviceClass, TrainingMode } from "@/lib/types";
import { isTouchDeviceClass } from "@/lib/device-class";

interface MobileSessionBannerProps {
  deviceClass: DeviceClass;
  trainingMode: TrainingMode;
  onSwitchToRecall?: () => void;
  onSwitchToReview?: () => void;
}

export function MobileSessionBanner({
  deviceClass,
  trainingMode,
  onSwitchToRecall,
  onSwitchToReview,
}: MobileSessionBannerProps) {
  if (!isTouchDeviceClass(deviceClass)) return null;

  const isBenchmarkMode = trainingMode === "type" || trainingMode === "sprint";

  return (
    <div className="mobile-session-banner" role="note">
      <p className="mobile-session-banner-text">
        {isBenchmarkMode
          ? "Mobile sessions are optimized for review and recall. Desktop is recommended for speed benchmarking."
          : "Mobile practice — focus on motif recall and consolidation, not raw WPM."}
      </p>
      {trainingMode === "review" && onSwitchToRecall && (
        <button type="button" className="mobile-banner-btn" onClick={onSwitchToRecall}>
          Start token recall
        </button>
      )}
      {(trainingMode === "type" || trainingMode === "sprint") && onSwitchToReview && (
        <button type="button" className="mobile-banner-btn" onClick={onSwitchToReview}>
          Switch to review
        </button>
      )}
    </div>
  );
}
