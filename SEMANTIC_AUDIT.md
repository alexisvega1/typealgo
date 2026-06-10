# Semantic Progression Audit

Audit of the TypeAlgo typing engine against the **semantic progression** spec (structural auto-flow, cognitive-only input, recall separation, performance model, and future hooks).  
Scope: current `main` as of the staged-problem / character-state fixes. **Audit only** — no engine changes in this document.

---

## IMPLEMENTED

### Structural vs. cognitive token model

| Spec item | Implementation |
|-----------|----------------|
| Engine distinguishes structural from cognitive tokens | `src/lib/semantic-traversal.ts` — `isStructuralChar()` treats `\n` and **leading line indent spaces** (`src/lib/indent.ts` → `isLeadingIndentSpace()`) as structural; everything else is cognitive. |
| Cognitive token counting | `countCognitiveChars()` in `semantic-traversal.ts`; used in `TypingTest.finishTest()` for `TypingResult.totalChars`. |
| Structural keystrokes excluded from WPM / recall scoring | `KeystrokeEvent.autoStructural` set in `TypingTest.autoAdvanceStructural()`; filtered via `isAutoKeystroke()` in `recall-metrics.ts`, `sprint-metrics.ts`, `review-analytics.ts`. Live/final WPM use `correctRef`, which is **not** incremented for structural auto-flow. |

### Line completion and auto-advance (no Enter required)

| Spec item | Implementation |
|-----------|----------------|
| After a correct cognitive char, structure auto-flows | `TypingTest.typeChar()` → on correct input calls `autoAdvanceStructural(now)`, which loops while `isStructuralChar(tokens, indexRef.current)` and advances `indexRef`. |
| On snippet/stage load, cursor lands past leading structure | `useEffect` on `[snippet, tick, …]` calls `autoAdvanceStructural(performance.now())` before first keystroke. |
| Enter not required for normal line breaks | Newlines are structural; consumed in the `while` loop inside `autoAdvanceStructural`. |
| Completion at end of snippet | `typeChar()` and Enter handler both call `finishTest()` when `indexRef >= tokens.length` after structural advance. |

### Indentation never typed; cursor on next meaningful token

| Spec item | Implementation |
|-----------|----------------|
| Leading indentation auto-skipped | `isLeadingIndentSpace()` + `autoAdvanceStructural()` — indent spans are marked `char-structural-auto` via `applyCharTyped()` (`src/lib/typing-display.ts`). |
| Cursor repositioned to next cognitive char | `autoAdvanceStructural()` ends with `updateCursor(indexRef.current)`; `findCursorTarget()` skips `\n` tokens to the next visible span ref. |

### Blank lines skipped with zero input

Empty or whitespace-only lines tokenize as `\n` and/or leading spaces. All are structural under `isStructuralChar()`, so consecutive newlines and indent-only lines are consumed in `autoAdvanceStructural()` without user input.

### Recall mode: structure auto-flows, retrieval is effortful

| Spec item | Implementation |
|-----------|----------------|
| Structural syntax auto-flows in recall | `autoAdvanceStructural()` is **not** gated by training mode — runs in recall, sprint, and type modes alike. |
| Blanks target cognitive tokens | `src/lib/recall-blanks.ts` — `buildRecallPlan()` blanks keywords, identifiers, builtins, etc. via `BLANKABLE_TYPES` / `blankScore()`; modes: `token-blank`, `line-blank`, `skeleton`. |
| Indent never blanked | `unmaskStructuralIndent()` clears `blankMask` on structural indent indices so blanks cannot hide the caret. |
| Auto keystrokes excluded from recall metrics | `computeRecallMetrics()` skips `isAutoKeystroke(ks)` when scoring blanks. |
| Recall intensity adapts to fluency | `computeRecallIntensity()` + `buildRecallPlan()` in `TypingTest.prepareSnippetStage()` / `rebuildBlankMaskForMode()`. |

### Performance-oriented display model

| Spec item | Implementation |
|-----------|----------------|
| DOM-direct per-character updates | `applyCharTyped()` / `applyCharPending()` in `typing-display.ts` mutate `textContent` and `className` on span refs — no React re-render of character spans per keystroke. |
| Character spans rendered once | `codeLines` `useMemo` builds line/token structure; refs stored in `charRefs.current[globalIndex]`. |
| Cursor positioning | `TypingTest.updateCursor()` sets `cursorRef` `transform: translate3d(...)` from target span `offsetLeft` / `offsetTop` + `lineOffsetRef` (avoids mid-transition `getBoundingClientRect` bugs). |
| Cursor motion smoothing | `globals.css` `.typing-cursor` — `transition: transform 70ms …, width 70ms …, height 70ms …`. |
| Smooth active-line tracking | `focusActiveLine()` applies `translate3d` to `.code-viewport-lines`; CSS `transition: transform 0.1s cubic-bezier(0.22, 1, 0.36, 1)` in `globals.css`. First/last lines pinned; middle lines centered in viewport. |
| Active line highlight | `updateActiveLine()` toggles `code-line-active` on line refs. |

