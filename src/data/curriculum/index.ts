import type { CurriculumTier, Snippet, TypingResult, CareerLevelId, CompanyTrackId } from "@/lib/types";
import { curriculumSnippetWeight, filterForProfile } from "@/lib/curriculum-engine";
import { CORE_REFLEX_SNIPPETS } from "./core-reflex";
import { INTERVIEW_FLUENCY_SNIPPETS } from "./interview-fluency";
import { ADVANCED_FLUENCY_SNIPPETS } from "./advanced-fluency";
import { STAGED_SNIPPETS } from "./staged-problems";
import { GOOGLE_SNIPPETS } from "./company-google";
import { GOOGLE_JAVA_SNIPPETS } from "./company-google-java";
import { GOOGLE_CPP_SNIPPETS } from "./company-google-cpp";
import { GOOGLE_COMPREHENSION_SNIPPETS } from "./company-google-comprehension";
import { GOOGLE_COMPREHENSION_JAVA_SNIPPETS } from "./company-google-comprehension-java";
import { GOOGLE_COMPREHENSION_CPP_SNIPPETS } from "./company-google-comprehension-cpp";
import { DEEPMIND_SNIPPETS } from "./company-deepmind";
import { META_SNIPPETS } from "./company-meta";
import { CURRICULUM_TIERS } from "./tiers";
import { isStagedSnippet } from "@/lib/snippet-stages";

export { PATTERN_PACKS, getPatternPack } from "./patterns";
export { CURRICULUM_TIERS, getTierInfo } from "./tiers";
export { SYNTAX_MOTIFS, getMotifInfo } from "./motifs";
export { CORE_REFLEX_SNIPPETS } from "./core-reflex";
export { INTERVIEW_FLUENCY_SNIPPETS } from "./interview-fluency";
export { ADVANCED_FLUENCY_SNIPPETS } from "./advanced-fluency";

export { STAGED_SNIPPETS } from "./staged-problems";
export { GOOGLE_SNIPPETS } from "./company-google";
export { GOOGLE_JAVA_SNIPPETS } from "./company-google-java";
export { GOOGLE_CPP_SNIPPETS } from "./company-google-cpp";
export { GOOGLE_COMPREHENSION_SNIPPETS } from "./company-google-comprehension";
export { GOOGLE_COMPREHENSION_JAVA_SNIPPETS } from "./company-google-comprehension-java";
export { GOOGLE_COMPREHENSION_CPP_SNIPPETS } from "./company-google-comprehension-cpp";
export { DEEPMIND_SNIPPETS } from "./company-deepmind";
export { META_SNIPPETS } from "./company-meta";

export const SNIPPETS: Snippet[] = [
  ...CORE_REFLEX_SNIPPETS,
  ...INTERVIEW_FLUENCY_SNIPPETS,
  ...ADVANCED_FLUENCY_SNIPPETS,
  ...STAGED_SNIPPETS,
  ...GOOGLE_SNIPPETS,
  ...GOOGLE_JAVA_SNIPPETS,
  ...GOOGLE_CPP_SNIPPETS,
  ...GOOGLE_COMPREHENSION_SNIPPETS,
  ...GOOGLE_COMPREHENSION_JAVA_SNIPPETS,
  ...GOOGLE_COMPREHENSION_CPP_SNIPPETS,
  ...DEEPMIND_SNIPPETS,
  ...META_SNIPPETS,
];

export const SNIPPET_BY_ID = new Map(SNIPPETS.map((s) => [s.id, s]));

export function getSnippet(id: string): Snippet | undefined {
  return SNIPPET_BY_ID.get(id);
}

export function snippetsByTier(tier: CurriculumTier): Snippet[] {
  return SNIPPETS.filter((s) => s.tier === tier);
}

export interface FilterOptions {
  pattern?: string;
  difficulty?: string;
  language?: string;
  tier?: CurriculumTier | "all";
  companyTrack?: CompanyTrackId;
  careerLevel?: CareerLevelId;
}

export function filterSnippets(opts: FilterOptions): Snippet[] {
  return SNIPPETS.filter((s) => {
    if (opts.pattern && opts.pattern !== "all" && s.pattern !== opts.pattern) return false;
    if (opts.difficulty && opts.difficulty !== "all" && s.difficulty !== opts.difficulty)
      return false;
    if (opts.language && s.language !== opts.language) return false;
    if (opts.tier && opts.tier !== "all" && s.tier !== opts.tier) return false;
    return true;
  });
}

