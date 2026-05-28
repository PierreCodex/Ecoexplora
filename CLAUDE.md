# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

This repo is **not** a flat Next.js project. The runnable app lives at:

```
Admin/TS/        ← Next.js 16 app (cwd for all npm/bun/next commands)
FRONTEND_PLAN.md ← canonical scope document — drives all module work
Docs/            ← additional reference docs
```

All commands below must be run from `Admin/TS/`. The root only contains planning material.

## Common commands

From `Admin/TS/`:

| Command | Purpose |
|---|---|
| `npm run dev` / `bun run dev` | Dev server (`next dev --webpack` — webpack, not Turbopack) |
| `npm run build` | Production build (also pinned to webpack) |
| `npm run lint` | ESLint (flat config in `eslint.config.mjs`) |
| `npm run format` | Prettier write across `src/**/*.{ts,tsx,js,jsx}` |
| `npx tsc --noEmit` | Type-check only — no test framework is configured |

Dependency installs may need `--legacy-peer-deps` (the `react-pdf 7.7.3` peer demands an older `@types/react` than the React 19 in this repo). Both `bun` and `npm` work; `bun.lock` is the committed lockfile.

There is **no test suite** in this project. Verification = `tsc --noEmit` + manual browser check on `/dashboard` and `/reservas`.

## Required env vars

`.env.local` in `Admin/TS/`:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_API_URL=https://<fastapi-backend>
```

Missing Supabase vars do not crash — `src/lib/supabase/client.ts` only `console.warn`s. Auth will silently fail until they're set.

## Architecture

### Template provenance and scoping

The codebase is the **UBold admin template** being progressively adapted into the **EcoExplora Tumbes** admin panel (tour-booking domain: reservations, WhatsApp conversations, tour catalog). `FRONTEND_PLAN.md` is authoritative — it lists which template folders to delete (section 0.1) and which to reuse for which domain module (section 0.1 table). Do not add new modules without consulting it.

Template demo pages that remain under `src/app/(admin)/apps/` (calendar, chat, crm/pipeline, crm/activities, file-manager, users) are kept **only as reuse references** — they will be replaced module-by-module by code under domain routes (`/reservas`, `/conversaciones`, `/catalogo/...`, `/disponibilidad`, `/horarios`, `/settings`, `/administradores`). The sidebar (`src/layouts/components/data.ts`) is already domain-only; template demo routes have no menu entry.

### Route groups and auth gating

`src/app/` uses three groups:

- `(admin)/` — all authenticated panel routes. Layout chains: `(admin)/layout.tsx` → `MainLayout` → `VerticalLayout` | `HorizontalLayout` (chosen by `useLayoutContext().orientation`).
- `(others)/` — template demos outside the panel chrome.
- `auth/` — sign-in / reset-password (public).

Auth gate is two-layered and intentional:

1. `AppProvidersWrapper` (mounted by the root `app/layout.tsx`) calls `useAuth()` and, once `sessionReady && !isAuthenticated`, `router.replace('/auth/sign-in')`.
2. `MainLayout` returns `null` while `!sessionReady || !isAuthenticated`, so `(admin)` routes never render their tree pre-auth (prevents flicker + unauthenticated API calls firing from child `useEffect`s).

This means **any `(admin)` page can assume a Supabase session exists** when it mounts — no per-page guards needed.

`next.config.ts` has a stale redirect `/ → /dashboard/ecommerce` left from the template. The real dashboard is `/dashboard`; update the redirect if `/` traffic becomes relevant.

### HTTP layer

All backend calls go through `src/lib/api.ts` — never call `fetch` directly to the FastAPI backend.

- `api.get/post/put/patch/delete` build URLs from `NEXT_PUBLIC_API_URL`, attach `Authorization: Bearer <supabase access_token>` pulled live from `supabase.auth.getSession()`, and serialize JSON or pass `FormData` through unchanged.
- Non-2xx → throws `ApiError` (exported) with `.status` and `.body`. Catch with `instanceof ApiError` to surface `err.message` (extracted from `detail`/`message` fields if the server returned JSON).
- `401` triggers an automatic `window.location.assign('/auth/sign-in')` inside `parseResponse`. UI code can ignore re-auth concerns.
- Query params: pass via the `query` option (`api.get('/admin/reservations', { query: { status: 'confirmed' } })`), not by string-concatenating the path.

### Domain types and shared UI conventions

- `src/types/reservation.ts` is the **single source of truth** for reservation shapes. `RESERVA_STATUS_META` (label + Bootstrap variant + Iconify icon per status) and `RESERVA_STATUS_ORDER` drive badges, the kanban column order, and action dropdowns. Don't duplicate status strings or colors in feature code — import from this file.
- Destructive actions go through `src/lib/confirm.ts` (`confirmAction`, `notifyOk`, `notifyError` — SweetAlert2 wrappers). `requireReason: true` opens a textarea with a "motivo obligatorio" validator; the returned `{ confirmed, reason }` shape is the standard for cancel/reject flows.
- Icons: `<Icon icon="..." />` from `@/components/wrappers/Icon` (Iconify, default set is `tabler`). Pass either bare names (`"send"`) or `set:name` (`"tabler:credit-card"`).
- FullCalendar pages must be loaded via `next/dynamic` with `ssr: false` — see `reservas/calendario/page.tsx`. Importing FullCalendar at module top from a server-rendered page crashes hydration.

### Layout and providers

- `src/context/useLayoutContext.tsx` controls vertical/horizontal orientation, theme, sidebar size, etc. — persisted via `usehooks-ts` storage hooks.
- `src/context/useNotificationContext.tsx` is a toast/notification bus (separate from SweetAlert2; SweetAlert2 is for blocking confirmations, this is for passive toasts).
- TS path alias: `@/*` → `./src/*`.

### Pre-existing template type errors

`tsc --noEmit` currently surfaces two errors that pre-date the EcoExplora adaptation:

- `src/app/(admin)/apps/crm/pipeline/components/usePipelineContext.tsx` (`ValidateForm` generic mismatch)
- `src/components/wrappers/ApexChart.tsx` (`'ApexChart' refers to a value, but is being used as a type`)

These live in template demo code scheduled for deletion. Don't "fix" them by touching the template files — let them be removed when the corresponding domain module replaces them. If your changes introduce new errors, those are yours to fix.