import type { CharToken } from "./types";
import { blankDisplayChar } from "./recall-blanks";

const TOKEN_CLASS: Record<string, string> = {
  keyword: "tok-keyword",
  builtin: "tok-builtin",
  string: "tok-string",
  number: "tok-number",
  operator: "tok-operator",
  punctuation: "tok-punctuation",
  identifier: "tok-identifier",
  function: "tok-function",
  comment: "tok-comment",
  default: "tok-default",
};

export function tokenClass(type: string): string {
  return TOKEN_CLASS[type] ?? "tok-default";
}

export function applyCharPending(
  el: HTMLSpanElement,
  index: number,
  tokens: CharToken[],
  typedIndex: number,
  blankMask: boolean[],
  revealed: Set<number>,
): void {
  const tok = tokens[index];
  const isBlank = blankMask[index];
  const isRevealed = revealed.has(index);
  const isPast = index < typedIndex;

  if (isPast) return;

  if (isBlank && !isRevealed) {
    el.textContent = blankDisplayChar(tok.char, false, tok.char);
    el.className = "code-char char-blank char-pending-blank";
    return;
  }

  el.textContent = tok.char === " " ? "\u00a0" : tok.char;
  const revealedClass = isBlank && isRevealed ? " char-revealed" : "";
  const visibleClass = isBlank ? " char-visible-given" : " char-pending";
  el.className = `code-char ${tokenClass(tok.type)}${visibleClass}${revealedClass}`;
}

export function applyCharTyped(
  el: HTMLSpanElement,
  index: number,
  tokens: CharToken[],
  correct: boolean,
  blankMask: boolean[],
): void {
  const tok = tokens[index];
  el.textContent = tok.char === " " ? "\u00a0" : tok.char;
  const blankClass = blankMask[index] ? " char-was-blank" : "";
  el.className = `code-char ${tokenClass(tok.type)} ${correct ? "char-correct" : "char-incorrect"}${blankClass}`;
}

export function resetAllChars(
  charRefs: (HTMLSpanElement | null)[],
  tokens: CharToken[],
  blankMask: boolean[],
  revealed: Set<number>,
): void {
  charRefs.forEach((el, i) => {
    if (!el) return;
    applyCharPending(el, i, tokens, 0, blankMask, revealed);
  });
}

/** Review mode — show full syntax-highlighted solution with study overlays. */
export function showAllCharsReview(
  charRefs: (HTMLSpanElement | null)[],
  tokens: CharToken[],
  opts?: { hesitationIndices?: Set<number>; motifLineIndices?: Set<number>; activeLine?: number },
): void {
  charRefs.forEach((el, i) => {
    if (!el) return;
    const tok = tokens[i];
    if (tok.char === "\n") return;
    el.textContent = tok.char === " " ? "\u00a0" : tok.char;

    const classes = [`code-char`, tokenClass(tok.type), "char-review-visible"];
    if (opts?.hesitationIndices?.has(i)) classes.push("char-review-hesitation");
    el.className = classes.join(" ");
  });

  // Line-level classes applied via parent in TypingTest line refs
}
