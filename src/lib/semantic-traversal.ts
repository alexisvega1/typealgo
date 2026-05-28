import type { CharToken, KeystrokeEvent } from "./types";
import { isLeadingIndentSpace } from "./indent";

export type StructuralKind = "newline" | "indent";

/** Auto-flow characters — structure, not implementation cognition. */
export function isStructuralChar(tokens: CharToken[], index: number): boolean {
  if (index >= tokens.length) return false;
  if (tokens[index].char === "\n") return true;
  if (isLeadingIndentSpace(tokens, index)) return true;
  return false;
}

export function structuralKind(
  tokens: CharToken[],
  index: number,
): StructuralKind | null {
  if (index >= tokens.length) return null;
  if (tokens[index].char === "\n") return "newline";
  if (isLeadingIndentSpace(tokens, index)) return "indent";
  return null;
}

/** First index at or after `from` that requires user input. */
export function nextCognitiveIndex(tokens: CharToken[], from: number): number {
  let i = from;
  while (i < tokens.length && isStructuralChar(tokens, i)) {
    i++;
  }
  return i;
}

export function countCognitiveChars(tokens: CharToken[]): number {
  return tokens.reduce((n, _, i) => (isStructuralChar(tokens, i) ? n : n + 1), 0);
}

export function isAutoKeystroke(ks: KeystrokeEvent): boolean {
  return Boolean(ks.autoStructural ?? ks.autoIndent ?? ks.autoPair);
}