### Auto-pair (related structural-adjacent behavior)

Optional IDE-style closing bracket/quote skip: `advanceAutoPair()` + `shouldAutoCompletePair()` (`src/lib/auto-pair.ts`), gated by `settings.autoPairCompletion`. Recorded as `autoPair: true` and excluded from WPM via `isAutoKeystroke()`.

---

## PARTIAL

### Line completion auto-advances; user never presses Enter

**What exists:** Primary path is fully automatic via `autoAdvanceStructural()` after each correct cognitive character and on load.

**Gap vs. spec:**

- **Enter fallback remains:** `handleKeyDown` handles `Enter` when `isStructuralChar(tokens, indexRef.current)` — manual advance if auto-flow did not run (e.g. user stopped on a structural index after an error, or edge timing before refs bind). Spec implies Enter should never be needed; engine still exposes it as an escape hatch.
- **Errors block structural auto-flow:** On incorrect input, `typeChar()` calls `updateCursor(idx + 1)` but **does not** call `autoAdvanceStructural()`. User must backspace or continue from the error position; structure ahead is not auto-consumed until the next correct keystroke path runs.
- **Trailing newline / completion stall:** If authored code ends with cognitive characters and a final `\n` is the last token, completion depends on structural auto-flow reaching that index. Trailing whitespace in stage content (before `normalizeStageCode`) or DOM/token length mismatch (recently fixed for stages) can leave the cursor short of `tokens.length`.

### Indentation / deterministic whitespace never typed

**What exists:** **Leading** indent spaces on each line are structural and auto-flowed.

**Gap vs. spec:**

- **Mid-line spaces are cognitive:** Tokenizer emits inter-token spaces as `{ type: "default" }` (`tokenizer.ts` fall-through). Users type spaces between keywords, operators, and identifiers. Spec wording (“deterministic whitespace”) could mean all formatting whitespace; engine only auto-skips **line-leading** indent.
- **`char-indent-auto` unused:** CSS defines `.char-indent-auto` alongside `.char-structural-auto` (`globals.css`), but only `char-structural-auto` is applied; `char-indent-auto` is only stripped on Backspace — no separate indent styling or logic path.
- **`autoIndent` on `KeystrokeEvent` deprecated:** Type field exists (`types.ts`) but is never set; all structural flow uses `autoStructural`.

### Engine distinguishes structural from cognitive tokens

**What exists:** Binary split: newline + leading indent = structural; all other chars (including comments, strings, punctuation, mid-line spaces) = cognitive.

**Gap vs. spec:**

- No first-class `CharToken` structural flag — classification is positional (`indent.ts`) not lexical.
- **`nextCognitiveIndex()` exported but unused** anywhere outside `semantic-traversal.ts` — helper for “land on next meaningful token” exists but traversal uses inline `while (isStructuralChar)` instead.
- **`structuralKind()` exported but unused** — no distinct handling for newline vs. indent beyond shared auto-flow.

### Recall mode: structural auto-flows, motif retrieval effortful

**What exists:** Structural auto-flow + blank masking as above.

**Gap vs. spec:**

- **Motif effort is indirect:** Blanks are scored by token type (`blankScore`), not by snippet `motifs[]` or `MOTIF_KEYWORDS`. Motif-aware retrieval lives in **Review** analytics (`linesForMotif()`, `MOTIF_KEYWORDS` in `src/lib/modes/`), not in recall blank selection.
- **Skeleton mode keeps header lines visible** (`isSkeletonHeaderLine()`), but that is line-pattern heuristics, not motif graph traversal.

### Performance: no rerender-per-keystroke

**What exists:** Character DOM is imperative; code block structure is stable across keystrokes.

**Gap vs. spec:**

- **`TypingTest` re-renders on every keystroke** via `refreshStats()` → `setLiveWpm`, `setLiveAcc`, `setLiveMistakes` (and recall confidence when active). `LiveStats` / `RecallConfidence` subscribe to that state.
- **`setShowRevealHint(false)`** on each `typeChar` can also trigger re-render during recall.
- Header, stats, and coach-adjacent UI reconcile on each keystroke even though character spans do not.

### Performance: cursor interpolation

**What exists:** CSS transitions on cursor transform/size (70ms).

**Gap vs. spec:**

- No JS-side interpolation or predicted caret path — discrete jump per `updateCursor()` with CSS easing only.
- Cursor width tracks target character `offsetWidth` — good for wide glyphs, but not true sub-character interpolation.

### Future-architecture hooks (scaffolding only)

