# 📋 Features & User Flows

## Overview

Yatara Ceylon TOMS serves multiple user types with distinct workflows. This document covers every feature module with user flow descriptions.

---

## User Roles

| Role | Access Level |
|------|-------------|
| **Visitor** | Browse packages, destinations, vehicles. Submit inquiries. |
| **User** | Book packages, view booking history, submit support tickets. |
| **Staff** | Manage bookings, packages, destinations. |
| **Admin** | Full CRUD access, user management, finance, partners. |
| **Vehicle Owner** | Manage own vehicles, view bookings. |
| **Hotel Owner** | Manage hotel partnerships. |

---

## Public Features

### 1. Homepage
- **Hero Carousel**: 3-slide auto-cycling text carousel over video background
- **Social Proof**: Animated trust stats + testimonial cards
- **How It Works**: 3-step concierge booking flow visualization
- **Signature Experiences**: Editorial-style featured journeys
- **Curated Collection**: Horizontal scroll journey carousel
- **Why Sri Lanka**: Stats grid + auto-scrolling destination marquee
- **Heritage Story**: Brand story with glass stat overlay
- **Yatara Standard**: Trust badge grid

### 2. Packages Page
- Browse curated travel packages
- Filter by duration, difficulty, tags
- Dual-currency pricing (LKR/USD)
- Detailed package pages with image galleries

### 3. Destinations Page
- Browse Sri Lankan destinations
- High-quality destination cards with descriptions
- Detailed destination pages with maps

### 4. Build Your Tour (Bespoke Planner)
- Interactive Sri Lanka map with 25 districts
- Click a district → explore hidden gems & attractions
- Drag-and-drop itinerary builder
- Day-by-day planning with estimated timing
- Preview mode with complete itinerary

**User Flow:**
```
Select District → Browse Gems → Add to Itinerary → Reorder Days → Preview → Submit Inquiry
```

### 5. Vehicle Fleet
- Browse transfer vehicles (sedans, SUVs, minibuses, luxury)
- View capacity, pricing, availability
- Book private transfers

### 6. Inquiry System
- Submit trip inquiries via form
- Auto-confirmation email
- Staff follow-up within 2 hours

---

## Dashboard Features

### 7. Dashboard Overview
- KPI stat cards: Revenue, Bookings, Active Packages, Users
- Recent bookings list
- Activity audit log

### 8. Booking Management
- View all bookings with status filters
- Status workflow: NEW → CONTACTED → CONFIRMED → COMPLETED / CANCELLED
- Assign staff to bookings
- View payment history per booking

### 9. Package Management
- Create/edit/delete packages
- Rich text descriptions
- Multi-image upload
- Publish/unpublish toggle
- Tag categorization

### 10. Destination Management
- Create/edit/delete destinations
- Coordinate-based location (lat/lng)
- Image management

### 11. Vehicle Management
- Add/manage fleet vehicles
- Set availability and pricing
- Block dates for maintenance

### 12. Financial Reports
- Revenue tracking (monthly, quarterly)
- Two-stage payment ledger (20% advance + 80% balance)
- Invoice generation (PDF) with auto-numbering
- Aging reports for outstanding balances
- Payment reconciliation dashboard

### 13. User Management (Admin)
- Create/edit/deactivate users
- Assign roles (Admin, Staff, User, Vehicle Owner, Hotel Owner)
- View user activity

### 14. Partner Management
- Add hotel/activity/transport partners
- Track partnership details
- Service management and rate cards
- Availability blocking

### 15. Support Tickets
- View/reply to customer support tickets
- Priority-based ticket management
- Status tracking
- Email notifications on replies

### 16. Refund Management
- Customer cancellation with <5 days restriction
- Refund request pipeline: Staff Review → Admin Approval → Finance Execution
- Refund method capture (bank transfer, original payment)
- Payment ledger auto-adjustment on refund completion
- Proof of refund upload and audit trail

---

## Authentication Flow

```
Login Page → Enter email/password → JWT token issued → Cookie set → Middleware validates on each request → Role-based access
```

## Payment Flow

```
Booking CONFIRMED → Admin sets totalAmount → 20% advance payment link generated → Customer pays via PayHere
→ Webhook records payment → Status: BALANCE_PENDING → 80% collected manually → Staff records manual payment
→ Status: FULLY_PAID → Invoice auto-generated → PDF receipt available
```

## Refund Flow

```
Customer cancels (>5 days before trip) → RefundRequest created → Staff adds recommendation
→ Admin approves/rejects → Finance marks as refunded with proof → Ledger auto-adjusted
```

---

## Currency System

- **Dual Currency**: LKR (Sri Lankan Rupee) and USD
- **Toggle**: Available in navbar on all public pages
- **Conversion**: Real-time rate applied via `CurrencyContext`
- **Persistence**: Selected currency stored in context for session

---

## Design System

The entire application uses the **Liquid Glass Design System** — a custom glassmorphic framework. See [DESIGN-SYSTEM.md](./DESIGN-SYSTEM.md) for full documentation.

Key visual features:
- Frosted glass panels with backdrop blur
- Gold accent hover effects
- Parallax video backgrounds
- Auto-scrolling destination marquees
- Animated scroll counters
- Staggered entrance animations
