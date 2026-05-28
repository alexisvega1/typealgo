import { getSnippet } from "@/data/curriculum";
import { getMotifInfo } from "@/data/curriculum/motifs";
import { estimateMotifMastery } from "@/lib/coach/predictive";
import type { KeystrokeEvent, Snippet, SyntaxMotif, TypingResult } from "@/lib/types";
import { MOTIF_KEYWORDS } from "./motif-notes";

export interface MotifReviewStat {
  motif: SyntaxMotif;
  label: string;
  recallAccuracy: number | null;
  masteryProbability: number;
  commonMistakes: string[];
  sessions: number;
}

export interface ReviewAnalytics {
  motifStats: MotifReviewStat[];
  hesitationIndices: Set<number>;
  hotspotTokens: { token: string; avgDelayMs: number; errors: number }[];
  priorAccuracy: number | null;
  priorRecallAccuracy: number | null;
}

export function linesForMotif(code: string, motif: SyntaxMotif): number[] {
  const keywords = MOTIF_KEYWORDS[motif] ?? [];
  if (keywords.length === 0) return [];

  const lines = code.split("\n");
  const matched: number[] = [];
  lines.forEach((line, i) => {
    const lower = line.toLowerCase();
    if (keywords.some((kw) => lower.includes(kw.toLowerCase()))) {
      matched.push(i);
    }
  });
  return matched;
}

export function buildReviewAnalytics(
  snippet: Snippet,
  results: TypingResult[],
): ReviewAnalytics {
  const past = results.filter((r) => r.snippetId === snippet.id);
  const hesitationIndices = new Set<number>();
  const tokenDelays = new Map<string, { total: number; count: number; errors: number }>();

  for (const session of past) {
    for (const ks of session.keystrokes) {
      if (ks.autoIndent || ks.delayMs < 280) continue;
      hesitationIndices.add(ks.index);
      const start = Math.max(0, ks.index - 12);
      const token =
        snippet.code.slice(start, ks.index + 1).trim().split(/\s+/).pop() ?? ks.char;
      const entry = tokenDelays.get(token) ?? { total: 0, count: 0, errors: 0 };
      entry.total += ks.delayMs;
      entry.count++;
      if (!ks.correct) entry.errors++;
      tokenDelays.set(token, entry);
    }
  }

  const hotspotTokens = Array.from(tokenDelays.entries())
    .map(([token, d]) => ({
      token,
      avgDelayMs: Math.round(d.total / d.count),
      errors: d.errors,
    }))
    .filter((t) => t.avgDelayMs > 280 || t.errors > 0)
    .sort((a, b) => b.avgDelayMs - a.avgDelayMs)
    .slice(0, 8);

  const motifStats: MotifReviewStat[] = snippet.motifs.map((motif) => {
    const info = getMotifInfo(motif);
    const motifSessions = past.filter((r) =>
      getSnippet(r.snippetId)?.motifs.includes(motif),
    );
    const recallValues = motifSessions
      .map((r) => r.recallMetrics?.recallAccuracy)
      .filter((v): v is number => v != null);
    const recallAccuracy =
      recallValues.length > 0
        ? Math.round(recallValues.reduce((a, b) => a + b, 0) / recallValues.length)
        : null;

    const mistakes = new Set<string>();
    for (const s of past) {
      for (const ks of s.keystrokes) {
        if (!ks.correct) {
          const start = Math.max(0, ks.index - 10);
          const tok = snippet.code.slice(start, ks.index + 1).trim().split(/\s+/).pop();
          if (tok) mistakes.add(tok);
        }
      }
      s.recallMetrics?.weakTokens.forEach((t) => mistakes.add(t));
    }

    return {
      motif,
      label: info?.label ?? motif,
      recallAccuracy,
      masteryProbability: estimateMotifMastery(motif, results).masteryProbability,
      commonMistakes: Array.from(mistakes).slice(0, 4),
      sessions: motifSessions.length,
    };
  });

  const last = past[past.length - 1];

  return {
    motifStats,
    hesitationIndices,
    hotspotTokens,
    priorAccuracy: last?.accuracy ?? null,
    priorRecallAccuracy: last?.recallMetrics?.recallAccuracy ?? last?.accuracy ?? null,
  };
}

export function aggregateKeystrokeMistakes(
  keystrokes: KeystrokeEvent[],
  code: string,
): string[] {
  const mistakes = new Set<string>();
  for (const ks of keystrokes) {
    if (ks.correct) continue;
    const start = Math.max(0, ks.index - 10);
    const tok = code.slice(start, ks.index + 1).trim().split(/\s+/).pop();
    if (tok) mistakes.add(tok);
  }
  return Array.from(mistakes).slice(0, 6);
}
