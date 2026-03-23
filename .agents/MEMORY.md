# MEMORY — Yatara Ceylon Project

## Mistakes
(none yet)

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
- Date filters not yet wired to API (placeholders for future use)
- "Has balance due" filter not yet wired to API (placeholder)

## Project Knowledge
- Booking model has: bookingNo, customerName, phone, email, type, packageId, totalCost, paidAmount, remainingBalance, status, dates, etc.
- Status values (from constants): NEW, CONTACTED, PAYMENT_PENDING, ADVANCE_PAID, CONFIRMED, ASSIGNED, IN_PROGRESS, COMPLETED, CANCELLED
- API endpoint: `/api/bookings?status=STATUS&search=QUERY&page=PAGE&limit=LIMIT` returns { bookings, total, page, totalPages }
- Gold color is `antique-gold` in Tailwind config
- Background is near-black (handled by layout, not component)
