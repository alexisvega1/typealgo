import type { Snippet, SnippetStage, Language } from "@/lib/types";

type SnippetInput = Omit<Snippet, "fluencyLevel"> & {
  fluencyLevel?: Snippet["fluencyLevel"];
  code?: string;
};

/** Snippet id for a language mirror of a Python-canonical seed (e.g. foo → foo-java). */
export function languageMirrorId(baseId: string, language: Exclude<Language, "python" | "javascript">): string {
  return `${baseId}-${language}`;
}

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
