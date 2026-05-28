import {
  filterSnippets,
  getSnippet,
  prerequisitesMet,
  SNIPPETS,
  type FilterOptions,
  type PickOptions,
} from "@/data/curriculum";
import { getMotifInfo } from "@/data/curriculum/motifs";
import { computeMotifWeaknesses } from "@/lib/curriculum";
import { curriculumSnippetWeight } from "@/lib/curriculum-engine";
import { hesitationHotspots } from "@/lib/metrics";
import type { RecallMode, Snippet, SyntaxMotif, TypingResult } from "@/lib/types";
import type { CoachAction, CoachRecommendation, ConfidenceLabel, WeakMotifRef } from "./types";
import { clamp } from "./utils";

const RECALL_LADDER: RecallMode[] = ["full-copy", "token-blank", "line-blank", "skeleton"];

function nextRecallMode(mode: RecallMode, harder: boolean): RecallMode {
  const idx = RECALL_LADDER.indexOf(mode);
  if (idx === -1) return mode;
  const next = harder ? idx + 1 : idx - 1;
  return RECALL_LADDER[clamp(next, 0, RECALL_LADDER.length - 1)];
}

/** Deterministic top pick by resurfacing weight (no randomness). */
export function pickTopSnippet(opts: PickOptions): Snippet {
  const excluded = new Set([
    ...(opts.excludeIds ?? []),
    ...(opts.excludeId ? [opts.excludeId] : []),
  ]);
  let pool = filterSnippets(opts).filter((s) => !excluded.has(s.id));
  if (pool.length === 0) {
    pool = filterSnippets({ ...opts, pattern: "all", difficulty: "all", tier: "all" }).filter(
      (s) => !excluded.has(s.id) && s.language === opts.language,
    );
  }
  if (pool.length === 0) pool = SNIPPETS.filter((s) => !excluded.has(s.id));

  if (opts.results?.length) {
    const trackId = opts.companyTrack ?? "general";
    const levelId = opts.careerLevel ?? "mid";
    return pool.reduce((best, s) =>
      curriculumSnippetWeight(s, opts.results!, trackId, levelId) >
      curriculumSnippetWeight(best, opts.results!, trackId, levelId)
        ? s
        : best,
    );
  }
  return pool[0];
}


function findMissingPrerequisite(
  snippet: Snippet,
  completedIds: Set<string>,
): Snippet | undefined {
  if (!snippet.prerequisites?.length) return undefined;
  const missing = snippet.prerequisites.find((id) => !completedIds.has(id));
  return missing ? getSnippet(missing) : undefined;
}

export interface SuggestiveInput {
  result: TypingResult;
  snippet: Snippet;
  allResults: TypingResult[];
  recallMode: RecallMode;
  filterOpts: FilterOptions;
}

function collectWeakMotifs(
  result: TypingResult,
  snippet: Snippet,
  allResults: TypingResult[],
): WeakMotifRef[] {
  const fromSession = snippet.motifs.map((m) => ({
    motif: m,
    label: getMotifInfo(m)?.label ?? m,
  }));

  const aggregate = computeMotifWeaknesses(allResults).slice(0, 3);
  const seen = new Set<SyntaxMotif>();
  const merged: WeakMotifRef[] = [];

  for (const m of fromSession) {
    if (!seen.has(m.motif)) {
      seen.add(m.motif);
      merged.push(m);
    }
  }
  for (const w of aggregate) {
    if (!seen.has(w.motif)) {
      seen.add(w.motif);
      merged.push({ motif: w.motif, label: w.label });
    }
  }
  return merged.slice(0, 3);
}

function primaryHesitationToken(result: TypingResult, code: string): string | null {
  const hotspots = hesitationHotspots(result.keystrokes, code);
  return hotspots[0]?.token ?? result.recallMetrics?.weakTokens[0] ?? null;
}

