import type { Snippet } from "@/lib/types";

type SnippetInput = Omit<Snippet, "fluencyLevel"> & { fluencyLevel?: Snippet["fluencyLevel"] };

/** Define a curriculum snippet with defaults. */
export function snippet(s: SnippetInput): Snippet {
  return {
    ...s,
    fluencyLevel: s.fluencyLevel ?? 1,
    motifs: s.motifs ?? [],
  };
}
