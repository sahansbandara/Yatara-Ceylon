# MEMORY — Yatara Ceylon Project

## Mistakes
- `transferCategoryCards` slugs must match lookups in sub-pages (e.g. slug is `'evening'`, not `'event'`)

## Patterns That Work
- DashboardHero for page headers with title and subtitle
- StatCard components for KPI displays with icon and trend
- Status pills use `status-pill` base class + variant (success/warning/danger/info/neutral/gold/purple)
- Use `liquid-glass-stat-dark` for card backgrounds and filter containers
- Use `dashboard-table-glass` for table containers
- Row hover effects use `hover:bg-white/[0.02]` for subtlety
- Pagination with page number buttons provides better UX than just prev/next
- Font choices: `font-display` for titles, `font-sans` for body text

## Dependencies & Versions
- Next.js 15 with 'use client' components
- React hooks (useState, useEffect)
- lucide-react for icons (Search, Eye, MessageSquare, ChevronLeft, ChevronRight, CalendarCheck)
- Custom components: DashboardHero, EmptyStateCard, StatCard, Input

## Architecture Decisions
- Status counts fetched separately on mount via individual API calls per status
- Summary KPIs calculated client-side from the fetched bookings array (totalRevenue, pendingBalance, avgValue)
- Status tabs act as toggleable filters—clicking active tab deselects it, clicking new tab filters to that status
- WhatsApp links constructed from phone numbers with regex to strip non-digits
- Date filters (dateFrom/dateTo) now wired to API with `dates.from` range query
- "Has balance due" filter wired: sends `hasBalanceDue=true` → API filters `remainingBalance: { $gt: 0 }`
- Column sorting via `sortBy` + `sortOrder` query params; allowed fields whitelist in API
- Bulk status updates use `/api/bookings/bulk` PATCH endpoint, capped at 50 per operation
- Duplicate booking detection is a warning (not blocking) — returns `warning` field in create response
- Invoice state machine: DRAFT → FINAL → VOID (each transition is its own code path in PATCH handler)
- Booking timeline fetches from AuditLog by entity+entityId, enriched with User names
- Analytics date range uses URL searchParams (`?months=12`), server component re-fetches on navigation
- Finance date filter uses URL searchParams (`?from=...&to=...`), server component re-fetches

## Project Knowledge
- Booking model has: bookingNo, customerName, phone, email, type, packageId, totalCost, paidAmount, remainingBalance, status, dates, etc.
- Status values (from constants): NEW, CONTACTED, PAYMENT_PENDING, ADVANCE_PAID, CONFIRMED, ASSIGNED, IN_PROGRESS, COMPLETED, CANCELLED
- API endpoint: `/api/bookings?status=STATUS&search=QUERY&page=PAGE&limit=LIMIT` returns { bookings, total, page, totalPages }
- Gold color is `antique-gold` in Tailwind config
- Background is near-black (handled by layout, not component)
- Payment model includes: status, provider, type (PAYMENT/REFUND), paidAt, voidedAt, amount, bookingId, etc.
- CSV export for finance reports uses format=csv query param; returns text/csv with proper headers
- Phone validation regex: `^\+?[\d\s\-\(\)]{7,}$` (supports international format, min 7 chars)
- Password requirements: min 8 chars, 1 uppercase, 1 lowercase, 1 number
