import type { CompanyTrackId, ImplementedLanguage, LanguageId, LanguageTier } from "@/lib/types";

export interface LanguageEcosystem {
  id: LanguageId;
  name: string;
  tier: LanguageTier;
  /** Snippets available in curriculum today. */
  implemented: boolean;
  hiringDemand: number;
  description: string;
  ecosystems: string[];
  /** Near-term expansion priority (1 = highest among unimplemented). */
  expansionPriority?: number;
}

export const LANGUAGE_ECOSYSTEMS: LanguageEcosystem[] = [
  // Tier 1 — essential
  {
    id: "python",
    name: "Python",
    tier: "tier-1",
    implemented: true,
    hiringDemand: 0.98,
    description: "AI, ML, backend, interviews",
    ecosystems: ["algorithms", "ml", "backend", "research"],
  },
  {
    id: "typescript",
    name: "TypeScript",
    tier: "tier-1",
    implemented: false,
    hiringDemand: 0.92,
    description: "Modern full-stack and web",
    ecosystems: ["web", "full-stack", "meta-style"],
    expansionPriority: 1,
  },
  {
    id: "javascript",
    name: "JavaScript",
    tier: "tier-1",
    implemented: true,
    hiringDemand: 0.88,
    description: "Interview ubiquity + frontend",
    ecosystems: ["web", "full-stack"],
  },
  {
    id: "go",
    name: "Go",
    tier: "tier-1",
    implemented: false,
    hiringDemand: 0.86,
    description: "Cloud, backend, infra",
    ecosystems: ["backend", "cloud", "google-style"],
    expansionPriority: 2,
  },
  {
    id: "java",
    name: "Java",
    tier: "tier-1",
    implemented: true,
    hiringDemand: 0.84,
    description: "Enterprise + breadth interviews",
    ecosystems: ["enterprise", "backend", "google-style"],
  },
  {
    id: "cpp",
    name: "C++",
    tier: "tier-1",
    implemented: true,
    hiringDemand: 0.8,
    description: "Systems, HFT, competitive programming",
    ecosystems: ["systems", "hft", "competitive"],
  },
  {
    id: "sql",
    name: "SQL",
    tier: "tier-1",
    implemented: false,
    hiringDemand: 0.82,
    description: "Data and backend fluency",
    ecosystems: ["data", "backend", "analytics"],
    expansionPriority: 3,
  },
  {
    id: "rust",
    name: "Rust",
    tier: "tier-1",
    implemented: false,
    hiringDemand: 0.78,
    description: "Systems, infra, AI infra trajectory",
    ecosystems: ["systems", "infra", "ai-infra"],
    expansionPriority: 4,
  },
  // Tier 2 — specialized
  {
    id: "ocaml",
    name: "OCaml",
    tier: "tier-2",
    implemented: false,
    hiringDemand: 0.55,
    description: "Jane Street / quant functional style",
    ecosystems: ["quant", "functional"],
    expansionPriority: 5,
  },
  {
    id: "bash",
    name: "Bash",
    tier: "tier-2",
    implemented: false,
    hiringDemand: 0.62,
    description: "Infra, devops, backend tooling",
    ecosystems: ["infra", "devops"],
  },
  {
    id: "kotlin",
    name: "Kotlin",
    tier: "tier-2",
    implemented: false,
    hiringDemand: 0.58,
    description: "Android / mobile",
    ecosystems: ["mobile", "android"],
  },
  {
    id: "swift",
    name: "Swift",
    tier: "tier-2",
    implemented: false,
    hiringDemand: 0.56,
    description: "iOS ecosystem",
    ecosystems: ["mobile", "ios"],
  },
  {
    id: "scala",
    name: "Scala",
    tier: "tier-2",
    implemented: false,
    hiringDemand: 0.54,
    description: "Distributed systems / data infra",
    ecosystems: ["distributed", "data-infra"],
  },
  {
    id: "cuda",
    name: "CUDA",
    tier: "tier-2",
    implemented: false,
    hiringDemand: 0.6,
    description: "Advanced ML systems kernels",
    ecosystems: ["ml-systems", "gpu"],
  },
  {
    id: "r",
    name: "R",
    tier: "tier-2",
    implemented: false,
    hiringDemand: 0.48,
    description: "Data science / research",
    ecosystems: ["data-science", "research"],
  },
  // Tier 3 — architected, not prioritized
];

/** Tier 3 — architected for future expansion (Mojo, Zig, Elixir, etc.). */
export const TIER3_PLANNED = [
  "mojo",
  "zig",
  "clojure",
  "haskell",
  "elixir",
  "julia",
] as const;

export function getLanguageEcosystem(id: LanguageId): LanguageEcosystem | undefined {
  return LANGUAGE_ECOSYSTEMS.find((l) => l.id === id);
}

export function implementedLanguages(): LanguageEcosystem[] {
  return LANGUAGE_ECOSYSTEMS.filter((l) => l.implemented);
}

export function languagesByTier(tier: LanguageTier): LanguageEcosystem[] {
  return LANGUAGE_ECOSYSTEMS.filter((l) => l.tier === tier);
}

export function expansionRoadmap(limit = 8): LanguageEcosystem[] {
  return LANGUAGE_ECOSYSTEMS.filter((l) => !l.implemented && l.expansionPriority != null)
    .sort((a, b) => (a.expansionPriority ?? 99) - (b.expansionPriority ?? 99))
    .slice(0, limit);
}

/** Track-weighted language relevance (probabilistic, not deterministic). */
export const TRACK_LANGUAGE_WEIGHTS: Partial<
  Record<CompanyTrackId, Partial<Record<LanguageId, number>>>
> = {
  meta: { python: 0.85, typescript: 0.78, javascript: 0.72, go: 0.45, java: 0.5, cpp: 0.55, rust: 0.4 },
  google: { go: 0.82, java: 0.85, cpp: 0.8, python: 0.78, typescript: 0.72, rust: 0.65, sql: 0.6 },
  openai: { python: 0.92, go: 0.68, rust: 0.62, typescript: 0.55, sql: 0.58, bash: 0.52 },
  anthropic: { python: 0.9, go: 0.65, rust: 0.6, typescript: 0.52, bash: 0.5 },
  deepmind: { python: 0.88, cpp: 0.72, java: 0.55, rust: 0.5, r: 0.45 },
  "jane-street": { ocaml: 0.88, python: 0.62, cpp: 0.58, java: 0.45 },
};

export function trackLanguageWeight(trackId: CompanyTrackId, languageId: LanguageId): number {
  if (trackId === "general") return 0.7;
  return TRACK_LANGUAGE_WEIGHTS[trackId]?.[languageId] ?? 0.4;
}

export function isImplementedLanguage(id: string): id is ImplementedLanguage {
  return implementedLanguages().some((l) => l.id === id);
}
