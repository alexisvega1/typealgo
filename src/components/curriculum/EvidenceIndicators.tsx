"use client";

import { getSnippetEvidence, trackEvidenceSummary } from "@/lib/evidence";
import type { CompanyTrackId, Snippet } from "@/lib/types";

const CONFIDENCE_STYLE = {
  high: "evidence-chip-high",
  medium: "evidence-chip-medium",
  low: "evidence-chip-low",
} as const;

interface EvidenceIndicatorsProps {
  snippet: Snippet;
  companyTrack?: CompanyTrackId;
  compact?: boolean;
}

/** Subtle evidence labels — max 2 visible to avoid clutter. */
export function EvidenceIndicators({
  snippet,
  companyTrack = "general",
  compact = false,
}: EvidenceIndicatorsProps) {
  const evidence = getSnippetEvidence(snippet);
  const labels = evidence.positioningLabels.slice(0, compact ? 1 : 2);

  if (labels.length === 0 && companyTrack === "general") return null;

  const trackWeight =
    companyTrack === "general"
      ? evidence.universalScore
      : evidence.companyWeights[companyTrack] ?? evidence.universalScore;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className={`evidence-chip ${CONFIDENCE_STYLE[evidence.confidenceBand]}`}>
        {evidence.confidenceBand === "high"
          ? "High confidence"
          : evidence.confidenceBand === "medium"
            ? "Moderate confidence"
            : "Low confidence"}
      </span>
      {labels.map((label) => (
        <span key={label} className="evidence-chip evidence-chip-neutral">
          {label}
        </span>
      ))}
      {!compact && companyTrack !== "general" && (
        <span className="text-xs text-muted" title={trackEvidenceSummary(companyTrack, trackWeight, evidence.confidenceBand)}>
          ~{Math.round(trackWeight * 100)}% track association
        </span>
      )}
    </div>
  );
}
