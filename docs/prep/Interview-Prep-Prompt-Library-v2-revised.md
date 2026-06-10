# Interview Prep Prompt Library v2 — Engineered, Curated, Anti-Sycophancy

*Rebuilt from the v1 library. Same principle (draft yourself → AI refines → you defend every claim), but smaller, sharper, and engineered so the model actually tells you the truth. Targets: Anthropic and OpenAI. All of these are **prep** prompts — never use them during live interviews or take-homes unless explicitly permitted.*

---

## Why v2 is different

The v1 library was thorough but had three flaws: too many near-duplicate prompts, "grade me" prompts with no anchored rubric (so the model inflates), and no use of what we know about where candidates actually fail. v2 fixes all three. The most important upgrade is the **anti-sycophancy harness** in §2 — paste it into any evaluation prompt and the model stops complimenting you and starts scoring you against a real bar.

How to use this doc: fill in the **Context Block** (§1) once and keep it on your clipboard. Use the **Power Prompts** (§2) as your daily drivers. Reach for the **Targeted Prompts** (§3–4) when prepping a specific company. Everything else in v1 was a variation on these — you don't need it.

---

## 1. The Context Block (fill once, paste everywhere)

Stop re-pasting your background into every prompt. Fill this once, save it, and prepend it to any prompt below that needs context.

```
CANDIDATE CONTEXT (treat as factual; do not embellish or invent beyond this):

COMPLETED / RUN-BACKED
- Neuroscience PhD candidate, University of Michigan (Aton lab); orexin-VIP circuits and memory consolidation.
- Brain-wide c-Fos quantification experience; QuPath/ABBA imaging workflows; intersectional genetics.
- Teaching/GSI experience for MCDB 322 across multiple semesters; strong communication and explanation skills.
- Python as primary interview language.

CONNECTOMICS / FFN PORTFOLIO STATUS
- Keep this section updated from the repo before using it in applications.
- Claim only run-backed artifacts: tests, Colab passes, benchmark outputs, screenshots, logs, merged PRs, or reproducible scripts.
- Candidate phrases to use only if literally true in the repo: skeleton-based ERL, RAG agglomeration, proofreader benchmark harness, FIB-25 Colab inference PASS, TensorStore/zarr/n5 workflows, Ray-based orchestration, FastAPI/Next.js dashboard.

IN PROGRESS / PARTIAL
- Connectomics / FFN portfolio as flagship technical deep-dive artifact.
- AI-for-science narrative connecting biological data scale, segmentation QC, reproducibility, and human-in-the-loop review.

KNOWN GAPS TO ADDRESS HONESTLY
- Production ML systems at frontier-lab scale.
- Distributed-systems interview fluency.
- Coding-interview speed under time pressure.
- Python concurrency depth: threads vs. processes vs. async, GIL, thread safety.

DO NOT CLAIM YET
- Any performance number not logged.
- Any pipeline behavior not tested.
- Any artifact that cannot be shown or reproduced.
- Any result that was AI-generated but not manually verified.

TARGET ROLES
- Research engineer / ML engineer.
- Primary near-term targets: Anthropic, OpenAI, Google Research Connectomics, Google DeepMind-adjacent AI-for-science roles.
```

---

## 2. Power Prompts (the daily drivers)

### 2A. The anti-sycophancy harness (paste into any "evaluate me" prompt)

This is the single highest-value block in the document. It forces honest, calibrated feedback.

```
EVALUATION RULES — follow these strictly:
1. Do not compliment me. Do not open with anything positive. Lead with the single
   weakest thing in my answer.
2. Score me on a 1-10 scale and define the bar: tell me, in one sentence each, what a
   3/10, a 6/10, and a 9/10 answer looks like for THIS question, then place me.
3. Justify every point you deduct with a specific quote from my answer. No vague notes.
4. Assume a skeptical senior interviewer who has heard a hundred versions of this answer.
   What makes mine forgettable? What follow-up would expose a weakness?
5. If I am being vague, defensive, generic, or inflating my contribution, say so plainly.
6. Do not rewrite my answer. Give me the diagnosis only. I will revise, then resubmit.
7. End with the ONE change that would raise my score the most.
```


