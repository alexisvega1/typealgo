import type {
  CareerLevelId,
  CompanyTrackId,
  EvidenceConfidence,
  Snippet,
  SnippetEvidenceProfile,
  SophisticationScores,
} from "@/lib/types";
import { SNIPPET_EVIDENCE_OVERRIDES } from "./overrides";
import {
  LEVEL_SOPHISTICATION_EXPECTATION,
  MOTIF_COMPANY_PRIORS,
  PATTERN_COMPANY_PRIORS,
  PATTERN_SOPHISTICATION,
} from "./priors";
import { buildPositioningLabels } from "./positioning";

const COMPANY_IDS: CompanyTrackId[] = [
  "general",
  "meta",
  "google",
  "openai",
  "anthropic",
  "deepmind",
  "jane-street",
];

const LEVEL_IDS: CareerLevelId[] = [
  "foundation",
  "junior",
  "mid",
  "senior",
  "staff",
  "research",
];

function clamp01(n: number): number {
  return Math.min(1, Math.max(0, n));
}

function averageMaps(
  maps: Partial<Record<CompanyTrackId, number>>[],
): Partial<Record<CompanyTrackId, number>> {
  const out: Partial<Record<CompanyTrackId, number>> = {};
  for (const id of COMPANY_IDS) {
    const vals = maps.map((m) => m[id]).filter((v): v is number => v != null);
    if (vals.length) out[id] = clamp01(vals.reduce((a, b) => a + b, 0) / vals.length);
  }
  return out;
}

function computeSophistication(snippet: Snippet): SophisticationScores {
  const base = PATTERN_SOPHISTICATION[snippet.pattern];
  const fluencyBoost = (snippet.fluencyLevel - 1) * 0.06;
  const diffBoost = snippet.difficulty === "hard" ? 0.12 : snippet.difficulty === "medium" ? 0.05 : 0;
  return {
    pattern: clamp01(base.pattern + fluencyBoost + diffBoost),
    systems: clamp01(base.systems + (snippet.pattern === "heap" ? 0.08 : 0)),
    implementationPressure: clamp01(base.implementationPressure + fluencyBoost * 0.5),
  };
}

function computeLevelWeights(
  snippet: Snippet,
  sophistication: SophisticationScores,
): Partial<Record<CareerLevelId, number>> {
  const composite = sophistication.pattern * 0.55 + sophistication.systems * 0.25 + sophistication.implementationPressure * 0.2;
  const out: Partial<Record<CareerLevelId, number>> = {};

  for (const level of LEVEL_IDS) {
    const expected = LEVEL_SOPHISTICATION_EXPECTATION[level];
    const distance = Math.abs(composite - expected);
    out[level] = clamp01(1 - distance * 1.35);
  }

  if (snippet.tier === "core-reflex") {
    out.foundation = clamp01((out.foundation ?? 0.5) + 0.15);
    out.junior = clamp01((out.junior ?? 0.5) + 0.1);
  }
  if (snippet.tier === "advanced-fluency") {
    out.senior = clamp01((out.senior ?? 0.5) + 0.12);
    out.research = clamp01((out.research ?? 0.5) + 0.1);
  }

  return out;
}

function computeUniversalScore(weights: Partial<Record<CompanyTrackId, number>>): number {
  const vals = (Object.entries(weights) as [CompanyTrackId, number][])
    .filter(([id]) => id !== "general")
    .map(([, v]) => v);
  if (!vals.length) return 0.5;
  const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
  const variance =
    vals.reduce((a, v) => a + (v - mean) ** 2, 0) / vals.length;
  return clamp01(mean * 0.65 + (1 - Math.sqrt(variance)) * 0.35);
}

function confidenceBand(score: number, hasOverride: boolean, sourceCount: number): EvidenceConfidence {
  if (hasOverride && sourceCount >= 2 && score >= 0.72) return "high";
  if (score >= 0.58 || (hasOverride && sourceCount >= 1)) return "medium";
  return "low";
}

