import { SNIPPETS } from "@/data/curriculum";
import type { Snippet } from "@/lib/types";

export interface VariantFamily {
  rootId: string;
  root: Snippet;
  variants: Snippet[];
}

/** Group snippets linked by variantOf relationships. */
export function buildVariantIndex(snippets: Snippet[] = SNIPPETS): Map<string, VariantFamily> {
  const byId = new Map(snippets.map((s) => [s.id, s]));
  const families = new Map<string, VariantFamily>();

  for (const s of snippets) {
    const rootId = s.variantOf ?? s.id;
    const root = byId.get(rootId) ?? s;

    if (!families.has(rootId)) {
      families.set(rootId, { rootId, root, variants: [] });
    }

    const family = families.get(rootId)!;
    if (s.id !== rootId) {
      family.variants.push(s);
    }
  }

  return families;
}

export function getVariants(snippetId: string, snippets: Snippet[] = SNIPPETS): Snippet[] {
  const snip = snippets.find((s) => s.id === snippetId);
  if (!snip) return [];

  const rootId = snip.variantOf ?? snippetId;
  return snippets.filter((s) => s.variantOf === rootId || s.id === rootId);
}

export type VariantRelation = "optimization" | "alternative" | "language-port" | "simplified";

export interface VariantLink {
  fromId: string;
  toId: string;
  relation: VariantRelation;
}

/** Declarative variant links for future ingestion metadata. */
export const VARIANT_RELATIONS: VariantLink[] = [];

export function registerVariantLink(link: VariantLink): void {
  VARIANT_RELATIONS.push(link);
}