export interface PickOptions extends FilterOptions {
  excludeId?: string;
  excludeIds?: string[];
  adaptive?: boolean;
  results?: TypingResult[];
}

function weightedPick(pool: Snippet[], weights: number[]): Snippet {
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < pool.length; i++) {
    r -= weights[i];
    if (r <= 0) return pool[i];
  }
  return pool[pool.length - 1];
}

/** Score how much a snippet should be resurfaced based on past performance. */
export function resurfacingWeight(snippet: Snippet, results: TypingResult[]): number {
  const sessions = results.filter((r) => r.snippetId === snippet.id);
  if (sessions.length === 0) {
    // Prefer unseen snippets in adaptive mode
    return 1.4;
  }

  const last = sessions[sessions.length - 1];
  const daysSince =
    (Date.now() - last.timestamp) / 86400000;

  const avgAcc =
    sessions.reduce((a, s) => a + s.accuracy, 0) / sessions.length;
  const avgWpm = sessions.reduce((a, s) => a + s.wpm, 0) / sessions.length;

  // Weak accuracy / low WPM → resurface sooner
  const weakness = (100 - avgAcc) / 100 + Math.max(0, 1 - avgWpm / 60);

  // Hesitation from last session
  const hesitations = last.keystrokes.filter((k) => k.delayMs > 350);
  const hesitationFactor = Math.min(hesitations.length / 10, 1);

  // Spacing: boost if not seen recently
  const spacing = Math.min(daysSince / 3, 2);

  return 0.5 + weakness * 1.5 + hesitationFactor * 0.8 + spacing;
}

const DEDICATED_TRACKS: CompanyTrackId[] = [
  "anthropic",
  "openai",
  "google",
  "meta",
  "deepmind",
];

/** Prefer track-specific dedicated seeds; fall back to classic pool. */
function applyTrackPoolPreference(pool: Snippet[], trackId: CompanyTrackId): Snippet[] {
  if (!DEDICATED_TRACKS.includes(trackId)) return pool;
  const packId = `company-${trackId}`;
  const dedicated = pool.filter((s) => s.packIds?.includes(packId));
  if (dedicated.length > 0) return dedicated;
  const classic = pool.filter((s) => !isStagedSnippet(s));
  return classic.length > 0 ? classic : pool;
}

export function pickSnippet(opts: PickOptions): Snippet {
  const trackId = opts.companyTrack ?? "general";
  const levelId = opts.careerLevel ?? "mid";
  const excluded = new Set([
    ...(opts.excludeIds ?? []),
    ...(opts.excludeId ? [opts.excludeId] : []),
  ]);
  let pool = filterSnippets(opts).filter((s) => !excluded.has(s.id));
  pool = filterForProfile(pool, trackId, levelId);
  pool = applyTrackPoolPreference(pool, trackId);

  if (pool.length === 0) {
    pool = filterSnippets({ ...opts, pattern: "all", difficulty: "all", tier: "all" }).filter(
      (s) => !excluded.has(s.id) && s.language === opts.language,
    );
    pool = filterForProfile(pool, trackId, levelId);
    pool = applyTrackPoolPreference(pool, trackId);
  }
  if (pool.length === 0) pool = SNIPPETS.filter((s) => !excluded.has(s.id));

  if (opts.adaptive && opts.results?.length) {
    const weights = pool.map((s) =>
      curriculumSnippetWeight(s, opts.results!, trackId, levelId),
    );
    return weightedPick(pool, weights);
  }

  return pool[Math.floor(Math.random() * pool.length)];
}

/** @deprecated use pickSnippet */
export function pickRandomSnippet(opts: PickOptions): Snippet {
  return pickSnippet(opts);
}

export function curriculumStats() {
  const byTier = CURRICULUM_TIERS.map((t) => ({
    tier: t,
    count: snippetsByTier(t.id).length,
    target: t.targetCount,
  }));
  const byPattern = SNIPPETS.reduce(
    (acc, s) => {
      acc[s.pattern] = (acc[s.pattern] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
  return { total: SNIPPETS.length, byTier, byPattern };
}

export function prerequisitesMet(
  snippet: Snippet,
  completedIds: Set<string>,
): boolean {
  if (!snippet.prerequisites?.length) return true;
  return snippet.prerequisites.every((id) => completedIds.has(id));
}

export function getReadySnippets(
  opts: FilterOptions,
  completedIds: Set<string>,
): Snippet[] {
  return filterSnippets(opts).filter((s) => prerequisitesMet(s, completedIds));
}
