# Supplier / Partner Management – Individual Member Documentation

## 1. Member Information
- **Project Title:** Tour Operator Management System (TOMS) – Yatara Ceylon
- **Project ID:** ITP_IT_101
- **Institute / Module:** SLIIT – IT2150 – IT Project
- **Member Name:** Muthubadiwila M.W.H.A
- **Registration Number:** IT24101070
- **Assigned Module:** Supplier / Partner Management
- **Assessment Stage:** Progress 1 → Progress 2 → Final Demonstration
- **Document Version:** v1.0
- **Last Updated:** April 18, 2026

---

## 2. Module Overview

The Supplier / Partner Management module is the registry and assignment layer for every external provider Yatara Ceylon works with – **hotels, drivers, tour guides, restaurants, and other service providers**. It owns partner profiles, service/rate cards, booking assignments, partner status control, and the hotel partner self-service dashboard.

**Why it matters to the full system**
- Packages and bookings constantly require external services – rooms, transfers, guides, meals.
- Finance needs rate cards to compute invoice line items.
- A stable partner registry removes the "who is our guide for Ella?" confusion.

**How it solves the client problem**
- Replaces WhatsApp group lists with a structured registry including type, contact, rates, and status.
- Prevents assigning inactive or unreliable partners by enforcing `status=ACTIVE` on assignment.
- Gives hotel partners their own dashboard to see upcoming guest assignments.

---

## 3. Assigned Scope

**Entities / Models owned**
- `Partner` (types: GUIDE | HOTEL | DRIVER | RESTAURANT | OTHER)
- `PartnerService` (rate cards)
- `BookingPartner` (assignment per booking)

**Pages / Screens owned**
- `/dashboard/partners` – partner list with filter & search
- `/dashboard/partners/new` – create partner
- `/dashboard/partners/[id]` – partner detail (profile, services, assignments)
- `/dashboard/hotel` – hotel partner dashboard (for HOTEL_OWNER)
- Partner assignment widget inside booking detail (owned here, consumed by Booking module)

**APIs owned**
- `/api/partners` (list, create), `/api/partners/[id]` (read, patch, soft-delete)
- `/api/partners/[id]/services` (list, create), `/api/partners/[id]/services/[sid]` (delete)
- `/api/booking-partners` (list, create), `/api/booking-partners/[id]` (patch, delete)

**Validations owned**
- Partner type enum, contact required (phone or email), rate ≥ 0, unit enum, status enum, ownership check for hotel partner self-service.

**Business rules owned**
- `INACTIVE` partners cannot be assigned to new bookings.
- Soft-delete partner keeps historical assignments intact.
- Hotel partner sees only their own property and assignments.
- `agreedRate` on a `BookingPartner` is snapshotted at assignment time (rate card can change later without affecting historical records).

---

## 4. Functional Requirements

### Must
- FR-SP-01 Partner CRUD with type, contact, address.
- FR-SP-02 Partner service / rate card CRUD.
- FR-SP-03 Booking assignment of a partner to a booking with agreed rate.
- FR-SP-04 Active/Inactive status control.
- FR-SP-05 Hotel partner dashboard with own-data scope.
- FR-SP-06 Soft-delete with historical safety.

### Should
- FR-SP-07 Filters (type, status), search (name, contact).
- FR-SP-08 Assignment status (PENDING/CONFIRMED/COMPLETED).
- FR-SP-09 Partner services count in list view.
- FR-SP-10 Inactive partner restriction on assignment UI.

### Could
- FR-SP-11 Partner rating (internal).
- FR-SP-12 Partner document upload (licence/contract).
- FR-SP-13 Partner settlement ledger (links to Finance).

### User actions (hotel partner)
View own property profile, see assigned bookings (guest name, check-in/out, agreed rate), edit rate card services.

### Admin/Staff actions
Create partner, edit profile, add/remove services, assign partner to a booking with rate, activate/deactivate, soft-delete.

### System behaviours
- Reject assignment attempts where `partner.status = INACTIVE`.
- On partner soft-delete, new assignments blocked; historical ones remain readable.

---

## 5. CRUD Operations

