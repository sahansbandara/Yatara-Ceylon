# 🚀 Local Development Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed:

| Tool | Version | Download |
|------|---------|----------|
| Node.js | v18+ (LTS recommended) | [nodejs.org](https://nodejs.org/) |
| npm | v9+ (comes with Node) | — |
| Git | Latest | [git-scm.com](https://git-scm.com/) |
| MongoDB Atlas | Free tier or higher | [mongodb.com/atlas](https://www.mongodb.com/atlas) |

---

## Step 1: Clone the Repository

```bash
git clone https://github.com/YourOrg/Yatara-Ceylon.git
cd Yatara-Ceylon
```

## Step 2: Install Dependencies

```bash
npm install
```

This installs ~1,200 packages including Next.js, React, Tailwind CSS, Mongoose, and Radix UI.

## Step 3: Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
cp .env.example .env.local
```

Fill in the following variables:

```env
# ─── Database ────────────────────────────────────────────
MONGODB_URI=mongodb+srv://<app-user>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
# Optional dedicated backup user / URI
MONGODB_BACKUP_URI=mongodb+srv://<backup-user>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
# Optional restore target. Prefer a local or staging DB, not production.
MONGODB_RESTORE_URI=mongodb://127.0.0.1:27017/<dbname>-restore

# ─── Authentication ──────────────────────────────────────
JWT_SECRET=your-super-secret-jwt-key-at-least-32-chars
JWT_EXPIRES_IN=1d

# ─── Application ─────────────────────────────────────────
APP_BASE_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# ─── Contact / Widgets ───────────────────────────────────
WHATSAPP_NUMBER=94704239802
NEXT_PUBLIC_WHATSAPP_NUMBER=94704239802
NEXT_PUBLIC_TAWKTO_PROPERTY_ID=your-tawk-property-id
NEXT_PUBLIC_TAWKTO_WIDGET_ID=your-tawk-widget-id

# ─── Captcha ─────────────────────────────────────────────
NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA

# ─── Email (SMTP) ────────────────────────────────────────
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=info@example.com
SMTP_PASS=your-smtp-password
SMTP_FROM="Yatara Ceylon <info@example.com>"

# ─── PayHere Payment Gateway ─────────────────────────────
PAYHERE_MODE=sandbox
PAYHERE_MERCHANT_ID=your-merchant-id
PAYHERE_MERCHANT_SECRET=your-merchant-secret
PAYHERE_MERCHANT_SECRET_PROD=
PAYHERE_MERCHANT_SECRET_WWW=
PAYHERE_APP_ID=
PAYHERE_APP_SECRET=
PAYHERE_CURRENCY=LKR

# ─── Stripe (Optional / server-side routes only) ────────
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_CURRENCY=lkr
```

### Getting a MongoDB Atlas URI

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas) and create a free account
2. Create a new cluster (M0 Free Tier is fine)
3. In **Database Access**, create a user with read/write permissions
4. In **Network Access**, add your IP (or `0.0.0.0/0` for development)
5. Click **Connect** → **Connect your application** → Copy the URI
6. Replace `<username>`, `<password>`, and `<dbname>` in the URI

## Step 4: Install MongoDB Database Tools

Local backups and restores use `mongodump` / `mongorestore`.

### macOS

```bash
brew install mongodb-database-tools
```

### Verify

```bash
mongodump --version
mongorestore --version
```

## Step 5: Run the Development Server

```bash
npm run dev
```

The application will start at **http://localhost:3000**.

> **Hot reload** is enabled — any code changes will instantly appear in the browser.

## Step 6: Seed Sample Data (Optional)

To populate the database with sample packages, destinations, and vehicles:

```bash
npm run seed
```

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (hot reload) |
| `npm run build` | Create production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint checks |
| `npm run test` | Run Jest test suite |
| `npm run seed` | Seed database with sample data |
| `npm run backup:mongodb` | Create a compressed MongoDB dump in `backups/mongodb/` |
| `npm run restore:mongodb -- <archive>` | Restore a MongoDB dump archive |

The backup script reads `MONGODB_BACKUP_URI` first, then falls back to `MONGODB_URI`.
The restore script reads `MONGODB_RESTORE_URI` first, then `MONGODB_BACKUP_URI`, then `MONGODB_URI`.
If you restore with `--drop`, the script expects `MONGODB_RESTORE_URI` unless you intentionally add `--allow-fallback-target`.

---

## Project Structure Quick Reference

```
src/
├── app/           # Pages and API routes (Next.js App Router)
├── components/    # Reusable UI components
├── lib/           # Utility functions (DB, auth, currency)
├── models/        # Mongoose database schemas
└── middleware.ts  # Authentication middleware
```

---

## Troubleshooting

### "MongooseServerSelectionError"
- Check your `MONGODB_URI` in `.env.local`
- Ensure your IP is whitelisted in MongoDB Atlas Network Access
- Verify the database user credentials

### Need backups on Atlas free tier
- Atlas free/shared tiers do not give you point-in-time recovery the way dedicated clusters do
- Use `npm run backup:mongodb` for a manual restorable dump
- See [MongoDB Backups](./mongodb-backups.md) for the daily GitHub Actions setup

### GitHub backup workflow fails to connect
- Confirm the repository secret `MONGODB_BACKUP_URI` is set
- Confirm Atlas network access allows GitHub-hosted runners, or run backups from a trusted environment instead
- Prefer a dedicated read-only backup user for `mongodump`

### "Module not found" errors
```bash
rm -rf node_modules .next
npm install
npm run dev
```

### Port 3000 already in use
```bash
npx kill-port 3000
npm run dev
```

### Tailwind styles not applying
```bash
rm -rf .next
npm run dev
```

---

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import repository in [Vercel Dashboard](https://vercel.com)
3. Add all environment variables from `.env.local`
4. Deploy — Vercel auto-detects Next.js

### Manual Build

```bash
npm run build
npm run start
```

The production server runs on port 3000 by default.
