# TODO

> **Agent: Read "Last Session" FIRST before doing anything else.**

## Current Milestone
Production Readiness — final QA pass and polish before go-live

---

## Just Completed (2026-04-04)

### Admin Dashboard UI/UX Polish
- [x] Fixed sidebar scrolling: changed layout to `h-screen` with independent overflow for sidebar and main content, eliminating ugly empty space.
- [x] Replaced harsh white hover effects on VehicleTable rows and action buttons with subtle dark-theme glass-morphism hover states.
- [x] Fixed TicketTable and support detail page hover effects to use softer, themed blue/gold backgrounds.
- [x] Changed ticket detail view (messages + reply form) from light `liquid-glass-stat` to dark `liquid-glass-stat-dark` backgrounds.
- [x] Fixed TicketReplyForm: corrected API endpoint from `POST /api/tickets/[id]/reply` to `PATCH /api/tickets/[id]` matching the actual backend.
- [x] Added `--turbopack` flag to dev script for faster local development.

### Package Form Validation
- [x] Blocked non-numeric characters (`e`, `E`, `+`, `-`) from duration and price inputs via `onKeyDown` handlers.
- [x] Changed default price values from `0` to empty string so fields start blank, preventing prices from starting with `0`.

### Admin Destinations Redesign
- [x] Completely replaced the admin Destinations data table with a responsive card grid matching the public page's luxury aesthetic.
- [x] Each card features: full background image, gradient overlay, glassmorphism info panel, status badge, selection checkbox, and hover-reveal admin actions (Publish/Edit/Archive).
- [x] Added "Select All" checkbox in the search toolbar for bulk operations.

### Destination Data Sync
- [x] Created `src/scripts/seed-destinations.ts` to upsert all 25 static destinations from `src/data/destinations.ts` into MongoDB.
- [x] Ran seed locally: 17 new destinations created, 8 updated — admin dashboard now matches public page destination count.

## All Core Features — VERIFIED COMPLETE (2026-04-01)

### Security & Auth
- [x] JWT cookie auth + role-based middleware
- [x] CSRF protection on all mutating requests
- [x] Password reset flow
- [x] Email verification on registration
- [x] Login lockout
- [x] Cloudflare Turnstile captcha
- [x] Rate limiting
- [x] Customer booking ownership enforcement

### Dashboard System
- [x] All 5 roles have complete dashboard navigation and data isolation
- [x] Empty states on all dashboard list pages
- [x] Partner service edit/delete with ownership checks
- [x] Inactive partner/service assignment blocking 

### Vehicle Fleet & Finance
- [x] Vehicle block overlap detection
- [x] Booking conflict check on manual blocks
- [x] Owner-restricted fleet and calendar views
- [x] Invoice CRUD with auto-calculated totals
- [x] Payment void with booking balance recalculation

## Remaining Work (Manual / Non-Automatable)

- [ ] Run the destination seed script against the **production MongoDB** to sync all 25 destinations on the hosted site
- [ ] Execute the documented manual QA matrix end-to-end (`docs/qa/manual-test-matrix.md`) — all 30 test cases are "Not run"
- [ ] Broader mobile dashboard QA on real devices (tables, forms, Build Tour map on mobile Safari/Chrome)
- [ ] Cross-browser smoke test of the public site (Safari, Firefox, Chrome)

---

## Last Session

**Date**: 2026-04-04
**What was done**:
- Fixed 4 admin dashboard UI bugs: sidebar scroll gap, white hover effects on tables, ugly hover on ticket view icon, and numeric input validation on package form.
- Replaced the entire admin Destinations table with a luxury card grid matching the public destinations page aesthetic.
- Fixed broken ticket reply form by correcting the API endpoint and HTTP method.
- Enabled Turbopack for faster local development.
- Created and ran a destination seed script to sync all 25 static destinations into MongoDB.

**What to do next**:
- Run `MONGODB_URI="<production-uri>" npx tsx src/scripts/seed-destinations.ts` against production DB to sync destinations on the hosted site.
- Continue monitoring Vercel deployment for build errors.

**Current state**:
- Branch: `main`
- Dev server: Verified OK
- All changes pushed to GitHub for Vercel auto-deploy

**Files changed (This Session)**:
- `package.json` — added `--turbopack` to dev script
- `src/app/dashboard/layout.tsx` — fixed `h-screen` for independent scrolling
- `src/app/dashboard/support/[id]/page.tsx` — dark theme for ticket detail view
- `src/components/dashboard/DestinationTable.tsx` — replaced table with card grid
- `src/components/dashboard/PackageForm.tsx` — numeric validation + empty defaults
- `src/components/dashboard/TicketReplyForm.tsx` — fixed API endpoint + dark theme
- `src/components/dashboard/TicketTable.tsx` — fixed hover effects
- `src/components/dashboard/VehicleTable.tsx` — fixed hover effects
- `src/components/layout/DashboardSidebar.tsx` — fixed `h-screen` scrolling
- `src/scripts/seed-destinations.ts` — new destination seeder script

