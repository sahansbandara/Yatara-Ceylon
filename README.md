# Ceylon Escapes - Tourism Management System

A comprehensive, responsive tourism website and management dashboard built for Sri Lanka's travel industry. This application facilitates tour package browsing, custom itinerary building, and a full back-office management suite for administrators.

---

## 🚀 Live Demo

**Public URL**: https://yatara-ceylon.vercel.app

**Admin Portal Access**:
To access the management dashboard, use the following credentials:
- **Login URL**: `/login`
- **Username**: `admin@ceylonescapes.lk`
- **Password**: `Admin@123`

*> Note: If the database is empty, run `npm run seed` locally to populate initial data.*

---

## 📖 Project Overview

Ceylon Escapes allows travelers to explore Sri Lanka's rich culture and landscapes through curated packages or custom-built tours. For operators, it provides a centralized dashboard to manage bookings, content, finance, and user support.

### Key Features

**Public Interface:**
- **Dynamic Tour Packages**: Browse and filter curated travel itineraries.
- **Destination Guide**: Explore key locations with rich media.
- **Tour Builder**: Interactive map-based custom tour planner.
- **Booking Engine**: Streamlined enquiry and booking process.
- **Responsive Design**: Optimized for mobile, tablet, and desktop.

**Admin Dashboard:**
- **Content Management**: CRUD operations for Packages, Destinations, and Vehicles.
- **Booking Management**: Track and update booking statuses.
- **Finance Module**: Generate invoices, track payments, and view reports.
- **User Management**: Role-Based Access Control (RBAC) for staff and admins.
- **Support System**: Integrated ticketing system for customer inquiries.

---

## 🏗️ Architecture

The application is built on the **Next.js 16 App Router** architecture, leveraging Server Components for performance and Client Components for interactivity.

### Component Structure

- **Public Routes**: Home Page, Tours Listing, Tour Details, Destinations, Contact.
- **Protected Routes**: Overview, Bookings Management, Content Management, User Management, Finance.

### User Flow

1. **Visitor**: Browse Public Website -> Inquire/Book -> Booking Request
2. **Admin**: Login -> Admin Dashboard -> Manage Content/Bookings -> Database

---

## 🛠️ Technology Stack

| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| **Framework** | Next.js | 16.1 | App Router, Server Actions, API Routes |
| **UI Library** | React | 18.3 | User Interface Components |
| **Styling** | Tailwind CSS | 3.4 | Utility-first styling |
| **Components** | shadcn/ui | Latest | Accessible, reusable UI components |
| **Database** | MongoDB | Atlas | Document-oriented database |
| **ORM** | Mongoose | 8.9 | Object Data Modeling |
| **Validation** | Zod | 3.24 | Schema validation |
| **Maps** | Leaflet | 1.9 | Interactive maps |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or higher
- MongoDB Connection String

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sahansbandara/ITP-Project-Tourism-WEB.git
   cd ITP-Project-Tourism-WEB
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   Create a `.env.local` file:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Seed Database** (Optional)
   Populate the database with sample data:
   ```bash
   npm run seed
   ```

5. **Run Development Server**
   ```bash
   npm run dev
   ```
   Access the app at `http://localhost:3000`.

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 👥 Team

**SLIIT ITP Project Team**
*Developing sustainable tourism solutions.*
