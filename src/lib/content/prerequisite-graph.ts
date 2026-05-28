import { SNIPPETS, getSnippet } from "@/data/curriculum";
import type { Snippet } from "@/lib/types";

export interface PrerequisiteNode {
  id: string;
  title: string;
  prerequisites: string[];
  dependents: string[];
  depth: number;
}

export interface PrerequisiteGraph {
  nodes: Map<string, PrerequisiteNode>;
  roots: string[];
  maxDepth: number;
}

/** Build prerequisite graph from current curriculum. */
export function buildPrerequisiteGraph(snippets: Snippet[] = SNIPPETS): PrerequisiteGraph {
  const nodes = new Map<string, PrerequisiteNode>();

  for (const s of snippets) {
    nodes.set(s.id, {
      id: s.id,
      title: s.title,
      prerequisites: s.prerequisites ?? [],
      dependents: [],
      depth: 0,
    });
  }

  for (const s of snippets) {
    for (const prereq of s.prerequisites ?? []) {
      nodes.get(prereq)?.dependents.push(s.id);
    }
  }

  const roots: string[] = [];
  for (const node of nodes.values()) {
    if (node.prerequisites.length === 0) roots.push(node.id);
  }

  const depthMemo = new Map<string, number>();

  function depth(id: string, visiting = new Set<string>()): number {
    if (depthMemo.has(id)) return depthMemo.get(id)!;
    if (visiting.has(id)) return 0;
    visiting.add(id);
    const node = nodes.get(id);
    if (!node || node.prerequisites.length === 0) {
      depthMemo.set(id, 0);
      return 0;
    }
    const d =
      1 + Math.max(...node.prerequisites.map((p) => depth(p, new Set(visiting))));
    depthMemo.set(id, d);
    node.depth = d;
    return d;
  }

  for (const id of nodes.keys()) depth(id);

  const maxDepth = Math.max(0, ...Array.from(nodes.values()).map((n) => n.depth));

  return { nodes, roots, maxDepth };
}

export function validatePrerequisiteGraph(graph: PrerequisiteGraph): string[] {
  const errors: string[] = [];

  for (const [id, node] of graph.nodes) {
    for (const prereq of node.prerequisites) {
      if (!graph.nodes.has(prereq)) {
        errors.push(`${id} references missing prerequisite ${prereq}`);
      }
    }
  }

  function hasCycle(id: string, visited = new Set<string>(), stack = new Set<string>()): boolean {
    if (stack.has(id)) return true;
    if (visited.has(id)) return false;
    visited.add(id);
    stack.add(id);
    const node = graph.nodes.get(id);
    if (node) {
      for (const p of node.prerequisites) {
        if (hasCycle(p, visited, stack)) return true;
      }
    }
    stack.delete(id);
    return false;
  }

  for (const id of graph.nodes.keys()) {
    if (hasCycle(id)) errors.push(`Cycle detected involving ${id}`);
  }

  return errors;
}

export function getLearningPath(targetId: string): Snippet[] {
  const target = getSnippet(targetId);
  if (!target) return [];

  const path: Snippet[] = [];
  const visited = new Set<string>();

  function walk(id: string) {
    if (visited.has(id)) return;
    visited.add(id);
    const snip = getSnippet(id);
    if (!snip) return;
    for (const p of snip.prerequisites ?? []) walk(p);
    path.push(snip);
  }

  walk(targetId);
  return path;
}
