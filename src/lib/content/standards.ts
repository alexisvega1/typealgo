import type { Language, SnippetDraft } from "@/lib/types";

/** Canonical standards for independently authored training snippets. */
export const CANONICAL_STANDARDS = {
  maxLines: 28,
  minMotifs: 1,
  maxMotifs: 4,
  requireFunctionWrapper: true,
  forbidCopyPastePhrases: [
    "copied from",
    "source:",
    "leetcode discuss",
  ],
  preferredNaming: "snake_case functions in Python, camelCase in JavaScript",
} as const;

export interface ValidationIssue {
  level: "error" | "warn";
  message: string;
}

export function validateDraft(draft: SnippetDraft): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const lines = draft.code.split("\n").filter((l) => l.trim().length > 0);

  if (lines.length > CANONICAL_STANDARDS.maxLines) {
    issues.push({
      level: "warn",
      message: `Snippet exceeds ${CANONICAL_STANDARDS.maxLines} lines — consider chunking for fluency density`,
    });
  }

  if (!draft.provenance.independentlyAuthored) {
    issues.push({ level: "error", message: "All snippets must be independently authored" });
  }

  const lower = draft.code.toLowerCase();
  for (const phrase of CANONICAL_STANDARDS.forbidCopyPastePhrases) {
    if (lower.includes(phrase)) {
      issues.push({ level: "error", message: `Forbidden phrase detected: ${phrase}` });
    }
  }

  if (CANONICAL_STANDARDS.requireFunctionWrapper) {
    const hasFn =
      (draft.language === "python" && /\bdef\s+\w+/.test(draft.code)) ||
      (draft.language === "javascript" && /\bfunction\s+\w+|=>/.test(draft.code));
    if (!hasFn) {
      issues.push({ level: "warn", message: "Prefer a named function wrapper for retrieval training" });
    }
  }

  if (!draft.description?.trim()) {
    issues.push({ level: "warn", message: "Add a one-line description for Review mode consolidation" });
  }

  return issues;
}

export function normalizeCode(code: string, language: Language): string {
  const trimmed = code.replace(/\r\n/g, "\n").trimEnd();
  if (language === "python") {
    return trimmed.split("\n").map((l) => l.replace(/\t/g, "    ")).join("\n");
  }
  return trimmed;
}