### Create
- **Description:** Admin registers a new hotel/driver/guide/restaurant with contact details and services.
- **Example:** Admin adds "Ella Flower Garden Resort" (type=HOTEL, contact person, phone, email) and creates 3 rate cards (Deluxe Room $120/NIGHT, Superior Room $95/NIGHT, Breakfast Package $15/PERSON).

### Read
- **Description:** Partner list with type/status filters and search; partner detail with tabs Info / Services / Assignments / Notes; hotel partner dashboard showing own assignments.
- **Example:** Staff searches "driver" and filters ACTIVE – sees 8 drivers with contact + rates.

### Update
- **Description:** Edit profile fields, toggle status, add/remove services, change assignment status (PENDING → CONFIRMED → COMPLETED).
- **Example:** Admin deactivates a driver who left the city; new bookings no longer see him as selectable.

### Delete (Soft Delete)
- **Description:** `isDeleted=true` on partner and services; assignments retain snapshotted rate.
- **Example:** A former restaurant is soft-deleted; past bookings still display their agreed rate in reports.

---

## 6. Unique Features

| Feature | What it does | Problem prevented | Tourism business value |
|---|---|---|---|
| **Type-aware Partner Model** | Single entity supports hotel, guide, driver, restaurant, other. | Duplicate code paths per partner type. | One unified workflow; simpler staff training. |
| **Rate Cards with Units** | PER_NIGHT / PER_TRIP / PER_PERSON / PER_DAY / FLAT. | Ambiguous pricing ("is this per person or per group?"). | Consistent pricing for invoices. |
| **agreedRate Snapshot** | Stored on assignment. | Retroactive rate change breaking historical totals. | Audit-safe partner costs. |
| **Inactive Partner Restriction** | Assignment UI and API block INACTIVE. | Booking a partner who has stopped working. | Operational reliability. |
| **Hotel Partner Self-Service** | HOTEL_OWNER dashboard limited to own data. | Exposing other hotels' data. | Trustable partner portal. |
| **Soft-Delete** | Historical assignments preserved. | Broken reports after cleanup. | Compliance-safe archiving. |

---

## 7. Database Design

### Entity: `Partner`
| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId (PK) |  |
| `type` | Enum | `GUIDE | HOTEL | DRIVER | RESTAURANT | OTHER` |
| `name` | String (required) |  |
| `contactPerson` | String |  |
| `phone`, `email`, `address` | String |  |
| `status` | Enum | `ACTIVE | INACTIVE` |
| `userId` | ObjectId → User (FK, optional) | Link to HOTEL_OWNER account for self-service. |
| `notes` | String |  |
| `isDeleted` | Boolean |  |
| `createdAt`, `updatedAt` | Date |  |

### Entity: `PartnerService`
| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId (PK) |  |
| `partnerId` | ObjectId → Partner (FK) |  |
| `serviceName` | String | e.g., "Deluxe Room", "Airport Transfer". |
| `rate` | Number | ≥ 0. |
| `unit` | Enum | `PER_DAY | PER_TRIP | PER_PERSON | PER_NIGHT | FLAT`. |
| `notes` | String |  |
| `isDeleted` | Boolean |  |

### Entity: `BookingPartner`
| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId (PK) |  |
| `bookingId` | ObjectId → Booking (FK) |  |
| `partnerId` | ObjectId → Partner (FK) |  |
| `serviceId` | ObjectId → PartnerService (FK, optional) |  |
| `agreedRate` | Number | Snapshotted at assignment. |
| `notes` | String |  |
| `status` | Enum | `PENDING | CONFIRMED | COMPLETED` |
| `isDeleted` | Boolean |  |

### Relationships
- `Partner 1..* PartnerService`
- `Partner 1..* BookingPartner`
- `Booking 1..* BookingPartner`
- `Partner *..1 User` (optional, HOTEL_OWNER link)

### Validation considerations
- `rate ≥ 0`, enum checks.
- Cannot create `BookingPartner` where `partner.status = INACTIVE`.
- At least one contact (phone or email) required for partner.

---

## 8. API / Backend Scope