| Hook | What exists | What spec asks |
|------|-------------|----------------|
| **Mastered-boilerplate collapsing** | Curriculum/coach layer: `masteredMotifs` in `curriculum-engine/engine.ts`, coach `likely-mastered` labels (`coach/utils.ts`, `CoachSection.tsx`). | Collapse or skip boilerplate **during typing** based on mastery — **not wired** to `TypingTest` or `semantic-traversal`. |
| **Motif-only traversal** | Review mode: `reviewMotif`, `linesForMotif()`, `MOTIF_KEYWORDS`, line dimming/focus in `TypingTest.applyReviewStyles()`. Motif stats in `review-analytics.ts`. | Traverse/type **only motif-bearing regions** — review is study-only; type/recall/sprint still walk full token stream. |
| **Strict syntax mode** | No setting, mode flag, or traversal branch. | Not present. |

---

## ABSENT

- **Unified “semantic progression” module** — logic is split across `semantic-traversal.ts`, `indent.ts`, `TypingTest.tsx`, and `recall-blanks.ts` with no single orchestrator or spec-linked API.
- **Blank-line as explicit concept** — behavior falls out of newline/indent rules; no `isBlankLine()` or dedicated skip pass.
- **Non-leading deterministic whitespace** — trailing line whitespace, column-alignment spaces, and blank-line interior spaces beyond leading-indent rules are not treated as structural (except when they happen to be leading on an otherwise empty line).
- **Motif-driven recall blanking** — blanks are token-type/heuristic based, not motif-keyed.
- **Runtime boilerplate collapse** — no skipping/collapsing of class headers, imports, or mastered blocks during typing.
- **Motif-only typing traversal** — no mode that advances `indexRef` only between motif anchor spans.
- **Strict syntax mode** — no enforcement or alternate traversal for punctuation/bracket rigidity.
- **Use of `nextCognitiveIndex()` / `structuralKind()`** in the live engine — dead exports today.
- **Per-keystroke render isolation** — stats HUD is not decoupled from the typing loop (e.g. ref-based stats or rAF batching).

---

## Per-character state and traversal overlap

Relevant to recent character-state bug fixes (`charOutcomesRef`, `resetDisplay`, stage/token DOM sync).

### Where per-character state lives

| Store | Location | Role |
|-------|----------|------|
| **`charOutcomesRef`** | `TypingTest.tsx` | `(boolean \| null)[]` — `true` correct, `false` incorrect, `null` pending. Persists across display re-inits until stage/snippet change. |
| **`charRefs`** | `TypingTest.tsx` | DOM `HTMLSpanElement` refs indexed by token index. |
| **`blankMaskRef`** | `TypingTest.tsx` | Recall blank plan per index. |
| **`revealedRef`** | `TypingTest.tsx` | `Set<number>` of revealed blank indices (`?` reveal). |
| **`tokensRef`** | `TypingTest.tsx` | Token stream from `tokenizeCode()`. |
| **DOM class/text** | `typing-display.ts` | Authoritative visual state on each span (`char-correct`, `char-incorrect`, `char-pending`, etc.). |

Traversal position is **`indexRef`** only — `isStructuralChar()` and `autoAdvanceStructural()` read **`tokensRef` + `indexRef`**, not `charOutcomesRef`.

### Where traversal touches character state

| Function | Reads | Writes |
|----------|-------|--------|
| **`autoAdvanceStructural()`** | `tokensRef`, `indexRef`, `isStructuralChar` | `indexRef`, `charOutcomesRef[i]=true`, DOM via `applyCharTyped`, `keystrokesRef` with `autoStructural: true` |
| **`typeChar()`** | `tokensRef`, `indexRef`, `blankMaskRef` | `indexRef`, `charOutcomesRef[i]=correct`, `correctRef`/`incorrectRef`, DOM, keystrokes |
| **`advanceAutoPair()`** | same | `charOutcomesRef[i]=true`, DOM, keystrokes (`autoPair`) |
| **`resetDisplay()`** | `charOutcomesRef`, `charRefs`, `tokensRef`, `indexRef` (for pending), `blankMaskRef`, `revealedRef` | DOM only — restores from `charOutcomesRef` or `applyCharPending` |
| **`prepareSnippetStage()`** | — | Resets `charOutcomesRef` to all `null`, resizes `charRefs`, rebuilds `tokensRef` |

### Overlap / risk flags (character-state bugs)

1. **Dual writers to character appearance:** Traversal (`autoAdvanceStructural`, `typeChar`) writes both `charOutcomesRef` and DOM; `resetDisplay()` can overwrite DOM from `charOutcomesRef` or reset pending chars. Any `resetDisplay()` call after typing starts (e.g. animation complete, `tick` change, mode switch) must respect `charOutcomesRef` — recent fix does; **`onAnimationComplete` still calls `resetDisplay()` only when `indexRef === 0` and no keystrokes**.

