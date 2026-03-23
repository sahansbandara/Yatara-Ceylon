# TODO

> **Agent: Read "Last Session" FIRST before doing anything else.**

## Current Milestone
Dashboard Elite Overhaul — full admin panel redesign and operational depth upgrade

---

## In Progress
- (nothing currently in progress)

## Just Completed (2026-03-22)

### Admin Dashboard (Phase 4)
- [x] Add audit log viewer page (Phase 4 stretch)
- [x] Seeded MongoDB with users (Admin, Staff, Hotel Partner, etc.) for testing
- [x] Add Archive/Restore Center (Phase 4 stretch)
  - [x] Created `GET /api/admin/archive` — fetches all soft-deleted records across Users, Packages, Vehicles, Bookings
  - [x] Created `POST /api/admin/archive/action` — restore or permanently delete records
  - [x] Created `/dashboard/archive` page — grouped view of archived items with restore/delete actions
  - [x] Updated soft-delete API endpoints for Users, Destinations, Packages, Vehicles (set `isDeleted: true` + `deletedAt`)
  - [x] Added Archive link to `DashboardSidebar` navigation

### Transfers Page & Categories Overhaul
- [x] Redesigned `/transfers` page with new hero, trust markers, and 6 dark luxury category cards
- [x] Updated data layer (`transfers.ts`) with new `CRUISE_RAIL_VIP` category and full packages for all 6 categories
- [x] Redesigned Homepage `TransfersTeaser.tsx` with 3 flagship editorial cards + 2 landscape cards & trust pills
- [x] Created 6 dedicated dynamic-feeling category pages
- [x] Checked TypeScript build errors and resolved all component prop mismatches ✅

---

## Priority Tasks
- [ ] Add real images to transfer routes and transfer category pages (Wait on User)
- [ ] Test all transfer detail pages on mobile
- [ ] Visual QA on mobile for all dashboard pages

---

## Phase 4: Extras & Polish
- [ ] Implement Analytics/Stats on Dashboard

---

## Blocked
- [ ] Waiting for user to generate Transfer Category Images

---

## Nice to Have
- [ ] Bulk actions (publish/unpublish, archive, export)
- [ ] File/document attachments (invoices, ID copies)
- [ ] Form autosave (package editor, destination editor)
- [ ] Data validation dashboards
- [ ] Notification composer with preview panel
- [ ] WhatsApp bot integration

---

## Done
- [x] [2026-03-22] Archive/Restore Center — full soft-delete + archive UI
- [x] [2026-03-22] Admin Vehicle Calendar View
- [x] [2026-03-22] Audit Log Viewer Page + DB Seeding
- [x] [2026-03-22] Dashboard Elite Overhaul — full 4-phase rebuild
- [x] [2026-03-22] Build-Tour V3 Elite Rebuild
- [x] [2026-03-22] Transfers Premium Category Model overhaul
- [x] [2026-03-22] All previous items (see git history)

---

## Last Session

**Date**: 2026-03-22 (Session 7)
**Agent**: Antigravity
**Task**: Archive/Restore Center + Agent File Updates

**What was done**:
- Created `GET /api/admin/archive` endpoint — queries all soft-deleted records from Users, Packages, Vehicles, Bookings collections, merges and sorts by deletedAt
- Created `POST /api/admin/archive/action` endpoint — handles restore (unset isDeleted/deletedAt) and permanent delete (findByIdAndDelete) actions
- Created `/dashboard/archive` page — full admin UI with tabular view of archived items, collection badges, restore/delete buttons, loading states
- Fixed import errors: replaced `next-auth`/`getServerSession` with project's `getSessionUser` from `@/lib/auth`, replaced `dbConnect` with `connectDB` from `@/lib/mongodb`
- Replaced `sonner` toast with standard `alert()` (sonner not in project dependencies)
- Archive link was already present in DashboardSidebar from a prior session

**Files modified**:
- `src/app/api/admin/archive/route.ts` [NEW]
- `src/app/api/admin/archive/action/route.ts` [NEW]
- `src/app/dashboard/archive/page.tsx` [NEW]
- `.agent/TODO.md` — updated tasks and last session
- `.agent/MEMORY.md` — added new patterns and mistakes

**Current state**:
- Dev server running on localhost:3000
- TypeScript compilation pending (tsc was running at session end)
- All archive API routes use project's auth pattern (`getSessionUser`) and DB connection (`connectDB`)

**What to do next**:
- Implement Analytics/Stats on Dashboard
- Add real images to transfer routes (waiting on user)
- Visual QA on mobile for all dashboard pages
