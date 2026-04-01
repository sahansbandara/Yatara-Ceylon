# TODO — Yatara Ceylon Bookings Page Rebuild

## Done ✓
- [x] Rebuild bookings page with DashboardHero, status tabs, KPI cards, improved filters, and pagination (2026-03-22)
- [x] Add payment void mechanism (PATCH handler) (2026-04-01)
- [x] Add CSV export for finance reports (2026-04-01)
- [x] Add booking date validation and user password strengthening (2026-04-01)

## In Progress
(none)

## Pending
(none)

## Nice-to-Haves

### Booking & Reservation
- [ ] Wire date-range filters (dateFrom/dateTo) to bookings API query — UI exists but not connected
- [ ] Wire "Has Balance Due" checkbox filter to API — state exists but filter not sent
- [ ] Duplicate booking detection (flag same customer + overlapping dates)
- [ ] Booking timeline/history stream (visual activity log per booking, beyond raw audit logs)
- [ ] Bulk status update for multiple bookings (select + batch action)

### Dashboard UX
- [ ] Column sorting on all dashboard tables (bookings, users, vehicles, partners, packages)
- [ ] Custom date-range picker for analytics dashboard (currently fixed 6-month window)
- [ ] Mobile-responsive QA pass on all dashboard pages
- [ ] Bulk selection + actions across all table views (export selected, delete selected, etc.)
- [ ] Dashboard dark/light theme toggle

### Finance & Payments
- [ ] Invoice VOID state transition after FINAL (currently no path to void a finalized invoice)
- [ ] Date-range filters on finance reporting page
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
**Date**: 2026-04-01
**What was done**:
- Created `/src/app/api/payments/[id]/route.ts` with PATCH handler for void mechanism
  - Accepts action: 'VOID'
  - Validates payment not already voided
  - Sets status to 'VOIDED' and adds voidedAt timestamp
  - Recalculates booking paidAmount and remainingBalance
  - Logs audit trail
- Updated `/src/app/api/reports/finance/route.ts`
  - Added format=csv query param support
  - Returns CSV with columns: Date, BookingNo, CustomerName, Type, Amount, Provider, Status
  - Sets proper Content-Type and Content-Disposition headers
- Updated `/src/lib/validations.ts`
  - createBookingSchema: added .refine() check that dates.from <= dates.to
  - createUserSchema: password now min 8 chars with uppercase, lowercase, number requirements
  - Added phone validation regex to phone fields in createBookingSchema, createPartnerSchema, createTicketSchema, and createUserSchema (optional)
  - Phone regex: `^\+?[\d\s\-\(\)]{7,}$` (international format support)

**Current state**:
- All 3 features implemented and validated
- Files created: `/src/app/api/payments/[id]/route.ts`
- Files modified: `/src/app/api/reports/finance/route.ts`, `/src/lib/validations.ts`

**Files changed**:
- `/src/app/api/payments/[id]/route.ts` (created)
- `/src/app/api/reports/finance/route.ts` (added CSV export)
- `/src/lib/validations.ts` (date, password, phone validation)
