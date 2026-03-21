# 📅 Booking & Reservation Management Module

> Full booking lifecycle, custom tour plans, status pipeline, vehicle/staff assignment, and customer booking history.

---

## Overview

The Booking module is the **operational core** of the system. It handles the complete lifecycle from a customer's initial booking request through payment, assignment, execution, and completion. It supports three booking types: **package bookings**, **vehicle transfers**, and **custom plan bookings**.

---

## Booking Status Pipeline

```mermaid
stateDiagram-v2
    [*] --> NEW: No payment needed
    [*] --> PAYMENT_PENDING: Payment expected

    NEW --> CONTACTED: Staff reaches out
    PAYMENT_PENDING --> ADVANCE_PAID: 20% paid via PayHere

    CONTACTED --> CONFIRMED: Customer confirms
    ADVANCE_PAID --> CONFIRMED: Admin verifies

    CONFIRMED --> ASSIGNED: Vehicle + Staff assigned
    ASSIGNED --> IN_PROGRESS: Trip date begins
    IN_PROGRESS --> COMPLETED: Trip finished ✅

    NEW --> CANCELLED: Customer cancels
    CONTACTED --> CANCELLED: No response
    PAYMENT_PENDING --> CANCELLED: Payment timeout
    CONFIRMED --> CANCELLED: Late cancellation
```

### Status Definitions

| Status | Color | Meaning |
|--------|-------|---------|
| `NEW` | 🔵 Blue | Booking created, no payment expected |
| `PAYMENT_PENDING` | 🟡 Yellow | Awaiting 20% advance payment |
| `CONTACTED` | 🔵 Sky | Staff has contacted the customer |
| `ADVANCE_PAID` | 🟢 Emerald | 20% advance received and verified |
| `CONFIRMED` | 🟢 Green | Booking fully confirmed |
| `ASSIGNED` | 🟣 Purple | Vehicle and/or staff assigned |
| `IN_PROGRESS` | 🔵 Indigo | Trip currently active |
| `COMPLETED` | ⚪ Gray | Trip finished |
| `CANCELLED` | 🔴 Red | Booking cancelled |

---

## Booking Creation Flow

```mermaid
flowchart TD
    subgraph Public["Public Website"]
        PKG["Package Detail Page"]
        VEH["Vehicle Transfer Page"]
        BT["Build Tour Page"]
    end

    PKG -->|"Book Now & Pay 20%"| FORM
    VEH -->|"Book Transfer"| FORM
    BT -->|"Submit Plan"| FORM

    FORM["📝 Booking Form\n/booking-request"]

    FORM -->|"POST"| API["API: /api/public/booking-request"]

    API --> CALC["Calculate:\ntotalCost\nadvanceAmount (20%)\nremainingBalance"]
    CALC --> CREATE["Create Booking in DB"]
    CREATE --> TICKET["Create Support Ticket"]

    CREATE --> HAS_COST{"totalCost > 0?"}
    HAS_COST -->|Yes| PENDING["Status: PAYMENT_PENDING"]
    HAS_COST -->|No| NEW_STATUS["Status: NEW"]

    PENDING --> PAYHERE["PayHere Popup\n(20% advance)"]
    PAYHERE --> WEBHOOK["PayHere Webhook"]
    WEBHOOK --> PAID["Status: ADVANCE_PAID\npaidAmount += advance\nremainingBalance recalculated"]

    style PAID fill:#22c55e,color:#fff
    style PENDING fill:#eab308,color:#fff
    style NEW_STATUS fill:#3b82f6,color:#fff
```

---

## Booking Entity

