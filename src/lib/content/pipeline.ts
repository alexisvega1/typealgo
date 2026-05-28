import { extractMotifsFromCode } from "./motif-extractor";
import { validateDraft, normalizeCode, type ValidationIssue } from "./standards";
import { validatePrerequisiteGraph, buildPrerequisiteGraph } from "./prerequisite-graph";
import type { FluencyLevel, Snippet, SnippetDraft } from "@/lib/types";

export interface IngestionResult {
  snippet: Snippet;
  issues: ValidationIssue[];
  autoMotifs: boolean;
}

export interface IngestionBatchResult {
  accepted: IngestionResult[];
  rejected: { draft: SnippetDraft; errors: ValidationIssue[] }[];
  graphErrors: string[];
}

function inferFluencyLevel(difficulty: SnippetDraft["difficulty"]): FluencyLevel {
  if (difficulty === "easy") return 2;
  if (difficulty === "medium") return 3;
  return 4;
}

/**
 * Normalize and validate a draft snippet before it enters the curriculum.
 * Does not persist — callers append to tier files or a generated registry.
 */
export function ingestDraft(draft: SnippetDraft): IngestionResult {
  const issues = validateDraft(draft);
  const errors = issues.filter((i) => i.level === "error");

  if (errors.length > 0) {
    throw new IngestionError(errors);
  }

  const autoMotifs = !draft.motifs?.length;
  const motifs =
    draft.motifs?.length
      ? draft.motifs
      : extractMotifsFromCode(draft.code, draft.language, draft.pattern);

  const snippet: Snippet = {
    id: draft.id,
    title: draft.title,
    pattern: draft.pattern,
    difficulty: draft.difficulty,
    language: draft.language,
    code: normalizeCode(draft.code, draft.language),
    description: draft.description,
    tier: draft.tier,
    fluencyLevel: draft.fluencyLevel ?? inferFluencyLevel(draft.difficulty),
    motifs,
    prerequisites: draft.prerequisites,
    variantOf: draft.variantOf,
    leetcodeId: draft.leetcodeId,
    provenance: draft.provenance,
    packIds: draft.packIds,
  };

  return { snippet, issues, autoMotifs };
}

export function ingestBatch(drafts: SnippetDraft[]): IngestionBatchResult {
  const accepted: IngestionResult[] = [];
  const rejected: { draft: SnippetDraft; errors: ValidationIssue[] }[] = [];

  for (const draft of drafts) {
    try {
      accepted.push(ingestDraft(draft));
    } catch (e) {
      if (e instanceof IngestionError) {
        rejected.push({ draft, errors: e.issues });
      } else {
        throw e;
      }
    }
  }

  const combined = [...accepted.map((a) => a.snippet)];
  const graph = buildPrerequisiteGraph(combined);
  const graphErrors = validatePrerequisiteGraph(graph);

  return { accepted, rejected, graphErrors };
}

export class IngestionError extends Error {
  constructor(public issues: ValidationIssue[]) {
    super(issues.map((i) => i.message).join("; "));
    this.name = "IngestionError";
  }
}

/** Difficulty progression within a pattern — easy → medium → hard. */
export const DIFFICULTY_ORDER = ["easy", "medium", "hard"] as const;

export function sortByProgression(snippets: Snippet[]): Snippet[] {
  return [...snippets].sort((a, b) => {
    const da = DIFFICULTY_ORDER.indexOf(a.difficulty);
    const db = DIFFICULTY_ORDER.indexOf(b.difficulty);
    if (da !== db) return da - db;
    return a.fluencyLevel - b.fluencyLevel;
  });
}
