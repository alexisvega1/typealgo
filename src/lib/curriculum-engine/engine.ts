import { getSnippet, resurfacingWeight } from "@/data/curriculum";
import type {
  CareerLevelId,
  CompanyTrackId,
  CurriculumProfile,
  Difficulty,
  Snippet,
  SprintGradingProfile,
  SyntaxMotif,
  TrainingMode,
  TrackReadinessScore,
  TypingResult,
} from "@/lib/types";
import { getCareerLevel } from "./levels";
import { getCompanyTrack } from "./tracks";

export function resolveProfile(
  trackId: CompanyTrackId = "general",
  levelId: CareerLevelId = "mid",
): CurriculumProfile {
  return {
    track: getCompanyTrack(trackId),
    level: getCareerLevel(levelId),
  };
}

function weightForMotifs(
  motifs: SyntaxMotif[],
  weights: Partial<Record<SyntaxMotif, number>>,
): number {
  if (!motifs.length || !Object.keys(weights).length) return 1;
  let sum = 0;
  let count = 0;
  for (const m of motifs) {
    const w = weights[m];
    if (w != null) {
      sum += w;
      count++;
    }
  }
  return count > 0 ? sum / count : 1;
}

function weightForPattern(
  pattern: Snippet["pattern"],
  weights: Partial<Record<Snippet["pattern"], number>>,
): number {
  return weights[pattern] ?? 1;
}

function weightForDifficulty(
  difficulty: Difficulty,
  bias: Record<Difficulty, number>,
): number {
  return bias[difficulty] ?? 1;
}

function levelFluencyFit(snippet: Snippet, level: CurriculumProfile["level"]): number {
  const [min, max] = level.fluencyLevelRange;
  if (snippet.fluencyLevel >= min && snippet.fluencyLevel <= max) return 1.25;
  if (snippet.fluencyLevel < min) return 0.85;
  return 0.95;
}

function levelDifficultyFit(snippet: Snippet, level: CurriculumProfile["level"]): number {
  return level.difficultyFilter.includes(snippet.difficulty) ? 1.2 : 0.65;
}

/** Combined adaptive weight for track + level aware snippet selection. */
export function curriculumSnippetWeight(
  snippet: Snippet,
  results: TypingResult[],
  trackId: CompanyTrackId = "general",
  levelId: CareerLevelId = "mid",
): number {
  const profile = resolveProfile(trackId, levelId);
  const base = resurfacingWeight(snippet, results);

  if (trackId === "general") {
    return base * levelFluencyFit(snippet, profile.level) * levelDifficultyFit(snippet, profile.level);
  }

  const motifW = weightForMotifs(snippet.motifs, profile.track.motifWeights);
  const patternW = weightForPattern(snippet.pattern, profile.track.patternWeights);
  const diffW = weightForDifficulty(snippet.difficulty, profile.track.difficultyBias);

  return (
    base *
    motifW *
    patternW *
    diffW *
    levelFluencyFit(snippet, profile.level) *
    levelDifficultyFit(snippet, profile.level)
  );
}

export function filterForProfile(
  pool: Snippet[],
  trackId: CompanyTrackId,
  levelId: CareerLevelId,
): Snippet[] {
  const profile = resolveProfile(trackId, levelId);
  const langOk = pool.filter((s) => profile.track.languages.includes(s.language));
  const base = langOk.length ? langOk : pool;

  const diffFiltered = base.filter((s) =>
    profile.level.difficultyFilter.includes(s.difficulty),
  );
  return diffFiltered.length >= 3 ? diffFiltered : base;
}

export function recommendedTrainingMode(
  trackId: CompanyTrackId,
  levelId: CareerLevelId,
): TrainingMode {
  const { track, level } = resolveProfile(trackId, levelId);
  const modes = (["type", "recall", "review", "sprint"] as TrainingMode[]).map((mode) => ({
    mode,
    weight: track.modeWeights[mode] * (mode === "sprint" ? level.pressureMultiplier : 1),
  }));
  modes.sort((a, b) => b.weight - a.weight);
  return modes[0].mode;
}

export function resolveSprintProfile(
  trackId: CompanyTrackId,
  levelId: CareerLevelId,
): SprintGradingProfile {
  const { track, level } = resolveProfile(trackId, levelId);
  const adj = level.sprintThresholdAdjust;
  return {
    ...track.sprintProfile,
    targetWpm: Math.round(track.sprintProfile.targetWpm * level.pressureMultiplier),
    readinessThresholds: {
      ready: track.sprintProfile.readinessThresholds.ready + adj,
      strong: track.sprintProfile.readinessThresholds.strong + adj,
      developing: track.sprintProfile.readinessThresholds.developing + adj,
    },
  };
}

export function computeTrackReadiness(
  results: TypingResult[],
  trackId: CompanyTrackId,
  levelId: CareerLevelId,
): TrackReadinessScore {
  const profile = resolveProfile(trackId, levelId);
  const sprintSessions = results.filter((r) => r.trainingMode === "sprint");
  const avgSprintReadiness =
    sprintSessions.length > 0
      ? Math.round(
          sprintSessions.reduce((a, r) => a + (r.sprintMetrics?.interviewReadiness ?? 0), 0) /
            sprintSessions.length,
        )
      : 0;

  const trackMotifs = Object.keys(profile.track.motifWeights) as SyntaxMotif[];
  const masteredMotifs = new Set<SyntaxMotif>();

  for (const r of results.filter((x) => x.accuracy >= 90)) {
    const snip = getSnippet(r.snippetId);
    if (!snip) continue;
    for (const m of snip.motifs) {
      if (trackMotifs.length === 0 || trackMotifs.includes(m)) masteredMotifs.add(m);
    }
  }

  const motifCoverage =
    trackMotifs.length > 0
      ? Math.round((masteredMotifs.size / trackMotifs.length) * 100)
      : Math.round(
          (results.filter((r) => r.accuracy >= 90).length / Math.max(results.length, 1)) * 100,
        );

  const volumeFactor = Math.min(results.length / 25, 1) * 100;
  const score = Math.round(
    avgSprintReadiness * 0.45 + motifCoverage * 0.35 + volumeFactor * 0.2,
  );

  let label = profile.track.sprintProfile.gradeLabels.developing;
  const thresholds = resolveSprintProfile(trackId, levelId).readinessThresholds;
  if (score >= thresholds.ready) label = profile.track.sprintProfile.gradeLabels.ready;
  else if (score >= thresholds.strong) label = profile.track.sprintProfile.gradeLabels.strong;

  const weakMotifs = trackMotifs.filter((m) => !masteredMotifs.has(m)).slice(0, 4);

  return {
    score: Math.min(100, score),
    label,
    motifCoverage,
    sprintSessions: sprintSessions.length,
    avgSprintReadiness,
    weakMotifs,
  };
}

export function formatCareerGoal(trackId: CompanyTrackId, levelId: CareerLevelId): string {
  const { track, level } = resolveProfile(trackId, levelId);
  if (trackId === "general") return `${level.name} — general fluency`;
  return `${track.name} · ${level.name}`;
}