2. **Structural chars always stored as correct in `charOutcomesRef`:** `autoAdvanceStructural()` sets `charOutcomesRef[idx] = true` even though structural keystrokes are not scored in WPM. Harmless for stats but means `charOutcomesRef` is not strictly “user outcome” — it includes auto-flow.

3. **Traversal without DOM:** When `charRefs[idx]` is null (token/DOM length desync — stage bug class), `indexRef` still advances and keystrokes append, but no `charOutcomesRef`/DOM update occurs for those indices — cursor/target logic in `findCursorTarget()` may jump to next available ref.

4. **`applyCharPending(..., typedIndex)` uses `indexRef.current`:** In `resetDisplay()`, pending styling for indices without an outcome uses current cursor position as the typed/pending boundary. Indices with stored outcomes ignore `typedIndex`. Traversal position and display state can diverge briefly if `resetDisplay()` runs mid-run without clearing `charOutcomesRef`.

5. **Backspace is the only traversal path that clears `charOutcomesRef`:** Pops keystrokes and sets `charOutcomesRef[charIdx] = null` before `applyCharPending`. Structural auto-keystrokes can be popped in a batch via `isAutoKeystroke()` loop — structural and cognitive undo share the same stack.

6. **Recall blanks vs. structural mask:** `unmaskStructuralIndent()` runs at plan build time; traversal does not re-check blank mask when auto-flowing structure. Structural indices should always have `blankMask[i] === false`.

---

## Stats integrity (verified)

**Question:** Does Type mode WPM/accuracy count structural auto-advanced characters via `charOutcomesRef`?

**Verdict: No — metrics path is clean.**

| Metric | Source | Structural auto-chars included? |
|--------|--------|----------------------------------|
| Live WPM / accuracy | `correctRef` + `incorrectRef` in `refreshStats()` | **No** — only incremented in `typeChar()` |
| Final `TypingResult.wpm` / `.accuracy` | Same refs in `finishTest()` | **No** |
| `TypingResult.rawWpm` | `calcRawWpm(correctRef + incorrectRef, …)` | **No** |
| Recall / sprint scoring | `isAutoKeystroke()` filters `keystrokesRef` | **No** |
| `charOutcomesRef` | Display restore in `resetDisplay()` only | **Not read by any metric** |

`autoAdvanceStructural()` writes `charOutcomesRef[idx] = true` and appends `autoStructural: true` keystrokes, but never touches `correctRef`. The audit’s concern (same array holding user and auto outcomes) applies to **display state only**, not fluency numbers.

---

## Known minor gaps (tracked, not urgent)

Fix together on the next engine-touching session in `metrics.ts` / `TypingTest.tsx`. Zero user-visible urgency today.

### 1. `hesitationHotspots()` includes auto-keystrokes

**File:** `src/lib/metrics.ts` — `hesitationHotspots()`

**Issue:** Iterates all `keystrokes` without filtering `isAutoKeystroke()`. On heavily indented snippets, coach hints, review analytics, and `ResultsPanel` hotspot lists can be slightly skewed by zero-delay structural entries.

**Contrast:** `computeRecallMetrics()` and `computeSprintMetrics()` already filter auto-keystrokes.

**Fix:** Skip `isAutoKeystroke(ks)` in the loop (same pattern as recall/sprint).

### 2. `charOutcomesRef` conflates user-correct and auto-correct

**File:** `TypingTest.tsx` — `charOutcomesRef: (boolean | null)[]`

**Issue:** `autoAdvanceStructural()` and `advanceAutoPair()` store `true` alongside user-typed outcomes from `typeChar()`. Harmless for metrics (see above) but semantically ambiguous for display restoration.

**Fix:** Widen type to `'auto' | boolean | null`; map `'auto'` to the same green styling as correct structural chars in `resetDisplay()`. Defensive typing only — no behavior change to WPM/accuracy.

---

## Summary

The engine **implements the core semantic progression loop**: leading indent and newlines auto-flow, cognitive characters require input, recall blanks cognitive tokens while structure flows, and WPM/recall metrics exclude auto-keystrokes. **Gaps** are mostly scope boundaries (mid-line spaces still typed, Enter fallback, motif-agnostic recall), **performance** (stats re-render per keystroke; CSS-only cursor easing), and **future hooks** (mastery collapse, motif-only traversal, strict syntax) existing only in curriculum/coach/review layers — not in the typing traversal itself.

**Highest-impact partial items relative to the spec:** mid-line whitespace classification, unused `nextCognitiveIndex()` (cursor landing helper), and decoupling live stats updates from the keystroke hot path.

**Companion docs:** `TRACKS_AUDIT.md` (track restructure inventory), `TRACKS_CONTENT_SPEC.md` (content authoring WHAT).
