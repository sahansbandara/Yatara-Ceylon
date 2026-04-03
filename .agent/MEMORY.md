# Memory

> Agent long-term memory. **READ THIS BEFORE EVERY SESSION.** Update IMMEDIATELY after any mistake, discovery, correction, or new learning.

---

## Mistakes — Never Repeat These

> Format: `[DATE]` What went wrong → Root cause → What to do instead

- [2026-04-04] Dashboard tabs `My Bookings` and `My Plans` felt sluggish and lagged during testing. → The Next.js App Router blocks client navigation when server components perform heavy DB fetches across large datasets. → Implement a global `loading.tsx` with a `<Suspense>` skeleton loader so routing transitions instantly while background data fetches.
- [2026-04-04] PayHere's sandbox webhook silently dropped out and blocked test booking completions. → Webhooks can fail or take excessive time in sandboxes (specifically without live tunnels). → Build a client-side polling fallback so `PaymentConfirmingClient` automatically checks the invoice status on an interval while users wait on the return URL.
- [2026-04-03] Search params on PayHere return URLs threw server errors when two `order_id`s were appended. → Next.js automatically parsed duplicate query params as an array, but Mongoose strict casting crashed when fed `[id1, id2]`. → Read single query fields using standard string extraction or take `Array.isArray(searchParams.order_id) ? searchParams.order_id[0] : searchParams.order_id` to guarantee strings.
- [2026-04-02] Production signup could show Cloudflare Turnstile `Success!` while `/api/auth/register` still returned `Captcha verification failed` → the backend passed Vercel's raw `x-forwarded-for` header straight to Cloudflare `siteverify`, and that header can contain a comma-separated proxy chain instead of a single client IP → When forwarding `remoteip` to Turnstile, sanitize proxy headers first (use only the first client IP, or omit the field).
- [2026-04-02] Resending email verification rotated the stored token hash, but the UI/email copy did not explain that older links immediately stop working and resend emails reused the original subject → users could request a new email, then click an older threaded message and think the link had "expired instantly" or that no new email arrived → When rotating single-use verification tokens, explicitly say only the latest link works and give resend emails a distinct subject/body so inbox threading does not hide the replacement link.
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

---

## Recent Findings

- [2026-04-04] Booking forms pre-fill user metadata successfully when `BookingRequestClient` fetches their user identity explicitly decoded from the page's route layout (`getUserFromToken()`), overcoming the hydration mismatch and improving customer experience immediately.
- [2026-04-04] Admin user linking logic `MyBookingsService` now queries using `{ $or: [{ customerEmail: email }, { customerId: user.id }] }` which natively protects lost bookings, joining older bookings via email matching with newer session-tied ID links robustly. 
- [2026-04-02] Local `.env.local` now includes real Turnstile keys, so local signup/public captcha flows can run against Cloudflare once the Next dev server is restarted. Vercel production still needs the same keys configured separately.
- [2026-04-02] After pushing commit `19dc2f1` to `main`, Vercel’s Git-connected production deployment `https://yatara-ceylon-ksfxosat9-sithmi.vercel.app` went `Ready` and `https://www.yataraceylon.me/api/bookings?limit=5` returned seeded booking data successfully. The missing-schema fix is confirmed live.
- [2026-04-02] Vercel production uses the seeded `toms` database and currently contains `36` non-deleted bookings, `31` users, and `4` invoices. The blank bookings dashboard was caused by `/api/bookings` crashing with `MissingSchemaError`, not by missing seed data.
- [2026-04-02] Production smoke testing showed the finance dashboard's "Outstanding Balances" panel is still ranked purely by `remainingBalance DESC`, which hides nearer operational demo bookings like `YC-DEMO-1005` and `YC-DEMO-1006` behind older high-balance records. For operator follow-up panels, prioritize actionable current bookings over raw historical debt size.

---

## Patterns That Work

> Solutions and approaches that proved reliable.