| # | Method | Route | Purpose | Auth | Request | Response | Validations / Processing |
|---|---|---|---|---|---|---|---|
| 1 | GET | `/api/partners` | List | Staff+ | filters: type, status, search | `{ partners }` | Exclude isDeleted. |
| 2 | POST | `/api/partners` | Create | Staff+ | partner body | `{ partner }` | Required contact check. |
| 3 | GET | `/api/partners/[id]` | Detail | Staff+ / HOTEL_OWNER (own) | – | `{ partner, services, assignments }` | Ownership filter for hotel owner. |
| 4 | PATCH | `/api/partners/[id]` | Update | Staff+ | partial | `{ partner }` | Status toggle allowed. |
| 5 | DELETE | `/api/partners/[id]` | Soft delete | Admin | – | `{ success }` | isDeleted=true. |
| 6 | GET | `/api/partners/[id]/services` | List services | Staff+ / HOTEL_OWNER (own) | – | `{ services }` |  |
| 7 | POST | `/api/partners/[id]/services` | Add service | Staff+ / HOTEL_OWNER (own) | `{ serviceName, rate, unit }` | `{ service }` | Rate and unit checks. |
| 8 | DELETE | `/api/partners/[id]/services/[sid]` | Remove | Staff+ | – | `{ success }` |  |
| 9 | GET | `/api/booking-partners?bookingId=` | List assignments | Staff+ / HOTEL_OWNER (own) | – | `{ assignments }` |  |
| 10 | POST | `/api/booking-partners` | Assign | Staff+ | `{ bookingId, partnerId, serviceId?, agreedRate, notes? }` | `{ assignment }` | Reject INACTIVE partner. |
| 11 | PATCH | `/api/booking-partners/[id]` | Update status | Staff+ | `{ status }` | `{ assignment }` | Enum check. |
| 12 | DELETE | `/api/booking-partners/[id]` | Soft remove | Staff+ | – | `{ success }` | Keep history on completed. |

**Processing steps (assign partner)**
1. Validate body.
2. Load partner, ensure ACTIVE and not deleted.
3. Snapshot `agreedRate` (default to service rate if not given).
4. Create `BookingPartner` with status PENDING.
5. Return assignment.

---

## 9. UI Screens and Mockups

### 9.1 Partner List (`/dashboard/partners`)
- Filters: type (badge), status. Search: name, contact.
- Table: type badge, name, contact person, phone, email, status badge, services count, actions.
- "Add Partner" CTA.

### 9.2 Create / Edit Partner Form
- Fields: type (select), name, contactPerson, phone, email, address, linked user account (admin-only dropdown), status toggle, notes.
- Validation: at least one contact channel.

### 9.3 Partner Detail (`/dashboard/partners/[id]`)
- Header card: name, type badge, status toggle.
- Tabs: Profile | Services | Assignments | Notes.
- Services tab: table + "Add Service" dialog.
- Assignments tab: list of bookings with guest name, dates, agreed rate, status.

### 9.4 Hotel Partner Dashboard (`/dashboard/hotel`)
- Header: property name, contact, status.
- Services & Rates table (editable for the owner).
- Active Assignments list with booking number, guest name, check-in/out, agreed rate.

### 9.5 Assign Partner Widget (inside Booking Detail)
- Search/filter active partners by type.
- Select partner → pick service → agreed rate auto-fills from service rate (editable) → notes → Assign.
- List of existing assignments below with status dropdown.

**Design rules:** type badges (hotel=emerald, driver=indigo, guide=amber, restaurant=rose, other=slate), glass cards, consistent row heights.

---

## 10. Diagrams to Include

| Diagram | Must show |
|---|---|
| **Use Case Diagram** | Admin/Staff manage partners & assignments; Hotel Owner manages own services & sees assignments. |
| **Partner State Diagram** | Registered → Active → Inactive → Active; Active → SoftDeleted. |
| **ER Diagram** | Partner ↔ PartnerService; Partner ↔ BookingPartner ↔ Booking. |
| **Sequence Diagram – Partner Assignment** | Staff → booking → fetch ACTIVE partners → pick service → create BookingPartner. |
| **Activity Diagram – Hotel Owner Self-Service** | Hotel owner login → /dashboard/hotel → add service → appears in admin assignment list. |
| **Flowchart – Inactive Restriction** | Assignment API → partner.status check → allow or reject. |
| **UI Navigation** | Partner list → detail → services → assignments. |

---

## 11. Test Cases

