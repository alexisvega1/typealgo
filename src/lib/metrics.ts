import type { KeystrokeEvent, Pattern, PatternStats, TypingResult } from "./types";

const WORD_LENGTH = 5;

export function calcWpm(correctChars: number, durationMs: number): number {
  if (durationMs <= 0) return 0;
  return Math.round((correctChars / WORD_LENGTH / (durationMs / 60000)) * 100) / 100;
}

export function calcRawWpm(totalChars: number, durationMs: number): number {
  if (durationMs <= 0) return 0;
  return Math.round((totalChars / WORD_LENGTH / (durationMs / 60000)) * 100) / 100;
}

export function calcAccuracy(correct: number, total: number): number {
  if (total <= 0) return 100;
  return Math.round((correct / total) * 10000) / 100;
}

export function fluencyScore(avgWpm: number, avgAccuracy: number, sessions: number): number {
  const wpmFactor = Math.min(avgWpm / 80, 1);
  const accFactor = avgAccuracy / 100;
  const practiceFactor = Math.min(sessions / 20, 1);
  return Math.round((wpmFactor * 0.4 + accFactor * 0.45 + practiceFactor * 0.15) * 100);
}

export function aggregatePatternStats(results: TypingResult[]): PatternStats[] {
  const map = new Map<
    Pattern,
    { sessions: number; wpmSum: number; accSum: number; bestWpm: number }
  >();

  for (const r of results) {
    const cur = map.get(r.pattern) ?? {
      sessions: 0,
      wpmSum: 0,
      accSum: 0,
      bestWpm: 0,
    };
    cur.sessions++;
    cur.wpmSum += r.wpm;
    cur.accSum += r.accuracy;
    cur.bestWpm = Math.max(cur.bestWpm, r.wpm);
    map.set(r.pattern, cur);
  }

  return Array.from(map.entries())
    .map(([pattern, s]) => {
      const avgWpm = s.wpmSum / s.sessions;
      const avgAccuracy = s.accSum / s.sessions;
      return {
        pattern,
        sessions: s.sessions,
        avgWpm: Math.round(avgWpm * 10) / 10,
        avgAccuracy: Math.round(avgAccuracy * 10) / 10,
        bestWpm: s.bestWpm,
        fluencyScore: fluencyScore(avgWpm, avgAccuracy, s.sessions),
      };
    })
    .sort((a, b) => b.fluencyScore - a.fluencyScore);
}

export function hesitationHotspots(
  keystrokes: KeystrokeEvent[],
  code: string,
  windowSize = 12,
): { token: string; avgDelayMs: number; errors: number }[] {
  const delays = new Map<string, { total: number; count: number; errors: number }>();

  for (const ks of keystrokes) {
    const start = Math.max(0, ks.index - windowSize);
    const token = code.slice(start, ks.index + 1).trim().split(/\s+/).pop() ?? ks.char;
    const entry = delays.get(token) ?? { total: 0, count: 0, errors: 0 };
    entry.total += ks.delayMs;
    entry.count++;
    if (!ks.correct) entry.errors++;
    delays.set(token, entry);
  }

  return Array.from(delays.entries())
    .map(([token, d]) => ({
      token,
      avgDelayMs: Math.round(d.total / d.count),
      errors: d.errors,
    }))
    .filter((h) => h.avgDelayMs > 200 || h.errors > 0)
    .sort((a, b) => b.avgDelayMs - a.avgDelayMs)
    .slice(0, 8);
}
