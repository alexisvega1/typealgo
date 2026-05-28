import { isAutoKeystroke } from "./semantic-traversal";
import type { KeystrokeEvent, RecallMetrics, TypingResult } from "./types";

export function computeRecallMetrics(
  keystrokes: KeystrokeEvent[],
  blankMask: boolean[],
  reveals: number,
  code: string,
): RecallMetrics {
  const blankIndices = blankMask.map((b, i) => (b ? i : -1)).filter((i) => i >= 0);

  let blanksCorrect = 0;
  let blanksIncorrect = 0;
  let blankHesitationTotal = 0;
  let blankHesitationCount = 0;
  const weakTokenDelays = new Map<string, { total: number; count: number; errors: number }>();

  for (const ks of keystrokes) {
    if (isAutoKeystroke(ks)) continue;
    if (!blankMask[ks.index]) continue;

    if (ks.correct) blanksCorrect++;
    else blanksIncorrect++;

    if (ks.delayMs > 200) {
      blankHesitationTotal += ks.delayMs;
      blankHesitationCount++;
    }

    const start = Math.max(0, ks.index - 14);
    const token = code.slice(start, ks.index + 1).trim().split(/\s+/).pop() ?? ks.char;
    const entry = weakTokenDelays.get(token) ?? { total: 0, count: 0, errors: 0 };
    entry.total += ks.delayMs;
    entry.count++;
    if (!ks.correct) entry.errors++;
    weakTokenDelays.set(token, entry);
  }

  const blanksTotal = blankIndices.length;
  const blanksTyped = blanksCorrect + blanksIncorrect;
  const recallAccuracy =
    blanksTyped > 0 ? Math.round((blanksCorrect / blanksTyped) * 10000) / 100 : 100;

  const corrections = keystrokes.filter((k) => !k.correct && blankMask[k.index]).length;

  const weakTokens = Array.from(weakTokenDelays.entries())
    .map(([token, d]) => ({
      token,
      avgDelayMs: Math.round(d.total / d.count),
      errors: d.errors,
    }))
    .filter((t) => t.avgDelayMs > 280 || t.errors > 0)
    .sort((a, b) => b.avgDelayMs - a.avgDelayMs)
    .slice(0, 6)
    .map((t) => t.token);

  return {
    recallAccuracy,
    blanksTotal,
    blanksCorrect,
    blanksIncorrect,
    reveals,
    corrections,
    avgBlankHesitationMs:
      blankHesitationCount > 0
        ? Math.round(blankHesitationTotal / blankHesitationCount)
        : 0,
    weakTokens,
    confidenceScore: Math.round(
      recallAccuracy * 0.55 +
        Math.max(0, 100 - reveals * 8) * 0.2 +
        Math.max(0, 100 - corrections * 4) * 0.25,
    ),
  };
}

export function priorSnippetRecallStats(
  results: TypingResult[],
  snippetId: string,
): { accuracy: number; recallAccuracy: number } | null {
  const past = results.filter((r) => r.snippetId === snippetId);
  if (past.length === 0) return null;
  const last = past[past.length - 1];
  return {
    accuracy: last.accuracy,
    recallAccuracy: last.recallMetrics?.recallAccuracy ?? last.accuracy,
  };
}