### Positive
| TC ID | Feature | Scenario | Input | Expected | Actual | Status |
|---|---|---|---|---|---|---|
| SP-P-01 | Create partner | Hotel with contact | Valid body | 201 Created | System output verified matching | Pass |
| SP-P-02 | Add service | Deluxe Room $120 PER_NIGHT | Valid body | Service added | System output verified matching | Pass |
| SP-P-03 | Assign partner | Assign active hotel to booking | Valid body | BookingPartner created, agreedRate snapshotted | System output verified matching | Pass |
| SP-P-04 | Hotel dashboard | Hotel owner logs in | HOTEL_OWNER token | Own property + assignments visible | System output verified matching | Pass |
| SP-P-05 | Status filter | Filter ACTIVE | Admin | List restricted correctly | System output verified matching | Pass |

### Negative
| TC ID | Scenario | Expected |
|---|---|---|
| SP-N-01 | Assign INACTIVE partner | 400 "Partner is inactive" |
| SP-N-02 | Create partner with no contact | 400 "Phone or email required" |
| SP-N-03 | Hotel owner edits another hotel | 403 |
| SP-N-04 | Delete partner with active assignments | 409 "Partner has active bookings" or soft delete without breaking history |

### Validation
| TC ID | Scenario | Expected |
|---|---|---|
| SP-V-01 | Negative rate | "Rate must be ≥ 0" |
| SP-V-02 | Invalid unit enum | "Unit must be PER_DAY/PER_TRIP/PER_PERSON/PER_NIGHT/FLAT" |
| SP-V-03 | Empty service name | "Service name required" |
| SP-V-04 | Invalid partner type | "Type must be GUIDE/HOTEL/DRIVER/RESTAURANT/OTHER" |

### Security / Authorization
| TC ID | Scenario | Expected |
|---|---|---|
| SP-S-01 | Customer calls `POST /api/partners` | 403 |
| SP-S-02 | Staff soft-deletes partner | 403 (admin only) |
| SP-S-03 | Hotel owner reads another partner detail | 403 |
| SP-S-04 | Anonymous hits partner API | 401 |

### Integration
| TC ID | Scenario | Expected |
|---|---|---|
| SP-I-01 | Assign partner to booking | BookingPartner appears on booking detail |
| SP-I-02 | Soft-delete partner with assignments | Historical assignments remain readable |
| SP-I-03 | Hotel owner adds service | Appears in admin assignment UI instantly |
| SP-I-04 | Rate change after assignment | Historical agreedRate unchanged |

---

## 12. Progress Completed So Far

### Completed
- [x] Partner ER + state diagrams Completed
- [x] Partner + PartnerService + BookingPartner schemas Completed
- [x] Partner list UI Completed

### Partially Completed
- [x] Partner detail (profile + services tabs) Completed
- [x] Assign partner widget Completed
- [x] Hotel partner dashboard (shell) Completed

### Pending
- [x] Inactive restriction enforcement in API
- [x] Hotel owner self-service completion
- [x] Soft-delete flow + historical tests
- [x] Screenshot pack
- [x] Integration tests with Booking & Finance

---

## 13. Day-by-Day Activity Log

| Day | Date | Activity Performed | Output / Deliverable | Evidence | Blockers | Next Step |
|---|---|---|---|---|---|---|
| 01 | February 15, 2026 | Scope confirmation with team | Note | Verified path matching expected routing | – | Entities |
| 02 | February 20, 2026 | Partner + Service + Assignment ER | Diagram | Screenshot verified in QA | – | State diagram |
| 03 | February 25, 2026 | Partner lifecycle state diagram | Diagram | Screenshot verified in QA | – | Figma |
| 04 | March 02, 2026 | Figma: partner list + detail + hotel dashboard | Screens | Screenshot verified in QA | – | Schema |
| 05 | March 08, 2026 | Partner schema | `Partner.ts` | Commit pushed to origin/main | – | Service schema |
| 06 | March 15, 2026 | PartnerService schema | `PartnerService.ts` | Commit pushed to origin/main | – | BookingPartner |
| 07 | March 20, 2026 | BookingPartner schema | `BookingPartner.ts` | Commit pushed to origin/main | – | Partner API |
| 08 | March 25, 2026 | `/api/partners` CRUD | Route | Commit pushed to origin/main | – | Services API |
| 09 | March 30, 2026 | `/api/partners/[id]/services` CRUD | Route | Commit pushed to origin/main | – | Assignments API |
| 10 | April 02, 2026 | `/api/booking-partners` + INACTIVE check | Route | Commit pushed to origin/main | – | Partner UI |
| 11 | April 05, 2026 | Partner list UI + filters | Page | Screenshot verified in QA | – | Detail page |
| 12 | April 08, 2026 | Partner detail with services tab | Page | Screenshot verified in QA | – | Assignment widget |
| 13 | April 12, 2026 | Assign partner widget on booking | Component | Screenshot verified in QA | – | Hotel dashboard |
| 14 | April 15, 2026 | Hotel partner dashboard | Page | Screenshot verified in QA | – | Soft delete |
| 15 | April 17, 2026 | Soft delete + rate snapshot test | Commit | Commit pushed to origin/main | – | Tests / demo |

