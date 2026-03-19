# Memory

> Agent long-term memory. **READ THIS BEFORE EVERY SESSION.** Update IMMEDIATELY after any mistake, discovery, correction, or new learning.

---

## Mistakes — Never Repeat These

> Format: `[DATE]` What went wrong → Root cause → What to do instead

- [2026-03-19] FleetTierCard has image prop but doesn't render it → Image container shows placeholder div instead of Image component → Always use next/image with the image prop when provided
- [2026-03-19] Package model has `type` field but packages page filters with `$or: [{ type: 'journey' }, { type: { $exists: false } }]` → Old packages might not have type field → When filtering, always account for missing type field
- [2026-03-19] District images: `.jpg` files in `/public/images/districts/` were 29-byte `<html><body>404</body></html>` stubs, NOT real images → Always verify image files with `file` command before assuming they're valid → The `.svg` files were gradient placeholders (858 bytes). User generates real photos externally.
- [2026-03-19] Next.js Image component returns 400 for SVG files via `/_next/image` → SVGs can't be processed by Next.js image optimization → Use `unoptimized` prop for SVGs, or use real .jpg/.webp files instead
- [2026-03-19] Don't generate images with AI tools — user has explicitly said to provide image specs (folder, filename, size, prompt) and they will generate images themselves
- [2026-03-19] Build-tour MapViewport uses Leaflet (not Mapbox) — no tile layer by design (user's choice), uses radial-gradient CSS bg + GeoJSON districts instead. Dark premium theme replaces the old pale grey map background.
- [2026-03-19] Build-tour planner height: calc(100vh-180px) fits 13-inch MacBook screen. Each section of the build-tour page should fit one viewport fold (~900px effective height). Do not make sections taller than 100vh.

---

## Patterns That Work

> Solutions and approaches that proved reliable.

- Server Components by default: pages in (public) are async server components, client components only in src/components/public/
- Transfer data is static (src/data/transfers.ts), not MongoDB — fast, no DB dependency for public transfer pages
- Destination data is static (src/data/destinations.ts) — 25 destinations with districtImage() helper
- Tailwind custom classes: `text-deep-emerald`, `bg-antique-gold`, `bg-off-white` — never hardcode hex
- Font classes: `font-display` for hero headings, `font-serif` for section headings, `font-nav` for body/nav text
- Spacing pattern: `pt-32 pb-24` for heroes, `py-24` for sections, `max-w-7xl mx-auto px-4 md:px-8`
- Gold accent patterns: `text-antique-gold`, `bg-antique-gold/20`, `border-antique-gold/30`
- Eyebrow labels: `text-[10px] tracking-[0.3em] uppercase text-antique-gold font-nav font-semibold`
- CTA button pattern: `px-8 py-3 bg-antique-gold text-deep-emerald font-nav font-semibold uppercase tracking-[0.15em] text-sm rounded-lg`
- Glassmorphism card: `liquid-glass-card` class in globals.css (bg-white/70, backdrop-blur, subtle border)
- Stat cards: `stat-card` class (hover rise, glassmorphism variant)
- Tag/chip filter: `tag-chip` class with active/inactive states
- Parallax hero: `useScroll` + `useTransform` from framer-motion on `heroRef`
- Staggered grid: `whileInView` with `transition={{ delay: index * 0.08 }}` for card reveals
- Build-tour planner glass system: `planner-shell-glass` for outer container, `planner-sidebar-glass` for left rail, `planner-map-container` for dark map bg, `planner-toolbar-glass` for floating toolbar, `quick-start-card` for entry mode cards, `region-card-glass` for region/district items, `place-card-glass` for place items, `how-step-glass` for how-it-works steps, `tour-card-elite` for popular tour cards
- Build-tour planner layout: 32% left rail / 68% map on desktop. Min-height 600px, max-height 860px, ideal = calc(100vh-180px). Mobile uses 85vh with bottom drawer sheet.
- Build-tour map framing: Sri Lanka bounds = [[5.92, 79.52], [9.85, 81.88]], padding [30, 40], fills ~70% of map height. District fitBounds uses 0.9s smooth animation with [60, 60] padding.
- Build-tour color palette: district default #1f4d3d, hover #2a6b54, selected #2a6b54 + gold border, dimmed #1a3a2e. Map bg radial gradient from #1a3a2e to #050e0a.
- Transfer page uses `generateStaticParams()` for SSG of category and package pages
- Image fallback pattern: check if image exists, show placeholder gradient if not
- Destination images: `.webp` format in `/public/images/districts/slug.webp`, 1600×900px
- JSON-LD structured data: centralised in `src/lib/jsonLd.tsx` with `<JsonLd data={...} />` component + builder functions per schema type. Injected at top of `<main>` in each page.

---

## Project Knowledge

- MongoDB connection: src/lib/mongodb.ts with global caching
- Transfer categories: airport-executive, wilderness-safari, capital-by-night, intercity-executive, chauffeur-reserve, signature-fleet
- Vehicle tiers: Executive (2 guests), Prestige (4 guests), Grand (7 guests)
- Package model type field: 'journey' | 'transfer' — packages page should only show 'journey'
- Transfer images in /public/images/transfers/ — referenced as /images/transfers/filename.jpg
- Destination images in /public/images/districts/ — 25 `.webp` files, referenced via districtImage() helper
- Pricing in transfers uses USD strings like '$65', '$120'
- LKR pricing to be added for new transfer products
- Destinations page has 25 items with region/bestSeason/idealNights/travelStyleTags metadata
- Destinations page features: search, region filter, travel style filter, editor's pick spotlight

---

## Dependencies & Versions

- next@15.1.0 — App Router framework
- react@19.0.0 — UI library
- mongoose — MongoDB ODM
- tailwindcss@3.4.17 — styling
- framer-motion — animations
- lucide-react — icons
- zustand — state management
- stripe — payment processing
- zod — validation schemas

---

## Architecture Decisions

- Static data for transfers → Chosen because transfer catalog is curated, not user-generated. Faster page loads, SSG-friendly. No admin CRUD needed yet.
- Static data for destinations → Same reasoning. 25 curated destinations in src/data/destinations.ts.
- Separate transfer/journey taxonomy → Transfers are point-to-point logistics. Journeys are multi-day itineraries. Different data models, different UX needs.
- Server Components for pages → Reduces client JS bundle. Only interactive elements (modals, forms, filters) use 'use client'.
- Images managed as static files → /public/images/. User generates images externally and places them in folder. Agent provides specs only.
- WebP format for destination images → Better compression than JPEG, natively supported by Next.js Image optimization. 1600×900px source files.
- Build-Tour V3 elite rebuild → Page restructured as planner-first: Hero (compact) → QuickStart → MainPlanner → HowItWorks → PopularPlans → Themes → StoryBanner → Testimonials → CTA. Planner dominates the page, editorial sections support it rather than compete.
- Build-Tour map: no tile layer by design → Uses CSS radial-gradient dark bg + GeoJSON district polygons. Lighter than Mapbox tiles, fully branded, no third-party tile server dependency.
- Build-Tour 100vh section design → Each section fits within one viewport fold on 13-inch MacBook (effective ~900px height). Planner uses calc(100vh-180px) with fullscreen toggle option.

---

## Environment & Commands

- Dev server: `npm run dev`
- Build: `npm run build`
- Deploy: Vercel (auto-deploy from git)
- Lint: `npm run lint`

---

## Client / User Preferences

- Owner: Sahan — AI student at SLIIT, runs crypto/forex Telegram channels
- Brand: Yatara Ceylon — luxury travel/transfer service in Sri Lanka
- Design: Premium, elegant, high-trust. Think Blacklane/SIXT ride level.
- Images: User generates images externally. Agent provides folder path, filename, dimensions, and generation prompts. Never generate images with AI tools.
- Pricing: Use LKR for new transfer products (airport, intercity, hourly). Existing packages use USD.
- No image generation by agent — provide specs for user to generate.
- If browser verification needed, ask user to send full-page screenshot instead of struggling with browser subagent.
