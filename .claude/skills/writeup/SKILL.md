---
name: writeup
description: Generate WRITEUP.md from git history + the current conversation. Use at the end of a take-home build to produce the recruiter-facing approach/AI-usage doc.
---

# writeup

You are generating `WRITEUP.md` at the repo root — the deliverable the recruiter reads alongside the code.

## When to invoke

The user types `/writeup` near the end of a take-home build, or asks for "the writeup", "the approach doc", or similar.

## What the doc must contain

Four short sections, in this order. Be specific; no fluff.

### 1. Scope decision
- What feature(s) were built and what was deliberately left out.
- The product reasoning. Reference the brief's wording where it shaped the call.
- 4–8 lines max.

### 2. Architecture
- Layering: where data fetching lives, where computation lives, where presentation lives.
- The one or two non-obvious choices and why.
- Call out scope reductions the brief invited (e.g. "single restaurant — hardcoded, not auth").
- 6–12 lines.

### 3. How I used AI
A bulleted list. For each bullet, name the *task* and the *human judgment* applied. Examples of the right altitude:
- "Asked Claude to scaffold types from `db.json`; manually narrowed the `BookingStatus` union after spotting `No_Show` vs `no_show` in the data."
- "Hand-wrote the optimistic update for `patchBookingStatus` — generated version swallowed rollback errors."
- "Used the `writeup` skill (this doc) to draft the writeup from git log; edited section 3 by hand."

Avoid: vague claims ("Claude helped a lot"), pretending no AI was used, pretending all AI output was kept verbatim.

### 4. What I'd do with more time
- 3–5 concrete items. No "would add tests" filler — name *which* tests and *why*.

## How to gather the material

Before writing, gather:

```bash
git log --oneline --reverse main..HEAD     # or: git log --oneline -n 30
git diff --stat main..HEAD                  # or: HEAD~N..HEAD
```

Read `CLAUDE.md` to mirror its vocabulary and stated scope.

Skim the recent conversation for: scope debates, rejected approaches, data-quality discoveries, manual rewrites of AI output. These become section-3 bullets.

## Style

- First person singular ("I chose…", "I left out…").
- Past tense for what was done; present tense for what the code is.
- No headings beyond the four section titles. No emojis. No marketing voice.
- Total length: ~250–400 words. The recruiter is skimming.

## Output

Write to `WRITEUP.md` at the repo root. Overwrite if it exists, after showing the user a diff if substantial.
