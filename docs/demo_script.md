# Yatara Ceylon — Demo Script

This script provides a structured walkthrough of the **Yatara Ceylon** Tourism Operations Management System (TOMS), covering both the public-facing website and the administrative dashboard.

---

## 🎭 Role 1: The Traveler (Public User)

**Goal:** Explore Sri Lanka, browse packages, and book a tour.

### Scene 1: Homepage & Inspiration
1.  **Open Homepage** (`/`)
    -   *Action*: Scroll down to see the **Hero Video** and animated text carousel.
    -   *Narrative*: "We start with an immersive introduction to Sri Lanka's beauty with cinematic parallax video and glass overlays."
2.  **Social Proof & Trust**
    -   *Action*: Scroll to **Social Proof Strip** — animated counters (500+ tours, 98% satisfaction, etc.).
    -   *Observation*: Testimonial cards with glassmorphic styling.
3.  **Signature Experiences**
    -   *Action*: Scroll to **Signature Experiences** section — editorial-style featured journeys.
    -   *Action*: Click on a featured package to view details.

### Scene 2: Finding a Tour
1.  **Browse Packages**
    -   *Action*: Click **"Packages"** in the navbar (`/packages`).
    -   *Action*: Browse the curated collection with filter chips.
    -   *Action*: Select a package (e.g., **"Ceylon Highlights Express"**).
2.  **Tour Details**
    -   *Action*: Scroll through the **Itinerary**, **What's Included**, and **Price**.
    -   *Action*: Toggle **currency** (LKR ↔ USD) in the navbar.
    -   *Narrative*: "Detailed information with dual-currency pricing helps travelers decide with confidence."

### Scene 3: Booking a Tour
1.  **Inquiry**
    -   *Action*: Click **"Enquire Now"** on the package detail page.
    -   *Action*: Fill out the **Inquiry Form** on `/inquire`:
        -   Name: `John Doe`
        -   Email: `john@example.com`
        -   Phone: `+94 77 123 4567`
        -   Message: "Interested in travel in December."
    -   *Action*: Complete Cloudflare Turnstile captcha and submit.
    -   *Observation*: Success notification with confirmation.

### Scene 4: Bespoke Tour Builder
1.  **Build Your Own**
    -   *Action*: Navigate to **"Build Tour"** (`/build-tour`).
    -   *Action*: Click on districts on the interactive Sri Lanka map (e.g., *Kandy*, *Galle*).
    -   *Action*: Browse hidden gems and attractions within each district.
    -   *Action*: Add places to the itinerary and drag-and-drop to reorder.
    -   *Action*: Preview the complete day-by-day plan.
    -   *Narrative*: "Travelers can design their own dream journey with our interactive planner."

---

## 🎭 Role 2: The Administrator (Back Office)

**Goal:** Manage bookings, content, finances, and partners.

### Scene 5: Admin Login
1.  **Access Portal**
    -   *Action*: Go to `/login`.
    -   *Input*:
        -   Email: `admin@yataraceylon.com`
        -   Password: *(use demo credentials)*
    -   *Action*: Click **Login**.

### Scene 6: Dashboard Overview
1.  **Overview Page** (`/dashboard`)
    -   *Observation*: View **KPI Stat Cards** (Total Revenue, Active Bookings, Total Packages, Users).
    -   *Observation*: Recent bookings pipeline and activity audit log.
    -   *Narrative*: "Real-time snapshot of business performance with glassmorphic stat cards."

### Scene 7: Managing Bookings
1.  **Booking List**
    -   *Action*: Navigate to **"Bookings"** (`/dashboard/bookings`).
    -   *Action*: Find the recent inquiry from *John Doe*.
    -   *Action*: Click **"View"** to see full booking details.
    -   *Action*: Change Status from `NEW` → `CONTACTED` → `CONFIRMED`.
    -   *Action*: Set total amount and generate payment link (20% advance via PayHere).
    -   *Narrative*: "Admins have full control over the booking lifecycle with a clear status pipeline."

### Scene 8: Content Management
1.  **Manage Packages**
    -   *Action*: Go to **"Packages"** (`/dashboard/packages`).
    -   *Action*: Click **"Add New Package"**.
    -   *Action*: Fill in Title, Price, Duration, Itinerary, Images.
    -   *Action*: Save and toggle publish status.
    -   *Observation*: New package instantly appears on the public site.

### Scene 9: Finance & Payments
1.  **Finance Dashboard**
    -   *Action*: Go to **"Finance"** (`/dashboard/finance`).
    -   *Action*: View **Payment Ledger** — all transactions with type (advance/balance/refund).
    -   *Action*: View **Invoices** tab — auto-generated invoices.
    -   *Action*: Generate a **PDF Receipt** for a completed payment.
    -   *Action*: View **Aging Report** for outstanding balances.
    -   *Narrative*: "Complete financial visibility with two-stage payment tracking."

### Scene 10: Refund Management
1.  **Refund Pipeline**
    -   *Action*: Go to **"Refunds"** (`/dashboard/refunds`).
    -   *Action*: Review a pending refund request from a cancelled booking.
    -   *Action*: Staff adds recommendation. Admin approves.
    -   *Action*: Finance marks as refunded with proof upload.
    -   *Observation*: Payment ledger automatically adjusted.
    -   *Narrative*: "Structured 3-stage refund pipeline ensures accountability and audit readiness."

---

## 🎬 Closing
"Yatara Ceylon provides a seamless end-to-end Tourism Operations Management System, combining a captivating luxury front-end experience with a powerful back-end management system — from inquiry to payment to refund, all in one platform."
