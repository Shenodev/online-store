# Shenostore — OpenCode workspace

Monorepo root. See `agentroles.md`, `rules.md`, `technical_requirements_document.md`,
`product_requirements_document.md`, `app-flow.md`, `backemd-schema.md`, `ui-ux-brief.md`.

## Packages

- `frontend/` — Next.js 14 App Router + TypeScript + Tailwind. Subdomain-aware
  (`frontend/middleware.ts`): `admin.*` → `/admin/*`, `store.*` → `/store/*`.
  API base: `NEXT_PUBLIC_API_URL` (`https://api.store.shenodev.tech`).
- `backend/` — Spring Boot 3.2 / Java 17 (Web, Validation, JPA, Security, Mail,
  MySQL). All tenant tables carry `store_id` (`TenantEntity`); admin `store_id`
  comes from JWT claims only. Prefix: `/api/v1/`.

## Routing (Vercel)

Root `vercel.json` outlines subdomain routing:

- `store.shenodev.tech` → Next.js storefront (`/`, `/store/[storeId]`)
- `admin.store.shenodev.tech` → Next.js admin (`/admin/*`)
- `api.store.shenodev.tech` → Spring Boot backend (`/api/v1/*`)

Edge middleware + `vercel.json` rewrites enforce this split.

## Roles

- `@LeadArchitect` — monorepo structure, `vercel.json` subdomain mapping.
- `@BackendDev` — REST APIs, Aiven MySQL pooling, JWT multi-tenancy, invites.
- `@FrontendDev` — Tailwind UIs per `rules.md`, App Router, Zustand cart
  namespaced `cart_store_<storeId>`.
- `@SecurityAuditor` — tenant-leakage review, auth scopes, middleware guards.

## Commands

- `npm run dev:frontend` / `npm run build:frontend` (root, via workspaces)
- Backend: `mvn spring-boot:run` in `backend/` (requires JDK 17 + Maven)
