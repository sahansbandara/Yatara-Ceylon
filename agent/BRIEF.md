# Project Brief

## Project Name
Yatara Ceylon — Tour Operator Management System (TOMS)

## Client
- Company: Yatara Ceylon (Luxury Travel & Transfers, Sri Lanka)
- Contact: Sahan
- Institute / Module: SLIIT – IT2150 – IT Project
- Project ID: ITP_IT_101
- Budget Range: N/A (owner-developed)

## Problem
The client operates a luxury tour and transfer business in Sri Lanka but relies on scattered WhatsApp groups, spreadsheets, and manual processes for booking management, fleet coordination, partner communication, and financial tracking. There is no unified digital platform to manage the complete tour operator workflow from end to end.

## Goal
Build a comprehensive, production-grade Tour Operator Management System that handles the complete business lifecycle: customer-facing booking and tour planning, admin dashboard for operations, fleet management, partner/hotel coordination, finance tracking, and a premium public-facing website that competes with elite brands like Blacklane, SIXT ride, and Welcome Pickups.

## Primary Users
- **Tourists**: International and domestic travelers booking luxury tours and transfers in Sri Lanka
- **Admin/Staff**: Yatara Ceylon operations team managing bookings, fleet, partners, and finance
- **Vehicle Owners**: Fleet partners managing their vehicles and availability
- **Hotel Owners**: Accommodation partners managing their properties and services
- **Customers**: Registered users tracking their bookings, plans, and support tickets

## System Overview
A Next.js 15 full-stack application with MongoDB, deployed on Vercel, covering 6 functional modules managed by 6 team members:

| # | Module | Member | Focus |
|---|--------|--------|-------|
| 1 | Account Management | Nawarathna K.M.G.D.I. | Auth, RBAC, user profiles, notifications |
| 2 | Products & Content | Wasala W.A.I. | Packages, destinations, content management |
| 3 | Vehicle Fleet | Melisha L.A. | Fleet tracking, scheduling, maintenance |
| 4 | Booking & Reservations | Sanujan S. | Booking lifecycle, payments, customer flow |
| 5 | Finance Management | Luxsana U.G. | Invoicing, payments, aging, audit reports |
| 6 | Supplier & Partners | Muthubadiwila D.H.S. | Hotel/vehicle partner onboarding, services |

---

# Requirements

## Functional Requirements

### 1. Public Website (Premium)
- Home page with hero video, signature experiences, curated collections
- Destinations page (25 destinations with masonry grid + detail pages)
- Packages/Journeys page with style/duration/region filtering
- Transfers page (22 transfer products across 6 categories)
- Transfer detail pages with premium 2-column sidebar layout
- Build-Tour interactive planner with 104 curated places and map
- FAQ page with glassmorphic accordion design
- News/Blog section with article detail pages
- About page with team, brands, sustainability, and fleet sections
- Contact/Inquire page with booking form

### 2. Authentication & Authorization
- Unified login for 5 roles (Admin, Staff, User, Vehicle Owner, Hotel Owner)
- JWT-based sessions with HttpOnly cookies
- Middleware-level RBAC route protection
- Role-based dashboard redirects
- Email verification, password reset, login lockout
- Cloudflare Turnstile captcha

### 3. Dashboard System
- Command Center with KPIs, pipeline, and activity feed
- User management with search, filters, and soft delete
- Booking management with status tabs, pagination, and balance tracking
- Package/Destination CRUD with data quality alerts
- Vehicle fleet management with availability calendar
- Hotel partner management with property and service CRUD
- Finance dashboard with invoice lifecycle, payments, aging, and audit
- Support ticket system with threaded messages and email notifications
- Notification center with publish/unpublish
- Global search (⌘K) across all entities
- Archive/Restore center for soft-deleted records

### 4. Booking & Payment Flow
- Multi-step booking request form with auto-computed dates and pricing
- PayHere payment gateway integration (20% advance online)
- Multi-stage payment ledger (advance → balance → refund)
- Invoice lifecycle (Draft → Final → Void)
- Booking status workflow (PENDING → CONFIRMED → BALANCE_PENDING → FULLY_PAID)

### 5. Search Functionality
- Public search API (`/api/public/search`) for packages and destinations
- SearchModal with static quick links and live API results
- Admin global search (`/api/search`) across 6 entity types
- JourneysGrid filters synced with URL params (?style=, ?duration=, ?region=)

## Non-Functional Requirements
- Performance: page load under 3s (SSG for public pages)
- Responsive: mobile, tablet, desktop
- SEO: proper metadata, JSON-LD structured data per page
- Brand consistency: deep-emerald, antique-gold, off-white palette
- Accessibility: semantic HTML, proper heading hierarchy
- Security: CSRF protection, rate limiting, input validation

---

# Acceptance Criteria

## All Modules — COMPLETE ✅