export function buildRecommendation(input: SuggestiveInput): CoachRecommendation {
  const { result, snippet, allResults, recallMode, filterOpts } = input;
  const weakMotifs = collectWeakMotifs(result, snippet, allResults);
  const recall = result.recallMetrics;
  const hesitation = primaryHesitationToken(result, snippet.code);

  const completedIds = new Set(
    allResults.filter((r) => r.accuracy >= 90).map((r) => r.snippetId),
  );

  const nextSnippet = pickTopSnippet({
    ...filterOpts,
    excludeId: snippet.id,
    adaptive: true,
    results: allResults,
  });

  const prereq = findMissingPrerequisite(nextSnippet, completedIds);

  let action: CoachAction = "continue-next";
  let confidenceLabel: ConfidenceLabel = "high-confidence";
  let suggestedRecallMode: RecallMode | undefined;
  let suggestedSnippet = nextSnippet;
  let headline = "";
  let explanation = "";

  const weakSession =
    result.accuracy < 85 ||
    (recall && recall.recallAccuracy < 78) ||
    (recall && recall.reveals >= 2) ||
    (hesitation != null && (recall?.avgBlankHesitationMs ?? 0) > 320);

  const strongSession =
    result.accuracy >= 92 &&
    (!recall || recall.recallAccuracy >= 88) &&
    (recall?.reveals ?? 0) <= 1 &&
    (recall?.confidenceScore ?? 100) >= 82;

  if (prereq && !prerequisitesMet(nextSnippet, completedIds)) {
    action = "practice-prerequisite";
    suggestedSnippet = prereq;
    confidenceLabel = "needs-reinforcement";
    headline = `Practice ${prereq.title} first`;
    explanation = `${nextSnippet.title} builds on it — lock in the prerequisite before moving on.`;
  } else if (weakSession && (result.accuracy < 80 || (recall && recall.recallAccuracy < 72))) {
    action = "retry-same";
    suggestedSnippet = snippet;
    confidenceLabel = "needs-reinforcement";
    const motifLabel = weakMotifs[0]?.label ?? snippet.pattern.replace("-", " ");
    headline = hesitation
      ? `Retry — hesitated on ${hesitation}`
      : `Retry ${snippet.title}`;
    explanation = `Accuracy or recall dipped on ${motifLabel}. One clean rep will strengthen the pattern.`;
  } else if (
    recall &&
    (recall.recallAccuracy < 75 || recall.reveals >= 3 || recall.confidenceScore < 65) &&
    recallMode !== "full-copy"
  ) {
    action = "easier-recall";
    suggestedRecallMode = nextRecallMode(recallMode, false);
    confidenceLabel = "needs-reinforcement";
    headline = "Dial back recall difficulty";
    explanation = `Switch to ${formatRecallMode(suggestedRecallMode)} — rebuild confidence before harder blanks.`;
  } else if (strongSession && recallMode !== "skeleton") {
    action = "harder-recall";
    suggestedRecallMode = nextRecallMode(recallMode, true);
    confidenceLabel = "likely-mastered";
    headline = "Ready for harder recall";
    explanation = `Try ${formatRecallMode(suggestedRecallMode)} on ${nextSnippet.title} — you're recalling cleanly.`;
  } else if (weakSession) {
    action = "retry-same";
    suggestedSnippet = snippet;
    confidenceLabel = "needs-reinforcement";
    const motifLabel = weakMotifs[0]?.label ?? "this pattern";
    headline = hesitation
      ? `Reinforce ${motifLabel}, then continue`
      : `One more rep on ${snippet.title}`;
    explanation = hesitation
      ? `You hesitated on ${hesitation}. Retry once, then move to ${nextSnippet.title}.`
      : `Quick retry to solidify ${motifLabel}, then ${nextSnippet.title}.`;
  } else {
    action = "continue-next";
    confidenceLabel = "high-confidence";
    const motifLabel = weakMotifs[0]?.label;
    headline = `Next: ${nextSnippet.title}`;
    explanation = motifLabel
      ? `Solid session. ${nextSnippet.title} will exercise ${motifLabel}.`
      : `Solid session — ${nextSnippet.title} is the best next drill.`;
  }

  return {
    action,
    headline,
    explanation,
    confidenceLabel,
    suggestedSnippetId: suggestedSnippet.id,
    suggestedSnippetTitle: suggestedSnippet.title,
    suggestedRecallMode,
    weakMotifs,
  };
}

function formatRecallMode(mode: RecallMode): string {
  switch (mode) {
    case "full-copy":
      return "Full Copy";
    case "token-blank":
      return "Token Recall";
    case "line-blank":
      return "Line Recall";
    case "skeleton":
      return "Skeleton Mode";
  }
}
