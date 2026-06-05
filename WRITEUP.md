# Writeup

> Status: foundation only — features not yet built. This will be expanded as the dashboard takes shape.

### 1. Scope decision

I'm building an owner-facing dashboard for one restaurant on Couvert: read-only views of today's bookings, reviews with a (mocked) reply box, headline metrics (covers, fill rate, no-show rate, revenue), and a plan/invoice summary with a peer benchmark. Deliberately out: auth, multi-tenant, real writes back to `db.json`, websockets, i18n, a charts library, and a test suite. The brief invites scope reduction and the data shape (single `restaurants[]` array of 3, no users table) makes single-restaurant the obviously correct call.

### 2. Architecture

Three folders under `src/`: `app/` for routes (Server Components by default), `components/` for presentational pieces, `lib/` for fetching, types, and **pure** computation. The non-obvious choice: all metric formulas — fill rate, no-show rate, cover counts, revenue — live in `src/lib/metrics.ts` as pure functions (input → output, no fetch, no `Date.now()`). Components stay dumb; metrics stay testable by inspection. Data comes from json-server on `:4000` (mock REST over `db.json`), launched alongside Next via `concurrently`. No state library — Server Components handle data, client islands are small and local.

### 3. How I used AI

- Asked Claude to scaffold Next 16 + TS + Tailwind to a tight spec (no UI kit, no state lib, no charts, no tests). Hand-reviewed `package.json` and `tsconfig.json` before installing — `create-next-app` would have pulled extras I'd then strip.
- Upgrade from Next 14 → 16: Claude flagged the React 19 peer-dep bump and the Node engine warning unprompted, which kept me from a half-finished bump.
- Had Claude enumerate `db.json` top-level entities and probe enums. That's how I found the `'no_show'` vs `'No_Show'` casing inconsistency and the `restaurant.capacity` ≠ `sum(tables.seats)` mismatch — both now in `CLAUDE.md`'s data-quality notes so I (and the AI) won't redo that analysis on every feature.
- Drafted `CLAUDE.md` collaboratively: I dictated the hard rules (no comments, no premature abstractions, no defensive try/catch, pure metrics), Claude proposed the glossary entries from the data and I trimmed.
- This writeup was generated via the `writeup` skill in `.claude/skills/writeup/`, wired to `/writeup` via a slash command. Section 3 will get rewritten by hand as real feature work happens.

### 4. What I'd do with more time

- Build the actual feature surface — currently just a placeholder home page renders.
- Pin Node via `.nvmrc` to silence the `eslint-visitor-keys` engine warning on 20.9.
- A single `node --test` over `src/lib/metrics.ts` once formulas exist — covers, no-show rate, fill rate. The rest of the UI is visual; metrics aren't.
- Decide the data-fetching shape (server-component `fetch` vs. a thin `lib/api.ts`) before the first list view, so it doesn't get decided by accident in the first component that needs data.
