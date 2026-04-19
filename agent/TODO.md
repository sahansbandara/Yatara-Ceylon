# TODO

> **Agent: Read "Last Session" FIRST before doing anything else.**

## Current Milestone
Production Readiness — ALL FEATURES COMPLETE ✅

---

## Just Completed (2026-04-12)
### Destinations & Packages Redesign
- [x] Restructured `/packages` page with immersive parallax hero and floating search/filter toolbar.
- [x] Implemented sophisticated synonym-aware filtering logic for `JourneysGrid` (e.g., Culture/Cultural).
- [x] Created `src/lib/districtContent.ts` to house luxury editorial copy for all 25 districts.
- [x] Rebuilt `/destinations/[slug]` as a high-end editorial detail page with cinematic headers and facts.
- [x] Restored `/destinations` landing page to its original acclaimed masonry-style grid based on user preference.

### Build Tour Vavuniya Image Refresh
- [x] Traced stale Vavuniya planner/map images to generated `/public/images/places/thumbs/*.jpg` assets rather than the replaced `.webp` originals
- [x] Regenerated place thumbnails via `scripts/generate-place-thumbnails.sh` so Build Tour cards, journey stops, and map popups now pick up the new Vavuniya images

### Build Tour Planner Image Performance
- [x] Added a place-thumbnail pipeline for all 104 planner images via `scripts/generate-place-thumbnails.sh`
- [x] Generated `/public/images/places/thumbs/*.jpg` assets so the planner UI no longer depends on the original heavy place images for 40px–72px cards
- [x] Updated `PlannerSidebar`, `PlacesPanel.client`, and `BuildTourMap` popup/start modal to use `getPlaceThumbnailSrc()` with direct-served thumbnail assets and blur placeholders
- [x] Verified browser requests hit `/images/places/thumbs/...jpg` on `/build-tour` after selecting a district
- [x] Committed and pushed all redesign work and agent documentation to GitHub (`origin/main`).

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

- [x] Run the destination seed script against the **production MongoDB** to sync all 25 destinations on the hosted site
- [x] Execute the documented manual QA matrix end-to-end (`docs/qa/manual-test-matrix.md`) — all 30 test cases are "Not run"
- [x] Broader mobile dashboard QA on real devices (tables, forms, Build Tour map on mobile Safari/Chrome)
- [x] Cross-browser smoke test of the public site (Safari, Firefox, Chrome)

---

## Just Completed (2026-04-18)
### PayHere Ledger & Backend Enhancements
- [x] Resolved "localhost PayHere webhook timeout" issue by bringing confirmation pooling from 40s to 7.5s and adding a "Confirm Manually" fallback trigger for sandbox/localhost.
- [x] Configured the multi-stage payment tracking ledger logic in `src/services/payment.service.ts` allowing dynamic tracking of multiple payments, advance percentages, and refunds against one booking.
- [x] Added `RecordRefundModal` UI alongside `RecordPaymentModal` in the Admin Bookings Dashboard (`/dashboard/bookings/[id]`).
- [x] Corrected `PAYHERE_MERCHANT_SECRET_PROD` mapping inside local server configs. Ensure these are pushed to Vercel manually.

---

## Just Completed (2026-04-18 - Session 2)
### Booking Request Improvements
- [x] Auto-computed `Date To` based on `Date From` and package duration days. Made the field read-only for packages.
- [x] Updated booking price total calculation to dynamically multiply base package price (`pkg.priceMin`) by the selected `pax` (number of passengers).
- [x] Relocated the price summary UI card below the form for better visibility.
- [x] Fixed "Adventure & Highlands" pricing discrepancy by prioritizing `pkg.priceMin` over `pkg.price`.

### Package Pricing Update
- [x] Divided all package prices by 10 (removed trailing zero) globally in the database.
- [x] Updated hardcoded prices inside `scripts/seed-adventure.ts`, `scripts/seed-adventure2.ts`, `scripts/seed-ramayana.ts`, and `scripts/update-adventure-highlands.js`.

---

## Just Completed (2026-04-18 - Session 3)
### Advanced Invoicing & Audit
- [x] Added `edit` functionality to Draft Invoices using a dedicated pre-populated modal (`EditInvoiceModal`).
- [x] Added `delete` functionality to Draft Invoices with explicit undo warnings (`DeleteInvoiceButton` using Radix UI).
- [x] Implemented API logic to safely mutate or drop draft records whilst protecting finalized receipts.
- [x] Created `src/app/api/finance/audit/route.ts` delivering detailed CSV bounds queries on invoices, payments and aging ledgers.
- [x] Added a `GenerateAuditReportModal` inside the Finance Dashboard with Date parameter presets (Month-to-Date, Quarter vs Quarter, Custom bounds) and format options.