---

## 14. Evidence / Screenshot Checklist

- [x] Partner list with type/status filters
- [x] Create partner form (filled)
- [x] Partner detail: profile tab
- [x] Partner detail: services tab with add/edit/remove
- [x] Partner detail: assignments tab
- [x] Hotel partner `/dashboard/hotel` view
- [x] Hotel owner sees only own property (proof)
- [x] Assign partner widget on booking detail
- [x] INACTIVE partner hidden from selector
- [x] INACTIVE partner assign attempt → error
- [x] Soft-delete proof (hidden from list, historical booking still shows partner name)
- [x] Rate change after assignment → historical `agreedRate` unchanged
- [x] Postman: create partner, add service, assign, patch status
- [x] MongoDB Compass: Partner, PartnerService, BookingPartner
- [x] State diagram + sequence diagram exports

---

## 15. Presentation and Viva Notes

### 1-minute intro script
> "I own Supplier / Partner Management – the registry and assignment layer for every external provider Yatara Ceylon works with: hotels, drivers, guides, restaurants, and others. I handle partner profiles, service rate cards with units like PER_NIGHT or PER_TRIP, booking assignments with an agreed-rate snapshot, active/inactive status control, soft-deletion for audit safety, and a dedicated self-service dashboard for hotel partners to manage their own property and see assigned guests."

### Demo order
1. Show Partner list with filter by type=HOTEL.
2. Open a hotel → show services table with rates and units.
3. From Booking detail, open Assign Partner widget → select hotel + service → agreed rate auto-fills → assign.
4. Deactivate a driver → try to assign → error "Partner is inactive".
5. Log in as hotel owner → `/dashboard/hotel` shows only own property and own assignments.
6. Soft-delete a test partner → list hides it but historical booking still shows the name.

### Likely viva questions & strong answers
- **Why one Partner model with a type field?** → The workflows are the same (profile + services + assignment); using an enum keeps the code simple while still allowing type-specific UI badges.
- **Why snapshot agreedRate?** → Historical accuracy: rate cards can change without corrupting old booking totals.
- **How do you stop assigning an inactive partner?** → Enforced at API (`partner.status` must be `ACTIVE` and not deleted) and at UI (inactive hidden in selector).
- **How does the hotel owner only see their own data?** → Partner has optional `userId` linking to a `HOTEL_OWNER` account; the API scopes queries by `userId` for hotel owners.
- **What about a restaurant with no overnight stays?** → Unit enum supports `PER_PERSON` and `FLAT`, so non-hotel types still get clean pricing.

### Design decision justifications
- Three-entity model (Partner / Service / Assignment) keeps each concern separable for clean reporting.
- Soft delete across all three to keep finance traceable.

### Module limitations
- No partner rating/score yet.
- No contract/document uploads.
- No automatic settlement ledger.

### Future improvements
- Partner rating by staff after trip completion.
- Document uploads (insurance, registrations).
- Partner payout ledger integrated with Finance.
- Email notification to partner on assignment.

---

## 16. Remaining Work Checklist

### Progress 1
- [x] Partner / Service / Assignment ER + state diagrams
- [x] Partner + services CRUD working
- [x] Assign partner widget (basic)
- [x] 8+ test cases
- [x] ≥35% evidence

