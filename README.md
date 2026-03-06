<div align="center">

# 🏝️ Yatara Ceylon — Tourism Operations Management System

### *Luxury Sri Lankan Tourism · Intelligent Booking · Real-Time Finance*

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=nextdotjs)](https://nextjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![PayHere](https://img.shields.io/badge/PayHere-Gateway-FF6B35?style=for-the-badge)](https://www.payhere.lk/)
[![License](https://img.shields.io/badge/License-Academic-blue?style=for-the-badge)](#license)

---

*A full-stack Tourism Operations Management System (TOMS) built for **Yatara Ceylon**, a luxury inbound tourism operator in Sri Lanka. The platform manages the complete lifecycle — from public-facing package discovery to booking, 20% advance payment via PayHere, role-based dashboards, fleet & partner coordination, and real-time financial tracking.*

</div>

---

## 📑 Table of Contents

- [System Architecture](#-system-architecture)
- [High-Level Flow](#-high-level-flow)
- [Tech Stack](#-tech-stack)
- [Management Modules](#-management-modules)
- [Role-Based Dashboards](#-role-based-dashboards)
- [Payment Integration](#-payment-integration)
- [Test Credentials](#-test-credentials)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Module Documentation](#-module-documentation)
- [API Reference](#-api-reference)
- [Security](#-security)
- [License](#-license)

---

## 🏗 System Architecture

The system follows a **layered architecture** separating the public tourism website, authentication layer, role-based portals, and backend operations.

<div align="center">
  <img src="docs/images/system-architecture.webp" alt="System Architecture" width="800" style="border-radius: 8px;">
</div>

```mermaid
graph TB
    subgraph Public["🌐 Public Layer"]
        LP["Landing Page"]
        PKG["Packages & Destinations"]
        BT["Build Your Tour"]
        VH["Vehicle Transfers"]
    end

    subgraph Auth["🔐 Authentication Layer"]
        LOGIN["Single Login Portal"]
        JWT["JWT Token + Cookie"]
        RBAC["Role-Based Access Control"]
        MW["Middleware Guard"]
    end

    subgraph Dashboards["📊 Role-Based Portals"]
        AD["Admin Dashboard"]
        SD["Staff/Concierge Dashboard"]
        CD["Customer Dashboard"]
        FD["Fleet Partner Dashboard"]
        HD["Hotel Partner Dashboard"]
    end

    subgraph Backend["⚙️ Operations Backend"]
        BK["Booking Engine"]
        PM["Payment Processor"]
        FM["Finance Manager"]
        VM["Vehicle Fleet Manager"]
        SM["Supplier/Partner Manager"]
    end

    subgraph Data["🗄️ Data Layer"]
        DB[(MongoDB Atlas)]
        PH[PayHere Gateway]
    end

    LP --> PKG
    PKG -->|Book Now| BK
    BT -->|Submit Plan| BK
    VH -->|Book Transfer| BK
    BK --> PM
    PM --> PH
    PH -->|Webhook| PM

    LOGIN --> JWT --> RBAC --> MW
    MW --> AD & SD & CD & FD & HD

    AD --> BK & FM & VM & SM
    SD --> BK & VM
    CD --> BK
    FD --> VM
    HD --> SM

    BK & PM & FM & VM & SM --> DB
```

---

## 🔄 High-Level Flow

The end-to-end user journey from package discovery to booking completion:

<div align="center">
  <img src="docs/images/booking-flow.webp" alt="Booking Flow" width="800" style="border-radius: 8px;">
</div>

```mermaid
sequenceDiagram
    participant C as 🧑 Customer
    participant W as 🌐 Website
    participant API as ⚙️ API Server
    participant PH as 💳 PayHere
    participant DB as 🗄️ MongoDB
    participant A as 👨‍💼 Admin/Staff

    C->>W: Browse Packages
    W->>API: GET /api/public/packages
    API->>DB: Query published packages
    DB-->>API: Package list
    API-->>W: Package data
    W-->>C: Display packages

    C->>W: Click "Book Now & Pay 20%"
    W->>W: Navigate to /booking-request?packageId=X

    C->>W: Fill booking form + Submit
    W->>API: POST /api/public/booking-request
    API->>DB: Create Booking (PAYMENT_PENDING)
    DB-->>API: bookingId + bookingNo
    API-->>W: bookingId

    W->>API: POST /api/payhere/create
    API->>DB: Create Payment record (INITIATED)
    API-->>W: PayHere checkout fields

    W->>PH: Open PayHere Popup (20% amount)
    C->>PH: Complete payment
    PH-->>W: onCompleted callback
    PH->>API: POST /api/payhere/notify (webhook)
    API->>API: Verify MD5 signature
    API->>DB: Update Payment (SUCCESS)
    API->>DB: Update Booking (ADVANCE_PAID, paidAmount, remainingBalance)

    W->>C: Redirect to /payment/return ✅

    A->>W: Login to Dashboard
    A->>W: View Bookings List
    A->>W: Open Booking Detail
    A->>API: PATCH /api/bookings/:id (status update)
    API->>DB: Update booking status
    A->>W: Assign Vehicle + Staff
```

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 15 (App Router, Server Components) |
| **Language** | TypeScript 5.x |
| **Database** | MongoDB with Mongoose ODM |
| **Auth** | JWT + bcryptjs + HttpOnly Cookies |
| **Payments** | PayHere (Sri Lankan Gateway, Sandbox + Production) |
| **Validation** | Zod schemas for all API inputs |
| **Styling** | Tailwind CSS + Custom Design System (Glassmorphism) |
| **UI Components** | shadcn/ui + Radix Primitives |
| **Icons** | Lucide React |
| **Maps** | Leaflet (OpenStreetMap) |
| **Rate Limiting** | In-memory rate limiter |
| **Audit** | Custom audit logging system |

---

## 🗄️ Core Database Schema (ER Diagram)

This entity-relationship diagram maps out how the primary collections in the MongoDB database interact to form the complete tourism management system.

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'fontSize': '15px', 'fontFamily': 'Helvetica'}}}%%
flowchart TB
    %% Entities - padded to prevent GitHub SVG truncation
    U["   USER   "]
    B["   BOOKING   "]
    PKG["   PACKAGE   "]
    DEST["   DESTINATION   "]
    V["   VEHICLE   "]
    P["   PARTNER   "]
    INV["   INVOICE   "]
    PAY["   PAYMENT   "]

    %% Relationships
    R_MAKES{" makes "}
    R_OWNS_V{" owns "}
    R_OWNS_P{" owns "}
    R_INCLUDES{" includes "}
    R_ASSIGNED_V{" assigned_to "}
    R_ASSIGNED_P{" assigned_to "}
    R_HAS_P{" creates "}
    R_HAS_I{" generates "}
    R_BOOKED_IN{" booked_in "}

    %% Connections
    U -- 1 ----- R_MAKES
    R_MAKES ----- M --> B

    U -- 1 ----- R_OWNS_V
    R_OWNS_V ----- M --> V

    U -- 1 ----- R_OWNS_P
    R_OWNS_P ----- M --> P

    PKG -- 1 ----- R_BOOKED_IN
    R_BOOKED_IN ----- M --> B

    PKG -- M ----- R_INCLUDES
    R_INCLUDES ----- N --> DEST

    V -- 1 ----- R_ASSIGNED_V
    R_ASSIGNED_V ----- M --> B

    P -- 1 ----- R_ASSIGNED_P
    R_ASSIGNED_P ----- M --> B

    B -- 1 ----- R_HAS_I
    R_HAS_I ----- M --> INV

    B -- 1 ----- R_HAS_P
    R_HAS_P ----- M --> PAY

    %% Attributes
    U_email([" email "])
    U_name([" name "])
    U_role([" role "])
    U -.- U_email
    U -.- U_name
    U -.- U_role

    B_dates([" dates "])
    B_pax([" pax "])
    B_totalCost([" totalCost "])
    B_status([" status "])
    B -.- B_dates
    B -.- B_pax
    B -.- B_totalCost
    B -.- B_status

    PKG_title([" title "])
    PKG_type([" type "])
    PKG_price([" price "])
    PKG -.- PKG_title
    PKG -.- PKG_type
    PKG -.- PKG_price

    V_type([" type "])
    V_status([" status "])
    V_plate([" plate "])
    V -.- V_type
    V -.- V_status
    V -.- V_plate

    P_type([" type "])
    P_name([" name "])
    P -.- P_type
    P -.- P_name

    INV_status([" status "])
    INV_total([" total "])
    INV -.- INV_status
    INV -.- INV_total

    PAY_amount([" amount "])
    PAY_method([" method "])
    PAY_status([" status "])
    PAY -.- PAY_amount
    PAY -.- PAY_method
    PAY -.- PAY_status

    DEST_name([" name "])
    DEST_loc([" location "])
    DEST -.- DEST_name
    DEST -.- DEST_loc

    classDef entity fill:#ffffff,stroke:#000000,stroke-width:2px,color:#000000,font-weight:bolder;
    classDef relationship fill:#e1f5fe,stroke:#0277bd,stroke-width:2px,color:#000000,font-weight:bolder;
    classDef attribute fill:#f8f9fa,stroke:#333333,stroke-width:1px,color:#000000,font-weight:normal;

    class U,B,PKG,DEST,V,P,INV,PAY entity;
    class R_MAKES,R_OWNS_V,R_OWNS_P,R_INCLUDES,R_ASSIGNED_V,R_ASSIGNED_P,R_HAS_P,R_HAS_I,R_BOOKED_IN relationship;
    class U_email,U_name,U_role,B_dates,B_pax,B_totalCost,B_status,PKG_title,PKG_type,PKG_price,V_type,V_status,V_plate,P_type,P_name,INV_status,INV_total,PAY_amount,PAY_method,PAY_status,DEST_name,DEST_loc attribute;
```

**Key Relationships Explained:**
- **Users:** Control the system based on their `role` (Admin, Staff, Customer, etc.). Customers generate Bookings. Fleet/Hotel roles manage Vehicles and Partner properties respectively.
- **Packages & Destinations:** The public catalog. Packages are standard tours built out of multiple Destinations. Bookings are attached to a specific Package choice.
- **Bookings:** The core operational entity. Everything revolves around the Booking document.
- **Finance (Payment & Invoice):** Track the lifecycle of money. Payments register inbound cash (via PayHere gateway or manual cash). Invoices are generated by staff against Bookings.
- **Resources (Vehicle & Partner):** Staff assigns available Vehicles (from Fleet module) and Partners (Hotels, Guides, Restaurants) to confirmed Bookings to fulfill the trip requirements.

---

## 📦 Management Modules

The system is organized into **6 core management modules**, each documented separately in the [`/docs`](./docs/) folder:

| # | Module | Scope | Docs |
|---|--------|-------|------|
| 1 | **Account Management** | User registration, auth, RBAC, 5 roles | [📄 Read →](./docs/account-management.md) |
| 2 | **Products & Content Management** | Packages, destinations, FAQs, gallery, testimonials | [📄 Read →](./docs/products-content-management.md) |
| 3 | **Vehicle Fleet Management** | Vehicles, availability blocking, booking assignments | [📄 Read →](./docs/vehicle-fleet-management.md) |
| 4 | **Booking & Reservation Management** | Booking lifecycle, custom plans, status pipeline | [📄 Read →](./docs/booking-reservation-management.md) |
| 5 | **Finance Management** | Payments, invoices, advance tracking, receipts | [📄 Read →](./docs/finance-management.md) |
| 6 | **Supplier/Partner Management** | Partners, services, rate cards, assignments | [📄 Read →](./docs/supplier-partner-management.md) |

---

## 🖥 Role-Based Dashboards

Each user role sees a **different dashboard** with permissions enforced at both middleware and API levels. The dashboards utilize a custom *liquid glass* design system.

### Admin Dashboard
<div align="center">
  <img src="docs/images/admin-dashboard.webp" alt="Admin Dashboard" width="800" style="border-radius: 8px;">
</div>

### Customer Dashboard
<div align="center">
  <img src="docs/images/customer-dashboard.webp" alt="Customer Dashboard" width="800" style="border-radius: 8px;">
</div>

### Fleet Partner Dashboard
<div align="center">
  <img src="docs/images/fleet-dashboard.webp" alt="Fleet Dashboard" width="800" style="border-radius: 8px;">
</div>

```mermaid
graph LR
    subgraph Roles["User Roles"]
        ADMIN["🔑 Admin"]
        STAFF["👨‍💼 Concierge Staff"]
        USER["🧑 Customer"]
        VEHICLE["🚗 Fleet Partner"]
        HOTEL["🏨 Hotel Partner"]
    end

    subgraph Pages["Dashboard Pages"]
        OV["Overview + Stats"]
        BK["Bookings"]
        PKG["Packages"]
        DST["Destinations"]
        VEH["Vehicles"]
        SUP["Support"]
        FIN["Finance"]
        PTR["Partners"]
        USR["Users"]
        MB["My Bookings"]
        MP["My Plans"]
        FL["Fleet Dashboard"]
        HT["Hotel Dashboard"]
        PR["Profile"]
    end

    ADMIN --> OV & BK & PKG & DST & VEH & SUP & FIN & PTR & USR
    STAFF --> OV & BK & PKG & DST & VEH & SUP & PTR
    USER --> MB & MP & PR
    VEHICLE --> FL & PR
    HOTEL --> HT & PR
```

### Dashboard Features by Role

| Feature | Admin | Staff | Customer | Fleet | Hotel |
|---------|:-----:|:-----:|:--------:|:-----:|:-----:|
| Overview with stat cards | ✅ | ✅ | — | — | — |
| Manage all bookings | ✅ | ✅ (restricted) | — | — | — |
| View my bookings | — | — | ✅ | — | — |
| Manage packages | ✅ | ✅ | — | — | — |
| Manage destinations | ✅ | ✅ | — | — | — |
| Manage vehicles | ✅ | View only | — | — | — |
| Fleet dashboard | — | — | — | ✅ | — |
| Hotel dashboard | — | — | — | — | ✅ |
| Finance overview | ✅ | — | — | — | — |
| Manage partners | ✅ | ✅ | — | — | — |
| Manage users | ✅ | — | — | — | — |
| Support tickets | ✅ | ✅ | — | — | — |
| Update booking status | ✅ | ✅ | — | — | — |
| Assign vehicles/staff | ✅ | ✅ | — | — | — |
| Custom plan builder | — | — | ✅ | — | — |
| Profile management | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 💳 Payment Integration

The system integrates **PayHere**, Sri Lanka's leading payment gateway, for secure 20% advance collection.

<div align="center">
  <img src="docs/images/finance-overview.webp" alt="Finance Dashboard" width="800" style="border-radius: 8px;">
</div>

```mermaid
stateDiagram-v2
    [*] --> BookingCreated: Customer submits form
    BookingCreated --> PaymentPending: totalCost > 0
    BookingCreated --> New: No payment needed

    PaymentPending --> PayHerePopup: PayHere SDK opens
    PayHerePopup --> PaymentSuccess: Customer pays 20%
    PayHerePopup --> PaymentDismissed: Popup closed
    PayHerePopup --> PaymentFailed: Error

    PaymentSuccess --> AdvancePaid: Webhook confirms
    PaymentDismissed --> PaymentPending: Can retry later
    PaymentFailed --> PaymentPending: Can retry

    AdvancePaid --> Confirmed: Admin confirms
    New --> Contacted: Staff reaches out
    Contacted --> Confirmed: Agreement reached

    Confirmed --> Assigned: Vehicle + Staff assigned
    Assigned --> InProgress: Trip starts
    InProgress --> Completed: Trip ends

    Confirmed --> Cancelled: Customer cancels
    PaymentPending --> Cancelled: Timeout/Cancel
```

### Payment Flow Details

| Step | Action | Status Change |
|------|--------|--------------|
| 1 | Customer fills booking form | Booking: `PAYMENT_PENDING` |
| 2 | System calculates 20% advance | `advanceAmount = totalCost × 0.20` |
| 3 | PayHere popup opens | Payment: `INITIATED` |
| 4 | Customer completes payment | Payment: `SUCCESS` |
| 5 | PayHere sends webhook | Booking: `ADVANCE_PAID` |
| 6 | System updates `paidAmount` | `remainingBalance = totalCost - paidAmount` |
| 7 | Admin sees payment in dashboard | Financial summary updated |

---

## 🔑 Test Credentials

After running `npm run seed`, these demo accounts are available:

| Role | Email | Password | Dashboard |
|------|-------|----------|-----------|
| **Administrator** | `admin@yataraceylon.com` | `Admin@123` | `/dashboard` (full access) |
| **Concierge Staff** | `concierge@yataraceylon.com` | `Concierge@123` | `/dashboard` (no Finance/Users) |
| **Hotel Partner** | `hotel.partner@yataraceylon.com` | `Hotel@123` | `/dashboard/hotel` |
| **Fleet Partner** | `fleet.partner@yataraceylon.com` | `Fleet@123` | `/dashboard/fleet` |
| **Customer** | `customer1@yataraceylon.com` | `Customer@123` | `/dashboard/my-bookings` |
| **Legacy Admin** | `admin@ceylonescapes.lk` | `Admin@123` | `/dashboard` |

> **PayHere Sandbox**: Use test card `4916217501611292` with any future expiry and CVV `123`.

---

## 📁 Project Structure

```
Yatara-Ceylon/
├── docs/                          # Module documentation
│   ├── account-management.md
│   ├── products-content-management.md
│   ├── vehicle-fleet-management.md
│   ├── booking-reservation-management.md
│   ├── finance-management.md
│   └── supplier-partner-management.md
├── public/                        # Static assets & images
├── src/
│   ├── app/
│   │   ├── (public)/              # Public-facing pages
│   │   │   ├── packages/          # Package listing & detail
│   │   │   ├── destinations/      # Destination pages
│   │   │   ├── booking-request/   # Booking form + payment
│   │   │   ├── payment/           # Payment return/cancel
│   │   │   ├── build-tour/        # Custom tour builder
│   │   │   ├── transfers/         # Vehicle transfer pages
│   │   │   └── ...
│   │   ├── auth/
│   │   │   └── login/             # Unified login page (all roles)
│   │   ├── dashboard/
│   │   │   ├── page.tsx           # Admin overview (real DB stats)
│   │   │   ├── bookings/          # Booking list + detail
│   │   │   ├── packages/          # Package CRUD
│   │   │   ├── destinations/      # Destination CRUD
│   │   │   ├── vehicles/          # Vehicle CRUD
│   │   │   ├── finance/           # Finance overview
│   │   │   ├── partners/          # Partner management
│   │   │   ├── users/             # User management (admin only)
│   │   │   ├── support/           # Support tickets
│   │   │   ├── fleet/             # Fleet partner dashboard
│   │   │   ├── hotel/             # Hotel partner dashboard
│   │   │   ├── my-bookings/       # Customer bookings
│   │   │   ├── my-plans/          # Customer saved plans
│   │   │   └── profile/           # Shared profile page
│   │   └── api/
│   │       ├── auth/              # Login, register, logout, me
│   │       ├── bookings/          # Booking CRUD + status
│   │       ├── packages/          # Package CRUD
│   │       ├── payhere/           # PayHere create + notify
│   │       ├── payments/          # Payment management
│   │       ├── public/            # Public booking + tickets
│   │       └── ...
│   ├── components/
│   │   ├── layout/                # DashboardSidebar, Navbar
│   │   ├── public/                # BookingRequestClient, etc.
│   │   └── ui/                    # shadcn/ui primitives
│   ├── lib/
│   │   ├── auth.ts                # JWT signing, hashing
│   │   ├── rbac.ts                # Role-based access helpers
│   │   ├── constants.ts           # Enums & status constants
│   │   ├── validations.ts         # Zod schemas
│   │   ├── seed.ts                # Database seeder
│   │   ├── payhere/               # PayHere config + hash
│   │   └── ...
│   ├── models/                    # Mongoose models
│   │   ├── User.ts
│   │   ├── Booking.ts
│   │   ├── Payment.ts
│   │   ├── Invoice.ts
│   │   ├── Package.ts
│   │   ├── Vehicle.ts
│   │   ├── Partner.ts
│   │   └── ...
│   └── middleware.ts              # Route protection
├── .env.local                     # Environment variables
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20+ (or 25.x LTS)
- **MongoDB** Atlas cluster or local instance
- **PayHere** sandbox merchant account

### Installation

```bash
# Clone the repository
git clone https://github.com/sahansbandara/Yatara-Ceylon.git
cd Yatara-Ceylon

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=1d
PAYHERE_MODE=sandbox
PAYHERE_MERCHANT_ID=your-merchant-id
PAYHERE_MERCHANT_SECRET=your-merchant-secret
PAYHERE_CURRENCY=LKR
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Run

```bash
# Seed demo data (users, packages, destinations, vehicles)
npm run seed

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

---

## 📚 Module Documentation

Detailed documentation for each management module with flow diagrams, entity schemas, and API endpoints:

| Document | Description |
|----------|-------------|
| [📄 Account Management](./docs/account-management.md) | User roles, authentication flow, JWT lifecycle, RBAC enforcement |
| [📄 Products & Content](./docs/products-content-management.md) | Package CRUD, destination management, SEO, content publishing |
| [📄 Vehicle Fleet](./docs/vehicle-fleet-management.md) | Vehicle registry, availability blocking, booking assignments |
| [📄 Booking & Reservation](./docs/booking-reservation-management.md) | Full booking lifecycle, status pipeline, custom plans |
| [📄 Finance](./docs/finance-management.md) | Payment processing, invoice system, advance tracking, receipts |
| [📄 Supplier/Partner](./docs/supplier-partner-management.md) | Partner registry, service rates, booking partner assignments |

---

## 🔌 API Reference

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/login` | — | Login with email/password |
| `POST` | `/api/auth/register` | — | Register new user |
| `POST` | `/api/auth/logout` | — | Clear auth cookie |
| `GET` | `/api/auth/me` | JWT | Get current user profile |

### Bookings

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/bookings` | Staff+ | List bookings (filter, search, paginate) |
| `POST` | `/api/bookings` | Staff+ | Create booking (staff-initiated) |
| `GET` | `/api/bookings/:id` | Staff+ | Get booking detail |
| `PATCH` | `/api/bookings/:id` | Staff+ | Update booking status |
| `POST` | `/api/public/booking-request` | — | Public booking + 20% advance |

### Payments

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/payhere/create` | — | Create PayHere payment session |
| `POST` | `/api/payhere/notify` | — | PayHere webhook (signature verified) |
| `GET` | `/api/payments` | Admin | List payment records |
| `POST` | `/api/payments` | Staff+ | Record manual payment |

### Packages, Vehicles, Partners

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET/POST` | `/api/packages` | Staff+ | Package CRUD |
| `GET/POST` | `/api/vehicles` | Staff+ | Vehicle CRUD |
| `GET/POST` | `/api/partners` | Staff+ | Partner CRUD |

---

## 🔒 Security

| Feature | Implementation |
|---------|---------------|
| **Password hashing** | bcryptjs with 12 salt rounds |
| **JWT tokens** | Signed with `HS256`, stored in HttpOnly cookies |
| **Cookie security** | `SameSite=Strict`, `Secure` in production |
| **RBAC middleware** | Every `/dashboard` route enforces role-based access |
| **Rate limiting** | Login and public APIs rate-limited per IP |
| **Input validation** | Zod schemas on all POST/PATCH endpoints |
| **PayHere verification** | MD5 signature verification on webhooks |
| **Security headers** | `X-Frame-Options`, `X-Content-Type-Options`, `X-XSS-Protection` |
| **Audit logging** | All admin/staff actions logged with actor ID |

---

## 📄 License

This project is developed as part of the **SLIIT ITP (Industry Training Project)** module — `ITP_IT_101`. For academic use only.

---

<div align="center">

**Built with ❤️ by the Yatara Ceylon Team**

*SLIIT · Faculty of Computing · BSc (Hons) Information Technology*

</div>