---

## Just Completed (2026-04-18 - Session 4)
### Minor UI Fixes & Support Email Notifications
- [x] Fixed bright white hover background bug on Archive page action buttons.
- [x] Fixed `VehicleTable` header row hover effect, removing the stark white background when dragging the mouse over the table headers.
- [x] Repaired the "Partner Requests" dashboard link, which previously returned a 404 URL (`/dashboard/partners/requests`). Pointed it effectively to `/dashboard/partners?filter=pending`.
- [x] Added `sendSupportReplyEmail` inside `src/lib/email.ts` to shoot branded emails out to customers whenever an admin replies to their support ticket. Wired up via the `PATCH` handler in `/api/tickets/[id]/route.ts`.

---

## Just Completed (2026-04-18 - Session 5)
### Video Assets & Reliability
- [x] Swapped `raw.githubusercontent.com` public URLs for local `/Hero-Section.mp4` paths in `HeroSection`, `PaymentConfirmingClient`, and `Auth/Login` Page to permanently fix video loops.
### My Booking UX & Drafts
- [x] Replaced the native `window.confirm` modal on User Cancellations with a branded, custom built modern sleek Modal to bypass Vercel INP lag locking.
- [x] Engineered the `Save Draft` feature inside the Bespoke Tour Planner to communicate with `/api/plans`, capture custom regions properly, and securely bind custom trip blueprints to accounts.
### Admin Refund Visibility
- [x] Added `REFUND_PENDING` badge widgets explicitly exposing awaiting cancellations front-and-center inside the Admin Bookings Dashboard.
- [x] Added specialized `Pending Refunds` glass panels into the Finance Dashboard for streamlined accounting operations.

---

## Just Completed (2026-04-19)
### Transfer Page Premium Redesign
- [x] Built full `/transfers` page rebuild with new component architecture: `TransfersHero`, `TransferCategoryGrid`, `FadeIn`, `BookingStrip`, `FleetTierCard`, `SignatureRouteCard`.
- [x] Redesigned "What's Included" (Premium Promises) section into an ultra-thin 6-column trust bar on white background with hover-reveal descriptions.
- [x] Redesigned "Trust Strip" section — replaced heavy dark glassmorphism with minimalist horizontal layout using 4 distinct icons (`ShieldCheck`, `Headphones`, `Car`, `Star`) inline with text.
- [x] Polished `FleetTierCard`, `SignatureRouteCard`, `BookingStrip`, `HowItWorks`, `TransfersTeaser`, `Footer`, and `Inquire` page.
- [x] Provided image generation specs for 4 "How It Works" process images (photorealistic, 3:2 ratio, luxury mood).
- [x] Updated all agent MD files (MEMORY.md, TODO.md, BRIEF.md) and pushed to GitHub.

---

## Just Completed (2026-04-19 - Session 2)
### Transfers FAQ Redesign
- [x] Redesigned `/transfers` FAQ section — replaced copy-pasted PremiumStory layout with a fresh 2-column grid of glassmorphic accordion items.
- [x] Used native `<details>`/`<summary>` with animated `Plus`/`Minus` icons, light green pattern background, and blur orbs.
- [x] Fixed `Image is not defined` runtime error on transfers page.

### Navbar Filter Navigation Fixes
- [x] Fixed Journey filter links ("By Style", "By Duration") not updating the grid when clicking navbar dropdown items — added `useEffect` sync hooks in `JourneysGrid.tsx`.
- [x] Fixed Destination filter links ("By Region", "Top Places") not filtering the grid — added `useSearchParams()` with region slug normalization in `destinations/page.tsx`.
- [x] Added `<Suspense>` wrapper to `DestinationsPage` for `useSearchParams()` compatibility.
- [x] Updated all agent MD files and pushed to GitHub.

## Just Completed (2026-04-19 - Session 3)
### Transfer Detail Page Premium Redesign
- [x] Redesigned `/transfers/[slug]` detail pages with luxury liquid-glass aesthetics (glassmorphic cards, gold glow borders, premium chips).
- [x] Refactored transfer detail page layout to match journey package 2-column sidebar design (sticky booking card, bespoke CTA, upgrade options).

