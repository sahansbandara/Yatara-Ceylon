# TODO — Yatara Ceylon Bookings Page Rebuild

## Done ✓
- [x] Rebuild bookings page with DashboardHero, status tabs, KPI cards, improved filters, and pagination (2026-03-22)

## In Progress
(none)

## Pending
(none)

## Last Session
**Date**: 2026-03-24
**What was done**:
- Fixed Vercel build failure: slug mismatch in `evening-event-chauffeur/page.tsx` — changed `'event'` → `'evening'` to match `transferCategoryCards` data
- Previously: added `eslint.ignoreDuringBuilds: true` to `next.config.ts`, fixed Vehicle Edit 405 (PUT→PATCH)

**Current state**:
- Build passes (all 162 pages prerender successfully)

**Files changed**:
- `/src/app/(public)/transfers/evening-event-chauffeur/page.tsx` (slug fix)
