import type { CharToken, RecallMode, TokenType } from "./types";
import { unmaskStructuralIndent } from "./indent";

export interface RecallPlan {
  blankMask: boolean[];
  blankCharCount: number;
  mode: RecallMode;
  intensity: number;
}

export interface WordSpan {
  start: number;
  end: number;
  word: string;
  type: TokenType;
  line: number;
  indent: number;
}

const BLANKABLE_TYPES = new Set<TokenType>([
  "keyword",
  "builtin",
  "identifier",
  "function",
  "string",
  "number",
  "operator",
]);

function lineStarts(code: string): { start: number; indent: number; text: string }[] {
  const lines: { start: number; indent: number; text: string }[] = [];
  let start = 0;
  const parts = code.split("\n");
  for (let i = 0; i < parts.length; i++) {
    const text = parts[i];
    const indent = text.length - text.trimStart().length;
    lines.push({ start, indent, text });
    start += text.length + 1;
  }
  return lines;
}

function charLineIndex(tokens: CharToken[], index: number): number {
  let line = 0;
  for (let i = 0; i < index; i++) {
    if (tokens[i].char === "\n") line++;
  }
  return line;
}

function extractWordSpans(tokens: CharToken[], code: string): WordSpan[] {
  const lineInfo = lineStarts(code);
  const spans: WordSpan[] = [];
  let i = 0;

  while (i < tokens.length) {
    const t = tokens[i];
    if (t.char === " " || t.char === "\n" || t.type === "comment") {
      i++;
      continue;
    }

    const type = t.type;
    const start = i;
    while (
      i < tokens.length &&
      tokens[i].type === type &&
      tokens[i].char !== " " &&
      tokens[i].char !== "\n"
    ) {
      if (tokens[i].type === "comment") break;
      i++;
    }

    const word = tokens
      .slice(start, i)
      .map((x) => x.char)
      .join("");
    const line = charLineIndex(tokens, start);
    const indent = lineInfo[line]?.indent ?? 0;
    spans.push({ start, end: i, word, type, line, indent });
  }

  return spans;
}

function blankScore(span: WordSpan): number {
  if (!BLANKABLE_TYPES.has(span.type)) return 0;
  switch (span.type) {
    case "builtin":
      return 10;
    case "function":
      return 9;
    case "identifier":
      return 8;
    case "keyword":
      return 7;
    case "string":
      return 6;
    case "operator":
      return span.word.length > 1 ? 5 : 2;
    case "number":
      return 4;
    default:
      return 0;
  }
}

function isSkeletonHeaderLine(text: string): boolean {
  const t = text.trim();
  if (/^(def |class |import |from |@)/.test(t)) return true;
  if (/^(if |elif |else:|for |while |try:|except |finally:|with )/.test(t)) return true;
  if (t.endsWith(":") && /^(if |for |while |elif |else|try|except|finally|with)\b/.test(t)) return true;
  return false;
}

export function computeRecallIntensity(opts: {
  fluencyLevel: number;
  priorAccuracy?: number;
  priorRecallAccuracy?: number;
}): number {
  let base = 0.45 + opts.fluencyLevel * 0.08;
  if (opts.priorAccuracy !== undefined) {
    if (opts.priorAccuracy >= 95) base += 0.12;
    else if (opts.priorAccuracy >= 88) base += 0.05;
    else if (opts.priorAccuracy < 75) base -= 0.08;
  }
  if (opts.priorRecallAccuracy !== undefined && opts.priorRecallAccuracy >= 92) {
    base += 0.08;
  }
  return Math.min(0.92, Math.max(0.28, base));
}

function markRange(mask: boolean[], start: number, end: number) {
  for (let i = start; i < end; i++) mask[i] = true;
}

function applyTokenBlanks(spans: WordSpan[], mask: boolean[], intensity: number) {
  const candidates = spans
    .map((s) => ({ span: s, score: blankScore(s) }))
    .filter((c) => c.score > 0)
    .sort((a, b) => b.score - a.score);

  const target = Math.max(1, Math.round(candidates.length * intensity));
  for (let i = 0; i < Math.min(target, candidates.length); i++) {
    markRange(mask, candidates[i].span.start, candidates[i].span.end);
  }
}

function applyLineBlanks(tokens: CharToken[], code: string, mask: boolean[], intensity: number) {
  const lines = lineStarts(code);
  const blankableLines = lines
    .map((l, idx) => ({ ...l, idx }))
    .filter((l) => l.text.trim() && !isSkeletonHeaderLine(l.text) && l.indent > 0);

  const target = Math.max(1, Math.round(blankableLines.length * intensity));
  const picked = new Set(blankableLines.slice(0, target).map((l) => l.idx));

  let charIdx = 0;
  for (let li = 0; li < lines.length; li++) {
    const lineLen = lines[li].text.length + (li < lines.length - 1 ? 1 : 0);
    if (picked.has(li)) {
      for (let j = 0; j < lineLen; j++) {
        if (charIdx + j < tokens.length && tokens[charIdx + j].char !== "\n") {
          mask[charIdx + j] = true;
        }
      }
    }
    charIdx += lineLen;
  }
}

function applySkeletonBlanks(tokens: CharToken[], code: string, mask: boolean[]) {
  const lines = lineStarts(code);
  let charIdx = 0;
  for (let li = 0; li < lines.length; li++) {
    const { text } = lines[li];
    const lineLen = text.length + (li < lines.length - 1 ? 1 : 0);
    const keepVisible = isSkeletonHeaderLine(text) || text.trim() === "";

    if (!keepVisible) {
      for (let j = 0; j < lineLen; j++) {
        if (charIdx + j < tokens.length && tokens[charIdx + j].char !== "\n") {
          mask[charIdx + j] = true;
        }
      }
    }
    charIdx += lineLen;
  }
}

export function buildRecallPlan(
  tokens: CharToken[],
  code: string,
  mode: RecallMode,
  intensity: number,
): RecallPlan {
  const blankMask = new Array(tokens.length).fill(false);

  if (mode === "full-copy") {
    return { blankMask, blankCharCount: 0, mode, intensity: 0 };
  }

  if (mode === "token-blank") {
    applyTokenBlanks(extractWordSpans(tokens, code), blankMask, intensity);
  } else if (mode === "line-blank") {
    applyLineBlanks(tokens, code, blankMask, intensity);
  } else if (mode === "skeleton") {
    applySkeletonBlanks(tokens, code, blankMask);
  }

  unmaskStructuralIndent(tokens, blankMask);

  return {
    blankMask,
    blankCharCount: blankMask.filter(Boolean).length,
    mode,
    intensity,
  };
}

export function blankDisplayChar(char: string, revealed: boolean, actualChar: string): string {
  if (revealed) return actualChar === " " ? "\u00a0" : actualChar;
  if (char === " ") return "\u00a0";
  if (char === "\n") return "";
  return "▁";
}
