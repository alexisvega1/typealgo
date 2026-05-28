import {
  getReadySnippets,
  getSnippet,
  prerequisitesMet,
  SNIPPETS,
  type FilterOptions,
} from "@/data/curriculum";
import { getMotifInfo } from "@/data/curriculum/motifs";
import { computeMotifWeaknesses, suggestResurface } from "@/lib/curriculum";
import type { Snippet, TypingResult } from "@/lib/types";
import { pickTopSnippet } from "./suggestive";
import type { DrillPurpose, TrainingPlan, TrainingPlanItem } from "./types";
import { mean } from "./utils";

function estimateSnippetMinutes(snippetId: string, results: TypingResult[]): number {
  const direct = results.filter((r) => r.snippetId === snippetId);
  if (direct.length) {
    return Math.max(1, Math.round(mean(direct.map((r) => r.durationMs)) / 60000));
  }
  const snip = getSnippet(snippetId);
  if (!snip) return 2;
  const patternSessions = results.filter((r) => getSnippet(r.snippetId)?.pattern === snip.pattern);
  if (patternSessions.length) {
    return Math.max(
      1,
      Math.round(mean(patternSessions.map((r) => r.durationMs)) / 60000),
    );
  }
  return snip.fluencyLevel <= 2 ? 2 : 3;
}

function purposeLabel(purpose: DrillPurpose, motifLabel?: string): string {
  switch (purpose) {
    case "reinforce":
      return motifLabel ? `Reinforce ${motifLabel}` : "Reinforce weak motif";
    case "retry":
      return "Retry for mastery";
    case "resurface":
      return "Spaced resurfacing";
    case "new-pattern":
      return "New pattern";
  }
}

function addItem(
  items: TrainingPlanItem[],
  used: Set<string>,
  snippet: Snippet,
  purpose: DrillPurpose,
  motifLabel?: string,
  results?: TypingResult[],
): void {
  if (used.has(snippet.id) || items.length >= 5) return;
  used.add(snippet.id);
  items.push({
    order: items.length + 1,
    snippetId: snippet.id,
    snippetTitle: snippet.title,
    purpose,
    purposeLabel: purposeLabel(purpose, motifLabel),
    estimatedMinutes: estimateSnippetMinutes(snippet.id, results ?? []),
    motifLabel,
  });
}

/** Build a short adaptive daily plan — 3–5 drills max. */
export function generateTrainingPlan(
  results: TypingResult[],
  filterOpts: FilterOptions,
): TrainingPlan {
  const items: TrainingPlanItem[] = [];
  const used = new Set<string>();
  const completedIds = new Set(
    results.filter((r) => r.accuracy >= 90).map((r) => r.snippetId),
  );
  const readyPool = getReadySnippets(filterOpts, completedIds);

  // 1. Weakest motif reinforcement
  const weaknesses = computeMotifWeaknesses(results);
  if (weaknesses[0]) {
    const motif = weaknesses[0].motif;
    const candidate = SNIPPETS.filter(
      (s) =>
        s.motifs.includes(motif) &&
        s.language === filterOpts.language &&
        prerequisitesMet(s, completedIds),
    ).sort(
      (a, b) =>
        (results.filter((r) => r.snippetId === b.id).length || 0) -
        (results.filter((r) => r.snippetId === a.id).length || 0),
    )[0];
    if (candidate) {
      addItem(items, used, candidate, "reinforce", weaknesses[0].label, results);
    }
  }

  // 2. Retry last session if weak
  const last = results[results.length - 1];
  if (last) {
    const lastSnip = getSnippet(last.snippetId);
    const needsRetry =
      last.accuracy < 90 ||
      (last.recallMetrics && last.recallMetrics.recallAccuracy < 85);
    if (needsRetry && lastSnip) {
      addItem(items, used, lastSnip, "retry", undefined, results);
    }
  }

  // 3. Spaced resurfacing
  const resurface = suggestResurface(results, 5).find((s) => !used.has(s.id));
  if (resurface) {
    addItem(items, used, resurface, "resurface", undefined, results);
  }

  // 4. One new / unseen snippet
  const attempted = new Set(results.map((r) => r.snippetId));
  const unseen =
    readyPool.find((s) => !attempted.has(s.id) && !used.has(s.id)) ??
    readyPool.find((s) => !used.has(s.id));
  if (unseen) {
    const motifLabel = unseen.motifs[0]
      ? getMotifInfo(unseen.motifs[0])?.label
      : undefined;
    addItem(items, used, unseen, "new-pattern", motifLabel, results);
  }

  // Fill to at least 3 with adaptive picks
  while (items.length < 3) {
    const next = pickTopSnippet({
      ...filterOpts,
      adaptive: true,
      results,
      excludeIds: Array.from(used),
    });
    if (used.has(next.id)) break;
    addItem(items, used, next, "new-pattern", undefined, results);
  }

  const totalEstimatedMinutes = items.reduce((a, i) => a + i.estimatedMinutes, 0);
  return { items, totalEstimatedMinutes: Math.round(totalEstimatedMinutes * 10) / 10 };
}
