import type { Snippet, SnippetStage } from "@/lib/types";

export function normalizeStageCode(code: string): string {
  return code.trimEnd();
}

export function isStagedSnippet(snippet: Snippet): boolean {
  return Boolean(snippet.stages && snippet.stages.length > 0);
}

export function snippetStageCount(snippet: Snippet): number {
  if (snippet.stages && snippet.stages.length > 0) return snippet.stages.length;
  return 1;
}

export function snippetStageCode(snippet: Snippet, stageIndex: number): string {
  if (snippet.stages && snippet.stages.length > 0) {
    const stage = snippet.stages[stageIndex];
    if (stage) return normalizeStageCode(stage.code);
  }
  return normalizeStageCode(snippet.code);
}

export function snippetStageRequirement(snippet: Snippet, stageIndex: number): string | null {
  return snippet.stages?.[stageIndex]?.requirement ?? null;
}

export function snippetStageLabel(snippet: Snippet, stageIndex: number): string {
  const total = snippetStageCount(snippet);
  if (total <= 1) return "";
  return `Stage ${stageIndex + 1} of ${total}`;
}

type StagedSnippetInput = Omit<Snippet, "code" | "fluencyLevel" | "motifs"> & {
  stages: SnippetStage[];
  code?: string;
  fluencyLevel?: Snippet["fluencyLevel"];
  motifs?: Snippet["motifs"];
};

/** Define a multi-stage snippet; top-level `code` defaults to stage 1 for backwards compatibility. */
export function stagedSnippet(input: StagedSnippetInput): Snippet {
  const firstCode = normalizeStageCode(input.stages[0]?.code ?? "");
  return {
    fluencyLevel: input.fluencyLevel ?? 2,
    motifs: input.motifs ?? [],
    ...input,
    format: input.format ?? "staged",
    code: normalizeStageCode(input.code ?? firstCode),
  };
}

/** Dev guard: header stage index must match the code being rendered. */
export function assertStageContentSync(
  snippet: Snippet,
  stageIndex: number,
  renderedCode: string,
): void {
  if (process.env.NODE_ENV === "production") return;
  if (!snippet.stages?.length) return;

  const expected = snippetStageCode(snippet, stageIndex);
  if (renderedCode !== expected) {
    console.error("[TypeAlgo] Stage header/content desync", {
      snippetId: snippet.id,
      stageIndex,
      stageId: snippet.stages[stageIndex]?.id,
      requirement: snippet.stages[stageIndex]?.requirement,
      expectedLength: expected.length,
      renderedLength: renderedCode.length,
    });
  }
}
