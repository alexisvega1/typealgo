"use client";

import { getSnippet } from "@/data/curriculum";
import { MOTIF_WHY_IT_MATTERS } from "@/lib/modes/motif-notes";
import type { MotifReviewStat, ReviewAnalytics } from "@/lib/modes/review-analytics";
import type { Snippet, SyntaxMotif } from "@/lib/types";

interface ReviewWorkspaceProps {
  snippet: Snippet;
  analytics: ReviewAnalytics;
  activeLine: number;
  lineCount: number;
  focusedMotif: SyntaxMotif | null;
  onLineChange: (line: number) => void;
  onMotifFocus: (motif: SyntaxMotif | null) => void;
}

export function ReviewWorkspace({
  snippet,
  analytics,
  activeLine,
  lineCount,
  focusedMotif,
  onLineChange,
  onMotifFocus,
}: ReviewWorkspaceProps) {
  const prereqTitles =
    snippet.prerequisites
      ?.map((id) => getSnippet(id)?.title ?? id)
      .join(" → ") ?? null;

  return (
    <div className="review-workspace">
      <div className="review-workspace-header">
        <div>
          <h3 className="text-sm font-medium">Consolidation</h3>
          <p className="mt-1 text-xs text-muted leading-relaxed">
            Study and internalize this implementation pattern. Use{" "}
            <kbd className="kbd">↑</kbd>/<kbd className="kbd">↓</kbd> to step lines,{" "}
            <kbd className="kbd">[</kbd>/<kbd className="kbd">]</kbd> to focus motifs.
          </p>
        </div>
        <div className="review-prior-stats">
          {analytics.priorRecallAccuracy != null && (
            <span className="review-prior-stat">
              Prior recall <strong>{analytics.priorRecallAccuracy}%</strong>
            </span>
          )}
          {analytics.priorAccuracy != null && (
            <span className="review-prior-stat">
              Accuracy <strong>{analytics.priorAccuracy}%</strong>
            </span>
          )}
        </div>
      </div>

      <div className="review-line-stepper mt-4">
        <span className="text-xs text-muted uppercase tracking-wider">Line focus</span>
        <div className="mt-2 flex items-center gap-2">
          <button
            type="button"
            className="review-step-btn"
            onClick={() => onLineChange(Math.max(0, activeLine - 1))}
            aria-label="Previous line"
          >
            ↑
          </button>
          <span className="review-line-indicator">
            Line {activeLine + 1} / {lineCount}
          </span>
          <button
            type="button"
            className="review-step-btn"
            onClick={() => onLineChange(Math.min(lineCount - 1, activeLine + 1))}
            aria-label="Next line"
          >
            ↓
          </button>
        </div>
      </div>

      {analytics.hotspotTokens.length > 0 && (
        <div className="mt-4">
          <h4 className="text-xs font-medium uppercase tracking-wider text-muted">
            Hesitation hotspots
          </h4>
          <div className="mt-2 flex flex-wrap gap-2">
            {analytics.hotspotTokens.map((h) => (
              <span key={h.token} className="hotspot-chip">
                <code>{h.token}</code>
                <span className="text-muted">{h.avgDelayMs}ms</span>
                {h.errors > 0 && <span className="text-red">{h.errors} err</span>}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-5">
        <h4 className="text-xs font-medium uppercase tracking-wider text-muted">Syntax motifs</h4>
        <ul className="review-motif-list mt-2">
          {analytics.motifStats.map((stat) => (
            <MotifCard
              key={stat.motif}
              stat={stat}
              active={focusedMotif === stat.motif}
              onSelect={() =>
                onMotifFocus(focusedMotif === stat.motif ? null : stat.motif)
              }
            />
          ))}
        </ul>
      </div>

      {prereqTitles && (
        <div className="mt-4 review-prereq">
          <h4 className="text-xs font-medium uppercase tracking-wider text-muted">
            Prerequisites
          </h4>
          <p className="mt-1 text-xs text-muted">{prereqTitles}</p>
        </div>
      )}
    </div>
  );
}

function MotifCard({
  stat,
  active,
  onSelect,
}: {
  stat: MotifReviewStat;
  active: boolean;
  onSelect: () => void;
}) {
  const why = MOTIF_WHY_IT_MATTERS[stat.motif];

  return (
    <li>
      <button
        type="button"
        className={`review-motif-card${active ? " review-motif-card-active" : ""}`}
        onClick={onSelect}
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="review-motif-label">{stat.label}</span>
          <span className="review-mastery-badge">{stat.masteryProbability}% mastery</span>
          {stat.recallAccuracy != null && (
            <span className="text-xs text-muted">Recall {stat.recallAccuracy}%</span>
          )}
        </div>
        {why && <p className="review-motif-why mt-2">{why}</p>}
        {stat.commonMistakes.length > 0 && (
          <p className="mt-2 text-xs text-muted">
            Common mistakes:{" "}
            {stat.commonMistakes.map((m) => (
              <code key={m} className="mr-1">
                {m}
              </code>
            ))}
          </p>
        )}
      </button>
    </li>
  );
}
