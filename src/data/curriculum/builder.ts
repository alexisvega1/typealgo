import type { Snippet, SnippetStage } from "@/lib/types";

type SnippetInput = Omit<Snippet, "fluencyLevel"> & {
  fluencyLevel?: Snippet["fluencyLevel"];
  code?: string;
};

/** Define a curriculum snippet with defaults. */
export function snippet(s: SnippetInput): Snippet {
  const code = s.code ?? s.stages?.[0]?.code ?? "";
  return {
    ...s,
    code,
    fluencyLevel: s.fluencyLevel ?? 1,
    motifs: s.motifs ?? [],
  };
}

export type { SnippetStage };
