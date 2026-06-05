# couvert-dashboard

Owner-facing dashboard for Couvert, a restaurant booking platform.

See `CLAUDE.md` for stack, hard rules, glossary, data-quality notes, and scope.

## Run

```bash
npm install
npm run dev          # Next on :3000 + json-server on :4000
npm run build
```

Mock API serves `db.json` from the repo root at `http://localhost:4000`.

## Data entities

Top-level collections in `db.json`:

- **cities** (6) — supported markets (Lisbon, Paris, …) with currency and timezone; reference data joined into restaurants and diners.
- **floorSections** (4) — named areas of a dining room (terrace, main hall, etc.) that tables belong to.
- **plans** (3) — Couvert's subscription tiers (`starter` / `growth` / `pro`) with monthly fee, per-cover fee, and feature lists that restaurants subscribe to.
- **restaurants** (3) — the tenants of the dashboard: identity, location, capacity, plan, contact, and ratings rollups.
- **tables** (42) — physical tables per restaurant, seat count, assigned to a floor section.
- **members** (7) — staff users per restaurant with role, status, invite and last-login timestamps.
- **promotions** (13) — restaurant-issued discount codes with active window, percentage off, and redemption count.
- **diners** (751) — end-customer profiles: city, language, dietary tags, loyalty tier, lifetime visits and spend, budget band.
- **bookings** (1,518) — reservations: restaurant, diner, table, party size, shift, status, channel, occasion, promo applied, deposit, bill total, and lifecycle timestamps (created / seated / left / cancelled).
- **reviews** (554) — diner feedback tied to a booking: per-axis ratings (food / service / ambiance / value), tags, comment, owner reply, reported flag, source.
- **invoices** (21) — Couvert's billing to restaurants per period: subscription fee, billable covers, no-shows excluded, totals, status.
- **marketBenchmarks** (4) — city × cuisine peer averages (ratings, fill rate, median spend) for comparison widgets.
