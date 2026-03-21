# TODO

> **Agent: Read "Last Session" FIRST before doing anything else.**

## Current Milestone
Build-Tour Elite Rebuild — upgrading planner to elite product experience

---

## In Progress
<!-- None -->

## Recently Completed
- [x] Analyze Walkers Tours Real Stories section and apply exact implementation to RealExperiencesSection.tsx (increased vertical height and background positioning)
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
- [x] Connect WhatsApp link to real number
- [x] Add real SLTDA certification logo
- [ ] Test all transfer detail pages on mobile
- [x] Add structured data (JSON-LD) for SEO on transfer pages
- [x] Add structured data (JSON-LD) for SEO on destination pages
- [x] Add structured data (JSON-LD) for SEO on package detail pages
- [x] Add site-wide Organization + WebSite JSON-LD
- [x] Provide Image Prompts for SLTDA logo, Theme Images (honeymoon-edit), and Transfer Route Images

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
- [x] [2026-03-22] Fixed "Discover The Masterpiece" button link in PremiumStory section. Created a new dedicated `/the-masterpiece` page to explain the Yatara Standard and linked the button to it.
- [x] [2026-03-22] Fixed full screen fit issue in BuildTourTeaser where parallax elements were cut off vertically on shorter screens. Changed `overflow-hidden` to `overflow-x-clip` and adjusted padding.
- [x] [2026-03-22] Refined vertical spacing site-wide to make UI incredibly compact, significantly shortening the space between components (`TransfersTeaser`, `PremiumStory`, `ProofStack`, `TrustedByStrip`, `JourneyDayStory`).
- [x] [2026-03-22] Rebuilt TrustedByStrip as a dark, elegant text-only strip showcasing premium accreditations.
- [x] [2026-03-22] Enabled `scrollLock`/`overflow-hidden` correctly inside `BuildTourShell` on both client and body levels to prevent scrolling issues within the interactive planner map.
- [x] [2026-03-22] Made BuildTourTeaser background lighter (`bg-deep-emerald`) and constrained its height (`min-h-[100dvh] flex items-center`) so it fits perfectly full-screen.
- [x] [2026-03-22] Provided Image Prompts for SLTDA logo, Theme Images (honeymoon-edit), and Transfer Route Images in IMAGE_PROMPTS.md artifact.
- [x] [2026-03-22] Connected real WhatsApp number (+94704239802) consistently across the site (Header, Footer).
- [x] [2026-03-22] Refined FAQ section (PremiumStory) aesthetics with liquid glass components, satisfying click animations, a single elite background, and smoother image parallax per user request.
- [x] [2026-03-22] Rebuilt BuildTourTeaser section with premium framer-motion animations, new layout, and imported bespoke-teaser-main / bespoke-galle-card webp images.
- [x] [2026-03-22] Upgraded TransfersTeaser section on homepage with elite background images, 3 image cards, and massive visual prominence to highlight the main business model.
- [x] [2026-03-22] Made "Global Accreditations" strip (TrustedByStrip) ultra-thin and compact per user request.
- [x] [2026-03-22] Fixed number counting animations: added proper IntersectionObserver to stats grid to prevent premature triggering, updated AnimatedStat regex to handle non-numeric prefixes/suffixes properly, added rewind-when-hidden logic for replayability.
- [x] [2026-03-20] Reduced Signature Experiences pattern band opacity to 0.05 and applied curated pattern to Featured Journeys

---

## Last Session

**Date**: 2026-03-21
**Agent**: Antigravity
**What was done**:
- Analyzed Walkers Tours Real Stories section reference and rebuilt the `RealExperiencesSection.tsx` component to identically match its proportions, layout, and textual hierarchy.
- Adjusted vertical spacing and sizing dynamically (`clamp`, `h-[...vh]`, `min-h`) to perfectly recreate the reference layout with overlapping text layers and parallax scrolling elements.
- Maintained user directives to explain where values can be tweaked manually via inline comments in the code.

**What to do next**:
- Visual QA on 13-inch MacBook — verify all sections fit viewport folds.
- Test mobile bottom drawer on real device for the updated Build Tour planner.
- Real images for tours and transfers still needed (user generating externally).

**Current state**:
- Branch: main (changes committed and pushed)
- Last commit: UI: Rebuild RealExperiencesSection layout to match reference proportions exactly
- Key design decisions: Increased minimum heights (`min-h-[1000px]`) and object positions for background images to create ample breathing room for the large text overlays in the Real Experiences section.