### Account Management ✅
- [x] Unified login for 5 roles with dashboard redirects
- [x] JWT auth with HttpOnly cookies and middleware RBAC
- [x] Customer self-registration with email verification
- [x] Admin user management (create, edit, disable, soft-delete)
- [x] Profile view/edit for all roles
- [x] Notification center with publish/unpublish

### Products & Content ✅
- [x] Package CRUD with pricing, images, and itineraries
- [x] Destination CRUD with 25 seeded destinations
- [x] Public packages page with style/duration/region filtering
- [x] Public destinations page with masonry grid and detail pages
- [x] TransferPage with 22 products across 6 categories

### Vehicle Fleet ✅
- [x] Vehicle CRUD with images, specs, and assignment
- [x] Availability calendar with block/unblock
- [x] Block overlap detection and booking conflict checks
- [x] Owner-restricted fleet views

### Booking & Reservations ✅
- [x] Multi-step booking form with auto-computed dates and pricing
- [x] PayHere payment integration with webhook polling
- [x] Booking lifecycle management (status transitions)
- [x] Customer booking history on profile
- [x] Build-Tour interactive planner with save/draft

### Finance Management ✅
- [x] Invoice lifecycle (Draft/Final/Void) with auto-calculated totals
- [x] Payment ledger with advance/balance/refund tracking
- [x] Aging analysis (0-7, 8-14, 15-30, 30+ days)
- [x] Audit report generation with date ranges and CSV export
- [x] Outstanding balances with smart ranking

### Supplier & Partners ✅
- [x] Hotel partner onboarding and property management
- [x] Service CRUD with ownership checks
- [x] Partner request workflow
- [x] Inactive partner/service assignment blocking

## Public Website — COMPLETE ✅
- [x] Premium home page with hero video and curated sections
- [x] Destinations page with masonry grid and 25 detail pages
- [x] Packages page with filtering and detail pages
- [x] Transfers page with 22 products and detail pages
- [x] Build-Tour interactive planner with 104 places
- [x] FAQ page with glassmorphic accordion
- [x] News/Blog section with article pages
- [x] About page with team, brands, sustainability, fleet
- [x] Contact/Inquire page
- [x] Search modal with live API results and static quick links

## Search Functionality — COMPLETE ✅
- [x] Public search API returns packages and destinations
- [x] SearchModal static links use correct URL params (?style=)
- [x] Live search results navigate to correct pages
- [x] Admin global search across all entities
- [x] Experiences section removed from search menu

## UI Polish — COMPLETE ✅
- [x] Transfer FAQ as 2-column glassmorphic accordion
- [x] Navbar filter links sync with JourneysGrid and DestinationsPage
- [x] Transfer detail pages with liquid-glass 2-column sidebar
- [x] Bespoke Tour dropdown with real package links
- [x] All navbar links point to valid pages
- [ ] 4 "How It Works" process images generated by user (pending)

---

# Documentation

## Member Documentation (docs/yatara_member_md_files/)
All 6 member files are comprehensive and fully detailed:
1. `01-account-management-nawarathna.md` — 634 lines, 30KB
2. `02-products-content-management-wasala.md` — 710 lines, 29KB
3. `03-vehicle-fleet-management-melisha.md` — 607 lines, 25KB
4. `04-booking-reservation-management-sanujan.md` — 702 lines, 29KB
5. `05-finance-management-luxsana.md` — 662 lines, 28KB
6. `06-supplier-partner-management-muthubadiwila.md` — 682 lines, 28KB

Each file contains: member info, module overview, scope, functional requirements, CRUD operations, unique features, database design, API endpoints, UI/UX components, architecture diagrams, test cases, progress schedule, and implementation checklist.

## Technical Documentation (docs/)
- `API.md` — API endpoint reference
- `ARCHITECTURE.md` — System architecture overview
- `DESIGN-SYSTEM.md` — Design tokens and component patterns
- `FEATURES.md` — Feature list and status
- `SETUP.md` — Development environment setup guide
- `demo_script.md` — Demo walkthrough script
- `mongodb-backups.md` — Database backup procedures
- `style-contract.md` — Design style contract

---

# Risks
- Missing images: Use placeholder references, user generates images separately
- LKR pricing accuracy: Use approximate rates from user's spec, can be adjusted later
- PayHere sandbox: Webhook polling fallback ensures payment confirmation works locally

# Out of Scope
- Mobile app (separate Expo project exists but excluded from web build)
- Real-time fare calculator
- Google Maps integration (uses custom OSRM + GeoJSON instead)
- Dynamic pricing engine

# Images Needed From Client
- "How It Works" process images (4 images, 800×533px, 3:2 ratio, photorealistic luxury mood):
  - `public/images/transfers/process-1.webp` — Luxury car on scenic coastal road
  - `public/images/transfers/process-2.webp` — Hotel concierge desk with leather folio
  - `public/images/transfers/process-3.webp` — Smartphone with travel itinerary
  - `public/images/transfers/process-4.webp` — Luxury vehicle interior with lush landscape
