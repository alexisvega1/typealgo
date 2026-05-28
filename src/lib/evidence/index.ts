export { EVIDENCE_SOURCE_REGISTRY, getEvidenceSourceMeta } from "./sources";
export {
  MOTIF_COMPANY_PRIORS,
  PATTERN_COMPANY_PRIORS,
  PATTERN_SOPHISTICATION,
  LEVEL_SOPHISTICATION_EXPECTATION,
} from "./priors";
export { SNIPPET_EVIDENCE_OVERRIDES } from "./overrides";
export {
  computeSnippetEvidence,
  getSnippetEvidence,
  evidenceCompanyWeight,
  evidenceLevelWeight,
} from "./scoring";
export { buildPositioningLabels, trackEvidenceSummary } from "./positioning";

import { SNIPPETS } from "@/data/curriculum";
import { SNIPPET_EVIDENCE_OVERRIDES } from "./overrides";
import { getSnippetEvidence } from "./scoring";
import type { CompanyTrackId, SnippetEvidenceProfile } from "@/lib/types";

export function evidenceEngineSummary() {
  const profiles = SNIPPETS.map(getSnippetEvidence);
  const high = profiles.filter((p) => p.confidenceBand === "high").length;
  const medium = profiles.filter((p) => p.confidenceBand === "medium").length;

  return {
    snippetCount: SNIPPETS.length,
    highConfidence: high,
    mediumConfidence: medium,
    lowConfidence: profiles.length - high - medium,
    curatedOverrides: Object.keys(SNIPPET_EVIDENCE_OVERRIDES).length,
  };
}

export function topSnippetsForTrack(
  trackId: CompanyTrackId,
  limit = 5,
): { snippetId: string; weight: number; profile: SnippetEvidenceProfile }[] {
  return SNIPPETS.map((s) => {
    const profile = getSnippetEvidence(s);
    const weight = profile.companyWeights[trackId] ?? profile.universalScore;
    return { snippetId: s.id, weight, profile };
  })
    .sort((a, b) => b.weight - a.weight)
    .slice(0, limit);
}
