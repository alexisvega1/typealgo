"use client";

import { formatAnimatedStat, useAnimatedNumber } from "@/lib/use-animated-number";

interface LiveStatsProps {
  wpm: number;
  accuracy: number;
  started: boolean;
  recallAccuracy?: number | null;
  showRecall?: boolean;
}

export function LiveStats({ wpm, accuracy, started, recallAccuracy, showRecall }: LiveStatsProps) {
  const displayWpm = useAnimatedNumber(wpm, started);
  const displayAcc = useAnimatedNumber(accuracy, started);
  const displayRecall = useAnimatedNumber(recallAccuracy ?? 0, started && showRecall === true);

  return (
    <div className="live-stats">
      <div className="stat-block">
        <div className="stat-value">{started ? formatAnimatedStat(displayWpm, 1) : "—"}</div>
        <div className="stat-label">wpm</div>
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
