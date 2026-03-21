# 💰 Finance Management Module

> Payment processing, advance tracking, invoice management, manual recording, and financial dashboards.

---

## Overview

The Finance module tracks **all monetary flows** in the system. It manages the 20% advance payment model via PayHere, manual payment recording by staff, invoice generation, and provides a real-time financial dashboard with collection metrics.

> **Scope Note**: Per the approved project document (ITP_IT_101), the initial scope focuses on **manual payment recording** — invoice, advance payment, receipt, remaining balance, and refund tracking. Online payment via PayHere is available as an enhancement.

---

## Payment Processing Flow

```mermaid
flowchart TD
    subgraph Sources["Payment Sources"]
        PH["💳 PayHere Online\n(20% advance)"]
        MANUAL["📝 Manual Recording\n(Cash/Bank/Card)"]
    end

    PH --> WEBHOOK["PayHere Webhook\n/api/payhere/notify"]
    WEBHOOK --> VERIFY{"MD5 Signature\nVerified?"}
    VERIFY -->|No| REJECT["❌ Reject + Log"]
    VERIFY -->|Yes| UPDATE_PAY["Update Payment\nstatus: SUCCESS"]

    MANUAL --> STAFF_API["Staff/Admin API\nPOST /api/payments"]
    STAFF_API --> CREATE_PAY["Create Payment\nmethod: CASH|BANK|CARD"]

    UPDATE_PAY --> BOOKING_UPDATE["Update Booking:\n• paidAmount += amount\n• remainingBalance = total - paid\n• status → ADVANCE_PAID"]
    CREATE_PAY --> BOOKING_UPDATE

    BOOKING_UPDATE --> DASHBOARD["📊 Finance Dashboard\nUpdated in real-time"]

    style REJECT fill:#ef4444,color:#fff
    style DASHBOARD fill:#22c55e,color:#fff
```

---

## Payment Entity

```mermaid
erDiagram
    PAYMENT {
        ObjectId _id PK
        ObjectId bookingId FK
        ObjectId invoiceId FK "optional"
        String orderId UK "YATRA-timestamp"
        String provider "PAYHERE | MANUAL"
        Enum method "CASH | BANK | CARD_OTHER | ONLINE"
        Enum type "PAYMENT | REFUND"
        Number amount
        String currency "LKR"
        Enum status "INITIATED | PENDING | SUCCESS | FAILED | CANCELED | CHARGEDBACK"
        Boolean md5sigVerified
        String payherePaymentId
        Date paidAt
        String reference
        String notes
        Object rawNotifyPayload "webhook data"
        Boolean isDeleted
    }

    INVOICE {
        ObjectId _id PK
        ObjectId bookingId FK
        String invoiceNo UK "auto-generated"
        Array items "label, qty, unitPrice"
        Number subtotal "calculated"
        Number discount
        Number total "subtotal - discount"
        Number advanceRequired
        String notes
        Enum status "DRAFT | FINAL"
        Boolean isDeleted
    }

    BOOKING ||--o{ PAYMENT : "has payments"
    BOOKING ||--o{ INVOICE : "has invoices"
    INVOICE ||--o{ PAYMENT : "linked to"
```

---

## Financial Calculations

```mermaid
flowchart LR
    TOTAL["totalCost\n(from package price)"] --> ADV["advanceAmount\n= totalCost × 20%"]
    ADV --> PAID["paidAmount\n(sum of SUCCESS payments)"]
    PAID --> REM["remainingBalance\n= totalCost - paidAmount"]

    REM --> CHECK{"remainingBalance > 0?"}
    CHECK -->|Yes| DUE["⚠️ Balance Due\n(shown in orange)"]
    CHECK -->|No| SETTLED["✅ Fully Settled\n(shown in green)"]

    style DUE fill:#f59e0b,color:#fff
    style SETTLED fill:#22c55e,color:#fff
```

---

