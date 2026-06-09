import type { Snippet, SnippetStage } from "@/lib/types";

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
    if (stage) return stage.code;
  }
  return snippet.code;
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
  const firstCode = input.stages[0]?.code ?? "";
  return {
    fluencyLevel: input.fluencyLevel ?? 2,
    motifs: input.motifs ?? [],
    ...input,
    code: input.code ?? firstCode,
  };
}