function mergeEvidence(
  computed: SnippetEvidenceProfile,
  override?: Partial<SnippetEvidenceProfile>,
): SnippetEvidenceProfile {
  if (!override) return computed;

  const companyWeights = { ...computed.companyWeights, ...override.companyWeights };
  const levelWeights = { ...computed.levelWeights, ...override.levelWeights };
  const sophistication = override.sophistication
    ? { ...computed.sophistication, ...override.sophistication }
    : computed.sophistication;
  const universalScore = override.universalScore ?? computed.universalScore;
  const positioningLabels =
    override.positioningLabels?.length
      ? override.positioningLabels
      : buildPositioningLabels(companyWeights, universalScore, sophistication);

  const evidenceSources = [
    ...computed.evidenceSources,
    ...(override.evidenceSources ?? []),
  ];

  const confidenceScore = override.confidenceScore ?? computed.confidenceScore;
  const confidenceBand =
    override.confidenceBand ??
    confidenceBandFromScore(confidenceScore, Boolean(override), evidenceSources.length);

  return {
    ...computed,
    ...override,
    companyWeights,
    levelWeights,
    sophistication,
    universalScore,
    positioningLabels,
    evidenceSources,
    confidenceScore,
    confidenceBand,
    motifJustification: override.motifJustification ?? computed.motifJustification,
    popularityScore: override.popularityScore ?? computed.popularityScore,
    recencyScore: override.recencyScore ?? computed.recencyScore,
  };
}

function confidenceBandFromScore(
  score: number,
  hasOverride: boolean,
  sourceCount: number,
): EvidenceConfidence {
  return confidenceBand(score, hasOverride, sourceCount);
}

/** Compute evidence profile from motifs, patterns, and optional overrides. */
export function computeSnippetEvidence(snippet: Snippet): SnippetEvidenceProfile {
  if (snippet.evidence) return snippet.evidence;

  const motifMaps = snippet.motifs.map((m) => MOTIF_COMPANY_PRIORS[m] ?? {});
  const patternMap = PATTERN_COMPANY_PRIORS[snippet.pattern] ?? {};
  const companyWeights = averageMaps([...motifMaps, patternMap]);

  const sophistication = computeSophistication(snippet);
  const levelWeights = computeLevelWeights(snippet, sophistication);
  const universalScore = computeUniversalScore(companyWeights);

  const motifJustification =
    snippet.motifs.length > 0
      ? `Weighted from ${snippet.motifs.join(", ")} motif priors and ${snippet.pattern} pattern sophistication.`
      : `Weighted from ${snippet.pattern} pattern priors and fluency tier.`;

  const confidenceScore = clamp01(
    0.35 +
      (snippet.motifs.length > 0 ? 0.2 : 0) +
      (snippet.tier !== "core-reflex" ? 0.1 : 0) +
      universalScore * 0.2,
  );

  const computed: SnippetEvidenceProfile = {
    companyWeights,
    levelWeights,
    sophistication,
    universalScore,
    confidenceScore,
    confidenceBand: confidenceBand(confidenceScore, false, 1),
    evidenceSources: [
      { kind: "motif-prior", label: "Motif association priors" },
      { kind: "pattern-sophistication", label: "Pattern sophistication model" },
    ],
    motifJustification,
    popularityScore: clamp01(universalScore * 0.7 + (snippet.tier === "interview-fluency" ? 0.25 : 0.1)),
    recencyScore: 0.75,
    positioningLabels: buildPositioningLabels(companyWeights, universalScore, sophistication),
  };

  const override = SNIPPET_EVIDENCE_OVERRIDES[snippet.id];
  return mergeEvidence(computed, override);
}

const evidenceCache = new Map<string, SnippetEvidenceProfile>();

export function getSnippetEvidence(snippet: Snippet): SnippetEvidenceProfile {
  const cached = evidenceCache.get(snippet.id);
  if (cached) return cached;
  const profile = computeSnippetEvidence(snippet);
  evidenceCache.set(snippet.id, profile);
  return profile;
}

/** Evidence-weighted company relevance (0–1) for track selection. */
export function evidenceCompanyWeight(
  snippet: Snippet,
  trackId: CompanyTrackId,
): number {
  if (trackId === "general") return getSnippetEvidence(snippet).universalScore;
  return getSnippetEvidence(snippet).companyWeights[trackId] ?? 0.45;
}

/** Evidence-weighted level fit (0–1). */
export function evidenceLevelWeight(snippet: Snippet, levelId: CareerLevelId): number {
  return getSnippetEvidence(snippet).levelWeights[levelId] ?? 0.5;
}
