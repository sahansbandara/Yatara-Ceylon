# Ceylon Escapes - Demo Script

This script provides a structured walkthrough of the **Ceylon Escapes** tourism management system, covering both the public-facing website and the administrative dashboard.

---

## 🎭 Role 1: The Traveler (Public User)

**Goal:** Explore Sri Lanka, browse packages, and book a tour.

### Scene 1: Homepage & Inspiration
1.  **Open Homepage** (`/`)
    -   *Action*: Scroll down to see the **Hero Video** and **About Section**.
    -   *Narrative*: "We start with an immersive introduction to Sri Lanka's beauty."
2.  **Destinations**
    -   *Action*: Scroll to **Popular Destinations**. Click on a destination (e.g., *Sigiriya*).
    -   *Observation*: View rich images and description of the location.

### Scene 2: Finding a Tour
1.  **Browse Packages**
    -   *Action*: Click **"Tours"** in the navbar (`/tours`).
    -   *Action*: Use filters (if implemented) or browse the list.
    -   *Action*: Select **"Cultural Triangle Explorer"**.
2.  **Tour Details**
    -   *Action*: Scroll through the **Itinerary** (Day 1 to 5).
    -   *Action*: Check **"What's Included"** and **"Price"**.
    -   *Narrative*: "Detailed information helps travelers decide with confidence."

### Scene 3: Booking a Tour
1.  **Enquiry**
    -   *Action*: Click **"Book Now"** or **"Enquire"** on the tour page.
    -   *Action*: Fill out the **Contact/Booking Form**:
        -   Name: `John Doe`
        -   Email: `john@example.com`
        -   Message: "Interested in travel in December."
    -   *Action*: Submit.
    -   *Observation*: "Inquiry submitted successfully!" notification.

### Scene 4: Custom Tour Builder (Optional)
1.  **Build Your Own**
    -   *Action*: Navigate to **"Build Tour"** (`/build-tour`).
    -   *Action*: Click on districts on the map (e.g., *Kandy*, *Galle*).
    -   *Action*: Select places within those districts.
    -   *Action*: save or submit the plan (if feature complete).

---

## 🎭 Role 2: The Administrator (Back Office)

**Goal:** Manage bookings, content, and finances.

### Scene 5: Admin Login
1.  **Access Portal**
    -   *Action*: Go to `/login` (or click Admin Login in footer).
    -   *Input*:
        -   Email: `admin@ceylonescapes.lk`
        -   Password: `Admin@123`
    -   *Action*: Click **Login**.

### Scene 6: Dashboard Overview
1.  **Overview Page** (`/dashboard`)
    -   *Observation*: View **KPI Cards** (Total Revenue, Active Bookings, Total Users).
    -   *Narrative*: "Real-time snapshot of business performance."

### Scene 7: Managing Bookings
1.  **Booking List**
    -   *Action*: Navigate to **"Bookings"** (`/dashboard/bookings`).
    -   *Action*: Find the recent enquiry from *John Doe*.
    -   *Action*: Click **"View"** / **"Edit"**.
    -   *Action*: Change Status from `PENDING` to `CONFIRMED`.
    -   *Action*: Assign a **Vehicle** (e.g., *Toyota Prius*).
    -   *Narrative*: "Admins have full control over the booking lifecycle."

### Scene 8: Content Management
1.  **Manage Packages**
    -   *Action*: Go to **"Packages"** (`/dashboard/packages`).
    -   *Action*: Click **"Add New Package"**.
    -   *Action*: Fill in Title, Price, Duration.
    -   *Action*: Save.
    -   *Observation*: New package appears in the list (and on public site).

### Scene 9: Finance & Reports
1.  **Finance**
    -   *Action*: Go to **"Finance"** (`/dashboard/finance`).
    -   *Action*: View **Invoices** and **Payments**.
    -   *Action*: Generate a **PDF Receipt** for a payment.
    -   *Narrative*: "Automated financial tracking and reporting."

---

## 🎬 Closing
"Ceylon Escapes provides a seamless end-to-end solution for tourism operators, combining a captivating front-end experience with a powerful back-end management system."
