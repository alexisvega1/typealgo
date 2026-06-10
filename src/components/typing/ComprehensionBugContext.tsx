"use client";

import type { Snippet } from "@/lib/types";
import { isComprehensionSnippet } from "@/lib/snippet-comprehension";

interface ComprehensionBugContextProps {
  snippet: Snippet;
}

/** Read-only buggy code shown above the typing target for comprehension problems. */
export function ComprehensionBugContext({ snippet }: ComprehensionBugContextProps) {
  if (!isComprehensionSnippet(snippet)) return null;

  const lines = snippet.buggyCode!.split("\n");

  return (
    <section className="comprehension-bug-context" aria-label="Buggy code to analyze">
      <p className="comprehension-bug-context-label">
        This code has a bug — identify it, then type the corrected version below.
      </p>
      <pre className="comprehension-bug-context-code">
        <code>
          {lines.map((line, i) => (
            <span key={i} className="comprehension-bug-line">
              {line || "\u00a0"}
              {"\n"}
            </span>
          ))}
        </code>
      </pre>
    </section>
  );
}
