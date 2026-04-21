<div align="center">

# 🏝️ Yatara Ceylon — Tourism Operations Management System

### *Luxury Sri Lankan Tourism · Intelligent Booking · Real-Time Finance*

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=nextdotjs)](https://nextjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![PayHere](https://img.shields.io/badge/PayHere-Gateway-FF6B35?style=for-the-badge)](https://www.payhere.lk/)
[![License](https://img.shields.io/badge/License-Academic-blue?style=for-the-badge)](#license)

---

A full-stack **Tourism Operations Management System (TOMS)** built for **Yatara Ceylon**, a luxury inbound tourism operator in Sri Lanka. The platform manages the complete lifecycle — from public-facing package discovery to booking, 20% advance payment via PayHere, role-based dashboards, fleet & partner coordination, and real-time financial tracking.

</div>

---

## 📑 Table of Contents

- [What is Yatara Ceylon?](#-what-is-yatara-ceylon)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Features at a Glance](#-features-at-a-glance)
- [User Roles & Permissions](#-user-roles--permissions)
- [Booking & Payment Flow](#-booking--payment-flow)
- [Database Schema (ER Diagram)](#-database-schema-er-diagram)
- [Project Structure](#-project-structure)
- [Getting Started (Step-by-Step)](#-getting-started-step-by-step)
- [Test Credentials](#-test-credentials)
- [Management Modules](#-management-modules)
- [API Reference](#-api-reference)
- [Security](#-security)
- [Diagrams & Documentation](#-diagrams--documentation)
- [License](#-license)

---

## 🌏 What is Yatara Ceylon?

**Yatara Ceylon** is a Sri Lankan luxury tourism company that organises inbound tours, vehicle transfers, and bespoke travel experiences across the island. This software platform — the **Tourism Operations Management System (TOMS)** — is the digital backbone that powers their entire operation.

### The Problem

Before this system, Yatara Ceylon managed bookings through spreadsheets, WhatsApp messages, and manual bank transfers. This caused:

- Lost bookings and double-booked vehicles
- No visibility into payment status or outstanding balances
- Partners (hotels, drivers) had no self-service portal
- Customers had no way to track their tour status online

### The Solution

TOMS provides a **single platform** where:

| Who | What they can do |
|-----|-----------------|
| **Customers** | Browse tour packages, book online, pay 20% advance via PayHere, build custom tours, track booking status |
| **Admin** | Manage all bookings, assign vehicles and staff, handle invoices, track revenue, manage users |
| **Concierge Staff** | Process bookings, update statuses, manage packages and destinations |
| **Fleet Partners** | View assigned trips, manage vehicle availability and blocks |
| **Hotel Partners** | Manage property services, room availability, and rate cards |

---

## 🏗 System Architecture

The application follows a **layered architecture** with clear separation between the public website, authentication, role-based dashboards, and a centralised service layer for all database operations.

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

    subgraph Backend["⚙️ Service Layer"]
        SVC["src/services/ — Centralised DB Operations"]
        API["src/app/api/ — REST Endpoints"]
    end

    subgraph Data["🗄️ Data Layer"]
        DB[(MongoDB Atlas)]
        PH[PayHere Gateway]
        MDL["src/models/ — Mongoose Schemas"]
    end

    LP --> PKG
    PKG -->|Book Now| API
    BT -->|Submit Plan| API
    VH -->|Book Transfer| API
    API --> SVC
    SVC --> MDL --> DB
    API --> PH

    LOGIN --> JWT --> RBAC --> MW
    MW --> AD & SD & CD & FD & HD

    AD & SD & CD & FD & HD --> SVC
```

### Key Architecture Decisions

| Decision | Rationale |
|----------|-----------|
| **Next.js 15 App Router** | Server Components for fast initial loads, Server Actions for mutations, built-in API routes |
| **Service Layer Pattern** | All DB queries centralised in `src/services/` — pages never import `connectDB` or Mongoose models directly |
| **JWT in HttpOnly Cookies** | Secure auth without exposing tokens to JavaScript, works with SSR |
| **PayHere Integration** | Sri Lanka's leading payment gateway with sandbox testing support |

> 📐 **[View Interactive System Architecture Diagram →](docs/diagrams/system_architecture.html)** *(Open in browser for full SVG)*

---

## 🛠 Tech Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|--------|
| **Framework** | Next.js (App Router) | 15.1.0 | Full-stack React framework with server components |
| **UI Library** | React | 19.0.0 | Component-based user interface library |
| **Language** | TypeScript | 5.7.x | Type-safe development across frontend and backend |
| **Database** | MongoDB Atlas + Mongoose | 8.9.5 | Cloud document database with schema validation (ODM) |
| **Auth** | JWT (jose + jsonwebtoken) + bcryptjs | — | Secure stateless authentication with HttpOnly cookies |
| **Payments** | PayHere (Sandbox + Production) | — | Sri Lankan payment gateway for LKR transactions |
| **Validation** | Zod | 3.24.x | Runtime schema validation for all API inputs |
| **Styling** | Tailwind CSS | 3.4.17 | Utility-first CSS with custom design tokens |
| **UI Primitives** | Radix UI + shadcn/ui patterns | — | Accessible dialogs, dropdowns, tabs, tooltips, popovers |
| **Animations** | Framer Motion | 11.18.x | Page transitions, scroll-based parallax, micro-interactions |
| **Icons** | Lucide React | 0.563.x | Modern SVG icon library |
| **Maps** | MapLibre GL + react-map-gl + Leaflet | — | Interactive maps for tour planner and destination explorer |
| **State** | Zustand | 5.0.x | Lightweight client-side state management |
| **Drag & Drop** | @dnd-kit | 6.3.x | Sortable itinerary items in tour builder |
| **Search** | cmdk + Fuse.js | — | Command palette (⌘K) and fuzzy search |
| **PDF** | jsPDF + jspdf-autotable | — | Invoice and receipt PDF generation |
| **Email** | Nodemailer (Zoho SMTP) | 8.0.x | Verification emails, support reply notifications |
| **Carousel** | Swiper | 11.2.x | Touch-friendly carousels for packages and galleries |
| **Calendar** | react-big-calendar | 1.19.x | Fleet availability and booking calendar views |
| **Dates** | date-fns | 4.1.x | Date formatting, parsing, and manipulation |
| **Captcha** | Cloudflare Turnstile | — | Bot protection on public forms |
| **Rate Limiting** | Custom in-memory limiter | — | API abuse prevention per IP |
| **Audit Trail** | Custom AuditLog model | — | Tracks all admin/staff actions with actor ID |

---

## ✨ Features at a Glance

### Public Website
- 🏖️ **Tour Package Catalog** — Browse curated Sri Lankan tour packages with pricing, itineraries, and photo galleries
- 🗺️ **Interactive Destination Explorer** — Explore destinations on an interactive map
- ✏️ **Build Your Own Tour** — Drag-and-drop custom itinerary builder with day-by-day planning
- 🚐 **Vehicle Transfer Booking** — Book airport/city transfers with vehicle selection
- 💳 **Online Payment** — Pay 20% advance securely via PayHere with automatic booking confirmation
- 📱 **Responsive Design** — Fully mobile-optimised with a luxury glassmorphism aesthetic

### Admin & Staff Dashboard
- 📊 **Real-Time KPIs** — Revenue, bookings, conversion rates updated live from the database
- 📋 **Booking Pipeline** — Visual status pipeline from NEW → CONTACTED → CONFIRMED → ASSIGNED → IN_PROGRESS → COMPLETED
- 🚗 **Fleet Calendar** — Gantt-style vehicle availability with drag-to-block
- 💰 **Finance Dashboard** — Revenue tracking, invoice management, payment aging reports
- 👥 **User Management** — Create/edit users, assign roles, manage permissions
- 🤝 **Partner Management** — Onboard hotels, guides, restaurants with rate cards
- 📝 **Support Tickets** — Customer support with threaded replies
- 📜 **Audit Logging** — Every admin action tracked with timestamp and actor

### Customer Portal
- 📦 **My Bookings** — Track all bookings with real-time status updates
- 🗓️ **My Plans** — View and reopen saved custom tour plans
- 👤 **Profile Management** — Update personal details and preferences

### Partner Portals
- 🚗 **Fleet Dashboard** — View assigned trips, manage vehicle availability blocks, track fleet utilisation
- 🏨 **Hotel Dashboard** — Manage property services, block room availability, view booking assignments

---

## 👥 User Roles & Permissions

The system supports **5 distinct user roles**, each with tailored dashboard access and permissions enforced at both middleware and API levels.

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

### Permission Matrix

| Feature | Admin | Staff | Customer | Fleet Partner | Hotel Partner |
|---------|:-----:|:-----:|:--------:|:-----:|:-----:|
| Dashboard overview with KPIs | ✅ | ✅ | — | — | — |
| Manage all bookings | ✅ | ✅ (restricted) | — | — | — |
| View own bookings | — | — | ✅ | — | — |
| Manage packages & destinations | ✅ | ✅ | — | — | — |
| Manage vehicles | ✅ | View only | — | — | — |
| Fleet partner dashboard | — | — | — | ✅ | — |
| Hotel partner dashboard | — | — | — | — | ✅ |
| Finance & invoices | ✅ | — | — | — | — |
| Manage partners | ✅ | ✅ | — | — | — |
| Manage users | ✅ | — | — | — | — |
| Support tickets | ✅ | ✅ | — | — | — |
| Assign vehicles/staff to bookings | ✅ | ✅ | — | — | — |
| Build custom tour plans | — | — | ✅ | — | — |
| Profile management | ✅ | ✅ | ✅ | ✅ | ✅ |

> 📐 **[View Full Use Case Diagram →](docs/diagrams/use_case_diagram.html)**

---

## 💳 Booking & Payment Flow

This is the complete user journey from browsing a package to completing a booking with payment.

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

### Booking Status Pipeline

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

### Payment Step-by-Step

| Step | What Happens | Status Change |
|------|-------------|--------------|
| 1 | Customer fills the booking form with dates, passengers, and package | — |
| 2 | System calculates total cost and 20% advance amount | Booking: `PAYMENT_PENDING` |
| 3 | PayHere payment popup opens in the browser | Payment: `INITIATED` |
| 4 | Customer enters card details and completes payment | Payment: `SUCCESS` |
| 5 | PayHere sends a webhook notification to our server | Booking: `ADVANCE_PAID` |
| 6 | System records the paid amount and calculates remaining balance | `remainingBalance = totalCost - paidAmount` |
| 7 | Admin sees the confirmed booking in their dashboard | Ready for vehicle/staff assignment |

> 📐 **[View Full Activity Diagram →](docs/diagrams/activity_diagram.html)** *(Swimlane diagram showing all actors)*

---

## 🗄️ Database Schema (ER Diagram)

The system uses **MongoDB** with **25 Mongoose models**. Here are the primary entity relationships:

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'fontSize': '14px', 'fontFamily': 'Helvetica'}}}%%
flowchart TB
    U["  USER  "]
    B["  BOOKING  "]
    PKG["  PACKAGE  "]
    DEST["  DESTINATION  "]
    V["  VEHICLE  "]
    P["  PARTNER  "]
    INV["  INVOICE  "]
    PAY["  PAYMENT  "]
    CP["  CUSTOM PLAN  "]
    VB["  VEHICLE BLOCK  "]
    NT["  NOTIFICATION  "]
    ST["  SUPPORT TICKET  "]
    AL["  AUDIT LOG  "]
    BPA["  BOOKING PARTNER  "]

    U -- "1 makes M" --> B
    U -- "1 owns M" --> V
    U -- "1 owns M" --> P
    PKG -- "1 booked_in M" --> B
    PKG -- "M includes N" --> DEST
    V -- "1 assigned_to M" --> B
    B -- "1 generates M" --> INV
    B -- "1 creates M" --> PAY
    CP -- "1 used_in 1" --> B
    V -- "1 has_block M" --> VB
    P -- "1 assigned M" --> BPA
    B -- "1 partners M" --> BPA
    U -..- NT
    U -..- ST
    U -..- AL
    U -..- CP

    classDef entity fill:#ffffff,stroke:#000000,stroke-width:2px,color:#000000,font-weight:bolder
    class U,B,PKG,DEST,V,P,INV,PAY,CP,VB,NT,ST,AL,BPA entity
```

### Key Relationships

| Relationship | Description |
|-------------|-------------|
| **User → Booking** | Customers create bookings. Admins/staff manage them |
| **Package → Booking** | Each booking references a tour package |
| **Booking → Payment** | Multiple payments can exist per booking (advance + balance) |
| **Booking → Invoice** | Staff generate invoices against bookings |
| **Vehicle → Booking** | Admin assigns an available vehicle to confirmed bookings |
| **Partner → Booking Partner** | Hotels/guides/restaurants are linked to bookings via assignment |
| **Vehicle → Vehicle Block** | Fleet partners can block dates when vehicle is unavailable |
| **User → Custom Plan** | Customers save custom-built tour itineraries |

> 📐 **[View Full ER Diagram →](docs/diagrams/er_diagram.html)** *(Interactive SVG with all attributes)*

---

## 📁 Project Structure

```
Yatara-Ceylon/
├── docs/                           # 📚 Project documentation
│   ├── diagrams/                   #    Interactive HTML diagrams (architecture, ER, use case, activity)
│   ├── yatara_member_md_files/     #    Individual member documentation (6 files)
│   ├── API.md                      #    API endpoint reference
│   ├── ARCHITECTURE.md             #    System architecture overview
│   ├── DESIGN-SYSTEM.md            #    Design tokens and component patterns
│   ├── FEATURES.md                 #    Feature list and status
│   ├── SETUP.md                    #    Development environment setup guide
│   ├── demo_script.md              #    Demo walkthrough script
│   ├── mongodb-backups.md          #    Database backup procedures
│   └── style-contract.md           #    Design style contract
│
├── scripts/                        # 🔧 Utility & seed scripts
│
├── src/
│   ├── app/
│   │   ├── (public)/               # 🌐 Public-facing pages
│   │   │   ├── packages/           #    Package listing & detail
│   │   │   ├── destinations/       #    Destination pages
│   │   │   ├── booking-request/    #    Booking form + payment
│   │   │   ├── payment/            #    Payment return/cancel pages
│   │   │   ├── build-tour/         #    Custom tour builder
│   │   │   └── transfers/          #    Vehicle transfer pages
│   │   │
│   │   ├── auth/login/             # 🔐 Unified login page (all roles)
│   │   │
│   │   ├── dashboard/              # 📊 Role-based dashboard pages
│   │   │   ├── page.tsx            #    Admin overview (KPIs)
│   │   │   ├── bookings/           #    Booking list + [id] detail
│   │   │   ├── packages/           #    Package CRUD
│   │   │   ├── destinations/       #    Destination CRUD
│   │   │   ├── vehicles/           #    Vehicle CRUD + calendar view
│   │   │   ├── finance/            #    Finance overview + invoices
│   │   │   ├── partners/           #    Partner management
│   │   │   ├── users/              #    User management (admin only)
│   │   │   ├── support/            #    Support tickets
│   │   │   ├── fleet/              #    Fleet partner dashboard
│   │   │   ├── hotel/              #    Hotel partner dashboard
│   │   │   ├── my-bookings/        #    Customer booking list
│   │   │   ├── my-plans/           #    Customer saved plans
│   │   │   └── profile/            #    Shared profile page
│   │   │
│   │   └── api/                    # ⚙️ REST API endpoints
│   │       ├── auth/               #    Login, register, logout, me
│   │       ├── bookings/           #    Booking CRUD + status updates
│   │       ├── packages/           #    Package CRUD
│   │       ├── payhere/            #    PayHere create + webhook notify
│   │       ├── payments/           #    Payment management
│   │       └── public/             #    Public booking + support tickets
│   │
│   ├── services/                   # 🗄️ Centralised database operations
│   │   ├── package.service.ts      #    Package queries (list, featured, signature)
│   │   ├── user.service.ts         #    User management queries
│   │   ├── fleet.service.ts        #    Fleet dashboard aggregations
│   │   ├── finance.service.ts      #    Revenue, invoices, aging queries
│   │   ├── analytics.service.ts    #    Monthly stats, top packages
│   │   ├── hotel.service.ts        #    Hotel partner queries
│   │   ├── dashboard.service.ts    #    Main dashboard KPIs
│   │   └── crud.service.ts         #    All remaining CRUD + detail lookups
│   │
│   ├── models/                     # 📋 Mongoose schemas (25 models)
│   │   ├── User.ts, Booking.ts, Payment.ts, Invoice.ts
│   │   ├── Package.ts, Vehicle.ts, Partner.ts, Destination.ts
│   │   ├── CustomPlan.ts, VehicleBlock.ts, Notification.ts
│   │   ├── RefundRequest.ts, PartnerService.ts, PartnerServiceBlock.ts
│   │   ├── SupportTicket.ts, AuditLog.ts, Attachment.ts
│   │   ├── BookingPartnerAssignment.ts, PartnerRequest.ts
│   │   ├── FAQ.ts, GalleryPost.ts, Testimonial.ts
│   │   └── Customer.ts, District.ts, DistrictPlace.ts
│   │
│   ├── components/                 # 🎨 React UI components
│   │   ├── dashboard/              #    Dashboard-specific components
│   │   ├── public/                 #    Public page components
│   │   ├── layout/                 #    Sidebar, Navbar, Footer
│   │   └── ui/                     #    shadcn/ui primitives
│   │
│   ├── lib/                        # 🔧 Shared utilities
│   │   ├── auth.ts                 #    JWT signing, password hashing
│   │   ├── rbac.ts                 #    Role-based access helpers
│   │   ├── mongodb.ts              #    Database connection
│   │   ├── currency.ts             #    LKR formatting utility
│   │   ├── constants.ts            #    Enums & status constants
│   │   ├── validations.ts          #    Zod schemas
│   │   └── payhere/                #    PayHere config & hash generation
│   │
│   └── middleware.ts               # 🛡️ Route protection middleware
│
├── .env.example                    # Template for environment variables
├── package.json                    # Dependencies and scripts
├── tailwind.config.ts              # Tailwind CSS configuration
├── tsconfig.json                   # TypeScript configuration
└── README.md                       # You are here!
```

---

## 🚀 Getting Started (Step-by-Step)

This section walks you through setting up the project from scratch, even if you've never used Next.js before.

### Step 1: Prerequisites

Make sure you have these installed on your computer:

| Tool | Version | How to Install |
|------|---------|---------------|
| **Node.js** | 20 or higher | Download from [nodejs.org](https://nodejs.org/) or use `nvm install 20` |
| **npm** | Comes with Node.js | Included when you install Node.js |
| **Git** | Any recent version | Download from [git-scm.com](https://git-scm.com/) |
| **MongoDB** | Atlas (cloud) or local | Free tier at [mongodb.com/atlas](https://www.mongodb.com/atlas) |

To verify your setup, open a terminal and run:

```bash
node --version    # Should show v20.x.x or higher
npm --version     # Should show 10.x.x or higher
git --version     # Should show git version 2.x.x
```

### Step 2: Clone the Repository

```bash
git clone https://github.com/sahansbandara/Yatara-Ceylon.git
cd Yatara-Ceylon
```

### Step 3: Install Dependencies

```bash
npm install
```

This will install all required packages (takes 1–2 minutes).

### Step 4: Set Up Environment Variables

```bash
cp .env.example .env.local
```

Now open `.env.local` in your code editor and fill in the values:

```env
# ── Database ──────────────────────────────────────
# Get this from MongoDB Atlas → Connect → Drivers
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/yatara-ceylon

# ── Authentication ────────────────────────────────
# Any random string — used to sign JWT tokens
JWT_SECRET=my-super-secret-key-change-this-in-production
JWT_EXPIRES_IN=1d

# ── App URL ───────────────────────────────────────
NEXT_PUBLIC_APP_URL=http://localhost:3000

# ── PayHere Payment Gateway ──────────────────────
# Get these from payhere.lk → Settings → API
PAYHERE_MODE=sandbox
PAYHERE_MERCHANT_ID=your_merchant_id
PAYHERE_MERCHANT_SECRET=your_merchant_secret
PAYHERE_CURRENCY=LKR

# ── Optional: WhatsApp ────────────────────────────
NEXT_PUBLIC_WHATSAPP_NUMBER=94704239802

# ── Optional: Cloudflare Turnstile (captcha) ─────
NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
```

> **💡 Tip:** If you don't have a PayHere account yet, the app still works — the payment popup just won't open. You can set `PAYHERE_MODE=sandbox` and use PayHere's test credentials.

### Step 5: Seed the Database

This creates demo users, packages, destinations, vehicles, and sample bookings:

```bash
npm run seed
```

You should see output confirming the data was created.

### Step 6: Start the Development Server

```bash
npm run dev
```

Open your browser and go to **[http://localhost:3000](http://localhost:3000)** 🎉

### Step 7: Log In

Visit **[http://localhost:3000/auth/login](http://localhost:3000/auth/login)** and use any of the [test credentials](#-test-credentials) below.

### Other Commands

```bash
# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test

# Lint code
npm run lint
```

---

## 🔑 Test Credentials

After running `npm run seed`, these demo accounts are available:

| Role | Email | Password | What they see |
|------|-------|----------|--------------|
| **Administrator** | `admin@yataraceylon.me` | `Admin@123` | Full dashboard — bookings, finance, users, vehicles, partners |
| **Concierge Staff** | `concierge@yataraceylon.me` | `Concierge@123` | Dashboard without Finance or User Management |
| **Hotel Partner** | `hotel.partner@yataraceylon.me` | `Hotel@123` | Hotel dashboard — manage property, services, availability |
| **Fleet Partner** | `fleet.partner@yataraceylon.me` | `Fleet@123` | Fleet dashboard — manage vehicles, view assigned trips |
| **Customer** | `customer1@yataraceylon.me` | `Customer@123` | My Bookings, My Plans, Profile |

### PayHere Sandbox Test Card

| Field | Value |
|-------|-------|
| Card Number | `4916217501611292` |
| Expiry | Any future date |
| CVV | `123` |

---

## 📦 Management Modules

The system is organised into **6 core modules**, each managed by a team member with detailed documentation:

| # | Module | Member | What it does | Documentation |
|---|--------|--------|-------------|------|
| 1 | **Account Management** | Nawarathna K.M.G.D.I. | User registration, login, JWT auth, 5 roles, RBAC | [📄 Read →](./docs/yatara_member_md_files/01-account-management-nawarathna.md) |
| 2 | **Products & Content** | Wasala W.A.I. | Tour packages, destinations, FAQs, gallery, testimonials | [📄 Read →](./docs/yatara_member_md_files/02-products-content-management-wasala.md) |
| 3 | **Vehicle Fleet** | Melisha L.A. | Vehicle registry, availability blocking, fleet calendar, booking assignments | [📄 Read →](./docs/yatara_member_md_files/03-vehicle-fleet-management-melisha.md) |
| 4 | **Booking & Reservation** | Sanujan N. | Full booking lifecycle, custom tour plans, status pipeline | [📄 Read →](./docs/yatara_member_md_files/04-booking-reservation-management-sanujan.md) |
| 5 | **Finance** | Luxsana S. | PayHere payments, manual payments, invoices, aging reports, refund pipeline | [📄 Read →](./docs/yatara_member_md_files/05-finance-management-luxsana.md) |
| 6 | **Supplier/Partner** | Muthubadiwila D.H.S. | Hotels, guides, restaurants — onboarding, rate cards, booking assignments | [📄 Read →](./docs/yatara_member_md_files/06-supplier-partner-management-muthubadiwila.md) |

---

## 🔌 API Reference

All API endpoints are under `/api/`. Authentication is via JWT tokens stored in HttpOnly cookies.

### Authentication

| Method | Endpoint | Auth Required | Description |
|--------|----------|:---:|-------------|
| `POST` | `/api/auth/login` | — | Login with email and password, returns JWT cookie |
| `POST` | `/api/auth/register` | — | Register a new customer account |
| `POST` | `/api/auth/logout` | — | Clear the auth cookie |
| `GET` | `/api/auth/me` | ✅ | Get the currently logged-in user's profile |

### Bookings

| Method | Endpoint | Auth Required | Description |
|--------|----------|:---:|-------------|
| `GET` | `/api/bookings` | Staff+ | List all bookings (supports filter, search, pagination) |
| `POST` | `/api/bookings` | Staff+ | Create a booking (staff-initiated) |
| `GET` | `/api/bookings/:id` | Staff+ | Get full booking detail with payments and invoices |
| `PATCH` | `/api/bookings/:id` | Staff+ | Update booking status or assign vehicle/staff |
| `POST` | `/api/public/booking-request` | — | Public booking form submission (creates booking + payment) |

### Payments

| Method | Endpoint | Auth Required | Description |
|--------|----------|:---:|-------------|
| `POST` | `/api/payhere/create` | — | Create a PayHere checkout session |
| `POST` | `/api/payhere/notify` | — | PayHere webhook (MD5 signature verified) |
| `GET` | `/api/payments` | Admin | List all payment records |
| `POST` | `/api/payments` | Staff+ | Record a manual cash/bank payment |

### Resources

| Method | Endpoint | Auth Required | Description |
|--------|----------|:---:|-------------|
| `GET/POST` | `/api/packages` | Staff+ | List or create tour packages |
| `GET/PATCH/DELETE` | `/api/packages/:id` | Staff+ | Read, update, or soft-delete a package |
| `GET/POST` | `/api/vehicles` | Staff+ | List or add vehicles |
| `GET/POST` | `/api/partners` | Staff+ | List or add partners |
| `GET/POST` | `/api/destinations` | Staff+ | List or add destinations |

---

## 🔒 Security

| Feature | How it works |
|---------|-------------|
| **Password Hashing** | bcryptjs with 12 salt rounds — passwords are never stored in plain text |
| **JWT Tokens** | Signed with HS256 algorithm, stored in HttpOnly cookies (not accessible via JavaScript) |
| **Cookie Security** | `SameSite=Strict` and `Secure` flag in production to prevent CSRF |
| **RBAC Middleware** | Every `/dashboard` route checks the user's role before rendering |
| **Rate Limiting** | Login and public API endpoints are rate-limited per IP address |
| **Input Validation** | All POST/PATCH endpoints validate input with Zod schemas |
| **PayHere Verification** | Webhook notifications verified using MD5 signature with merchant secret |
| **Security Headers** | `X-Frame-Options`, `X-Content-Type-Options`, `X-XSS-Protection` set on all responses |
| **Audit Logging** | Every admin/staff action (create, update, delete) is logged with actor ID and timestamp |
| **Soft Deletes** | Records are never permanently deleted — `isDeleted: true` flag preserves data integrity |

---

## 📐 Diagrams & Documentation

All detailed diagrams are available as interactive HTML files in the [`docs/diagrams/`](./docs/diagrams/) folder:

| Diagram | Description | File |
|---------|-------------|------|
| **System Architecture** | Full layered architecture with all components | [📐 View →](./docs/diagrams/system_architecture.html) |
| **ER Diagram** | Entity-relationship diagram with all 14 collections | [📐 View →](./docs/diagrams/er_diagram.html) |
| **Use Case Diagram** | Actor-system interactions for all 5 roles | [📐 View →](./docs/diagrams/use_case_diagram.html) |
| **Activity Diagram** | End-to-end booking flow with swimlanes | [📐 View →](./docs/diagrams/activity_diagram.html) |

> **How to view:** Download or clone the repo, then open the `.html` files in any web browser.

Additional module documentation is available in [`docs/yatara_member_md_files/`](./docs/yatara_member_md_files/) — see [Management Modules](#-management-modules) above. Technical docs including API reference, architecture overview, design system, and setup guide are in the [`docs/`](./docs/) folder.

---

## 📄 License

This project is developed as part of the **SLIIT ITP (Industry Training Project)** module — `ITP_IT_101`. For academic use only.

---

<div align="center">

**Built with ❤️ by the Yatara Ceylon Team**

*SLIIT · Faculty of Computing · BSc (Hons) Information Technology*

</div>