### 2A-alt. Balanced final-edit mode

Use this when the answer is close to done and you need polish without losing the strong parts. Do not use it for first-pass critique.

```
EVALUATION RULES — balanced final edit:
1. Identify the strongest sentence or idea first so I know what to preserve.
2. Then identify the weakest part and the most likely skeptical follow-up.
3. Flag any unsupported, inflated, generic, or AI-sounding claim.
4. Suggest edits that preserve my voice.
5. End with a final version only if I explicitly ask for a rewrite.
```

### 2B. Calibration check (run this first, occasionally)

Before trusting the harness, make the model show you its bar so you know it isn't being soft:

```
For the question "[paste question]", write three example answers: one you would honestly
score 3/10, one 6/10, one 9/10. After each, explain in two sentences exactly what moves
it up a tier. Do not make the 9/10 sound superhuman — make it realistic for a strong
candidate. I want to see the bar before I submit my own answer.
```

### 2C. Reusable interviewer persona (one question at a time)

```
[Context Block]
You are a [Anthropic / OpenAI] interviewer for a [role]. Run a mock [coding / system
design / behavioral / values] round. Ask ONE question at a time and wait for my answer.
After each answer, apply the EVALUATION RULES above, then ask the next question. Push
back when I'm vague — don't accept the first answer if a real interviewer would dig.
Stay in role. Begin.
```

### 2D. The master application-answer prompt (refine, never generate)

```
[Context Block]
I am applying for [role] at [company]. I wrote the first draft myself.
Job description: [paste]
Question: [paste]
My draft: [paste]

Rules:
1. Do NOT invent any experience, metric, result, or claim. If a number would strengthen
   the answer, ask me for it — don't fill it in.
2. Preserve my voice. Don't make me sound over-polished or corporate.
3. Critique BEFORE rewriting: strongest sentence, weakest sentence, what's generic,
   what's distinctive, what evidence is missing, what to cut.
4. Then give one tightened version.
5. End with a list of every claim I must be ready to defend out loud in an interview.
```

### 2E. The master technical deep-dive prompt

```
[Context Block]
I'm preparing a technical deep dive for a [role] interview at [company].
Project: [paste]
Build with me, and tell me directly if any part sounds weak or inflated:
1. 30-second, 2-minute, and 10-minute versions (escalating depth)
2. The architecture, described as if to a distributed-systems engineer who's never heard
   of EM segmentation
3. My single specific contribution (push me to be concrete, not "we")
4. The hardest technical challenge + the debugging story
5. Metrics and honest impact (researcher time saved, proofreading reduced, reproducibility)
6. Failure modes and what I'd do differently
7. The 12 hardest follow-up questions a skeptical senior engineer would ask
8. For each follow-up, a one-line note on what they're really testing
Do not inflate the project. Treat my honesty-ledger discipline as a feature to surface.
```

### 2F. The master company-research prompt (with anti-hallucination guard)

```
I'm interviewing at [company] for [role]. Using only public materials and reputable
recent sources — and searching the web where you can — help me understand:
1. what the company values in candidates
2. which technical areas matter most for this role
3. cultural signals that appear repeatedly
4. relevant announcements from the last ~3 months
5. smart questions to ask interviewers (not "what's the culture like")
6. which parts of my background map best, and which may raise concerns
7. how to answer "Why [company]?" without sounding generic

Separate HIGH-CONFIDENCE facts (with source) from REASONABLE INFERENCES from
SPECULATION I should avoid stating in an interview. If you're unsure of something,
say so rather than guessing.
```

---

## 3. Anthropic-targeted prompts (aim at the known failure points)

Source-weighted prep assumption: values/culture appears to be a major Anthropic filter in candidate-report sources; production-quality Python, concurrency-flavored problems, and substantive engagement with Anthropic safety work are high-yield preparation areas.

### Values round (treat as a major filter)

```
[Context Block]
You are an Anthropic interviewer running the values round — a round I should treat as a major filter. Probe whether I have genuinely internalized the tension between moving
fast and being responsible, not whether I can recite the right words. Reference the
Responsible Scaling Policy and Constitutional AI and check whether I engage with them
substantively. Apply the EVALUATION RULES. Ask one question at a time and don't let me
escape with surface-level mission enthusiasm. If I sound like I'm performing alignment
rather than reasoning about it, call it out.
```

