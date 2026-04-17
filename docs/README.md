# 📚 Yatara Ceylon — Documentation Hub

> **TOMS** — Tour Operations Management System

Welcome to the Yatara Ceylon documentation. This folder contains comprehensive guides for developers, designers, and stakeholders.

---

## 📖 Documentation Index

| Document | Description |
|----------|-------------|
| [Architecture](./ARCHITECTURE.md) | System architecture, component hierarchy, data flow & database schema |
| [Setup Guide](./SETUP.md) | Local development setup, environment variables, and deployment |
| [API Reference](./API.md) | REST API endpoints, request/response schemas, authentication |
| [Design System](./DESIGN-SYSTEM.md) | Liquid Glass design system — colors, typography, components |
| [Features](./FEATURES.md) | Complete feature breakdown by module with user flows |
| [MongoDB Backups](./mongodb-backups.md) | Manual restore points and daily Atlas free-tier backup workflow |

---

## 🏗️ Quick Start

```bash
# Clone the repo
git clone https://github.com/YourOrg/Yatara-Ceylon.git
cd Yatara-Ceylon

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your MongoDB URI, JWT secret, etc.

# Run development server
npm run dev

# Open http://localhost:3000
```

> For detailed setup instructions, see [SETUP.md](./SETUP.md)

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Liquid Glass Design System
- **Database**: MongoDB Atlas (Mongoose ODM)
- **Auth**: JWT + bcrypt + middleware-based role guards
- **Payments**: PayHere integration
- **Maps**: Leaflet + GeoJSON
- **UI**: Radix UI primitives + custom glass components

---

## 📄 License

This project is proprietary software. All rights reserved.
