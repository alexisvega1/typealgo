import type { CharToken } from "./types";

/** Index where the current line begins (first char after previous newline). */
export function lineStartIndex(tokens: CharToken[], index: number): number {
  let start = index;
  while (start > 0 && tokens[start - 1].char !== "\n") {
    start--;
  }
  return start;
}

/** First index on this line that is not a leading space (may equal line length / newline). */
export function lineIndentEnd(tokens: CharToken[], lineStart: number): number {
  let i = lineStart;
  while (i < tokens.length && tokens[i].char === " ") {
    i++;
  }
  return i;
}

/** Leading whitespace on a line — structural, not recall targets. */
export function isLeadingIndentSpace(tokens: CharToken[], index: number): boolean {
  if (index >= tokens.length || tokens[index].char !== " ") {
    return false;
  }
  const start = lineStartIndex(tokens, index);
  const indentEnd = lineIndentEnd(tokens, start);
  return index >= start && index < indentEnd;
}

/** Clear blank mask on structural indent so blanks never hide cursor position. */
export function unmaskStructuralIndent(tokens: CharToken[], blankMask: boolean[]): void {
  for (let i = 0; i < tokens.length; i++) {
    if (isLeadingIndentSpace(tokens, i)) {
      blankMask[i] = false;
    }
  }
}