```
Help me build a STAR story about a time I refused to overclaim a result, drawing on my
honesty-ledger discipline (badges must be literally true, run-backed artifacts only).
Ask me for the raw facts first. Then structure it to show judgment and integrity without
making me sound self-congratulatory. This should double as a values-round answer.
```

### Concurrency fluency (recurs across rounds)

```
Quiz me on Python concurrency the way an Anthropic interviewer would. Cover threads vs.
processes vs. async, the GIL and when it bites, I/O-bound vs CPU-bound, and thread-safety.
Ask one question, wait, then push with a follow-up before moving on. After the set, tell
me honestly where my mental model has gaps.
```

```
Give me a multi-tiered coding problem in Anthropic's style: starts simple, escalates over
4 stages, concurrency-flavored (e.g., a polite concurrent crawler, a thread-safe bounded
cache, a rate limiter). Don't show solutions. Let me attempt each stage; after each, grade
my code for PRODUCTION quality — error handling, edge cases, clarity — not just whether it
passes. Flag anything that looks engineered to pass tests rather than genuinely solve.
```

### "Why Anthropic?" (anti-generic)

```
[Context Block]
Here's my draft answer to "Why Anthropic?": [paste]
Apply the EVALUATION RULES. Specifically flag any sentence that could appear in any
candidate's answer to any AI lab. I want this grounded in my real background — safe AI for
science, careful evaluation, human-in-the-loop QC, reliable systems — not "I admire the
mission." Don't rewrite it; diagnose it.
```

---

## 4. OpenAI-targeted prompts (aim at the known failure points)

Source-weighted prep assumption: third-party OpenAI guides repeatedly emphasize system design, practical coding, and technical deep dive as high-leverage areas. The two failure modes to avoid in practice are over-scaling too early and naming technology without justifying tradeoffs. Prepare a real point of view on where AI is going, but do not present third-party process claims as guaranteed.

### System design (the two failure modes)

```
[Context Block]
You are an OpenAI interviewer running a 60-minute system design round on "[prompt, e.g.
design a model-evaluation platform]". Run it realistically: let me start simple and only
pull me toward scale when I've validated the basics — penalize me if I jump to a massively
distributed architecture too early. Every time I name a technology, ask me why that over
the alternatives. Before we finish, force me to address what happens when a node dies, a
region goes down, and a deploy goes wrong. Apply the EVALUATION RULES at the end.
```

### Deep dive as reverse system design

```
[Context Block]
Run my connectomics/FFN pipeline as an OpenAI "reverse system design" deep dive. I present;
you interrogate. Spend 40 minutes asking pointed questions about why I made each
architectural choice, what I'd do differently, and how it scales. Don't accept polished
summaries — drill until you hit something I can't fully justify, then tell me what it was.
```

### Practical coding (test-driven)

```
Give me an OpenAI-style practical coding task: rebuild a small real system or fix a buggy
class (e.g., time-based key-value store, resumable paginated iterator, retry queue with
dead-letter). I'll write it test-first. Run my code against edge cases YOU choose and didn't
tell me about. Then grade clarity and correctness, lead with the weakest part.
```

### Point of view on AI (recruiter screen)

```
Challenge me to articulate a specific, defensible point of view on where AI for science is
headed, grounded in my connectomics and neuroscience background. After I give it, attack
the weakest assumption. I want a view I actually believe and can defend under pressure — not
a take that sounds smart but collapses on one follow-up.
```

---

## 5. Cross-cutting prompts worth keeping

### Translate research into engineering impact (without inflating)

```
[Context Block]
Here's a piece of my dissertation/research work: [paste]
Identify the parts that are honestly equivalent to ML/research-engineering experience —
data cleaning, pipelines, evaluation, experiment design, debugging, reproducibility,
stakeholder communication. Phrase each honestly for a technical interview. If a parallel
is a stretch, tell me it's a stretch rather than helping me oversell it.
```

### Stress-test any answer to its floor

