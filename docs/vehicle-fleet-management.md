# 🚗 Vehicle Fleet Management Module

> Vehicle registry, availability blocking, booking assignments, and fleet partner dashboard.

---

## Overview

The Vehicle Fleet module manages Yatara Ceylon's **transport fleet** — private cars, vans, SUVs, buses, and tuk-tuks available for airport transfers, city tours, and multi-day journeys. Fleet partners (vehicle owners) can manage their own vehicles through a dedicated dashboard, while admin/staff handle assignments.

---

## Vehicle Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Registered: Admin/Partner adds vehicle
    Registered --> Available: Status = AVAILABLE
    Available --> AssignedToBooking: Linked to a booking
    Available --> Blocked: Date range blocked
    Available --> Maintenance: Scheduled maintenance
    AssignedToBooking --> Available: Trip completed
    Blocked --> Available: Block period ends
    Maintenance --> Available: Maintenance complete
    Available --> Unavailable: Permanently removed
    Unavailable --> Available: Reactivated

    state Blocked {
        [*] --> BlockActive
        BlockActive: Reason: BOOKING | MAINTENANCE | PERSONAL | OTHER
    }
```

---

## Vehicle Assignment Flow

```mermaid
sequenceDiagram
    participant A as Admin/Staff
    participant BD as Booking Detail Page
    participant API as /api/bookings/:id
    participant VDB as Vehicle DB
    participant BDB as Booking DB

    A->>BD: Open booking detail
    BD->>VDB: Fetch available vehicles
    VDB-->>BD: Vehicle list (AVAILABLE only)
    BD-->>A: Show vehicle dropdown

    A->>BD: Select vehicle + Assign
    BD->>API: PATCH {assignedVehicleId: vehicleId}
    API->>BDB: Update booking with vehicle
    API->>VDB: Optionally create VehicleBlock
    BDB-->>API: Updated booking
    API-->>BD: Success
    BD-->>A: Vehicle shown as assigned ✅
```

---

## Vehicle Entity

```mermaid
erDiagram
    VEHICLE {
        ObjectId _id PK
        Enum type "CAR | VAN | SUV | BUS | MINIBUS | TUK_TUK"
        String model
        String plateNumber
        Number seats
        Number luggage
        Number dailyRate "USD/day"
        Enum status "AVAILABLE | MAINTENANCE | UNAVAILABLE"
        Array images "URL list"
        Array features "e.g. AC, WiFi, GPS"
        Array transferTypes "AIRPORT_PICKUP | AIRPORT_DROP | CITY_TOUR"
        ObjectId ownerId FK "links to User (VEHICLE_OWNER)"
        Boolean isDeleted
    }

    VEHICLE_BLOCK {
        ObjectId _id PK
        ObjectId vehicleId FK
        Date from
        Date to
        Enum reason "BOOKING | MAINTENANCE | PERSONAL | OTHER"
        ObjectId bookingId FK "optional"
        Boolean isDeleted
    }

    VEHICLE ||--o{ VEHICLE_BLOCK : "has blocks"
    VEHICLE }o--|| USER : "owned by"
```

---

## Fleet Partner Dashboard

The fleet partner (`VEHICLE_OWNER`) has a dedicated dashboard at `/dashboard/fleet` showing:

```mermaid
flowchart TB
    subgraph FleetDash["Fleet Partner Dashboard"]
        STATS["📊 Summary Cards"]
        VEHICLES["🚗 My Vehicles List"]
        ASSIGN["📋 Active Assignments"]
        BLOCKS["🔒 Blocked Periods"]
    end

    STATS --> S1["Total Vehicles"]
    STATS --> S2["Active Assignments"]
    STATS --> S3["Blocked Periods"]

    VEHICLES --> V1["Model / Type / Seats"]
    VEHICLES --> V2["Daily Rate"]
    VEHICLES --> V3["Status Badge"]

    ASSIGN --> A1["Booking No"]
    ASSIGN --> A2["Customer Name"]
    ASSIGN --> A3["Trip Dates"]
    ASSIGN --> A4["Status"]

    BLOCKS --> B1["Date Range"]
    BLOCKS --> B2["Reason"]
```

---

## Availability Calendar Logic

```mermaid
flowchart TD
    CHECK["Check vehicle availability for date range"] --> Q1{"Any VehicleBlocks overlap?"}
    Q1 -->|Yes| UNAVAIL["❌ Vehicle unavailable"]
    Q1 -->|No| Q2{"Any active booking assignments overlap?"}
    Q2 -->|Yes| UNAVAIL
    Q2 -->|No| Q3{"Vehicle status = AVAILABLE?"}
    Q3 -->|No| UNAVAIL
    Q3 -->|Yes| AVAIL["✅ Vehicle available for assignment"]

    style AVAIL fill:#22c55e,color:#fff
    style UNAVAIL fill:#ef4444,color:#fff
```

---

## Key Files

| File | Purpose |
|------|---------|
| `src/models/Vehicle.ts` | Vehicle Mongoose schema |
| `src/models/VehicleBlock.ts` | Vehicle block period schema |
| `src/app/dashboard/vehicles/page.tsx` | Admin vehicle list |
| `src/app/dashboard/vehicles/[id]/page.tsx` | Vehicle edit + blocks |
| `src/app/dashboard/vehicles/new/page.tsx` | New vehicle form |
| `src/app/dashboard/fleet/page.tsx` | Fleet partner dashboard |
| `src/app/api/vehicles/route.ts` | Vehicle CRUD API |
| `src/app/api/vehicles/[id]/blocks/route.ts` | Vehicle blocks API |
| `src/lib/validations.ts` | `createVehicleSchema`, `createVehicleBlockSchema` |

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/vehicles` | Staff+ | List all vehicles |
| `POST` | `/api/vehicles` | Staff+ | Register new vehicle |
| `GET` | `/api/vehicles/:id` | Staff+ | Get vehicle detail |
| `PATCH` | `/api/vehicles/:id` | Staff+ | Update vehicle |
| `DELETE` | `/api/vehicles/:id` | Admin | Soft delete vehicle |
| `GET` | `/api/vehicles/:id/blocks` | Staff+ | List vehicle blocks |
| `POST` | `/api/vehicles/:id/blocks` | Staff+ | Create date block |
| `DELETE` | `/api/vehicles/:id/blocks/:blockId` | Staff+ | Remove block |
