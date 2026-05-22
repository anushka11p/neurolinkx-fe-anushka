# NeurolinkX Frontend — Shipment Tracking Dashboard

A production-quality shipment tracking dashboard built for the NeurolinkX Frontend Developer Assignment.

## Quick Start

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

**Demo credentials:**

- Email: `demo@neurolinkx.com`
- Password: `password123`

## Storybook

```bash
pnpm storybook
```

Open [http://localhost:6006](http://localhost:6006) to view the component library.

## Run Tests

```bash
pnpm test
```

## Tech Stack

| Category   | Technology                                  |
| ---------- | ------------------------------------------- |
| Framework  | Next.js 15 App Router + React 19            |
| Language   | TypeScript 5 (strict mode)                  |
| Styling    | Tailwind CSS 4 + CSS custom property tokens |
| State      | TanStack Query v5 + Zustand                 |
| Forms      | React Hook Form + Zod                       |
| Mock API   | MSW (Mock Service Worker)                   |
| Auth       | NextAuth.js v5                              |
| Testing    | Vitest + React Testing Library + jest-axe   |
| CI/CD      | GitHub Actions                              |
| Components | Storybook 10                                |

## Project Structure

```
app/
  (auth)/           # Login, Signup, Forgot Password pages
  (dashboard)/      # Dashboard, Shipments, Settings pages
  components/ui/    # Reusable component library
  api/              # Next.js API routes
lib/
  api/              # Axios instance + interceptors
  hooks/            # Custom React hooks
  msw/              # Mock Service Worker handlers
  store/            # Zustand UI store
  auth.ts           # NextAuth configuration
  providers.tsx     # React Query + MSW provider
docs/
  architecture.md   # System design document
  lighthouse-report.html
  bundle-analyzer.png
```

## Components Built

- **Button** — 4 variants, 3 sizes, loading state, full accessibility
- **DataTable** — TanStack Table, sortable, paginated, row selection, skeleton loading
- **Modal** — Focus trap, ESC to close, animated, portal rendered
- **Toast** — 4 variants, auto-dismiss, stackable, aria-live
- **FormFields** — Input, Textarea, Select, Checkbox, Radio, Switch with Zod validation
- **CommandPalette** — Cmd+K trigger, fuzzy search, keyboard navigation

## Key Technical Decisions

**MSW over JSON Server** — MSW intercepts requests at the network level so mock and real API behave identically. Zero code changes needed when switching to production.

**Tailwind + CSS tokens** — All design values are CSS custom properties. Zero hardcoded colours anywhere in the codebase. Dark mode works by swapping token values.

**URL as source of truth** — Shipment filters, sort, and pagination are stored in the URL via nuqs. Shareable links, browser back button, and refresh all work correctly.

**TanStack Query for all server state** — Zustand only manages UI state (sidebar, theme, drawers). All API data lives in TanStack Query with proper cache keys and stale times.

## Known Limitations

- Map embed on shipment detail page uses a placeholder (Mapbox token not configured)
- Auth is mock only — no real database backend
- CSV export is UI only — downloads a placeholder file

## What I'd Improve With More Time

- Add real database with Prisma + PostgreSQL
- Add Mapbox GL for real shipment route visualization
- Add E2E Playwright tests for full user flows
- Add Chromatic for visual regression testing on every PR
- Add Sentry for error tracking in production

## Architecture

See [docs/architecture.md](./docs/architecture.md) for the full system design document covering rendering strategy, component architecture, state management, performance at 2M MAU, security, and trade-off analysis.
