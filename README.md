# couvert-dashboard

Owner-facing dashboard for Couvert, a restaurant booking platform. One restaurant per session, read-only with inline status mutations on upcoming bookings.

Built with **Next.js 16 (App Router)**, **React 19**, **TypeScript** (strict), **Tailwind**. Mock API via **json-server** over `db.json`.

## Run

```bash
npm install
npm run dev      # Next on :3000  +  json-server on :4000
```

| script | what |
|---|---|
| `dev`        | both processes in parallel |
| `dev:next`   | Next only |
| `dev:api`    | json-server only (`--watch db.json`) |
| `build`      | production build |
| `typecheck`  | `tsc --noEmit` |
| `lint`       | `next lint` |

## Structure

```
src/
  app/         # routes; page.tsx is the only client component (the orchestrator)
  components/  # presentational, all controlled by props
  lib/
    api.ts        # fetch wrappers for json-server
    metrics.ts    # pure derivations (covers, channel mix, peer rows, …)
    format.ts     # Intl-based formatters
    types.ts      # domain types + unions
    constants.ts  # API base, current restaurant id
db.json        # mock data, served at :4000
```

## What's on the page

Restaurant header · 30/90-day KPI strip (covers seated, new guests, revenue) · channel mix · vs-market peer comparison · latest invoice · upcoming bookings with inline status mutations (Mark seated / No-show / Cancel) that PATCH json-server with an optimistic UI.

## See also

- [`CLAUDE.md`](./CLAUDE.md) — hard rules, domain glossary, data-quality notes, scope.
- [`WRITEUP.md`](./WRITEUP.md) — approach, architecture, AI usage.