- Asynchronous Webhook Polling: On payment gateways like PayHere, wait for the webhook callback to update the DB using a client-side polling shell (`loading.tsx` or `<Suspense>` wrapper). This avoids 404s when the user returns before the background request completes.
- UX Loading Boundaries: Define `loading.tsx` heavily at layouts (`src/app/dashboard/loading.tsx`) avoiding direct perceived server response lag across complex data-heavy tables.
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
- Verification and password-reset email delivery are currently SMTP-only in this repo; if `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, and `SMTP_FROM` are not configured in Vercel, the helper logs `Email delivery skipped because SMTP is not configured` and no email is sent
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
- Local `.env.local` now includes Zoho SMTP settings for `info@yataraceylon.me` using `smtp.zoho.com:587`; local verification-email tests should exercise the real SMTP path instead of the "SMTP is not configured" fallback
- Resend verification emails now use the subject `Your new Yatara Ceylon verification link` and the body explicitly says that any previous verification emails are replaced; the login page mirrors that rule when `/auth/login?verified=invalid` is shown
- Transfer categories: airport-executive, wilderness-safari, capital-by-night, intercity-executive, chauffeur-reserve, signature-fleet
- Vehicle tiers: Executive (2 guests), Prestige (4 guests), Grand (7 guests)
- Package model type field: 'journey' | 'transfer' — packages page should only show 'journey'
- Transfer images in /public/images/transfers/ — referenced as /images/transfers/filename.jpg
- Destination images in /public/images/districts/ — 25 `.webp` files, referenced via districtImage() helper
- Pricing in transfers uses USD strings like '$65', '$120'
- LKR pricing to be added for new transfer products
- Destinations page has 25 items with region/bestSeason/idealNights/travelStyleTags metadata
- Destinations page features: search, region filter, travel style filter, editor's pick spotlight
- Dashboard Tabs Navigation Optimization: Next.js router blocks when pages fetch extensive Server-Side data leading to a slow perception when navigating admin dashboards. Adding global `loading.tsx` resolves this via Suspense boundaries, letting client switches happen instantly.

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
- Build-Tour map: no tile layer by design → Uses CSS radial-gradient dark bg + GeoJSON district polygons. Lighter than Mapbox tiles, fully branded, no third-party server dependency.
- Build-Tour 100vh section design → Each section fits within one viewport fold on 13-inch MacBook (effective ~900px height). Planner uses calc(100vh-180px) with fullscreen toggle option.
- Global suspense rendering bounds for dashboard tabs. Layout fetches shared resources, individual components have granular suspension mechanisms so UI navigates smoothly.

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
- Design: Premium, elegant, high-trust. Think Blacklane/SIXT ride level. Require liquid-glass panels, smooth dynamic loading states.  
- Images: User generates images externally. Agent provides folder path, filename, dimensions, and generation prompts. Never generate images with AI tools.
- Pricing: Use LKR for new transfer products (airport, intercity, hourly). Existing packages use USD.
- No image generation by agent — provide specs for user to generate.
- If browser verification needed, ask user to send full-page screenshot instead of struggling with browser subagent.

---

## Last Session

**Date**: 2026-04-04

**What was done**:
1. Implemented auto-linking of historical and current bookings to user accounts via JWT context to `customerId` attachment rules in `api/public/booking-request/route.ts`. 
2. Hydrated user details (name, email, phone) directly onto the public facing `BookingRequestClient` layout eliminating repetitive steps for logged-in operators and users.
3. Completely redesigned the `MyBookingsClient.tsx` customer dashboard utilizing liquid-glass cards, pulling `coverImage` arrays from nested Mongoose populators so it acts as an elite showcase.
4. Corrected Dashboard UI navigation freeze by pushing a global component `layout.tsx` boundary with a rich glassmorphism `<Suspense>` fallback, guaranteeing instant perceptual clicks.
5. Remediated PayHere's sandbox behavior and missing Webhooks by using background polling in `payment/return` routes and patching the duplicate URL `order_id` parser issue.

**Current state**:
- Everything verified successfully locally.
- Pushed completely to Github `main`.
- Vercel is handling the real-time application deployment as expected.
- Ready for final public checks!

**What to do next**:
- Explore `.env` variables if production lacks fully certified keys.
- Let User execute manual QA across production.
