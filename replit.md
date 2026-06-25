# BetWin Sports Betting Platform

A sports betting dashboard that displays live match odds, sports events, and a bet slip — pulling real-time data from Betmaster and SofaScore.

## Run & Operate

- `pnpm --filter @workspace/betwin run dev` — run the frontend (port 5000)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 3000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string (auto-provisioned by Replit)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: Vue 3, Vite, Tailwind CSS
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild

## Where things live

- `artifacts/betwin/` — Vue.js frontend (main app)
- `artifacts/api-server/` — Express backend
- `artifacts/mockup-sandbox/` — React UI prototyping environment
- `lib/db/` — Drizzle schema and DB client
- `lib/api-spec/` — OpenAPI YAML definitions
- `lib/api-zod/` — Generated Zod schemas
- `lib/api-client-react/` — Generated TanStack Query hooks

## Architecture decisions

- Vite dev server proxies `/betmaster-api` and `/sofascore-api` to external services, keeping API calls server-side and avoiding CORS issues in the browser.
- DB schema is in `lib/db/src/schema/index.ts` — currently empty, ready to add models.
- AI match analysis uses Pollinations AI (public endpoint, no API key required).

## Product

Sports betting interface showing live odds across Soccer, Basketball, Tennis, and more. Users can browse matches by league, view odds, and build a bet slip. Includes a match detail view with AI chat for match analysis.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- The Vite dev server must run with `PORT` and `BASE_PATH` env vars set (handled by the workflow).
- `DATABASE_URL` is auto-provisioned by Replit — do not hardcode it.
- Run `pnpm install` from the workspace root before running any package scripts.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
