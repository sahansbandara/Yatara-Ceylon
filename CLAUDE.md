# Yatara Ceylon — Agent Context

## Agent Pre-flight Checklist
**CRITICAL**: Every time before you start coding, modifying files, or debugging for a new session, you MUST read the project tracking state:
- Use `view_file` on `agent/MEMORY.md` to read the foundational changes and architecture findings.
- Use `view_file` on `agent/TODO.md` to review the previous session history and what needs to be done next.
- Use `view_file` on `agent/BRIEF.md` for the current project brief and requirements.
DO NOT begin implementing features or refactoring without checking these files first.
## Tech Stack
- **Framework**: Next.js 15 (App Router, Server Components)
- **Database**: MongoDB + Mongoose
- **Auth**: Custom JWT (`src/lib/auth.ts`)
- **Styling**: Tailwind CSS + custom design tokens
- **Deployment**: Vercel

## Architecture Rules

### Data Access — Service Layer Pattern
All database operations go through `src/services/`. **Never** import `connectDB` or Mongoose models directly in pages or components.

```
src/services/
├── package.service.ts      # Packages (list, featured, signature)
├── user.service.ts         # User management
├── fleet.service.ts        # Fleet dashboard aggregations
├── finance.service.ts      # Revenue, invoices, aging
├── analytics.service.ts    # Monthly bookings, revenue, top packages
├── hotel.service.ts        # Hotel partners, services, blocks
├── dashboard.service.ts    # Main dashboard KPIs, pipeline, activity
└── crud.service.ts         # All remaining CRUD + detail lookups
```

### Page Pattern
Pages are thin controllers — they call a Service method and pass data to components:
```tsx
import { SomeService } from '@/services/some.service';
export default async function Page() {
    const data = await SomeService.getData();
    return <ClientComponent data={data} />;
}
```

### Key Directories
```
src/app/api/          → API route handlers (backend)
src/app/(public)/     → Public pages
src/app/(public)/build-tour/_components/ → Bespoke Tour planner components
src/app/dashboard/    → Admin dashboard pages
src/models/           → Mongoose schemas (backend only)
src/services/         → Centralized DB query layer
src/lib/              → Utilities (auth, db connection, currency, rbac)
src/lib/trip/         → Tour planner store, types, and utilities
src/components/       → React UI components
scripts/              → Seed scripts and utilities
docs/                 → Project documentation
```

### Conventions
- Currency: Use `formatLKR()` from `src/lib/currency.ts`
- Serialization: Services use `JSON.parse(JSON.stringify(data))` for plain objects
- Auth: `getSessionUser()` from `src/lib/auth.ts` for session data
- RBAC: `adminOnly()` / `staffOnly()` from `src/lib/rbac.ts`
- Design: Light theme uses `bg-off-white`, `deep-emerald` text, `antique-gold` accents
- Glass effect: `bg-white/60 backdrop-blur-xl border border-deep-emerald/10`
- Role check (client): fetch `/api/auth/me` → `data.user.role`
- Roles: `ADMIN | STAFF | USER | VEHICLE_OWNER | HOTEL_OWNER`
