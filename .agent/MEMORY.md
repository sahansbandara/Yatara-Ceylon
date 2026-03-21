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
- [2026-03-22] BuildTourTeaser parallax elements cut off vertically on small screens → `overflow-hidden` on `min-h-[100dvh]` container with no vertical padding clips any scrolling children → Use `overflow-x-clip` instead and ensure adequate padding like `py-20` so parallax elements have room to move.
- [2026-03-22] `overflow-hidden` handling in full-viewport layouts → If the inner components (e.g. Leaflet map) have scroll/drag enabled, relying on `overflow-hidden` purely on a container might still cause standard macOS elastic scroll if the body isn't locked → Lock body scroll globally when mounting fullscreen overlays/maps using `useEffect`.
- [2026-03-22] Animations and layouts for competitor analysis → Always inspect the actual site DOM/CSS using a browser instead of guessing from static images, especially for complex parallax or sticky scroll interactions.

---

## Patterns That Work

> Solutions and approaches that proved reliable.

- Server Components by default: pages in (public) are async server components, client components only in src/components/public/
- Transfer data is static (src/data/transfers.ts), not MongoDB — fast, no DB dependency for public transfer pages
- Destination data is static (src/data/destinations.ts) — 25 destinations with districtImage() helper
- Tailwind custom classes: `text-deep-emerald`, `bg-antique-gold`, `bg-off-white` — never hardcode hex
- Font classes: `font-display` for hero headings, `font-serif` for section headings, `font-nav` for body/nav text
- Spacing pattern: For new sections prefer `py-16` or `py-24`, but be *very careful* not to use large `py` classes if the total height starts exceeding a normal user screen. Compactness is favored everywhere.
- Gold accent patterns: `text-antique-gold`, `bg-antique-gold/20`, `border-antique-gold/30`
- Eyebrow labels: `text-[10px] tracking-[0.3em] uppercase text-antique-gold font-nav font-semibold`
- CTA button pattern: `px-8 py-3 bg-antique-gold text-deep-emerald font-nav font-semibold uppercase tracking-[0.15em] text-sm rounded-lg`
- Glassmorphism card: `liquid-glass-card` class in globals.css (bg-white/70, backdrop-blur, subtle border)
- Stat cards: `stat-card` class (hover rise, glassmorphism variant)
- Tag/chip filter: `tag-chip` class with active/inactive states
- Parallax hero: `useScroll` + `useTransform` from framer-motion on `heroRef`
- Staggered grid: `whileInView` with `transition={{ delay: index * 0.08 }}` for card reveals
- Build-tour planner glass system: `planner-shell-glass` for outer container, `planner-sidebar-glass` for left rail, `planner-map-container` for dark map bg, `planner-toolbar-glass` for floating toolbar, `quick-start-card` for entry mode cards, `region-card-glass` for region/district items, `place-card-glass` for place items, `how-step-glass` for how-it-works steps, `tour-card-elite` for popular tour cards
- Build-tour planner layout: 32% left rail / 68% map on desktop. Min-height 600px, max-height 860px, ideal = calc(100vh-180px). Mobile uses 85vh with bottom drawer sheet. Fullscreen map utilizes locking the `document.body.style.overflow` to hidden.
- Build-tour map framing: Sri Lanka bounds = [[5.92, 79.52], [9.85, 81.88]], padding [30, 40], fills ~70% of map height. District fitBounds uses 0.9s smooth animation with [60, 60] padding.
- Build-tour color palette: district default #1f4d3d, hover #2a6b54, selected #2a6b54 + gold border, dimmed #1a3a2e. Map bg radial gradient from #1a3a2e to #050e0a.
- The user is obsessed with *vertical compactness*. Spaces between sections must be tight. Use less vertical padding (`py-12` instead of `py-24`) to eliminate "empty visual voids" making content faster to view.
- Packages Section (FeaturedJourneysClient) and CuratedCollection use a very subtle mix-blend-multiply pattern background for luxury feel (`packages-bg-pattern.webp`). Opacity is usually between `opacity-[0.05]` and `opacity-[0.15]`.
- Why Yatara counts animation triggers every time using `amount: 0.5` on a tight wrapper ref around the numbers, resetting controls to initial values when out of view, ensuring premature triggering doesn't occur.
- Build-Tour Teaser layout: left-side text with motion stagger, right-side 4:5 image container highlighting "added to route" destination and sticky floating itinerary to look like an elite iOS application, animated softly with framer-motion `y: [0, -8, 0]`.
- Transfer page uses `generateStaticParams()` for SSG of category and package pages
- Image fallback pattern: check if image exists, show placeholder gradient if not
- Destination images: `.webp` format in `/public/images/districts/slug.webp`, 1600×900px
- FAQ items use liquid glass cards (`bg-white/40 backdrop-blur-md border border-white/50 rounded-2xl`) with satisfying click animations (`whileTap={{ scale: 0.98 }}`).
- The "Discover The Masterpiece" button in the FAQ/PremiumStory section explicitly links to `/the-masterpiece`, a dedicated page explaining the Yatara Standard, as it didn't have a distinct destination previously.
- JSON-LD structured data: centralised in `src/lib/jsonLd.tsx` with `<JsonLd data={...} />` component + builder functions per schema type. Injected at top of `<main>` in each page.
- Real Experiences layout recreation: Extended minimum section height dramatically (`min-h-[900px]` to `1200px`) and used `object-[center_60%]` to properly drag the background mountain lower, giving text layers enough "sky" to breathe and preventing cramped UI overlap.

---