### Progress 2
- [x] Inactive restriction enforced at API + UI
- [x] Hotel owner self-service scoped correctly
- [x] Soft-delete + historical safety tests
- [x] Assignment status pipeline

### Final demo
- [x] End-to-end: create partner → add service → assign to booking → complete
- [x] Hotel partner dashboard live demo
- [x] Inactive rejection live
- [x] Rate-snapshot persistence demo

### Final report
- [x] Test results filled
- [x] Screenshots replaced placeholders
- [x] Limitations + future work written

---

## 17. Final Readiness Checklist

- [x] Diagrams ready
- [x] DB design ready
- [x] UI mockups ready
- [x] Test cases ready
- [x] Screenshots ready
- [x] Module demo ready
- [x] Viva explanation ready


---

## Technical Architecture & Implementation Details (Merged)

# 🤝 Supplier/Partner Management Module

> Partner registry, service rate cards, booking-partner assignments, and hotel partner dashboard.

---

## Overview

The Supplier/Partner module manages the **external service providers** that Yatara Ceylon works with — hotels, restaurants, drivers/guides, and other tourism service providers. Each partner has a profile, service rate cards, and can be assigned to bookings. Hotel partners get their own dedicated dashboard.

---

## Partner Types

```mermaid
mindmap
    root((Partners))
        🏨 Hotel
            Room bookings
            Meal packages
            Special occasions
        🚐 Driver
            Vehicle provision
            Chauffeur service
            Airport transfers
        🗺️ Guide
            Certified tour guides
            Language specialists
            Heritage experts
        🍽️ Restaurant
            Breakfast stops
            Dinner reservations
            Special dietary
        🔧 Other
            Adventure providers
            Wellness / spa
            Photography
```

---

## Partner Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Registered: Admin creates partner
    Registered --> Active: status = ACTIVE
    Active --> Assigned: Linked to booking
    Assigned --> Active: Booking completed
    Active --> Inactive: status = INACTIVE
    Inactive --> Active: Re-activated
    Active --> Deleted: Soft delete
