"use client";

import { evidenceEngineSummary, EVIDENCE_SOURCE_REGISTRY } from "@/lib/evidence";

export function EvidenceCredibilityPanel() {
  const summary = evidenceEngineSummary();

  return (
    <section className="card border-dashed">
      <h2 className="card-title">Evidence-weighted curriculum</h2>
      <p className="card-subtitle leading-relaxed">
        Track labels are probabilistic associations from public prep motifs — never claims
        about what any company asks. We prefer uncertainty labels over fake certainty.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-4 text-sm">
        <Stat label="Snippets scored" value={summary.snippetCount} />
        <Stat label="High confidence" value={summary.highConfidence} />
        <Stat label="Moderate" value={summary.mediumConfidence} />
        <Stat label="Curated overrides" value={summary.curatedOverrides} />
      </div>

      <div className="mt-5">
        <h3 className="text-xs font-medium uppercase tracking-wider text-muted">
          Public signal sources (aggregate only)
        </h3>
        <ul className="mt-2 space-y-2 text-xs text-muted">
          {EVIDENCE_SOURCE_REGISTRY.slice(0, 6).map((s) => (
            <li key={s.kind}>
              <span className="text-foreground">{s.name}</span> — {s.deriveFrom[0]}
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-4 text-xs text-muted leading-relaxed">
        Pattern sophistication (easy → research-heavy) is scored separately from company
        emphasis. A rotated array may rank high for Meta/Google prep discussions but low for
        OpenAI infra emphasis unless tagged for research roles.
      </p>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-surface-2 px-3 py-2">
      <p className="text-xs text-muted">{label}</p>
      <p className="text-lg font-semibold tabular-nums">{value}</p>
    </div>
  );
}
