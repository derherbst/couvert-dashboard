# Writeup

### 1. Scope decision

I built an owner-facing dashboard for one restaurant on Couvert: a restaurant header (identity + rating + capacity), a 3-card KPI strip with a 30/90-day toggle (covers seated, new guests acquired, revenue from Couvert — each with a vs-previous-period delta), a "where bookings come from" channel mix, a "vs market" peer-benchmark table, the latest invoice, and an upcoming-bookings table with inline status mutations (Mark seated / No-show / Cancel). Deliberately out: auth, multi-tenant, reviews UI, promotion analytics, hour-level heatmaps, charts library, i18n, test suite. The brief invites scope reduction and the data shape (a `restaurants[]` of 3, no users table) makes single-restaurant the obviously correct call. I cut the original 4-KPI strip down to 3 once it was clear the 4th was either invoice-cadence (already in the invoice block) or vanity.

### 2. Architecture

Three folders under `src/`: `app/` for routes, `components/` for presentational pieces (all controlled by props), `lib/` for the data layer (`api.ts`), domain types + unions (`types.ts`), formatting (`format.ts`), and **pure** computation (`metrics.ts`). The hard rule: anything that derives a number — covers, fill rate, deltas, channel shares, peer rows, invoice picking, upcoming filtering — lives in `metrics.ts` as a pure function (input → output, `now: number` passed in, no `Date.now()` inside). `src/app/page.tsx` is the only client component: one `useEffect` loads `restaurant` then parallels city/bookings/invoices/benchmarks, `useState` holds the live bookings + period + error, `useMemo` derives the entire view from `(data, bookings, periodDays)`. Optimistic patching of a booking row is owned by the page (`patchBookingInState`), passed into `UpcomingBookings` as `onPatched`; the row reverts in place on a failed PATCH. Data normalisation happens at the API boundary (`getBookings` lowercases the status to handle the `no_show` / `No_Show` casing inconsistency and filters out rows with unparseable `reservedFor`). Tailwind only, no UI kit, no state library, no charts library.

### 3. How I used AI

- Scaffolded Next 16 + TS + Tailwind to a tight spec (no UI kit, no state lib, no charts, no tests). Hand-reviewed `package.json` and `tsconfig.json` before installing — `create-next-app` would have pulled extras I'd then strip.
- Had Claude probe `db.json` upfront to enumerate top-level entities and union values. That's how I found the `'no_show'` vs `'No_Show'` casing, the `restaurant.capacity` ≠ `sum(tables.seats)` mismatch, and the ~1% bad-data rows in bookings — all now in `CLAUDE.md`'s data-quality notes so the assumption set is shared with future prompts.
- Drafted the components with inline mocks first to lock the visual, then refactored each to be controlled by props once the page became the orchestrator. The two-pass approach was cheaper than designing the prop shapes up front — I knew what data the cards needed only after seeing them rendered.
- Two NaN bugs in the KPI cards exposed dirty data the types lied about: `reservedFor` had values like `'31/12/2025'`, `'not-a-date'`, `null`, `'2026-13-01…'`, and 14 bookings had `partySize: undefined`. Claude debugged by running ad-hoc node scripts against `db.json`; I picked the fix scope (drop rows with unparseable `reservedFor` at the API boundary; coalesce `partySize` to 0 inside the covers sum so channel/new-guest counts stay accurate). The split matters and Claude didn't propose it on its own.
- Asked Claude to audit `api.ts` against actual UI consumers; removed `getCity`/`getInvoices` when the originally-planned card was cut, then re-added them when the page-level orchestration brought invoices and city-currency back into scope. "What's redundant" was a useful AI question that surfaced a real cleanup.
- This writeup was generated via the `writeup` skill in `.claude/skills/writeup/`, wired to `/writeup` via a slash command at `.claude/commands/writeup.md`.

### 4. What I'd do with more time

- A `node --test` over `src/lib/metrics.ts` — covers, no-show rate, fill rate, channel mix. Visual review caught the NaN bugs late; a tiny test suite would have caught them before render.
- Make the period selector cap its window to actual data extent (UI currently quietly computes deltas against 60–90 day windows that partially predate the data; for a real demo I'd clamp or surface a "limited history" hint).
- Replace `Date.now()` in `useMemo` with a `useRef` set on mount so toggling period doesn't subtly shift the window on every render. Edge case but real.
- Pin Node via `.nvmrc` to silence the `eslint-visitor-keys` engine warning on 20.9.
- Restaurant switcher (1 select on the header). The data has 3 restaurants and the rest of the app is already restaurant-id-driven — would cost an hour.
