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
