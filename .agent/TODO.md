# TODO

> **Agent: Read "Last Session" FIRST before doing anything else.**

## Current Milestone
Destinations page premium rebuild — IN PROGRESS (browser verification remaining)

---

## In Progress
- [/] Destinations page — verify in browser (responsive, visual quality, performance)

---

## Priority Tasks
- [ ] Add real images to all transfer routes (user generating externally)
- [ ] Connect WhatsApp link to real number
- [ ] Add real SLTDA certification logo
- [ ] Test all transfer detail pages on mobile
- [ ] Add structured data (JSON-LD) for SEO on transfer pages
- [ ] Add structured data (JSON-LD) for SEO on destination pages

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

---

## Last Session

**Date**: 2026-03-19
**Agent**: Antigravity
**What was done**:
- Complete destinations page premium rebuild with 5 major sections
- Parallax hero with animated stats (25 destinations, 9 regions, etc.)
- Interactive filter toolbar (search + region buttons + travel style chips)
- Editor's Pick spotlight component (FeaturedDestinationSpotlight — Sigiriya)
- Premium DestinationCard with hover zoom, gradient overlays, stagger reveal
- "Build Your Journey" CTA section with glassmorphism card
- Fixed image loading: discovered .jpg files were 29-byte 404 stubs, .svg were gradient placeholders
- User generated 25 real .webp destination photos externally
- Switched all image references to .webp, re-enabled Next.js Image optimization

**What to do next**:
- Verify destinations page in browser (open localhost:3000/destinations)
- Check responsive behavior on mobile
- Test filter interactions (search, region, travel style)
- Confirm all 25 images load correctly with proper optimization

**Current state**:
- Branch: main
- Dev server: running (npm run dev, port 3000)
- Last files changed: destinations.ts, page.tsx, DestinationCard.tsx, FeaturedDestinationSpotlight.tsx
- Build status: untested after image switch (dev server running)
- Any errors: none known

**Files changed this session**:
- src/data/destinations.ts (districtImage helper: .jpg → .svg → .webp)
- src/app/(public)/destinations/page.tsx (complete premium rebuild — 5 sections, 450 lines)
- src/components/public/DestinationCard.tsx (new component — premium card)
- src/components/public/FeaturedDestinationSpotlight.tsx (new component — editorial spotlight)
- src/app/globals.css (added liquid-glass-card, stat-card, tag-chip utility classes)
