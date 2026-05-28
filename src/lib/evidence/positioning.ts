import type { CompanyTrackId, SnippetEvidenceProfile } from "@/lib/types";

const COMPANY_LABEL: Record<CompanyTrackId, string> = {
  general: "universal interview prep",
  meta: "graph-heavy, speed-oriented prep",
  google: "breadth + correctness-oriented prep",
  openai: "ML/backend-oriented prep",
  anthropic: "Python backend + ML infra prep",
  deepmind: "algorithm + research engineering prep",
  "jane-street": "quant/math precision prep",
};

export function buildPositioningLabels(
  companyWeights: Partial<Record<CompanyTrackId, number>>,
  universalScore: number,
  sophistication: SnippetEvidenceProfile["sophistication"],
): string[] {
  const labels: string[] = [];

  if (universalScore >= 0.82) {
    labels.push("Broadly used interview motif");
  }

  const ranked = (Object.entries(companyWeights) as [CompanyTrackId, number][])
    .filter(([id]) => id !== "general")
    .sort((a, b) => b[1] - a[1]);

  const top = ranked[0];
  if (top && top[1] >= 0.78) {
    if (top[0] === "meta") labels.push("Common graph-heavy interview motif");
    else if (top[0] === "openai" || top[0] === "anthropic")
      labels.push("Backend/ML-oriented pattern");
    else if (top[0] === "deepmind") labels.push("Research-heavy algorithm motif");
    else if (top[0] === "jane-street") labels.push("Quant-style precision motif");
    else if (top[0] === "google") labels.push("Common breadth-oriented pattern");
  }

  if (sophistication.systems >= 0.45) {
    labels.push("Systems-oriented implementation");
  }
  if (sophistication.implementationPressure >= 0.55) {
    labels.push("High-speed implementation pattern");
  }

  return [...new Set(labels)].slice(0, 3);
}

export function trackEvidenceSummary(
  trackId: CompanyTrackId,
  snippetWeight: number,
  confidenceBand: SnippetEvidenceProfile["confidenceBand"],
): string {
  const pct = Math.round(snippetWeight * 100);
  const conf =
    confidenceBand === "high"
      ? "High confidence"
      : confidenceBand === "medium"
        ? "Moderate confidence"
        : "Low confidence — motif priors only";

  if (trackId === "general") {
    return `${conf} · Universal prep relevance`;
  }

  return `${conf} · ~${pct}% association with ${COMPANY_LABEL[trackId]} discussions (not a company claim)`;
}