```mermaid
erDiagram
    BOOKING {
        ObjectId _id PK
        String bookingNo UK "auto: YC-XXXXXX"
        String customerName
        String phone
        String email
        String address
        String city
        String country
        Enum type "PACKAGE | VEHICLE | CUSTOM"
        ObjectId packageId FK
        ObjectId vehicleId FK
        ObjectId customPlanId FK
        Number pax
        String pickupLocation
        Object dates "from, to"
        String notes
        Number totalCost
        Number advancePercentage "default 20"
        Number advanceAmount
        Number paidAmount
        Number remainingBalance
        Enum status "NEW|PAYMENT_PENDING|..."
        ObjectId assignedStaffId FK
        ObjectId assignedVehicleId FK
        Boolean isDeleted
        Date createdAt
    }

    BOOKING }o--|| PACKAGE : "for package"
    BOOKING }o--|| VEHICLE : "for vehicle"
    BOOKING }o--|| CUSTOM_PLAN : "for custom plan"
    BOOKING }o--o| USER : "assigned staff"
    BOOKING }o--o| VEHICLE : "assigned vehicle"
    BOOKING ||--o{ PAYMENT : "has payments"
```

---

## Admin Booking Management

### Booking List Page (`/dashboard/bookings`)

```mermaid
flowchart LR
    subgraph Filters["Filters"]
        SEARCH["🔍 Search: name, phone, booking#"]
        STATUS["📌 Status filter dropdown"]
    end

    subgraph Table["Booking Table"]
        COL1["Code"]
        COL2["Customer"]
        COL3["Package"]
        COL4["Dates"]
        COL5["Total"]
        COL6["Paid"]
        COL7["Balance"]
        COL8["Status"]
        COL9["→ Detail"]
    end

    subgraph Pagination["Navigation"]
        PREV["← Previous"]
        PAGE["Page X of Y"]
        NEXT["Next →"]
    end

    SEARCH --> Table
    STATUS --> Table
    Table --> Pagination
```

### Booking Detail Page (`/dashboard/bookings/:id`)

| Section | Contents |
|---------|----------|
| **Header** | Booking #, status badge, status updater dropdown |
| **Customer Info** | Name, phone, email, pax |
| **Trip Details** | Package name, pickup location, date range, notes |
| **Payment History** | List of all payment records (orderId, amount, status, provider) |
| **Vehicle Assignment** | Assigned vehicle or "Not assigned" |
| **Financial Summary** | Total cost, 20% advance, paid amount, remaining balance |
| **Staff Assignment** | Assigned staff member or "Not assigned" |

---

## Custom Tour Plans

```mermaid
erDiagram
    CUSTOM_PLAN {
        ObjectId _id PK
        String title
        ObjectId userId FK
        String customerName
        String customerPhone
        Array districtsUsed
        Enum status "DRAFT | SAVED"
        Boolean isDeleted
    }

    CUSTOM_PLAN ||--o{ PLAN_DAY : has
    PLAN_DAY {
        Number dayNo
        Array places "place IDs"
        String notes
    }
```

The Build Your Tour feature allows customers to:
1. **Browse districts** on a Leaflet map
2. **Select places** within each district
3. **Arrange into days** with drag-and-drop
4. **Save the plan** and optionally convert to a booking

---

## Key Files

| File | Purpose |
|------|---------|
| `src/models/Booking.ts` | Booking Mongoose schema |
| `src/models/CustomPlan.ts` | Custom plan schema |
| `src/app/dashboard/bookings/page.tsx` | Admin booking list |
| `src/app/dashboard/bookings/[id]/page.tsx` | Booking detail page |
| `src/app/dashboard/bookings/[id]/BookingStatusUpdater.tsx` | Status dropdown |
| `src/app/dashboard/my-bookings/page.tsx` | Customer booking history |
| `src/app/dashboard/my-plans/page.tsx` | Customer saved plans |
| `src/app/(public)/booking-request/page.tsx` | Public booking form |
| `src/components/public/BookingRequestClient.tsx` | Booking form + PayHere |
| `src/app/api/bookings/route.ts` | Booking CRUD API |
| `src/app/api/public/booking-request/route.ts` | Public booking API |
| `src/lib/validations.ts` | `createBookingSchema`, `updateBookingStatusSchema` |

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/bookings` | Staff+ | List bookings (filter, search, paginate) |
| `POST` | `/api/bookings` | Staff+ | Create booking (staff-initiated) |
| `GET` | `/api/bookings/:id` | Staff+ | Get booking detail |
| `PATCH` | `/api/bookings/:id` | Staff+ | Update status or assignment |
| `POST` | `/api/public/booking-request` | — | Public booking + 20% advance calc |
