# TypeAlgo run #3: Google multi-language mirrors

Copy to Cursor when ready. Closes the **only logged deferral** from runs #1–#2.

**Prerequisite:** Runs #1–#2 complete (51 dedicated seeds; comprehension format shipped).

### Delivery mode

| Mode | Instructions |
|------|----------------|
| **Local Cursor agent** | Commit per phase on `main`. **Do not push** — review locally first. |
| **Cloud / background agent** | Branch `content/google-mirrors`. Push branch only; PR for review. |

---

```
# TypeAlgo: Google multi-language mirrors (LOCAL)

Read TRACKS_CONTENT_SPEC.md and PREP_BACKLOG.md first. Commit per phase
on main, typecheck (npx tsc --noEmit) before each, DO NOT PUSH.

Context: Google restricts coding interviews to Python, Java, C++, and
JavaScript. The Google classic pool (9 problems) and the 6 Google
comprehension problems are currently Python-only. Add Java and C++
mirrors (skip JS unless trivial — Python+Java+C++ covers Google's real
distribution).

## Phase 0 — Multi-language data model
Check how the Snippet schema handles language. If a problem is
single-language today, extend it so one logical problem can carry
multiple language variants the user selects via the existing language
selector, backwards compatible. If this needs more than a contained
schema change, STOP and write the design into TRACKS_AUDIT.md for my
review before proceeding. Commit.

## Phase 1 — Java mirrors (9 classic + 6 comprehension)
Author idiomatic Java for each existing Google problem — same algorithm,
same planted bug/fix for comprehension ones. Idiomatic Java (no
C-style), correct types, compiles mentally. Link mirrors to Python
originals (variantOf or equivalent). Commit.

## Phase 2 — C++ mirrors (9 classic + 6 comprehension)
Same, idiomatic modern C++ (auto, range-for, STL containers). Commit.

## Phase 3 — Docs
Update PREP_BACKLOG.md and TRACKS_AUDIT.md: Google mirrors shipped,
mark the deferred item closed. Commit.

## House rules
Algorithm correctness matters (typing targets). Comprehension fixes must
stay correct in every language. No regressions to engine/auth/globals.css/
keep-alive. Never push --force; blocked phase after 3 retries → log in
TRACKS_AUDIT.md, commit what's done, skip, continue. DO NOT PUSH.
```

---

## Review focus when it finishes

1. **Phase 0 report** — Is multi-language a clean extension (e.g. per-language snippet IDs + `variantOf`) or does it require engine changes?
2. **Comprehension ports** — Spot-check that Java/C++ *fixes* are correct, not just the planted bugs. A fix right in Python can be subtly wrong when ported.
3. **Idiom** — Java should use collections/maps idiomatically; C++ should use STL, not C-style arrays.

## Inventory target

| Pool | Before | After |
|------|--------|-------|
| Google classic | 9 (Python) | 9 × 3 langs = 27 snippet rows |
| Google comprehension | 6 (Python) | 6 × 3 langs = 18 snippet rows |

Python originals remain canonical; mirrors are additive.
