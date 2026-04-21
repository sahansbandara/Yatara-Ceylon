# 🏗️ System Architecture

## Overview

Yatara Ceylon (TOMS) is built as a **full-stack monolithic Next.js application** using the App Router architecture. It combines server-side rendering, API routes, and client-side interactivity in a single deployable unit.

---

## High-Level Architecture

```mermaid
graph TB
    subgraph Client["🌐 Client Layer"]
        Browser["Browser / Mobile"]
    end

    subgraph NextJS["⚡ Next.js 15 App Router"]
        Pages["Pages (SSR/SSG)"]
        API["API Routes (/api/*)"]
        Middleware["Auth Middleware"]
        Components["React Components"]
    end

    subgraph Data["💾 Data Layer"]
        MongoDB["MongoDB Atlas"]
        PayHere["PayHere Gateway"]
    end

    subgraph External["🔗 External Services"]
        Vercel["Vercel (Hosting)"]
        Turnstile["Cloudflare Turnstile"]
        SMTP["Nodemailer (Zoho SMTP)"]
    end

    Browser --> |HTTPS| Middleware
    Middleware --> Pages
    Middleware --> API
    Pages --> Components
    API --> MongoDB
    API --> PayHere
    NextJS --> Vercel
```

---

## Application Layers

### 1. Presentation Layer
- **Public Pages**: Homepage, Packages, Destinations, Vehicles, Build Tour, Guide, Inquire
- **Dashboard Pages**: Admin overview, bookings, packages, destinations, vehicles, finance, users, partners, support
- **Auth Pages**: Login, registration

### 2. Business Logic Layer
- **API Routes** (`src/app/api/`): RESTful endpoints for CRUD operations
- **Server Components**: Data fetching with `async` server components
- **Client Components**: Interactive UI with React hooks

### 3. Data Access Layer (Services)
- **Service Layer** (`src/services/`): Centralised database query functions
  - `package.service.ts` — Package listing, featured, signature
  - `dashboard.service.ts` — KPI aggregations, pipeline, activity
  - `fleet.service.ts` — Fleet calendar, availability
  - `finance.service.ts` — Revenue, invoices, aging reports
  - `analytics.service.ts` — Monthly bookings, revenue trends
  - `hotel.service.ts` — Hotel partners, services, blocks
  - `crud.service.ts` — All remaining CRUD operations
- **Mongoose Models** (`src/models/`): 25 schema definitions with validation
- **Database Connection** (`src/lib/mongodb.ts`): Singleton connection pool

---

## Component Hierarchy

```mermaid
graph TD
    RootLayout["RootLayout (layout.tsx)"]

    subgraph Public["Public Routes"]
        PubLayout["(public)/layout.tsx"]
        PubLayout --> Navbar
        PubLayout --> Footer
        PubLayout --> ConciergeBtn["ConciergeButton"]

        Home["page.tsx (Homepage)"]
        Home --> Hero["HeroSection"]
        Home --> Social["SocialProof"]
        Home --> HowIt["HowItWorks"]
        Home --> Signature["SignatureExperiences"]
        Home --> Curated["CuratedCollection"]
        Home --> DestShow["DestinationShowcase"]
        Home --> Heritage["HeritageStory"]
        Home --> Standard["YataraStandard"]
    end

    subgraph Dashboard["Dashboard Routes"]
        DashLayout["dashboard/layout.tsx"]
        DashLayout --> Sidebar["DashboardSidebar"]
        DashLayout --> DashContent["Dashboard Content"]
    end

    RootLayout --> Public
    RootLayout --> Dashboard
```

---

## Database Schema

