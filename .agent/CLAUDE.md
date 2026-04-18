# Project: Yatara Ceylon

## MANDATORY AGENT RULES
**On every new session, before writing any code:**
1. Read `.agent/TODO.md` → Last Session section first
2. Read `.agent/MEMORY.md` → avoid past mistakes
3. Read `.agent/BRIEF.md` → know the requirements

**While coding, update `.agent/` files live:**
- Task started/completed → edit `.agent/TODO.md`
- Bug found/fixed → edit `.agent/MEMORY.md` → Mistakes
- Pattern discovered → edit `.agent/MEMORY.md` → Patterns
- Dependency added → edit `.agent/MEMORY.md` → Dependencies
- Session ending → edit `.agent/TODO.md` → Last Session with full handoff

**These updates are not optional. They are part of the task.**

---

## Tech Stack
- Framework: Next.js 15.1.0 (App Router) + React 19.0.0
- Styling: Tailwind CSS 3.4.17 + custom CSS variables
- Database: MongoDB with Mongoose ODM
- Hosting: Vercel (team_wwCLPcfzUbny1FsgGKcXch3G)
- Auth: JWT (jsonwebtoken + jose) + bcryptjs
- Payments: Stripe + PayHere
- State: Zustand
- Animations: Framer Motion
- Icons: Lucide React
- UI Components: Radix UI + shadcn/ui
- Maps: Leaflet + react-leaflet
- TypeScript: 5.7.3

## Brand Colors (CSS vars + Tailwind)
- `deep-emerald` — primary dark green
- `antique-gold` — accent gold
- `off-white` — background light

## Code Standards
- ES modules only
- No inline styles — Tailwind classes only
- No console.log in production
- Handle all error states (loading, error, empty)
- All colors as Tailwind custom classes (deep-emerald, antique-gold, off-white)
- Functions max ~30 lines
- Semantic HTML5
- Server Components by default, 'use client' only when needed
- Font classes: `font-display`, `font-serif`, `font-nav`

## Folder Structure
```
project-root/
├── .agents/
│   └── agent.md         ← Auto-loaded rules
├── .agent/
│   ├── CLAUDE.md        ← This file (project config)
│   ├── TODO.md          ← Tasks + handoff state
│   ├── MEMORY.md        ← Mistakes + patterns + knowledge
│   └── BRIEF.md         ← Requirements + acceptance criteria
├── CLAUDE.md            ← Auto-loaded by Claude Code
├── src/
│   ├── app/
│   │   ├── (public)/    ← Public pages (transfers, packages, etc.)
│   │   ├── dashboard/   ← Admin panel (auth-protected)
│   │   ├── api/         ← API routes
│   │   └── auth/        ← Auth pages
│   ├── components/
│   │   ├── public/      ← Client components for public pages
│   │   │   └── transfers/ ← Transfer-specific components
│   │   ├── dashboard/   ← Admin components
│   │   ├── layout/      ← Layout components
│   │   └── ui/          ← Radix/shadcn components
│   ├── data/            ← Static data (transfers.ts, destinations.ts)
│   ├── models/          ← Mongoose schemas (25+ models)
│   ├── lib/             ← Utils (mongodb, auth, validations, stripe)
│   └── types/           ← TypeScript type definitions
├── public/
│   └── images/
│       └── transfers/   ← Transfer route/fleet images
├── .env                 ← NEVER commit
└── package.json
```

## Key Routes
- `/transfers` → Transfer landing page (static data from src/data/transfers.ts)
- `/transfers/[category]` → Category detail page
- `/transfers/[category]/[slug]` → Transfer package detail page
- `/packages` → Journeys page (dynamic from MongoDB)
- `/packages/[slug]` → Journey detail page
- `/dashboard/packages` → Admin package management
- `/dashboard/archive` → Archive/Restore Center for soft-deleted records
- `/dashboard/audit-logs` → Audit log viewer

## Data Architecture
- **Transfers**: Static data in `src/data/transfers.ts` (categories, packages, routes, fleet tiers)
- **Journeys/Packages**: Dynamic MongoDB via `src/models/Package.ts` (type: 'journey')
- **Separation rule**: Transfers and Journeys are DISTINCT product types. Never mix them.
