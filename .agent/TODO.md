# TODO

> **Agent: Read "Last Session" FIRST before doing anything else.**

## Current Milestone
Build-Tour Elite Rebuild — upgrading planner to elite product experience

---

## In Progress
<!-- None -->

## Recently Completed
- [x] Build-Tour V3 Elite Rebuild — planner-first page with liquid glass, 100vh-fit sections, premium map
  - [x] Added elite planner CSS system (~200 lines: planner-shell-glass, planner-sidebar-glass, planner-map-container, planner-toolbar-glass, quick-start-card, region-card-glass, place-card-glass, how-step-glass, tour-card-elite, testimonial-glass-dark, custom Leaflet zoom controls, gold-pulse-ring animation)
  - [x] Rebuilt BuildTourHero — compact 38vh, product-led copy, trust pills, dual CTA
  - [x] QuickStartModes — 3 entry mode cards (Map, Style, Route) with glass hover
  - [x] Rebuilt BuildTourShell — 32/68 desktop split, calc(100vh-180px), planner-shell-glass, floating toolbar, fullscreen toggle
  - [x] Rebuilt MapViewport — dark premium theme, tight Sri Lanka framing (70% fill), smooth fitBounds (0.9s), gold district states
  - [x] Rebuilt ConciergePanel — trip snapshot card, glass region/district/place cards, hover popup effects
  - [x] Created HowItWorks strip — 3 glass step cards
  - [x] Upgraded SelectedStopsPanel — premium drag cards, pace indicator, district count, concierge note
  - [x] Upgraded RouteSummaryBar — glass stat cards, tighter layout
  - [x] Upgraded PopularTours — removed broken % metrics, elite glass hover cards (tour-card-elite)
  - [x] Upgraded ThemeCarousel — added duration, bestSeason, regions, mood metadata + "Load Theme" CTA + Honeymoon Edit theme
  - [x] Upgraded Testimonials — dark theme matching planner page, dot indicators, concierge tie-in
  - [x] Reordered page.tsx — Hero → QuickStart → Planner → HowItWorks → PopularTours → Themes → Parallax → Testimonials → CTA
  - [x] Tightened vertical heights significantly on How It Works to be ultra-compact per user preference
  - [x] TypeScript compiles cleanly (tsc --noEmit passes)

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
- [x] [2026-03-20] Reduced Signature Experiences pattern band opacity to 0.05 and applied curated pattern to Featured Journeys
- [x] [2026-03-20] Added `curated-bg-pattern.webp` to Signature Experiences (TourCategoriesCarousel)
- [x] [2026-03-20] User uploaded `curated-bg-pattern.webp` and applied it to `CuratedCollection.tsx`
- [x] [2026-03-20] Tweaked pattern background opacity in CuratedCollection and FeaturedJourneysClient for better visibility
- [x] [2026-03-20] Push all changes to GitHub (UI fixes, Why Yatara animations, pattern background)
- [x] [2026-03-20] Added elite packages pattern background to FeaturedJourneys
- [x] [2026-03-20] Configured repeating scroll animation for WhyYatara stats counters
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

**Date**: 2026-03-21
**Agent**: Antigravity
**What was done**:
- Refined the "How Your Journey Is Crafted" section on the Build-Tour page.
- Dramatically reduced the vertical height (padding, margins, gaps) by a substantial amount to make the layout ultra-compact and fit tighter on the screen.
- Pushed updates to GitHub.

**What to do next**:
- Add theme images: /images/themes/honeymoon-edit.webp (new theme added)
- Visual QA on 13-inch MacBook — verify all sections fit viewport folds
- Test mobile bottom drawer on real device
- Consider adding fullscreen map keyboard shortcut (Escape to exit)
- Real images for tours still needed

**Current state**:
- Branch: main (changes committed and pushed)
- Last commit: UI: Update How Your Journey Is Crafted section height and styling
- Key design decisions: How It Works section intentionally kept very compact vertically (minimal py, mb, mt) due to user preference for space efficiency.
