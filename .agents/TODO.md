# TODO — Yatara Ceylon Bookings Page Rebuild

## Done ✓
- [x] Rebuild bookings page with DashboardHero, status tabs, KPI cards, improved filters, and pagination (2026-03-22)
- [x] Add payment void mechanism (PATCH handler) (2026-04-01)
- [x] Add CSV export for finance reports (2026-04-01)
- [x] Add booking date validation and user password strengthening (2026-04-01)
- [x] Wire date-range filters (dateFrom/dateTo) to bookings API + frontend (2026-04-02)
- [x] Wire "Has Balance Due" checkbox filter to bookings API (2026-04-02)
- [x] Invoice VOID state transition: FINAL → VOID with reason + audit log (2026-04-02)
- [x] Column sorting on bookings table (8 sortable columns, API + UI) (2026-04-02)
- [x] Duplicate booking detection on create (same customer + overlapping dates warning) (2026-04-02)
- [x] Analytics custom date-range picker (3M/6M/12M/24M selector) (2026-04-02)
- [x] Date-range filters on finance reporting dashboard (from/to with Apply/Clear) (2026-04-02)
- [x] Booking activity timeline (audit log stream per booking with actor names) (2026-04-02)
- [x] Bulk status updates for bookings (checkbox select + batch status change, max 50) (2026-04-02)

## In Progress
(none)

## Pending
(none)

## Nice-to-Haves

### Booking & Reservation
- [x] Wire date-range filters (dateFrom/dateTo) to bookings API query (2026-04-02)
- [x] Wire "Has Balance Due" checkbox filter to API (2026-04-02)
- [x] Duplicate booking detection (flag same customer + overlapping dates) (2026-04-02)
- [x] Booking timeline/history stream (visual activity log per booking) (2026-04-02)
- [x] Bulk status update for multiple bookings (select + batch action) (2026-04-02)

### Dashboard UX
- [x] Column sorting on bookings table (2026-04-02)
- [x] Custom date-range picker for analytics dashboard (2026-04-02)
- [ ] Mobile-responsive QA pass on all dashboard pages
- [ ] Bulk selection + actions across all table views (export selected, delete selected, etc.)
- [ ] Dashboard dark/light theme toggle

### Finance & Payments
- [x] Invoice VOID state transition after FINAL (2026-04-02)
- [x] Date-range filters on finance reporting page (2026-04-02)
- [ ] Automated overdue payment reminders (email/notification when aging > threshold)
- [ ] Payment receipt email auto-send on payment recording
- [ ] Multi-currency support for international bookings

### Notifications & Communication
- [ ] Email delivery for notifications (currently created in DB but not sent)
- [ ] Push notification support (browser / mobile)
- [ ] WhatsApp API integration for booking confirmations and status updates
- [ ] Automated booking confirmation email on status change to CONFIRMED
- [ ] SMS fallback for critical notifications

### Security & Auth
- [ ] 2FA / MFA for ADMIN and STAFF roles
- [ ] Session management UI (view active sessions, force logout)
- [ ] Login activity log visible to users (last login, device, IP)
- [ ] OAuth social login (Google) for customer accounts

### Reporting & Analytics
- [ ] Exportable analytics dashboard (PDF/PNG download of charts)
- [ ] Custom report builder (pick metrics, date range, group-by dimensions)
- [ ] Booking conversion funnel (NEW → CONFIRMED drop-off analysis)
- [ ] Partner performance reports (ratings, assignment frequency, revenue generated)
- [ ] Vehicle utilization reports (occupancy rate, revenue per vehicle per month)

### Public Website
- [ ] Blog/content management system (CRUD for blog posts from dashboard)
- [ ] Customer review submission and moderation flow
- [ ] Multi-language support (Sinhala, Tamil, Japanese, Chinese for key markets)
- [ ] SEO metadata management from dashboard (per-page title, description, OG tags)
- [ ] Progressive Web App (PWA) support for offline tour plan access

### Integrations
- [ ] Google Calendar sync for booking schedules (staff + vehicle owners)
- [ ] Accounting software export (QuickBooks / Xero compatible format)
- [ ] TripAdvisor / Google Reviews widget integration
- [ ] Automated backup system with restore capability

## Last Session
**Date**: 2026-04-02
**What was done**:
- Wired date-range filters (dateFrom/dateTo) + "Has Balance Due" filter to bookings API and frontend
- Added Invoice VOID state transition (FINAL → VOID) with reason and audit logging
- Created VoidInvoiceButton component for booking detail page
- Added column sorting to bookings table (8 sortable fields, API sortBy/sortOrder params)
- Added duplicate booking detection on POST /api/bookings (warns if same customer + overlapping dates)
- Created analytics date-range picker (3M/6M/12M/24M) with URL-param-driven server component
- Created finance date-range filter (from/to date inputs with Apply/Clear)
- Created booking activity timeline API (GET /api/bookings/[id]/timeline) with actor enrichment
- Created BookingTimeline component (visual audit log stream per booking)
- Created bulk status update API (PATCH /api/bookings/bulk, max 50 per op)
- Added checkbox selection + bulk action bar to bookings table

**What to do next**: Column sorting on remaining tables (users, vehicles, partners, packages), mobile QA

**Current state**:
- All 9 Tier 1+2 nice-to-have features implemented and type-checked
- No new TS errors introduced (verified via tsc --noEmit)

**Files changed**:
- `/src/app/api/bookings/route.ts` (dateFrom, dateTo, hasBalanceDue, sortBy, sortOrder params + duplicate detection)
- `/src/app/api/bookings/bulk/route.ts` (created — bulk PATCH)
- `/src/app/api/bookings/[id]/timeline/route.ts` (created — audit timeline)
- `/src/app/api/invoices/[id]/route.ts` (added FINAL → VOID transition)
- `/src/app/dashboard/bookings/page.tsx` (sorting, bulk select, filter wiring)
- `/src/app/dashboard/bookings/[id]/page.tsx` (VoidInvoiceButton, BookingTimeline)
- `/src/app/dashboard/analytics/page.tsx` (custom months range, AnalyticsDateFilter)
- `/src/app/dashboard/finance/page.tsx` (date filter params, FinanceDateFilter)
- `/src/components/dashboard/finance/VoidInvoiceButton.tsx` (created)
- `/src/components/dashboard/finance/FinanceDateFilter.tsx` (created)
- `/src/components/dashboard/analytics/AnalyticsDateFilter.tsx` (created)
- `/src/components/dashboard/bookings/BookingTimeline.tsx` (created)