```
Here's my answer: [paste]
Give me the three hardest possible follow-ups — the ones most likely to expose a gap or
make me backpedal. For each, tell me what a weak response looks like so I can avoid it.
Then I'll draft my responses and you'll pressure-test those.
```

### Honest skeptic on the neuroscience→AI-safety bridge

```
Challenge my claim that connectomics/neuroscience experience is relevant to AI safety and
alignment. Give me the strongest skeptical critique an interviewer could make. Then help me
refine the claim so it's accurate and not overextended — including the places where the
analogy genuinely breaks down and I should NOT push it.
```

### Verify AI didn't drift my voice or add claims

```
Original draft I wrote: [paste]
AI-refined version: [paste]
List every claim, number, or implication in the refined version that is NOT in my original.
For each, tell me whether I can defend it. Flag anything that sounds more like AI than me.
```

---


## 6. Google Connectomics / DeepMind bridge prompts

These adapt the same flagship project for Google-oriented roles, where the strongest story is large-scale biological data infrastructure rather than LLM-safety alignment.

```
[Context Block]
Help me position my connectomics/FFN portfolio project for Google Research Connectomics.
Emphasize large-volume biological image data, segmentation QC, graph algorithms, run-backed reproducibility, Neuroglancer/TensorStore-style workflows, and human-in-the-loop proofreading.
Tell me what to cut if it sounds too Anthropic/OpenAI-specific.
Do not inflate the project; separate run-backed facts from work in progress.
```

```
[Context Block]
Run a Google Research Connectomics technical deep dive. Ask one question at a time about:
- chunked volume storage,
- FFN-style inference,
- stitching and merge/split errors,
- skeleton/RAG evaluation,
- Neuroglancer review,
- reproducibility,
- scaling bottlenecks,
- failure modes.
After each answer, apply the EVALUATION RULES.
```

```
[Context Block]
Help me answer "Why Google Research Connectomics?" without sounding generic.
Use my neuroscience PhD, c-Fos/brain-wide quantification work, connectomics portfolio, and interest in AI-for-science.
Flag any sentence that sounds like it could be said to Anthropic or OpenAI unchanged.
```

```
[Context Block]
Challenge my flagship project as a Google engineer would.
Ask whether the pipeline is reproducible, whether the evaluation metric actually captures proofreading burden, whether it scales, what happens at block boundaries, and what evidence I can show.
Lead with the weakest part.
```

---

## 7. Weekly workflow

| Day | Focus | Prompt to use |
|---|---|---|
| Mon | Refine one resume/project bullet | §2D master application prompt |
| Tue | One coding drill + honest critique | §3 concurrency (Anthropic) / §4 practical (OpenAI) |
| Wed | One system design mock | §4 system design |
| Thu | One company-research pass | §2F master research prompt |
| Fri | One behavioral story, pressure-tested | §2A harness + §5 stress-test |
| Sat | Deep dive on connectomics/FFN | §2E master deep-dive prompt |
| Sun | Defensibility review | §5 verify-voice prompt |

Run the **calibration check (§2B)** once a week on a random question to confirm the model's bar hasn't gone soft on you.


### Prep scorecard

Create one row per mock session or drill. The point is to make progress measurable instead of vibes-based.

| Date | Target | Round type | Prompt used | Score /10 | Weakest issue | One fix | Follow-up that exposed the gap | Evidence created | Next drill |
|---|---|---|---:|---:|---|---|---|---|---|
| YYYY-MM-DD | Anthropic / OpenAI / Google | coding / system design / values / deep dive | § |  |  |  |  | code / notes / story / diagram |  |

Weekly review question: **what claim can I now defend better than last week, and what claim should I stop making until I have evidence?**

---

## 8. The disposition you're building toward

The point of all of this isn't "AI helped me prep." It's that you can show, honestly, that you know how to use AI to refine communication, pressure-test reasoning, and expose your own weaknesses — while keeping full ownership of the work and being able to defend every claim yourself. That disposition *is* the thing Anthropic's values round screens for. Don't hide that you prepped with Claude; the good version of that story is "I drafted it myself, used Claude to find the weak spots, and can defend every line."
