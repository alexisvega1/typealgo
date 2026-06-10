# TypeAlgo run #5: Landing page hero (LOCAL — design run, stop for review)

Copy to Cursor when ready. **Watch this run** — Phase 1 stops for your review before animation.

**Prerequisite:** Runs #1–#4 complete (content queue empty). All catalog data ships; hero pulls from real problem data so stats and snippets stay in sync.

### Delivery mode

| Mode | Instructions |
|------|----------------|
| **Local Cursor agent** | Commit per phase on `main`. **Do not push** — review locally first. **Stop after Phase 1** for design review. |
| **Cloud / background agent** | **Not recommended** — design is iterative; the Phase 1 stop-gate is the whole point. |

---

## Design decisions (locked)

| Question | Answer |
|----------|--------|
| Hero content | Live track-switching preview: Google comprehension bug-fix → Anthropic staged build → OpenAI gates |
| Motion | Subtle — flowing/blinking cursor + gentle fade between tracks. Not full staged-gate playback. |
| Lead track | Google comprehension bug-fix (newest, most distinctive format) |
| Scope | Hero section **only**. No Recall/Review/Sprint previews below the fold (deferred). |
| Constraints | Reuse existing theme tokens and `globals.css`. New layout within the design system. No regressions to dvh/safe-area viewport rules. |

**Mockup note:** A static concept mockup aligns on *layout and idea*, not pixel-perfect styling. Build within the actual theme and components — real tokens will look different (and should look better).

---

```
# TypeAlgo: landing-page hero (LOCAL — design run, stop for review)

Read globals.css, layout.tsx, and the existing landing/home component
first. Commit per phase on main, typecheck before each, DO NOT PUSH.
This is a DESIGN run — after Phase 1, STOP and tell me to look before
building animation.

Design decisions (locked):
- Hero shows a live track-switching preview: rotate through Google
  comprehension bug-fix → Anthropic staged build → OpenAI gate, the
  code block typing itself out for each, then fading to the next.
- Motion: subtle. Flowing/blinking cursor + gentle fade between tracks.
  NOT full staged-gate playback — just enough to suggest the typing feel.
- Lead the rotation with the Google comprehension bug-fix (newest,
  most distinctive format).
- Scope: hero section ONLY. No Recall/Review/Sprint previews below the
  fold — that's a separate future run.
- Constraints: reuse existing theme tokens and globals.css. New layout
  WITHIN the existing design system. Do NOT regress the dvh/safe-area
  viewport fixes or any existing globals.css rules.

## Phase 1 — Static hero (STOP AFTER THIS)
Build the hero structure, NO animation yet:
- Headline + subhead conveying "practice the exact code formats real
  2026 interviews use."
- Three track pills (Google bug-fix / Anthropic staged / OpenAI gates),
  the active one visually highlighted.
- A code preview block showing one real snippet from the catalog
  (start with a Google comprehension bug-fix problem — pull from actual
  problem data, don't hardcode a fake snippet).
- A stats row reading from the real catalog (problem count, formats,
  tracks) — not hardcoded numbers that'll drift.
- CTA to enter the trainer.
Commit. Then STOP and tell me to review before Phase 2.

## Phase 2 — Animation (only after I approve Phase 1)
- Typing animation: code types out character-by-character with a
  blinking cursor, reading the snippet from real problem data.
- Track rotation: after a snippet finishes (or a few seconds), fade to
  the next track + its snippet. Loop. Lead with Google bug-fix.
- Respect prefers-reduced-motion: if set, show the static hero (Phase 1
  state) with no animation — accessibility requirement, not optional.
- Pause animation on hover/focus so a reviewer can read it.
- Performance: animation must not cause layout thrash or jank; use CSS
  transitions/transforms, not per-frame React re-renders.
Commit.

## Phase 3 — Docs
Update PREP_BACKLOG.md: landing hero shipped, note below-fold previews
as deferred. Commit.

## House rules
- Reuse design tokens; no new color system. Sentence case, existing fonts.
- prefers-reduced-motion support is mandatory in Phase 2.
- No regressions to engine, auth, globals.css viewport rules, keep-alive.
- Never push --force. Blocked phase after 3 retries → log, commit, skip.
- DO NOT PUSH. After Phase 1, STOP for my review before Phase 2.
```

---

## Review focus

### Phase 1 (static — stop here first)

- Headline/subhead voice — does it land for a 2026 interview reviewer?
- Wrong snippet, pills too big, stats row layout — tune before animation.
- Snippet and stats must come from **real catalog data**, not hardcoded strings or counts.

### Phase 2 (animation — only after Phase 1 approval)

- `prefers-reduced-motion` → static hero, no animation (accessibility signal).
- Pause on hover/focus so a reviewer can read without chasing the cursor.
- No layout thrash — CSS transitions/transforms, not per-frame React re-renders.

---

## Notes before running

1. **Watch it, don't background it.** The Phase 1 stop-gate is the whole point. A landing page you didn't look at mid-build is a landing page you'll redo.

2. **Two protections baked in:** real catalog data for snippets/stats (hero won't drift when problems are added), and `prefers-reduced-motion` (clean static hero for motion-sensitive reviewers — handling it is itself a signal of care).

3. **Mockup is concept, not spec.** Don't reproduce a widget pixel-for-pixel; align on layout and idea, then build with real tokens.

---

## Deferred (separate future run)

- Recall / Review / Sprint mode previews below the fold
- Full staged-gate playback in the hero (out of scope — subtle typing feel only)

---

## Suggested session

Run when you have a focused block — ideally not at the end of a night. When Phase 1 stops, paste a screenshot and tune before Phase 2 animates.
