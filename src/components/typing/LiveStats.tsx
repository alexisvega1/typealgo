"use client";

import { formatAnimatedStat, useAnimatedNumber } from "@/lib/use-animated-number";
import { isTouchDeviceClass } from "@/lib/device-class";
import type { DeviceClass } from "@/lib/types";

interface LiveStatsProps {
  wpm: number;
  accuracy: number;
  started: boolean;
  recallAccuracy?: number | null;
  showRecall?: boolean;
  deviceClass?: DeviceClass;
}

export function LiveStats({
  wpm,
  accuracy,
  started,
  recallAccuracy,
  showRecall,
  deviceClass = "desktop-keyboard",
}: LiveStatsProps) {
  const displayWpm = useAnimatedNumber(wpm, started);
  const displayAcc = useAnimatedNumber(accuracy, started);
  const displayRecall = useAnimatedNumber(recallAccuracy ?? 0, started && showRecall === true);
  const touchSession = isTouchDeviceClass(deviceClass);

  return (
    <div className="live-stats">
      <div className="stat-block">
        <div className="stat-value">{started ? formatAnimatedStat(displayWpm, 1) : "—"}</div>
        <div className="stat-label">{touchSession ? "practice wpm" : "wpm"}</div>
      </div>
      <div className="stat-divider" aria-hidden />
      <div className="stat-block">
        <div className="stat-value">{started ? `${formatAnimatedStat(displayAcc, 1)}%` : "—"}</div>
        <div className="stat-label">accuracy</div>
      </div>
      {showRecall && (
        <>
          <div className="stat-divider" aria-hidden />
          <div className="stat-block">
            <div className="stat-value stat-value-recall">
              {started && recallAccuracy != null
                ? `${formatAnimatedStat(displayRecall, 1)}%`
                : "—"}
            </div>
            <div className="stat-label">recall</div>
          </div>
        </>
      )}
    </div>
  );
}
