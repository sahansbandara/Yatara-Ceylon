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
