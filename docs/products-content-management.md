# 📦 Products & Content Management Module

> Packages, destinations, FAQs, testimonials, gallery, and SEO-optimized content publishing.

---

## Overview

This module manages all **public-facing content** for the Yatara Ceylon tourism website. It provides full CRUD for tour packages with itineraries, destination pages with regional grouping, customer testimonials, FAQ management, and a gallery/blog system.

---

## Content Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Draft: Admin/Staff creates content
    Draft --> Published: Set isPublished = true
    Published --> Draft: Unpublish for edits
    Published --> Featured: Set isFeatured = true
    Featured --> Published: Remove from featured
    Published --> Deleted: Soft delete
    Draft --> Deleted: Soft delete

    state Published {
        [*] --> Live
        Live --> HomeFeatured: Set isFeaturedHome + homeRank
    }
```

---

## Package Management

### Package Entity

```mermaid
erDiagram
    PACKAGE {
        ObjectId _id PK
        String title
        String slug UK "auto-generated"
        String summary
        String fullDescription
        String duration "e.g. 7 Days / 6 Nights"
        Number durationDays
        Enum type "journey | transfer"
        Enum style "cultural | wildlife | heritage | ..."
        Number priceMin
        Number priceMax
        Number price "fixed price if applicable"
        Number originalPrice "for discount display"
        Array images "URL strings"
        Array highlights "string list"
        Array inclusions "string list"
        Array exclusions "string list"
        Array tags "string list"
        Boolean isPublished
        Boolean isFeatured
        Boolean isFeaturedHome
        Number homeRank
        Boolean isDeleted
    }

    PACKAGE ||--o{ ITINERARY_DAY : has
    ITINERARY_DAY {
        Number day
        String title
        String description
        String activity
    }
```

### Package CRUD Flow

```mermaid
flowchart LR
    subgraph Admin["Admin/Staff Dashboard"]
        LIST["📋 Package List"]
        NEW["➕ New Package"]
        EDIT["✏️ Edit Package"]
        PREVIEW["👁 Preview"]
    end

    subgraph API["API Layer"]
        GET_ALL["GET /api/packages"]
        POST_PKG["POST /api/packages"]
        PATCH_PKG["PATCH /api/packages/:id"]
        DEL_PKG["DELETE /api/packages/:id"]
    end

    subgraph Public["Public Website"]
        PKG_LIST["/packages"]
        PKG_DETAIL["/packages/:slug"]
        HOME["/ (featured)"]
    end

    LIST --> GET_ALL
    NEW --> POST_PKG
    EDIT --> PATCH_PKG
    EDIT --> DEL_PKG

    GET_ALL --> PKG_LIST
    GET_ALL --> HOME
    PKG_DETAIL --> PREVIEW

    style Admin fill:#f0fdf4
    style Public fill:#eff6ff
```

### Package Detail Page Sections

| Section | Data Source | Description |
|---------|-----------|-------------|
| Hero Banner | `images[0]` | Full-width hero with gradient overlay |
| Gallery Strip | `images[1..3]` | 3-image grid below hero |
| Signature Moments | `highlights[]` | Key experience highlights grid |
| Journey Overview | `fullDescription` | Long-form description prose |
| Day-by-Day Itinerary | `itinerary[]` | Timeline with day numbers and activities |
| What's Included | `inclusions[]` | Green checkmark list |
| What's Excluded | `exclusions[]` | Red X list |
| Booking Sidebar | `priceMin`, `priceMax` | Price display + Book Now button |
| Related Journeys | Related packages query | 3 related packages by tags |

---

## Destination Management

```mermaid
erDiagram
    DESTINATION {
        ObjectId _id PK
        String title
        String slug UK
        String description
        String location
        Enum region "SOUTH | CENTRAL | NORTH | ..."
        Array images
        Boolean isPublished
        Boolean isDeleted
    }

    DISTRICT {
        ObjectId _id PK
        String name
        String code
        Enum region
        Object center "lat, lng"
    }

    PLACE {
        ObjectId _id PK
        ObjectId districtId FK
        String name
        Enum category "TEMPLE | BEACH | NATURE | ..."
        String description
        Object coords "lat, lng"
        Array images
        Boolean isActive
    }

    DISTRICT ||--o{ PLACE : contains
```

---

## Other Content Types

### FAQs

```mermaid
flowchart LR
    A["Admin creates FAQ"] --> B["question + answer"]
    B --> C{isPublished?}
    C -->|Yes| D["Visible on /faq page"]
    C -->|No| E["Hidden (draft)"]
```

### Testimonials

| Field | Type | Description |
|-------|------|-------------|
| `name` | String | Customer name |
| `rating` | Number (1-5) | Star rating |
| `comment` | String | Review text |
| `isPublished` | Boolean | Visibility toggle |

### Gallery / Blog

| Field | Type | Description |
|-------|------|-------------|
| `type` | `IMAGE` or `BLOG` | Content type |
| `title` | String | Title |
| `content` | String | Blog body (markdown-capable) |
| `images` | String[] | Image URLs |
| `isPublished` | Boolean | Visibility toggle |

---

## Key Files

| File | Purpose |
|------|---------|
| `src/app/dashboard/packages/page.tsx` | Package list (admin) |
| `src/app/dashboard/packages/[id]/page.tsx` | Package edit form |
| `src/app/dashboard/packages/new/page.tsx` | New package form |
| `src/app/dashboard/destinations/page.tsx` | Destination list (admin) |
| `src/app/(public)/packages/page.tsx` | Public package listing |
| `src/app/(public)/packages/[slug]/page.tsx` | Public package detail |
| `src/app/(public)/destinations/page.tsx` | Public destination listing |
| `src/app/api/packages/route.ts` | Package CRUD API |
| `src/app/api/destinations/route.ts` | Destination CRUD API |
| `src/lib/validations.ts` | Zod schemas for all content types |

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/packages` | Staff+ | List all packages |
| `POST` | `/api/packages` | Staff+ | Create package |
| `GET` | `/api/packages/:id` | Staff+ | Get package detail |
| `PATCH` | `/api/packages/:id` | Staff+ | Update package |
| `DELETE` | `/api/packages/:id` | Admin | Soft delete package |
| `GET` | `/api/destinations` | Staff+ | List destinations |
| `POST` | `/api/destinations` | Staff+ | Create destination |
| `GET` | `/api/public/packages` | — | Public package listing |
