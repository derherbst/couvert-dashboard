# couvert-dashboard

Take-home: an owner-facing dashboard for a restaurant booking system (Couvert).

## Stack & versions

- **Next.js 16.2.7** (App Router, Turbopack) + **React 19** + **TypeScript 5.5** (strict)
- **Tailwind CSS 3.4** — no UI kit, no component library
- **json-server 0.17** — mock API for `db.json` on `:4000`
- **concurrently 8.2** — runs Next + json-server together
- No state library, no charts library, no test framework
- Node ≥ 20.9 (one transitive dep warns below 20.19)

## How to run

```bash
npm install
npm run dev          # Next on :3000  +  json-server on :4000
npm run dev:next     # just Next
npm run dev:api      # just json-server (--watch db.json)
npm run build        # production build
npm run typecheck    # tsc --noEmit
npm run lint         # next lint
```

Data source: `db.json` at repo root — served by json-server at `http://localhost:4000`.

## Project layout

```
src/
  app/        # routes, layouts, global CSS (Server Components by default)
  components/ # presentational components, take typed props
  lib/        # data fetching, types, pure computation (metrics.ts)
```

`@/*` resolves to `src/*`.

## Hard rules

These are non-negotiable. AI-generated code that violates them gets rewritten.

- **No comments** unless the *why* is non-obvious. Don't restate what the code does. Don't reference tickets or PRs. If a future reader can derive it from the identifier, delete the comment.
- **No premature abstractions.** Three similar lines beat a generic helper. Wait for the third real caller before extracting. No "just in case" props, no parameterised components with one use site.
- **No defensive try/catch.** Don't swallow errors to "be safe." Let them propagate; the Next error boundary catches them. Only catch at a boundary where you have a *specific* recovery (retry once, fall back to a known value) — and the catch must do that recovery, not just `console.error`.
- **Pure functions for computation.** Anything that derives a metric — fill rate, no-show rate, revenue, cohort splits — lives in `src/lib/metrics.ts` as a pure function: input → output, no fetching, no `Date.now()`, no globals. UI components call it; tests (if added) would call it directly.
- **Server Components by default.** Mark client islands with `"use client"` only when you need state, effects, or browser APIs.
- **No CSS outside Tailwind.** No CSS modules, no inline styles beyond one-offs Tailwind can't express.

## Domain glossary

Terms used in the data and the UI. Read these before naming variables.

- **Cover** — one seated guest at one booking. A party of 4 = 4 covers. Couvert bills the restaurant a `coverFee` per cover that actually showed up. `coversBilled` on an invoice is the billable cover count for that period; `noShowsNotCharged` is excluded.
- **No-show** — a confirmed booking where the party never arrived. `booking.status === 'no_show'` (⚠ also appears as `'No_Show'` — see Data-quality notes). No-shows are not billed; they still hurt fill rate.
- **Walk-in** — a guest seated without a prior reservation. `booking.status === 'walked_in'`. Counts as a cover for billing and fill rate, but `channel` will still be whatever the staff logged it as (often `phone` or `restaurant_widget`).
- **Fill rate** — seated covers ÷ seating capacity over a period. Benchmarks store this as `avgFillRate` (0–1). Capacity comes from `restaurant.capacity`, not `sum(tables.seats)` — the two don't always agree.
- **Channel** — where the booking originated. Enum: `couvert_app`, `couvert_web`, `restaurant_widget` (the embeddable widget on the restaurant's own site), `phone`. Used for attribution: bookings via `couvert_*` channels are the value Couvert delivers; `restaurant_widget` and `phone` are the restaurant's own funnel.
- **Service shift** — `lunch` or `dinner`. Used to bucket bookings on the day view and to compute per-shift fill rate.
- **Plan** — the restaurant's Couvert subscription tier (`starter` / `growth` / `pro`). Determines monthly fee, per-cover fee, and feature gates (e.g. `growth` unlocks Promotions; `pro` unlocks Yield management).
- **Promotion** — a discount code the restaurant issues (`discountPct`, active window, redemption count). When applied to a booking, `booking.promoCode` and `discountPct` are denormalised onto the booking.
- **Loyalty tier** — diner segmentation: `new` / `regular` / `vip`. Derived upstream, treat as read-only.
- **Benchmark** — `marketBenchmarks` row keyed by city × cuisine. Use for "your X vs. peers" comparisons; sample size is small (4 rows total), so peer matching is best-effort.

## Data-quality notes

Things to handle, not to "fix" in the data.

- **`booking.status` case inconsistency.** Both `'no_show'` and `'No_Show'` appear. Normalise on read (lowercase) in `src/lib/`; don't pattern-match the raw string in components.
- **Nullable booking fields.** `tableId`, `billTotal`, `seatedAt`, `leftAt`, `cancelledAt`, `depositAmount`, `occasion`, `promotionId`, `promoCode`, `discountPct`, `specialRequest` can all be `null`. Metrics that average `billTotal` must filter out nulls (typically: cancelled and no-show bookings have no bill).
- **Capacity mismatch.** `restaurant.capacity` may not equal `sum(tables.seats)` for the same restaurant. Use `restaurant.capacity` for fill-rate denominators — it's the operating capacity the owner reports.
- **Reviews from multiple sources.** `review.source` is `couvert` or `google`. Owner can reply (`reply`/`repliedAt`) — assume only `couvert` reviews are replyable in this UI even though the schema doesn't enforce it.
- **Tiny benchmark table.** Only 4 rows in `marketBenchmarks`. A restaurant may have no exact city × cuisine match. Fall back to city-only, then show "no peer data" rather than fabricating.
- **Currency.** All sample data is `EUR`. Don't hardcode the symbol — read `restaurant.city.currency` (via the city join) or `invoice.currency`.
- **Time zones.** Timestamps are ISO-8601 UTC; the city has a `timezone`. Bucketing by "day" or "shift" must use the restaurant's local time, not the user's browser time.

## Scope

### In scope

- Single owner viewing **one** restaurant's dashboard. Restaurant selection can be hardcoded or via a simple dropdown — no auth.
- Read-only views of: bookings (today / upcoming), reviews (with reply form, even if posting is mocked), key metrics (covers, fill rate, no-show rate, revenue/spend), plan & invoice summary, benchmark comparison.
- Derived metrics computed client-side from the json-server data via pure functions in `src/lib/metrics.ts`.

### Out of scope

- Multi-tenant auth, RBAC, member invites.
- Writes that mutate `db.json` through json-server PATCH (UI can show optimistic updates, but persistence is not the deliverable).
- Live updates / websockets.
- Internationalisation, accessibility audit beyond sensible defaults, mobile-first responsive polish.
- A real charts library — if a chart is needed, hand-roll a minimal SVG bar/line. Skip if it doesn't add insight.
- Tests. (If something is genuinely tricky to verify by eye — a metric formula — a single `node --test` script in `src/lib/` is acceptable, but not required.)
