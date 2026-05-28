import type { CharToken, Language, TokenType } from "./types";

const PYTHON_KEYWORDS = new Set([
  "def",
  "return",
  "if",
  "else",
  "elif",
  "for",
  "while",
  "in",
  "not",
  "and",
  "or",
  "class",
  "import",
  "from",
  "as",
  "None",
  "True",
  "False",
  "pass",
  "break",
  "continue",
  "lambda",
  "yield",
  "with",
  "try",
  "except",
  "finally",
  "raise",
]);

const PYTHON_BUILTINS = new Set([
  "len",
  "range",
  "enumerate",
  "set",
  "list",
  "dict",
  "min",
  "max",
  "sum",
  "abs",
  "sorted",
  "reversed",
  "float",
  "int",
  "str",
  "bool",
  "print",
  "map",
  "filter",
  "zip",
  "any",
  "all",
]);

const JS_KEYWORDS = new Set([
  "const",
  "let",
  "var",
  "function",
  "return",
  "if",
  "else",
  "for",
  "while",
  "of",
  "in",
  "new",
  "class",
  "import",
  "export",
  "from",
  "default",
  "null",
  "undefined",
  "true",
  "false",
  "this",
  "async",
  "await",
  "try",
  "catch",
  "throw",
]);

function classifyWord(word: string, language: Language): TokenType {
  if (language === "python") {
    if (PYTHON_KEYWORDS.has(word)) return "keyword";
    if (PYTHON_BUILTINS.has(word)) return "builtin";
  }
  if (language === "javascript") {
    if (JS_KEYWORDS.has(word)) return "keyword";
  }
  if (/^\d+$/.test(word)) return "number";
  return "identifier";
}

export function tokenizeCode(code: string, language: Language): CharToken[] {
  const tokens: CharToken[] = [];
  let i = 0;

  while (i < code.length) {
    const ch = code[i];

    if (ch === "#" && language === "python") {
      const start = i;
      while (i < code.length && code[i] !== "\n") i++;
      for (let j = start; j < i; j++) {
        tokens.push({ char: code[j], type: "comment" });
      }
      continue;
    }

    if (ch === "/" && code[i + 1] === "/" && language === "javascript") {
      const start = i;
      while (i < code.length && code[i] !== "\n") i++;
      for (let j = start; j < i; j++) {
        tokens.push({ char: code[j], type: "comment" });
      }
      continue;
    }

    if (ch === '"' || ch === "'") {
      const quote = ch;
      tokens.push({ char: ch, type: "string" });
      i++;
      while (i < code.length && code[i] !== quote) {
        tokens.push({ char: code[i], type: "string" });
        i++;
      }
      if (i < code.length) {
        tokens.push({ char: code[i], type: "string" });
        i++;
      }
      continue;
    }

    if (/[a-zA-Z_]/.test(ch)) {
      const start = i;
      while (i < code.length && /[a-zA-Z0-9_]/.test(code[i])) i++;
      const word = code.slice(start, i);
      const wordType = classifyWord(word, language);
      const fnType: TokenType =
        i < code.length && code[i] === "(" ? "function" : wordType;
      for (let j = start; j < i; j++) {
        tokens.push({ char: code[j], type: fnType });
      }
      continue;
    }

    if (/[+\-*/%=<>!&|^~]/.test(ch)) {
      tokens.push({ char: ch, type: "operator" });
      i++;
      continue;
    }

    if (/[()[\]{}:,.]/.test(ch)) {
      tokens.push({ char: ch, type: "punctuation" });
      i++;
      continue;
    }

    if (/\d/.test(ch)) {
      while (i < code.length && /[\d.]/.test(code[i])) {
        tokens.push({ char: code[i], type: "number" });
        i++;
      }
      continue;
    }

    tokens.push({ char: ch, type: "default" });
    i++;
  }

  return tokens;
}

export function flattenTokens(tokens: CharToken[]): string {
  return tokens.map((t) => t.char).join("");
}
