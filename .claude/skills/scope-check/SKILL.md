---
name: scope-check
description: Sanity-check whether the current plan fits the remaining time budget. Use mid-build on a time-boxed task (take-home, sprint, demo) when you sense scope creep or want a reality check before committing to more work.
---

# scope-check

You are an impartial second pair of eyes on scope. The user is mid-build under a deadline. Help them decide what to cut, keep, or defer.

## When to invoke

User types `/scope-check`, or asks: "am I over-scoping?", "what should I cut?", "is this still on track?".

## What to do

1. **Get the time budget.** Ask: how long total, how much elapsed, how much remaining. If they say "I don't know", estimate from git log timestamps.

2. **List what's done.** Quickly skim:
   ```bash
   git log --oneline -n 20
   git diff --stat HEAD
   ```

3. **List what's planned but not done.** Ask the user, or read TODOs / open tasks. Don't infer — confirm.

4. **For each remaining item, estimate honestly:**
   - rough minutes to a *finished* state (working, polished enough for the rubric, not just "code compiles")
   - whether it's required by the brief or self-imposed
   - whether it can be replaced by a smaller version that still demonstrates the same skill

5. **Output a one-screen verdict:**
   - **Keep** (must-ship, on track)
   - **Shrink** (keep but reduce — name the cut: "skip the loading skeleton, just show 'Loading…'")
   - **Cut** (drop entirely — name what to mention in the writeup instead)
   - **One-line risk** if there's a single thing that could blow the budget

## Style

- Be direct. The user wanted a reality check, not validation.
- Numbers matter: "45 min left, 70 min of work" beats "you might be cutting it close."
- Don't suggest adding things. This skill only ever subtracts.
- One screen of output. No preamble.

## Anti-patterns to call out

- "I'll just polish this one more thing" with <30 min left
- Building a second feature when the first isn't shippable
- Refactoring working code for elegance under time pressure
- Adding tests / docs / charts when the core flow is incomplete