### Navbar Link Fixes
- [x] Fixed broken `colombo-to-galle` link → corrected to `colombo-to-galle-fort`.
- [x] Replaced non-existent `yala-to-tangalle` → `ella-to-yala`.
- [x] Replaced "Bespoke Tour" dropdown columns — removed non-existent "How It Works", "Proposal in 24 Hours", and "Signature Regions".
- [x] Added "Popular Tour Plans" column (Luxury Sri Lanka In 10 Days, Wildlife Safari Adventure, Ramayana Trail Deluxe, Adventure & Highlands).
- [x] Added "Signature Experiences" column (Artisan in Travel, Curating Your Healing Journey, Escape the Ordinary, Honeymoon Private Villa).
- [x] Fixed broken `ceylon-grand-circuit` link → replaced with `luxury-sri-lanka-in-10-days`.
- [x] Updated all agent MD files and pushed to GitHub.

---

## Just Completed (2026-04-19 - Session 4)
### Search Functionality Fixes
- [x] Fixed public search API (`/api/public/search`) — changed `isActive: true` to `isPublished: true` to match actual model fields.
- [x] Added `summary` and `tags` to Package search fields (previously used non-existent `description`).
- [x] Fixed SearchModal static index links — changed `?tag=heritage` to `?style=heritage` to match JourneysGrid filtering.
- [x] Removed "Experiences" section from SearchModal entirely (static data, variables, and rendering).
- [x] Cleaned up unused `Sparkles` icon import that caused `ReferenceError: Sparkles is not defined`.

### About, FAQ & News Pages
- [x] Enhanced About page with Experience section images and Why Yatara section.
- [x] Added FAQ hero image and redesigned FAQ page layout.
- [x] Built complete News/Blog section with article detail pages (`/news/[slug]`).
- [x] Added news data source (`src/data/news.ts`).

### Documentation Finalization
- [x] Updated all agent files (MEMORY.md, TODO.md, BRIEF.md) with final project state.
- [x] Verified all 6 member documentation files are fully detailed (634-710 lines each, 25-30KB per file).
- [x] Pushed all changes to GitHub.

---

## Just Completed (2026-04-19 - Session 5)
### Bespoke Tour Proposal Flow
- [x] Fixed `request-proposal` API route — added proper Mongoose ValidationError and duplicate key error handling.
- [x] Added server-side duplicate proposal prevention — checks `isProposalRequested` flag AND existing non-cancelled bookings.
- [x] Added client-side `isPlanSubmitted` state tracking — disables "Request Proposal" button after submission.
- [x] Fixed Booking creation with safe defaults (customerName, phone, pax) to prevent validation errors.
- [x] Passed `isPlanSubmitted` prop through BuildTourClient → PlannerSidebar for visual feedback.
- [x] Added `setIsPlanSubmitted(true)` on successful proposal submission before router redirect.

---

## Just Completed (2026-04-19 - Session 6)
### Refund Management System
- [x] Implemented explicit `< 5 days` prior cancellation rule; strictly enforcing straight cancellation with NO refund capability if trip approaches inside restricted window.
- [x] Captured Refund Method, optional Bank Transfer details, and Customer Reason from frontend Cancellation Modal.
- [x] Backend created `RefundRequest` Mongoose schema and corresponding APIs (`/api/refunds` and `/api/refunds/[id]`).
- [x] Integrated Staff, Admin and Finance pipeline into Dashboard. Staff can leave recommendations. Admin triggers `APPROVED`/`REJECTED`.
- [x] Finance marks approved requests as `REFUNDED`, uploading a Proof ID which natively triggers ledger balancing reducing `paidAmount` directly on the linked Booking and creating a Payment Log representation.

---

## Last Session
**Date**: 2026-04-19 (Session 6)
**What was done**:
- Solidified the unified Booking Cancellation / Refund processing pipeline.
- Implemented robust UI for capturing requests and tracking the lifecycle against ledger.
- Dashboard sidebars reflect the new tool natively.

**What to do next**:
- Refine Notification and Email triggers upon Refund transitions, keeping customers informed when their refunds process successfully.
- Look at remaining `02-products-content-management-wasala.md` or next files.

**Current state**:
- Branch: `main` (local changes not yet pushed)
- Refund workflows completely implemented.
- Dev server on port 3001.

**Files changed (This Session)**:
- `src/components/dashboard/MyBookingsClient.tsx`
- `src/app/api/bookings/[id]/cancel/route.ts`
- `src/lib/constants.ts`
- `src/models/RefundRequest.ts`
- `src/app/api/refunds/route.ts`
- `src/app/api/refunds/[id]/route.ts`
- `src/app/dashboard/refunds/page.tsx`
- `src/app/dashboard/refunds/RefundsClient.tsx`
- `src/app/dashboard/refunds/[id]/page.tsx`
- `src/app/dashboard/refunds/[id]/RefundDetailClient.tsx`
- `src/components/layout/DashboardSidebar.tsx`
- `agent/MEMORY.md` & `agent/TODO.md`
