# Writeup

> Status: foundation only — features not yet built. This will be expanded as the dashboard takes shape.

### 1. Scope decision

I started by scaffolding the project myself rather than running `create-next-app`, because the brief specified a narrow stack (App Router + TS + Tailwind, nothing else) and the generator pulls in extras I'd then have to strip. No UI library, no state library, no charts library, no test framework — keeping the surface area minimal so what I build is unambiguously mine. Feature scope (which booking views, which interactions) is still TBD against the brief.

### 2. Architecture

Three top-level folders under `src/`: `app/` for routes and layouts, `components/` for presentational pieces, `lib/` for data fetching, types, and pure helpers. Path alias `@/*` → `src/*`. Server Components by default; client islands marked explicitly. Tailwind for all styling — no CSS modules, no styled-components. No abstractions yet beyond what the framework provides; I'd rather grow them when a second use case appears than design upfront.

### 3. How I used AI

- Asked Claude to scaffold the Next.js project to my spec (App Router, TS, Tailwind, three src/ folders, no extras). Reviewed the generated `package.json` and `tsconfig.json` line-by-line before installing.
- When I asked Claude to bump Next to v16, it flagged the React 19 peer-dep change and the Node engine warning unprompted — useful, kept me from a half-finished upgrade.
- Wrote `CLAUDE.md` collaboratively: I dictated the conventions, Claude formatted.
- This writeup was drafted via the `writeup` skill in `.claude/skills/writeup/`; I'll rewrite section 3 by hand as the real feature work happens.

### 4. What I'd do with more time

- Build the actual dashboard views — currently just a placeholder home page.
- Pin a Node version via `.nvmrc` (one transitive dep already warns on 20.9).
- Wire `npm run lint` and `npm run typecheck` into a pre-commit hook so the strict TS config has teeth.
- Decide on a data-fetching pattern (server-component `fetch` vs. a thin `lib/api.ts` client) before the first feature, so it doesn't get decided by accident.