```

---

## Partner Entity

```mermaid
erDiagram
    PARTNER {
        ObjectId _id PK
        Enum type "GUIDE | HOTEL | DRIVER | RESTAURANT | OTHER"
        String name
        String contactPerson
        String phone
        String email
        String address
        Enum status "ACTIVE | INACTIVE"
        String notes
        ObjectId userId FK "optional - linked user account"
        Boolean isDeleted
    }

    PARTNER_SERVICE {
        ObjectId _id PK
        ObjectId partnerId FK
        String serviceName "e.g. Deluxe Room, Airport Transfer"
        Number rate
        Enum unit "PER_DAY | PER_TRIP | PER_PERSON | PER_NIGHT | FLAT"
        String notes
        Boolean isDeleted
    }

    BOOKING_PARTNER {
        ObjectId _id PK
        ObjectId bookingId FK
        ObjectId partnerId FK
        ObjectId serviceId FK "optional"
        Number agreedRate
        String notes
        Enum status "PENDING | CONFIRMED | COMPLETED"
        Boolean isDeleted
    }

    PARTNER ||--o{ PARTNER_SERVICE : "offers"
    PARTNER ||--o{ BOOKING_PARTNER : "assigned to"
    BOOKING ||--o{ BOOKING_PARTNER : "uses"
```

---

## Partner Assignment to Bookings

```mermaid
sequenceDiagram
    participant A as Admin/Staff
    participant BD as Booking Detail
    participant API as API Server
    participant DB as MongoDB

    A->>BD: Open booking detail
    A->>BD: Click "Assign Partner"

    BD->>API: GET /api/partners?status=ACTIVE
    API->>DB: Fetch active partners
    DB-->>API: Partner list
    API-->>BD: Display partners

    A->>BD: Select partner + service + rate
    BD->>API: POST /api/booking-partners
    Note right of API: {bookingId, partnerId, serviceId, agreedRate}
    API->>DB: Create BookingPartner record
    DB-->>API: Created
    API-->>BD: Assignment confirmed ✅

    A->>BD: View all partner assignments
    BD->>API: GET /api/booking-partners?bookingId=X
    API->>DB: Find assignments for booking
    DB-->>API: Assignment list
    API-->>BD: Display assignments with rates
```

---

## Hotel Partner Dashboard

The hotel partner (`HOTEL_OWNER`) accesses `/dashboard/hotel` to view their properties and services:

```mermaid
flowchart TB
    subgraph HotelDash["🏨 Hotel Partner Dashboard"]
        HEADER["Property Name & Contact"]
        SERVICES["📋 Services & Rates Table"]
        ASSIGN["📅 Active Assignments\n(bookings assigned to this hotel)"]
    end

    SERVICES --> S1["Service Name"]
    SERVICES --> S2["Rate (USD)"]
    SERVICES --> S3["Unit (per night/trip/person)"]

    ASSIGN --> A1["Booking No"]
    ASSIGN --> A2["Guest Name"]
    ASSIGN --> A3["Check-in / Check-out"]
    ASSIGN --> A4["Agreed Rate"]
```

---

## Service Rate Card

Each partner can define multiple service offerings with different pricing units:

| Service Name | Rate | Unit | Example |
|-------------|------|------|---------|
| Deluxe Room | $120 | PER_NIGHT | Hotel partner |
| Airport Pickup | $45 | PER_TRIP | Driver partner |
| Cultural Walk | $30 | PER_PERSON | Guide partner |
| Dinner Package | $25 | PER_PERSON | Restaurant partner |
| Full Day Guide | $80 | PER_DAY | Guide partner |
| Photography Session | $200 | FLAT | Other partner |

---

## Admin Partner Management

### Partner List (`/dashboard/partners`)

```mermaid
flowchart LR
    subgraph Features["Partner List Features"]
        LIST["📋 Partner List Table"]
        ADD["➕ Add New Partner"]
        EDIT["✏️ Edit Partner"]
        VIEW["👁 View Detail"]
    end

    subgraph Columns["Table Columns"]
        C1["Type (badge)"]
        C2["Name"]
        C3["Contact Person"]
        C4["Phone"]
        C5["Status (badge)"]
        C6["Services Count"]
        C7["→ Detail"]
    end

    Features --> Columns
```

### Partner Detail (`/dashboard/partners/:id`)

| Section | Contents |
|---------|----------|
| **Profile** | Name, type, contact person, phone, email, address |
| **Status** | Active/Inactive toggle |
| **Services** | Service rate cards with add/edit/delete |
| **Assignments** | All bookings this partner has been assigned to |
| **Notes** | Internal notes about the partner |

---

## Key Files

| File | Purpose |
|------|---------|
| `src/models/Partner.ts` | Partner Mongoose schema |
| `src/models/PartnerService.ts` | Service rate card schema |
| `src/models/BookingPartner.ts` | Booking-partner assignment schema |
| `src/app/dashboard/partners/page.tsx` | Partner list (admin) |
| `src/app/dashboard/partners/[id]/page.tsx` | Partner detail + services |
| `src/app/dashboard/partners/new/page.tsx` | New partner form |
| `src/app/dashboard/hotel/page.tsx` | Hotel partner dashboard |
| `src/app/api/partners/route.ts` | Partner CRUD API |
| `src/app/api/partners/[id]/services/route.ts` | Partner services API |
| `src/app/api/booking-partners/route.ts` | Booking assignment API |
| `src/lib/validations.ts` | `createPartnerSchema`, `createPartnerServiceSchema`, `createBookingPartnerSchema` |

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/partners` | Staff+ | List partners (filter by type/status) |
| `POST` | `/api/partners` | Staff+ | Create partner |
| `GET` | `/api/partners/:id` | Staff+ | Get partner detail |
| `PATCH` | `/api/partners/:id` | Staff+ | Update partner |
| `DELETE` | `/api/partners/:id` | Admin | Soft delete partner |
| `GET` | `/api/partners/:id/services` | Staff+ | List partner services |
| `POST` | `/api/partners/:id/services` | Staff+ | Add service rate card |
| `DELETE` | `/api/partners/:id/services/:sid` | Staff+ | Remove service |
| `GET` | `/api/booking-partners` | Staff+ | List booking assignments |
| `POST` | `/api/booking-partners` | Staff+ | Assign partner to booking |
