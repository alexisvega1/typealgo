"use client";

import {
  CONTENT_SOURCES,
  contentArchitectureSummary,
  buildPrerequisiteGraph,
  snippetCountForPack,
} from "@/lib/content";
import { ML_ENGINEERING_DOMAINS } from "@/lib/content/ml-expansion";
import { CONTENT_PACKS } from "@/lib/content/packs";

const STATUS_LABEL: Record<string, string> = {
  active: "Active",
  planned: "Planned",
  community: "Community",
  seasonal: "Seasonal",
};

export function ContentStrategyPanel() {
  const summary = contentArchitectureSummary();
  const graph = buildPrerequisiteGraph();

  return (
    <div className="space-y-8">
      <section className="card">
        <h2 className="card-title">Content Moat Architecture</h2>
        <p className="card-subtitle">
          Motif-driven curriculum — derived inspiration, never mirrored catalogs
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-sm">
          <Stat label="Canonical snippets" value={summary.snippetCount} />
          <Stat label="Motif-tagged" value={`${summary.withMotifs}/${summary.snippetCount}`} />
          <Stat label="Prerequisite depth" value={summary.graphDepth} />
          <Stat label="Active packs" value={summary.activePacks} />
        </div>
        {!summary.graphValid && (
          <p className="mt-3 text-xs text-red">
            Graph validation: {summary.graphErrors.join("; ")}
          </p>
        )}
      </section>

      <section className="card">
        <h2 className="card-title">Inspiration Sources</h2>
        <p className="card-subtitle">Structure and progression — not verbatim cloning</p>
        <div className="mt-4 space-y-3">
          {CONTENT_SOURCES.filter((s) => s.id !== "typealgo-original").map((source) => (
            <div key={source.id} className="rounded-lg bg-surface-2 px-4 py-3 text-sm">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium">{source.name}</span>
                <span className="text-xs text-muted capitalize">{source.role}</span>
                {source.url && (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-accent hover:underline ml-auto"
                  >
                    Reference ↗
                  </a>
                )}
              </div>
              <p className="mt-1 text-xs text-muted">
                Derive: {source.deriveFrom.join(" · ")}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="card">
        <h2 className="card-title">Content Packs</h2>
        <p className="card-subtitle">Current curriculum + expansion roadmap</p>
        <div className="mt-4 space-y-2">
          {CONTENT_PACKS.map((pack) => {
            const count = snippetCountForPack(pack.id);
            const target = pack.targetSnippetCount;
            return (
              <div key={pack.id} className="curriculum-snippet-row">
                <span className="font-medium min-w-0 truncate">{pack.name}</span>
                <span className="text-xs capitalize text-muted">{STATUS_LABEL[pack.status]}</span>
                <span className="text-xs text-muted">
                  {target ? `${count}/${target}` : count || "—"}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="card">
        <h2 className="card-title">Prerequisite Graph</h2>
        <p className="card-subtitle">
          {graph.roots.length} entry points · max depth {graph.maxDepth}
        </p>
        <div className="mt-4 max-h-48 overflow-y-auto space-y-1 text-xs font-mono">
          {Array.from(graph.nodes.values())
            .filter((n) => n.prerequisites.length > 0)
            .slice(0, 12)
            .map((n) => (
              <div key={n.id} className="text-muted">
                <span className="text-foreground">{n.title}</span>
                {" ← "}
                {n.prerequisites.join(", ")}
              </div>
            ))}
          {graph.nodes.size > 12 && (
            <p className="text-muted pt-1">+ {graph.nodes.size - 12} more nodes</p>
          )}
        </div>
      </section>

      <section className="card">
        <h2 className="card-title">ML Engineering Expansion</h2>
        <p className="card-subtitle">Same Type / Recall / Review / Sprint — procedural fluency for ML</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {ML_ENGINEERING_DOMAINS.slice(0, 9).map((d) => (
            <div key={d.id} className="rounded-lg bg-surface-2 px-3 py-2 text-sm">
              <span className="font-medium">{d.name}</span>
              <p className="mt-1 text-xs text-muted truncate">{d.exampleChunks.join(" · ")}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="card border-dashed">
        <h2 className="card-title">Ingestion Pipeline</h2>
        <p className="card-subtitle text-sm leading-relaxed">
          Draft → validate standards → extract motifs → normalize code → check prerequisite graph →
          register snippet. Community packs and AI motif decomposition plug into the same pipeline.
        </p>
        <ul className="mt-3 space-y-1 text-xs text-muted list-disc pl-4">
          <li>Independently authored implementations only</li>
          <li>Chunk size capped for retrieval strength</li>
          <li>Variant links for optimizations and language ports</li>
          <li>Adaptive resurfacing weights weak motifs automatically</li>
        </ul>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg bg-surface-2 px-3 py-2">
      <p className="text-xs text-muted">{label}</p>
      <p className="text-lg font-semibold tabular-nums">{value}</p>
    </div>
  );
}
