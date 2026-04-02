# Memory

> Agent long-term memory. **READ THIS BEFORE EVERY SESSION.** Update IMMEDIATELY after any mistake, discovery, correction, or new learning.

---

## Mistakes — Never Repeat These

> Format: `[DATE]` What went wrong → Root cause → What to do instead

- [2026-04-02] Production signup could show Cloudflare Turnstile `Success!` while `/api/auth/register` still returned `Captcha verification failed` → the backend passed Vercel's raw `x-forwarded-for` header straight to Cloudflare `siteverify`, and that header can contain a comma-separated proxy chain instead of a single client IP → When forwarding `remoteip` to Turnstile, sanitize proxy headers first (use only the first client IP, or omit the field).
- [2026-04-02] Registration kept posting an empty `turnstileToken` when Turnstile was not configured or failed to load, so the API answered with generic `Validation failed` while the page separately showed "Captcha is unavailable right now." → The signup UI did not gate submission on captcha readiness and did not map Zod field errors into a user-facing captcha/setup message → When a security widget is mandatory, block submit until it is ready/solved and translate missing-token validation into a specific configuration or verification error.
- [2026-04-02] Production `/api/bookings` populated `packageId` / `assignedStaffId` / `assignedVehicleId` from `Booking` without guaranteeing the referenced schemas were registered in that serverless runtime → Vercel cold starts threw `MissingSchemaError: Schema hasn't been registered for model "Package"` and the dashboard fell back to an empty state even though data existed → When a model will be populated in isolated runtimes, eagerly import/register its referenced models (or import them in the route) and add a regression test for schema registration.
- [2026-04-02] Package and destination dashboard forms/toggles still sent `PUT` requests while `/api/packages/[id]` and `/api/destinations/[id]` only expose `PATCH` for updates → publish toggles and edit submits silently fail or 405 even though the backend exists → Before wiring any polish on dashboard CRUD tables/forms, verify the real route methods and align every client action to them.
- [2026-04-02] The root Next.js build picked up files from the separate Expo app under `mobile/Yatara-Ceylon` because `tsconfig.json` included every `**/*.ts(x)` file in the repo → `npm run build` failed on mobile-only path aliases unrelated to the web app → Exclude nested projects from the root TypeScript config so the web build only validates the intended app.
- [2026-04-02] Jest scanned the generated `.claude/worktrees/.../package.json` files and threw a haste-map naming collision before route tests even ran → targeted API regression tests became unreliable despite the code being valid → Ignore `.claude/worktrees/` in `jest.config.ts` so local worktrees do not contaminate the repo test graph.
- [2026-04-01] Vercel `MONGODB_URI` was set to a single Atlas shard host (`ac-...-shard-00-00...`) with `directConnection=true` → writes from the seed failed in production with `MongoServerError: not primary` / `NotWritablePrimary` even though reads and env loading looked fine → On Atlas-backed production deployments, use the cluster SRV URI (`mongodb+srv://...@ac-....mongodb.net/...`) or a full replica-set connection string, never a single-host direct connection for app traffic.
- [2026-04-01] Hotel dashboard property cards read `p.contact?.email` / `p.contact?.phone`, but the `Partner` model stores `email` and `phone` at the top level → hotel partner fixtures existed yet rendered as blank contact info, making the dashboard look unseeded → When wiring dashboard demo data, verify the render layer matches the real schema fields instead of assuming nested contact objects.
- [2026-04-01] `/dashboard/vehicles` could hard-crash during render because legacy vehicle records contained invalid `images[0]` values like `sdfghjkl;` and the table passed them straight into `next/image` → one malformed DB value blanked the whole fleet management page even though the rest of the data was valid → Validate dashboard image URLs before rendering `next/image`, and fall back to the icon placeholder for malformed or non-whitelisted hosts.
- [2026-04-01] Demo/test accounts created by `src/lib/seed.ts` were left with the model default `emailVerified: false` → `/api/auth/login` correctly rejected them with "Please verify your email before signing in", so the published test credentials were unusable even though the password hashes were valid → Seeded demo accounts must be explicitly marked `emailVerified: true` and refreshed on re-seed so existing local databases are repaired.
- [2026-04-01] `npm run seed` did not load `.env.local` / `.env` before reading `MONGODB_URI` → the script silently fell back to `mongodb://localhost:27017/toms` and failed with `ECONNREFUSED`, so the documented demo-account bootstrap often never ran at all → Standalone scripts in this repo must load env files explicitly before touching database config.
- [2026-04-01] `Booking.findOne(...).lean()` in `src/app/api/bookings/route.ts` widened to a document-or-array type under the current Mongoose typings → build failed when reading `duplicateCheck.bookingNo` even though runtime returns one document → Narrow the result before property access (or explicitly type/select the lean payload) when adding duplicate-warning metadata.
- [2026-04-01] `src/app/dashboard/finance/page.tsx` imported `@/components/dashboard/finance/FinanceDateFilter` even though the component was never added → `next build` failed at module resolution before any runtime verification → Remove dangling imports or add the component in the same change when wiring new dashboard controls.
- [2026-04-01] The repo had two separate login pages (`/login` and `/auth/login`) with different behavior → auth fixes can land in one page while the other quietly drifts, which makes demo credentials look role-broken depending on entry path → Keep a single canonical login implementation and make aliases redirect to it.
- [2026-03-19] FleetTierCard has image prop but doesn't render it → Image container shows placeholder div instead of Image component → Always use next/image with the image prop when provided
- [2026-03-19] Package model has `type` field but packages page filters with `$or: [{ type: 'journey' }, { type: { $exists: false } }]` → Old packages might not have type field → When filtering, always account for missing type field
- [2026-03-19] District images: `.jpg` files in `/public/images/districts/` were 29-byte `<html><body>404</body></html>` stubs, NOT real images → Always verify image files with `file` command before assuming they're valid → The `.svg` files were gradient placeholders (858 bytes). User generates real photos externally.
- [2026-03-19] Next.js Image component returns 400 for SVG files via `/_next/image` → SVGs can't be processed by Next.js image optimization → Use `unoptimized` prop for SVGs, or use real .jpg/.webp files instead
- [2026-03-19] Don't generate images with AI tools — user has explicitly said to provide image specs (folder, filename, size, prompt) and they will generate images themselves
- [2026-03-19] Build-tour MapViewport uses Leaflet (not Mapbox) — no tile layer by design (user's choice), uses radial-gradient CSS bg + GeoJSON districts instead. Dark premium theme replaces the old pale grey map background.
- [2026-03-19] Build-tour planner height: calc(100vh-180px) fits 13-inch MacBook screen. Each section of the build-tour page should fit one viewport fold (~900px effective height). Do not make sections taller than 100vh.
- [2026-03-22] Auth imports: This project does NOT use `next-auth`. Auth is custom JWT via `getSessionUser()` from `@/lib/auth`. Session returns `{ id, email, role }` directly (no `session.user` wrapper). Never import `getServerSession` or `authOptions`.
- [2026-03-22] DB connection: Import `connectDB` from `@/lib/mongodb`, NOT `dbConnect` from `@/lib/db`. The `@/lib/db` module does not exist.
- [2026-03-22] `sonner` is NOT installed in this project. Use standard `alert()` for notifications in dashboard pages. Other dashboard components also use `alert()` for feedback.
- [2026-03-24] VehicleForm used `PUT` method but the API route (`/api/vehicles/[id]/route.ts`) only exports `PATCH` → 405 Method Not Allowed on every vehicle edit → Always check which HTTP methods the API route actually exports before using them in client components.
- [2026-03-24] ESLint 9 + `next/typescript` extends overrides `.eslintrc.json` custom rules from `warn` to `error` → Build fails on 100+ `no-explicit-any` errors despite config saying `warn` → Added `eslint.ignoreDuringBuilds: true` in `next.config.ts`. Lint runs separately via `npm run lint` in dev.
- [2026-03-24] Mapping object keys didn't match real data slugs in Transfers (`event` instead of `evening`) → Link fell back to default `#${slug}` anchor → Always verify that dictionary keys exactly match the actual data IDs/slugs they are meant to map.
- [2026-03-24] React hydration mismatch on Transfers page observed via browser tools. Caused by client-side state initializing (`useCurrency` or similar) differently than SSR. While not breaking layout, it should be investigated for perfect performance. Always ensure initial client render matches server HTML output.
- [2026-04-01] Login route treated `lastLogin` persistence as part of the critical auth path → a transient Mongo write failure after valid credentials would surface to the UI as `Internal server error` → Keep login success independent from non-essential metadata writes; update `lastLogin` with a separate best-effort write and regression-test that behavior.
- [2026-04-01] Running `next dev` and `next build` against the same `.next` directory can corrupt local server bundles in this repo → `/api/auth/login` started throwing `Cannot find module './chunks/vendor-chunks/next.js'` and the UI only showed `Internal server error` → Use a separate development dist directory (`.next-dev`) so local auth routes do not depend on a shared artifact tree.
- [2026-04-01] Dashboard `UserForm` edit mode was still sending `PUT` while `/api/users/[id]` only implements `PATCH` → user edits silently failed despite the backend capability existing → Always verify form verbs against the actual route exports before trusting an audit claim like "edit missing".
- [2026-04-01] `CustomPlan` dashboard flow expected ownership fields (`userId`, sometimes `title`) that were not actually persisted by the model/API → "My Plans" could not reliably show saved plans for authenticated users → Keep model, API, and dashboard queries aligned for ownership fields, and backstop with route tests.
- [2026-04-01] Destination imagery from the database can contain malformed absolute URLs like `yataraceylon.mehttps://...` → `next/image` receives an invalid src and the public destination hero/cards break → Normalize stored image URLs before rendering and fall back to local district images when the value is unusable.
- [2026-04-01] Partner edit form still submitted `PUT` to `/api/partners/[id]` while the route only exports `PATCH` → partner edits fail with 405 even though the backend exists → Always verify dashboard form verbs against the real route methods before assuming a module is "unfinished".
- [2026-04-01] Converting `createPartnerServiceSchema` to a transformed Zod schema broke `.partial()` and stricter `validateBody()` typing across every route importing `updatePartnerServiceSchema` → build/tests failed before any runtime verification could happen → When adding transforms, keep an untransformed base object schema for partial/update variants or widen the validator helper to accept transformed schemas explicitly.

---

## Recent Findings

- [2026-04-02] Local `.env.local` now includes real Turnstile keys, so local signup/public captcha flows can run against Cloudflare once the Next dev server is restarted. Vercel production still needs the same keys configured separately.
- [2026-04-02] After pushing commit `19dc2f1` to `main`, Vercel’s Git-connected production deployment `https://yatara-ceylon-ksfxosat9-sithmi.vercel.app` went `Ready` and `https://www.yataraceylon.me/api/bookings?limit=5` returned seeded booking data successfully. The missing-schema fix is confirmed live.
- [2026-04-02] Vercel production uses the seeded `toms` database and currently contains `36` non-deleted bookings, `31` users, and `4` invoices. The blank bookings dashboard was caused by `/api/bookings` crashing with `MissingSchemaError`, not by missing seed data.
- [2026-04-02] Production smoke testing showed the finance dashboard's "Outstanding Balances" panel is still ranked purely by `remainingBalance DESC`, which hides nearer operational demo bookings like `YC-DEMO-1005` and `YC-DEMO-1006` behind older high-balance records. For operator follow-up panels, prioritize actionable current bookings over raw historical debt size.
- [2026-04-01] Local DB check confirmed `admin@yataraceylon.me` exists, bcrypt validation succeeds for `Admin@123`, and the account still has `emailVerified: false`. The test-credential failure is in seeded account state, not password hashing or JWT generation.
- [2026-04-01] `npm run seed` currently ignores `.env.local`; when run from the repo root it attempts localhost Mongo unless the shell already exported `MONGODB_URI`. That makes the README instruction inaccurate until the seed script loads env files itself.
- [2026-04-01] MapViewport.client.tsx already uses dynamic import with ssr: false in BuildTourShell.client.tsx. CSS imports are correct (leaflet.css, MarkerCluster.css). Loading state shows "Loading map..." with animated spinner on dark bg. Districts and places data load correctly via fetch GeoJSON and curated places JSON. No fixes needed for map rendering.
- [2026-04-01] `/api/auth/login` succeeds locally for `admin@ceylonescapes.lk` and `Admin@123`. The vulnerable point was the post-auth `lastLogin` write, not credential lookup or JWT issuance.
- [2026-04-01] The observed local 500 could also be reproduced from a corrupted Next dev bundle, not just auth logic. After a `next build` while dev was running, the login route resolved to a missing vendor chunk inside `.next`.
- [2026-04-01] Live Vercel behavior on `https://www.yataraceylon.me/api/auth/login`: malformed email returns `400`, missing user returns `401`, but valid admin credentials return `500`. This strongly indicates production reaches the database and only fails in the post-auth success path, matching the pre-patch `lastLogin` save behavior. Domain redirect (`yataraceylon.me` → `www.yataraceylon.me`) is normal and not the cause.
- [2026-04-01] `TOMS-Completion-Audit-Report.md` is partially stale: several items flagged as missing were already implemented (`/api/users/[id]` PATCH/DELETE, notification PATCH/DELETE, bookings/tickets/invoices/payments auth, finance CSV export, analytics page, tests, custom 404). Re-audit the code before treating the report as source of truth.
- [2026-04-01] Destination cards/detail pages now normalize malformed stored image URLs before sending them to `next/image`, which prevents broken hero/card imagery when DB content contains duplicated domains.
- [2026-04-01] Two sensitive partner reads were still exposed after the earlier audit cleanup: `GET /api/booking-partners` had no auth at all and `GET /api/partners/[id]` was publicly readable. Security re-checks must include adjacent routes, not only the exact URLs named in an audit.
- [2026-04-01] The repo currently has no shared CSRF, email-delivery, or captcha plumbing. Password reset, email verification, lockout, and public-form protection need shared primitives first; patching routes one by one creates drift and inconsistent enforcement.
- [2026-04-01] After adding CSRF and Turnstile to public/auth flows, the existing Jest suite must be updated for the new request contract (matching CSRF cookie/header pairs and captcha token payloads). Several failures were test expectations, not route regressions.
- [2026-04-01] `nodemailer` compiles fine at runtime but this repo still needs `@types/nodemailer` for `next build` type-checking → adding the package is simpler than carrying a local ambient declaration.
- [2026-04-01] Browser smoke-check on `/build-tour` confirmed the map now mounts a real `.leaflet-container` with interactive district paths on desktop instead of hanging on “Loading map…”. The main non-app console noise is third-party chat/CORS and favicon warnings, not planner failures.

---

## Patterns That Work

> Solutions and approaches that proved reliable.

- Auth/signup flows with required captcha: let the server-side verifier own the final captcha message, but block the UI submit button until a token exists and surface the first field-level API error instead of raw `Validation failed`.
- Dashboard demo fixtures: seed them with stable business keys (`bookingNo`, `invoiceNo`, `orderId`, `plateNumber`, partner `name + type`, service `partnerId + serviceName`) and refresh via upserts so rerunning `npm run seed` repairs hotel, fleet, finance, support, and customer dashboards without creating duplicate rows.
- Seeded demo accounts: treat them as fixtures, not one-time inserts. Load `.env.local`/`.env` inside the script, upsert by email, force `emailVerified: true`, reset lockout state, and refresh the known password on every `npm run seed` so local databases stay recoverable.
- Login routes: use `/auth/login` as the canonical page; keep `/login` as a simple redirect alias so redirects, captcha, verification messaging, and role-based post-login routing stay in one place.
- Dashboard pages (support, notifications, users): Use DashboardHero with title + subtitle showing summary stats. Subtitle format: "X total" or "X total • Y open". Action prop accepts Button wrapped in Link for CTAs.
- Auth routes: verify credentials first, then treat audit/profile updates like `lastLogin` as best-effort follow-up work so a transient write issue cannot block a valid login.
- Next.js local workflow: keep development output separate from production build output when both commands may run on the same repo; `.next-dev` for dev and `.next` for build avoids broken route bundles.
- Saved plan ownership: persist `userId` for authenticated plan saves and let reads fall back to `customerEmail` for legacy records until data is backfilled.
- Dashboard StatCard KPI rows: Responsive grid (grid-cols-1 md:grid-cols-2 lg:grid-cols-4 or lg:grid-cols-3). Each card shows: title (small uppercase label), numeric value (large bold), icon with hover effects. Use accentColor prop like "text-blue-400" or "text-amber-400".
- Dashboard data queries: All server-side in page.tsx. Pattern: fetch with .find({ isDeleted: false }), filter in-memory for stats, serialize with JSON.parse(JSON.stringify()). GlassPanel wraps table content with liquid-glass-stat-dark styling.
- Dashboard button styling: Gold CTA buttons use class="bg-antique-gold hover:bg-antique-gold/90 text-deep-emerald font-semibold tracking-wider text-xs rounded-lg" for consistency across Support/Notifications/Users pages.
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
- How It Works section intentionally kept very compact vertically (minimal py, mb, mt) based on user's luxury/space-efficiency preference.
- Packages Section (FeaturedJourneysClient) and CuratedCollection use a very subtle mix-blend-multiply pattern background for luxury feel (`packages-bg-pattern.webp`). Opacity is usually between `opacity-[0.05]` and `opacity-[0.15]`.
- Featured Journeys section: plain white bg, no card borders/frames, liquid glass pagination dots (gold gradient active, expanding pill), duration tags use `bg-white/10 backdrop-blur-md border-antique-gold/40` (NOT black). Cards show only title + subtitle, matching Signature Experiences editorial style. Filter bar sits inline with title on md+ screens.
- Why Yatara counts animation triggers every time using `amount: 0.2` and resetting controls to `"hidden"` when out of view.
- Transfer page uses `generateStaticParams()` for SSG of category and package pages
- Image fallback pattern: check if image exists, show placeholder gradient if not
- TransferHero heroImage prop: renders full-bleed next/image with `from-deep-emerald/80 via-deep-emerald/60 to-deep-emerald/85` gradient overlay + radial vignette. Falls back to solid deep-emerald bg + accent blobs when omitted.
- Destination images: `.webp` format in `/public/images/districts/slug.webp`, 1600×900px
- JSON-LD structured data: centralised in `src/lib/jsonLd.tsx` with `<JsonLd data={...} />` component + builder functions per schema type. Injected at top of `<main>` in each page.
- Real Experiences layout tuning: Used `useSpring` on Framer scroll progress to add a slow, fluid scroll effect. Fine-tuned parallax speeds so the background text moves very fast downward (`[-60%, 80%]`), while keeping the girl's upward parallax gentle (`[10%, -5%]`).
- Finance/Packages/Destinations dashboard pages: Use 4-column KPI stat grid (grid-cols-2 lg:grid-cols-4). Finance adds revenue bar chart by month and aging buckets (0-7, 8-14, 15-30, 30+ days). Packages/Destinations show data quality alerts for pricing/image issues respectively. All tables wrap in GlassPanel with `noPadding` prop.
- Dashboard v2 color system: 4-layer surface hierarchy. L0 canvas = #060d0b (near-black). L1 sidebar = #0a1410 (darkest). L2 cards = rgba(255,255,255,0.055) via liquid-glass-stat-dark. L3 tables = rgba(255,255,255,0.025) via dashboard-table-glass. Gold used ≤10% for CTA/active states only.
- Dashboard layout v2: No scenic background image. Uses subtle radial gradients (rgba(255,255,255,0.02)) and faint gold accent orb (rgba(212,175,55,0.025)). Much lighter than v1.
- GlassPanel component: Accepts `subtitle` prop (optional) for secondary text below title.
- Dashboard Command Center (page.tsx): Imports AuditLog and PartnerRequest models for activity feed and pending approvals. Uses booking pipeline (horizontal stacked bars by status) and revenue by status charts (CSS-only, no recharts).
- Bookings page v2: Client component with status tabs (fetch counts per status), KPI summary row (calculated client-side from fetched data), date range filters, balance-due checkbox filter, page number pagination.
- Global search: `/api/search?q=term` searches 6 entities (Booking, Package, Destination, Vehicle, Partner, User) with regex. CommandBar.tsx uses `cmdk` package with ⌘K shortcut, 300ms debounce, grouped results.
- TransfersTeaser v2: Data-driven from `transferCategoryCards`. First 3 categories → tall editorial cards (min-h-[650px]), last 2 → compact landscape cards (min-h-[380px], 2-column). `categoryRoutes` dict maps slugs to routes. Safari/Evening currently use anchor links (`/transfers#slug`).
- Archive/Restore Center: API pattern uses `Promise.all()` to query all collections with `{ isDeleted: true }`, merges results with `collectionName` tag, sorts by `deletedAt` descending. Action route uses a `modelMap` object to resolve collection name to Mongoose model.
- Soft delete pattern: Set `isDeleted: true` + `deletedAt: new Date()` on DELETE. Restore = `$set: { isDeleted: false }, $unset: { deletedAt: "" }`. Permanent delete = `findByIdAndDelete(id)`.
- All active-record queries must filter `{ isDeleted: false }` or `{ isDeleted: { $ne: true } }` to exclude soft-deleted items.

---

## Project Knowledge

- MongoDB connection: src/lib/mongodb.ts with global caching
- Turnstile verification should only send the first client IP from `x-forwarded-for`; Vercel may include a comma-separated proxy chain that Cloudflare rejects if passed through unchanged
- Turnstile helper now emits failure-only diagnostics in Vercel logs via `[Turnstile] ...` entries, including `errorCodes`, `hostname`, response status, and presence booleans for token/IP, but never the raw token or secret
- Local `.env.local` has Turnstile configured as of 2026-04-02; restart the Next.js dev server after env edits so the client-side site key is reloaded.
- Turnstile env placeholders now live in `.env.example`; production needs both `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` configured for `www.yataraceylon.me` / `yataraceylon.me`
- Root web-app TypeScript config now excludes the nested Expo app at `mobile/Yatara-Ceylon` so `next build` only checks the web project
- Low-priority polish wave (2026-04-02): packages/destinations/notifications now support bulk toolbar actions and CSV export, and the remaining operator tables reuse `useTableSort` + `SortableHeader`
- Dashboard date-range presets now live in `src/lib/date-range.ts` and power both analytics and finance pages via `from` / `to` / `preset` URL params
- Finance dashboard outstanding balances now use `rankOutstandingBookings()` from `src/lib/finance-dashboard.ts`, prioritizing upcoming non-settled bookings by status + departure date before falling back to highest stale balances
- Booking activity timeline now merges booking audit rows with invoice and payment lifecycle events from `/api/bookings/[id]/timeline`
- Finance dashboard now includes explicit draft/final/void invoice status counts in addition to recent invoice rows
- Attachment management uses the `Attachment` model plus `/api/bookings/[id]/attachments` routes for URL-backed document records; avoid server-local uploads on this Vercel-hosted app
- Package and destination dashboard editors now autosave client-side drafts to localStorage (`yatara:package-form:*`, `yatara:destination-form:*`) and clear them on successful submit
- Staff/admin WhatsApp dispatch shortcut is exposed through `GET /api/bookings/[id]/whatsapp`; if no WhatsApp env is set, the dashboard card shows a safe setup message instead of a broken link
- Production Atlas fix: derive the writable cluster root from `ac-dhyrkz5-shard-00-00.lrmzamd.mongodb.net` to `ac-dhyrkz5.lrmzamd.mongodb.net` and use an SRV URI with retryable writes instead of `directConnection=true`
- Local Vercel CLI bootstrap for this repo: `vercel link --yes --project yatara-ceylon --scope sithmi` before using `vercel env` commands from a fresh checkout
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
- Development build output: `.next-dev`
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

---

## Last Session

**Date**: 2026-04-02
**Agent**: Codex
**Task**: Fix the production finance smoke-test mismatch where the Outstanding Balances panel hid seeded actionable bookings, then verify and prepare the repo for push

**What was done**:
1. Confirmed the production mismatch came from `src/app/dashboard/finance/page.tsx` still sorting the Outstanding Balances panel by `remainingBalance DESC` with `limit(10)`, which pushed `YC-DEMO-1005` and `YC-DEMO-1006` off the panel behind older higher-balance records.
2. Added `src/lib/finance-dashboard.ts` with `rankOutstandingBookings()` so upcoming non-settled bookings are prioritized by status and departure date, with raw highest-balance ordering used only for stale fallback records.
3. Updated the finance dashboard query/render path to use the ranking helper, include departure/status context in the panel rows, and clarify the panel subtitle.
4. Added a focused regression test in `src/lib/__tests__/finance-dashboard.test.ts` covering the reported smoke-test shape.
5. Updated `docs/finance-management.md` so the documented panel behavior matches the new operational ranking.
6. Verified the change with a passing targeted Jest run, a passing existing invoice regression run, and a successful production build.

**Files created**:
- `/src/lib/finance-dashboard.ts`
- `/src/lib/__tests__/finance-dashboard.test.ts`

**Files modified**:
- `.agent/TODO.md`
- `.agent/MEMORY.md`
- `src/app/dashboard/finance/page.tsx`
- `docs/finance-management.md`

**Verification**:
- `npx jest --runTestsByPath './src/lib/__tests__/finance-dashboard.test.ts' --runInBand`
- `npx jest --runTestsByPath './src/app/api/invoices/[id]/route.test.ts' --runInBand`
- `npm run build`

**Current state**:
- The finance dashboard now ranks outstanding balances toward current actionable bookings, which should surface seeded active demo bookings like `YC-DEMO-1005` and `YC-DEMO-1006` ahead of stale historical debtors.
- Verification is green locally (`finance-dashboard` test, invoice route test, and full build).
- The worktree still contains a large pre-existing set of unrelated changes outside this finance fix, so the push step must choose a deliberate commit scope rather than assuming a clean tree.

**What to do next**:
- Move on to the remaining manual/non-automatable items at the top of `.agent/TODO.md` (manual QA matrix, mobile QA, cross-browser smoke testing, and production env credential setup).
