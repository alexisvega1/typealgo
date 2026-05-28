import type { EvidenceConfidence, FrameworkId, LanguageId } from "@/lib/types";

export type RepoIntelligenceSourceKind =
  | "github-trending"
  | "interview-prep-repo"
  | "awesome-list"
  | "ml-systems-repo"
  | "framework-ecosystem"
  | "benchmark-repo"
  | "discuss-aggregate";

export interface RepoIntelligenceSource {
  kind: RepoIntelligenceSourceKind;
  name: string;
  /** What statistical signals we derive — never clone repo content. */
  extractSignals: string[];
}

export const REPO_INTELLIGENCE_SOURCES: RepoIntelligenceSource[] = [
  {
    kind: "github-trending",
    name: "GitHub trending",
    extractSignals: ["language growth", "stars/forks velocity", "topic tag frequency"],
  },
  {
    kind: "interview-prep-repo",
    name: "Interview prep repositories",
    extractSignals: ["motif frequency", "company tag counts", "pattern indexes"],
  },
  {
    kind: "awesome-list",
    name: "Awesome-* curated lists",
    extractSignals: ["ecosystem momentum", "framework mentions", "tooling shifts"],
  },
  {
    kind: "ml-systems-repo",
    name: "ML systems repositories",
    extractSignals: ["API recurrence", "JAX/PyTorch idioms", "kernel patterns"],
  },
  {
    kind: "framework-ecosystem",
    name: "Framework ecosystems",
    extractSignals: ["breaking API motifs", "deprecated pattern decline", "new idioms"],
  },
  {
    kind: "benchmark-repo",
    name: "Benchmark repositories",
    extractSignals: ["implementation variant frequency", "canonical forms"],
  },
  {
    kind: "discuss-aggregate",
    name: "Forum aggregates",
    extractSignals: ["discussion frequency", "stack mention trends"],
  },
];

/** Statistical signal from a public repo/ecosystem — no copyrighted content. */
export interface RepoSignal {
  id: string;
  source: RepoIntelligenceSourceKind;
  capturedAt: number;
  languageId?: LanguageId;
  frameworkId?: FrameworkId;
  motifTags: string[];
  mentionFrequency: number;
  momentumScore: number;
  recencyScore: number;
  referenceLabel: string;
  referenceUrl?: string;
}

export interface CurriculumAdaptation {
  target: "language" | "framework" | "motif";
  targetId: string;
  previousWeight: number;
  newWeight: number;
  delta: number;
  reason: string;
  confidence: EvidenceConfidence;
  signals: string[];
}

/** Aggregate repo signals into language momentum scores (0–1). */
export function aggregateLanguageMomentum(
  signals: RepoSignal[],
): Map<LanguageId, number> {
  const buckets = new Map<LanguageId, { sum: number; count: number }>();

  for (const s of signals) {
    if (!s.languageId) continue;
    const cur = buckets.get(s.languageId) ?? { sum: 0, count: 0 };
    cur.sum += s.mentionFrequency * 0.5 + s.momentumScore * 0.35 + s.recencyScore * 0.15;
    cur.count++;
    buckets.set(s.languageId, cur);
  }

  const out = new Map<LanguageId, number>();
  for (const [id, { sum, count }] of buckets) {
    out.set(id, Math.min(1, sum / count));
  }
  return out;
}

/** Propose curriculum weight shifts from aggregated signals. */
export function proposeCurriculumAdaptations(
  signals: RepoSignal[],
  currentWeights: Partial<Record<LanguageId, number>>,
  minDelta = 0.05,
): CurriculumAdaptation[] {
  const momentum = aggregateLanguageMomentum(signals);
  const adaptations: CurriculumAdaptation[] = [];

  for (const [languageId, score] of momentum) {
    const previous = currentWeights[languageId] ?? 0.5;
    const newWeight = Math.min(1, previous * 0.7 + score * 0.3);
    const delta = newWeight - previous;
    if (Math.abs(delta) < minDelta) continue;

    const related = signals.filter((s) => s.languageId === languageId);
    adaptations.push({
      target: "language",
      targetId: languageId,
      previousWeight: previous,
      newWeight,
      delta,
      reason: `Motif/API recurrence increased across ${related.length} public repo signals`,
      confidence: related.length >= 3 ? "high" : related.length >= 1 ? "medium" : "low",
      signals: related.map((s) => s.referenceLabel).slice(0, 3),
    });
  }

  return adaptations.sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));
}

/** Seed signals for development — replace with live ingestion pipeline. */
export const SEED_REPO_SIGNALS: RepoSignal[] = [
  {
    id: "go-concurrency-2026",
    source: "interview-prep-repo",
    capturedAt: Date.now(),
    languageId: "go",
    motifTags: ["goroutine", "select", "channel", "sync.WaitGroup"],
    mentionFrequency: 0.72,
    momentumScore: 0.68,
    recencyScore: 0.85,
    referenceLabel: "Backend interview prep repos: Go concurrency motif frequency",
  },
  {
    id: "rust-async-2026",
    source: "github-trending",
    capturedAt: Date.now(),
    languageId: "rust",
    motifTags: ["async", "tokio", "Arc", "Mutex"],
    mentionFrequency: 0.65,
    momentumScore: 0.74,
    recencyScore: 0.8,
    referenceLabel: "Infra/AI repos: Rust async idioms trending",
  },
  {
    id: "jax-sharding-2026",
    source: "ml-systems-repo",
    capturedAt: Date.now(),
    languageId: "python",
    frameworkId: "jax",
    motifTags: ["jax.jit", "pjit", "sharding", "jax.vmap"],
    mentionFrequency: 0.58,
    momentumScore: 0.7,
    recencyScore: 0.88,
    referenceLabel: "ML systems repos: JAX sharding API recurrence",
  },
];
