import { SYNTAX_MOTIFS } from "@/data/curriculum/motifs";
import { MOTIF_KEYWORDS } from "@/lib/modes/motif-notes";
import type { Language, Pattern, SyntaxMotif } from "@/lib/types";

/** Heuristic motif extraction — replaceable with AST/ML decomposition later. */
export function extractMotifsFromCode(
  code: string,
  language: Language,
  hintPattern?: Pattern,
): SyntaxMotif[] {
  const lower = code.toLowerCase();
  const scores = new Map<SyntaxMotif, number>();

  for (const [motif, keywords] of Object.entries(MOTIF_KEYWORDS) as [SyntaxMotif, string[]][]) {
    let score = 0;
    for (const kw of keywords) {
      if (lower.includes(kw.toLowerCase())) score += 2;
    }
    if (score > 0) scores.set(motif, score);
  }

  if (language === "python") {
    if (lower.includes("def dfs") || lower.includes("def bfs")) scores.set("dfs-recursion", 3);
    if (lower.includes("collections.deque")) scores.set("bfs-queue", 3);
    if (lower.includes("heapq")) scores.set("heap-push-pop", 3);
    if (lower.includes("defaultdict")) scores.set("counter-defaultdict", 2);
  }

  const ranked = Array.from(scores.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([m]) => m);

  if (ranked.length === 0 && hintPattern) {
    const fallback = SYNTAX_MOTIFS.find((m) => m.pattern === hintPattern)?.id;
    if (fallback) return [fallback];
  }

  return ranked.slice(0, 3);
}

export interface MotifChunk {
  motif: SyntaxMotif;
  label: string;
  startLine: number;
  endLine: number;
  confidence: number;
}

/** Line-range chunks for retrieval decomposition. */
export function decomposeIntoMotifChunks(
  code: string,
  motifs: SyntaxMotif[],
): MotifChunk[] {
  const lines = code.split("\n");
  const chunks: MotifChunk[] = [];

  for (const motif of motifs) {
    const keywords = MOTIF_KEYWORDS[motif] ?? [];
    const matchedLines: number[] = [];

    lines.forEach((line, i) => {
      const lower = line.toLowerCase();
      if (keywords.some((kw) => lower.includes(kw.toLowerCase()))) {
        matchedLines.push(i);
      }
    });

    if (matchedLines.length === 0) continue;

    const info = SYNTAX_MOTIFS.find((m) => m.id === motif);
    chunks.push({
      motif,
      label: info?.label ?? motif,
      startLine: matchedLines[0],
      endLine: matchedLines[matchedLines.length - 1],
      confidence: Math.min(1, matchedLines.length / 3),
    });
  }

  return chunks;
}
