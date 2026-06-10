import type { Snippet, PlantedBugKind } from "@/lib/types";
import { normalizeStageCode } from "@/lib/snippet-stages";

export function isComprehensionSnippet(snippet: Snippet): boolean {
  return snippet.format === "comprehension" && Boolean(snippet.buggyCode);
}

type ComprehensionSnippetInput = Omit<
  Snippet,
  "code" | "fluencyLevel" | "motifs" | "format" | "buggyCode"
> & {
  /** Corrected code — the typing target. */
  code: string;
  /** Code with exactly one planted bug — read-only context. */
  buggyCode: string;
  plantedBugKind: PlantedBugKind;
  fluencyLevel?: Snippet["fluencyLevel"];
  motifs?: Snippet["motifs"];
};

/** Define a comprehension snippet: read buggy code, type the fix. */
export function comprehensionSnippet(input: ComprehensionSnippetInput): Snippet {
  return {
    fluencyLevel: input.fluencyLevel ?? 2,
    motifs: input.motifs ?? [],
    ...input,
    format: "comprehension",
    code: normalizeStageCode(input.code),
    buggyCode: normalizeStageCode(input.buggyCode),
  };
}
