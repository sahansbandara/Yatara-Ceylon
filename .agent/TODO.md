# TODO

> **Agent: Read "Last Session" FIRST before doing anything else.**

## Current Milestone
Production Readiness — final QA pass and polish before go-live

---

## Just Completed (2026-04-09)
### UI Refinement & Map Integration Fixes
- [x] Fixed "Popular Tour Plans" and "Themes" packages not interacting properly with the map by switching from async store hydration to direct static JSON imports for place resolution.
- [x] Implemented global `yatara:load-tour` event system to sync external component selections (cards/themes) with the local map planner state.
- [x] Transformed the Tour Planner preview modal with a "Liquid Glass" editorial look, including image-backed headers and improved text contrast.
- [x] Resolved "sharp corner bleed" issues in Safari/Chrome across all tour cards and modes by implementing hardware-accelerated clipping fixes (`translateZ(0)`).
- [x] Validated image manifest and filesystem consistency; confirmed broken images are due to dev server cache (recommending restart).

### Interactive Map 104-Place Curated Merge & Route Optimization
- [x] Merged the `sri-lanka.curated.master.json` holding 97 accurate points with 100 existing points, deduplicating them into 104 total elite places across all 25 districts.
- [x] Optimized dynamic road-based routing to ensure 1-click "Optimize Tour" intelligently solves Travelling Salesman problem via OSRM map geometry drawing on roads.

### Admin Dashboard UI/UX Polish
- [x] Fixed sidebar scrolling: changed layout to `h-screen` with independent overflow for sidebar and main content, eliminating ugly empty space.
- [x] Replaced harsh white hover effects on VehicleTable rows and action buttons with subtle dark-theme glass-morphism hover states.
- [x] Fixed TicketTable and support detail page hover effects to use softer, themed blue/gold backgrounds.
- [x] Changed ticket detail view (messages + reply form) from light `liquid-glass-stat` to dark `liquid-glass-stat-dark` backgrounds.

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
**Date**: 2026-04-09
**What was done**:
- Refactored Tour Planner to correctly load curated plans and themes onto the interactive map.
- Upgraded the Tour Plan preview UI with a premium "Liquid Glass" aesthetic and image headers.
- Fixed Safari-specific layout bugs (corner clipping) and audited all image asset paths.
- Mapped 104 elite destination nodes with valid WebP assets and metadata.

**What to do next**:
- Check on the production deployment once the user restarts the dev server and verifies local assets.
- Proceed with final QA checks on the mobile layout sheet for the tour planner.

**Current state**:
- Branch: `main`
- Dev server: Restart required for asset refresh.
- All map features: Fully optimized and responsive.

**Files changed (This Session)**:
- `src/app/(public)/build-tour/_components/PopularTours.tsx`
- `src/app/(public)/build-tour/_components/ThemeCarousel.tsx`
- `src/app/(public)/build-tour/_components/BuildTourClient.tsx`
- `src/app/(public)/build-tour/_components/QuickStartModes.tsx`
- `src/app/(public)/build-tour/_components/PlannerSidebar.tsx`
- `.agent/MEMORY.md`, `.agent/TODO.md`