```mermaid
erDiagram
    USER {
        string name
        string email
        string password
        string role
        string phone
    }

    PACKAGE {
        string title
        string slug
        string description
        number priceMin
        number durationDays
        string[] images
        string difficulty
        boolean isPublished
    }

    DESTINATION {
        string title
        string slug
        string description
        string[] images
        number lat
        number lng
    }

    BOOKING {
        ObjectId userId
        ObjectId packageId
        string status
        number totalAmount
        date startDate
        date endDate
        number guests
    }

    VEHICLE {
        string name
        string type
        number capacity
        number pricePerDay
        string[] images
        boolean isAvailable
    }

    PARTNER {
        string name
        string type
        string email
        string phone
        string address
    }

    PAYMENT {
        ObjectId bookingId
        number amount
        string status
        string method
        string transactionId
    }

    TICKET {
        ObjectId userId
        string subject
        string message
        string status
        string priority
    }

    REFUND_REQUEST {
        ObjectId bookingId
        ObjectId requestedBy
        string reason
        string refundMethod
        string status
        number amount
    }

    INVOICE {
        ObjectId bookingId
        string invoiceNo
        number totalAmount
        number paidAmount
        string status
    }

    CUSTOM_PLAN {
        ObjectId userId
        string title
        object[] itinerary
        string status
    }

    AUDIT_LOG {
        ObjectId actorId
        string action
        string target
        Date timestamp
    }

    USER ||--o{ BOOKING : creates
    PACKAGE ||--o{ BOOKING : "booked as"
    BOOKING ||--o{ PAYMENT : "paid via"
    BOOKING ||--o{ REFUND_REQUEST : "refund for"
    BOOKING ||--|| INVOICE : "invoiced as"
    USER ||--o{ TICKET : submits
    USER ||--o{ CUSTOM_PLAN : plans
    USER ||--o{ AUDIT_LOG : triggers
```

---

## Authentication Flow

```mermaid
sequenceDiagram
    participant U as User
    participant M as Middleware
    participant API as API Route
    participant DB as MongoDB

    U->>M: Request with JWT cookie
    M->>M: Verify JWT token
    alt Token Valid
        M->>API: Forward request with user context
        API->>DB: Query data
        DB-->>API: Return results
        API-->>U: 200 OK + data
    else Token Invalid/Missing
        M-->>U: 401 Redirect to /login
    end
```

---

## Folder Structure

```
Yatara-Ceylon/
├── docs/                    # Documentation
├── public/                  # Static assets (images, videos)
│   ├── images/              # Page images
│   └── Hero-Section.mp4     # Hero video
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── (public)/        # Public-facing pages
│   │   │   ├── page.tsx     # Homepage
│   │   │   ├── packages/    # Package listing & detail
│   │   │   ├── destinations/# Destination listing & detail
│   │   │   ├── vehicles/    # Vehicle fleet page
│   │   │   ├── build-tour/  # Interactive tour builder
│   │   │   ├── guide/       # Sri Lanka travel guide
│   │   │   ├── inquire/     # Inquiry form
│   │   │   └── layout.tsx   # Public layout (Navbar + Footer)
│   │   ├── dashboard/       # Admin dashboard pages
│   │   │   ├── page.tsx     # Dashboard overview
│   │   │   ├── bookings/    # Booking management
│   │   │   ├── packages/    # Package CRUD
│   │   │   ├── destinations/# Destination CRUD
│   │   │   ├── vehicles/    # Vehicle fleet management
│   │   │   ├── finance/     # Financial reports
│   │   │   ├── users/       # User management
│   │   │   ├── partners/    # Partner management
│   │   │   ├── support/     # Support tickets
│   │   │   └── layout.tsx   # Dashboard layout (Sidebar)
│   │   ├── api/             # API routes
│   │   ├── auth/            # Authentication pages
│   │   ├── globals.css      # Global styles + Liquid Glass System
│   │   └── layout.tsx       # Root layout
│   ├── components/
│   │   ├── layout/          # Navbar, Footer, DashboardSidebar
│   │   ├── public/          # Homepage sections, cards
│   │   ├── dashboard/       # Dashboard tables, forms
│   │   └── ui/              # Radix UI primitives
│   ├── services/            # Centralised data access layer
│   ├── lib/                 # Utilities (DB, auth, currency, rbac)
│   ├── models/              # Mongoose schemas (25 models)
│   └── middleware.ts        # Auth middleware
├── tailwind.config.ts       # Design tokens + animations
├── next.config.ts           # Next.js configuration
└── package.json
```
