# TODO

> **Agent: Read "Last Session" FIRST before doing anything else.**

## Current Milestone
All changes pushed to GitHub — ready for next feature sprint

---

## In Progress
<!-- None -->

---

## Priority Tasks
- [ ] Add real images to all transfer routes (user generating externally)
- [ ] Connect WhatsApp link to real number
- [ ] Add real SLTDA certification logo
- [ ] Test all transfer detail pages on mobile
- [x] Add structured data (JSON-LD) for SEO on transfer pages
- [x] Add structured data (JSON-LD) for SEO on destination pages
- [x] Add structured data (JSON-LD) for SEO on package detail pages
- [x] Add site-wide Organization + WebSite JSON-LD

---

## Blocked
<!-- None -->

---

## Nice to Have
- [ ] Animated booking strip interactions
- [ ] Route map visualization per transfer
- [ ] WhatsApp bot integration for instant booking
- [ ] Dynamic pricing calculator
- [ ] Admin CRUD for transfer products (migrate static → MongoDB)
- [ ] Interactive SVG map for destinations (replace region buttons with clickable map)

---

## Done
- [x] [2026-03-19] Destinations page — premium rebuild (hero, filters, cards, spotlight, CTA)
- [x] [2026-03-19] FeaturedDestinationSpotlight component — editorial split card with region badge
- [x] [2026-03-19] DestinationCard component — premium hover effects, gradient overlays, stagger animations
- [x] [2026-03-19] Destination images — switched from broken .jpg/.svg stubs to 25 user-generated .webp photos
- [x] [2026-03-19] Update agent files (CLAUDE.md, TODO.md, MEMORY.md, BRIEF.md)
- [x] [2026-03-19] Rebuild transfers data model — 22 products, new interfaces
- [x] [2026-03-19] Build BookingStrip client component
- [x] [2026-03-19] Redesign TransferCategoryTile — full-image premium cards
- [x] [2026-03-19] Redesign SignatureRouteCard — type badge, price, tier
- [x] [2026-03-19] Upgrade FleetTierCard — real image support
- [x] [2026-03-19] Rebuild transfer landing page — 9 sections
- [x] [2026-03-19] Build transfer detail page — 7 sections
- [x] [2026-03-19] Clean up old routing structure
- [x] [2026-03-19] Filter transfer products out of packages page
- [x] [2026-03-19] Fix payment/return duplicate route conflict
- [x] [2026-03-19] Verify transfer build — all 22 pages SSG'd
- [x] [2026-03-19] Move HTML diagrams (ER, Use Case, Architecture, Activity) → docs/diagrams/
- [x] [2026-03-19] Update README.md — link to HTML diagrams, add Activity Diagram section
- [x] [2026-03-19] Push all changes to GitHub (107 files, commit f283b32)

---

## Last Session

**Date**: 2026-03-19 (evening)
**Agent**: Antigravity
**What was done**:
- Created `src/lib/jsonLd.tsx` — centralized JSON-LD utility with `JsonLd` component + 7 builder functions
- Added Organization + WebSite JSON-LD to `(public)/layout.tsx` (site-wide)
- Added TravelAgency + FAQPage + BreadcrumbList to `transfers/page.tsx`
- Added Product/Offer + BreadcrumbList to `transfers/[slug]/page.tsx`
- Added TouristDestination + BreadcrumbList to `destinations/[slug]/page.tsx`
- Added TouristTrip/Product + AggregateOffer + BreadcrumbList to `packages/[slug]/page.tsx`
- Build verified — no errors, all SSG pages generated

**What to do next**:
- Add real images to transfer routes
- Connect WhatsApp link to real number
- Add SLTDA certification logo
- Mobile test transfer detail pages

**Current state**:
- Branch: main (changes not yet pushed)
- Dev server: running (npm run dev, port 3000)
- Build status: clean build, no errors
- Any errors: none known
- Files changed: src/lib/jsonLd.tsx (new), layout.tsx, transfers/page.tsx, transfers/[slug]/page.tsx, destinations/[slug]/page.tsx, packages/[slug]/page.tsx