## Finance Dashboard (`/dashboard/finance`)

```mermaid
flowchart TB
    subgraph Cards["Summary Cards"]
        C1["💵 Total Collected\nSum of SUCCESS payments"]
        C2["📈 Advances Received\nSum of booking paidAmounts"]
        C3["⚠️ Pending Balances\nSum of remainingBalances > 0"]
        C4["📊 Collection Rate\ncollected / (collected + pending)"]
    end

    subgraph Panels["Detail Panels"]
        P1["📋 Recent Payments\n10 latest payment records"]
        P2["🔴 Outstanding Balances\n10 bookings with highest due"]
    end

    Cards --> Panels
    P2 -->|Click| BD["→ Booking Detail Page"]
```

### Dashboard Data Queries

| Metric | Query |
|--------|-------|
| Total Collected | `Payment.aggregate($sum amount where status=SUCCESS)` |
| Advances Received | `Booking.aggregate($sum paidAmount where paidAmount > 0)` |
| Pending Balances | `Booking.aggregate($sum remainingBalance where remainingBalance > 0)` |
| Collection Rate | `collected / (collected + pending) × 100%` |
| Recent Payments | `Payment.find().sort(createdAt: -1).limit(10)` |
| Outstanding | `Booking.find(remainingBalance > 0).sort(remainingBalance: -1).limit(10)` |

---

## Invoice System

```mermaid
sequenceDiagram
    participant A as Admin
    participant API as /api/invoices
    participant DB as MongoDB

    A->>API: POST {bookingId, items[], discount, advanceRequired}
    API->>API: Calculate subtotal (Σ qty × unitPrice)
    API->>API: Calculate total (subtotal - discount)
    API->>API: Generate invoiceNo
    API->>DB: Create Invoice (status: DRAFT)
    DB-->>API: Invoice document
    API-->>A: Invoice created

    Note over A: Review and finalize
    A->>API: PATCH {status: FINAL}
    API->>DB: Update to FINAL
    API-->>A: Invoice finalized ✅
```

---

## Manual Payment Recording

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `bookingId` | String | ✅ | Which booking this payment is for |
| `amount` | Number | ✅ | Payment amount (min 0.01) |
| `method` | Enum | ✅ | `CASH`, `BANK`, `CARD_OTHER`, `ONLINE` |
| `invoiceId` | String | ❌ | Link to invoice if applicable |
| `paidAt` | String | ❌ | Payment date (defaults to now) |
| `reference` | String | ❌ | Bank reference / receipt number |
| `type` | Enum | ❌ | `PAYMENT` (default) or `REFUND` |
| `notes` | String | ❌ | Internal notes |

---

## Key Files

| File | Purpose |
|------|---------|
| `src/models/Payment.ts` | Payment Mongoose schema |
| `src/models/Invoice.ts` | Invoice Mongoose schema |
| `src/app/dashboard/finance/page.tsx` | Finance dashboard |
| `src/app/api/payments/route.ts` | Payment CRUD API |
| `src/app/api/invoices/route.ts` | Invoice CRUD API |
| `src/app/api/payhere/create/route.ts` | PayHere session creation |
| `src/app/api/payhere/notify/route.ts` | PayHere webhook handler |
| `src/lib/payhere/hash.ts` | MD5 signature verification |
| `src/lib/validations.ts` | `createPaymentSchema`, `createInvoiceSchema` |

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/payments` | Admin | List payment records |
| `POST` | `/api/payments` | Staff+ | Record manual payment |
| `GET` | `/api/invoices` | Staff+ | List invoices |
| `POST` | `/api/invoices` | Staff+ | Create invoice |
| `PATCH` | `/api/invoices/:id` | Staff+ | Update invoice status |
| `POST` | `/api/payhere/create` | — | Create PayHere session |
| `POST` | `/api/payhere/notify` | — | PayHere webhook (MD5 verified) |
