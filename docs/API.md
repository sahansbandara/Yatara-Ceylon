# 🔌 API Reference

## Overview

All API endpoints are located at `/api/*` and follow RESTful conventions. Authentication is handled via JWT tokens stored in HTTP-only cookies.

---

## Authentication

### POST `/api/auth/login`
Authenticate a user and receive a JWT token.

**Request Body:**
```json
{
    "email": "admin@yataraceylon.com",
    "password": "your-password"
}
```

**Response (200):**
```json
{
    "success": true,
    "user": {
        "id": "65a1b2c3d4e5f6g7h8i9j0k1",
        "name": "Admin User",
        "email": "admin@yataraceylon.com",
        "role": "ADMIN"
    }
}
```

**Roles:** `ADMIN`, `STAFF`, `USER`, `VEHICLE_OWNER`, `HOTEL_OWNER`

---

## Packages

### GET `/api/packages`
List all packages (supports query filters).

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `tag` | string | Filter by tag (heritage, wildlife, beach) |
| `difficulty` | string | Filter by difficulty level |
| `published` | boolean | Filter by publish status |

**Response (200):**
```json
{
    "packages": [
        {
            "_id": "...",
            "title": "Ceylon Highlights Express",
            "slug": "ceylon-highlights-express",
            "description": "...",
            "priceMin": 1200,
            "durationDays": 7,
            "images": ["/images/packages/ceylon-express.jpg"],
            "difficulty": "Easy",
            "tags": ["highlights", "culture"],
            "isPublished": true
        }
    ]
}
```

### GET `/api/packages/:id`
Get a single package by ID.

### POST `/api/packages` 🔒
Create a new package (Admin/Staff only).

### PUT `/api/packages/:id` 🔒
Update a package (Admin/Staff only).

### DELETE `/api/packages/:id` 🔒
Soft-delete a package (Admin only).

---

## Destinations

### GET `/api/destinations`
List all destinations.

### GET `/api/destinations/:id`
Get a single destination.

### POST `/api/destinations` 🔒
Create a new destination (Admin/Staff only).

### PUT `/api/destinations/:id` 🔒
Update a destination (Admin/Staff only).

---

## Bookings

### GET `/api/bookings` 🔒
List all bookings (Admin/Staff: all, User: own bookings).

### GET `/api/bookings/:id` 🔒
Get booking details.

### POST `/api/public/booking-request`
Submit a public booking request (no auth required).

**Request Body:**
```json
{
    "packageId": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+94771234567",
    "startDate": "2024-03-15",
    "endDate": "2024-03-22",
    "guests": 2,
    "specialRequests": "Vegetarian meals preferred"
}
```

### PUT `/api/bookings/:id` 🔒
Update booking status (Admin/Staff only).

**Status transitions:** `NEW` → `CONTACTED` → `CONFIRMED` → `COMPLETED` / `CANCELLED`

---

## Vehicles

### GET `/api/vehicles`
List all vehicles.

### POST `/api/vehicles` 🔒
Create a vehicle (Admin/Vehicle Owner).

### PUT `/api/vehicles/:id` 🔒
Update vehicle details.

---

## Users

### GET `/api/users` 🔒
List all users (Admin only).

### POST `/api/users` 🔒
Create a user (Admin only).

### PUT `/api/users/:id` 🔒
Update user details.

---

## Payments

### POST `/api/payhere/create` 🔒
Initialize a PayHere payment session.

### POST `/api/payhere/notify`
PayHere webhook callback (server-to-server).

### GET `/api/payments` 🔒
List payment records.

---

## Support Tickets

### GET `/api/tickets` 🔒
List support tickets.

### POST `/api/public/tickets`
Submit a public support ticket.

### PUT `/api/tickets/:id` 🔒
Update/reply to a ticket.

---

## Partners

### GET `/api/partners` 🔒
List partners (Admin/Staff only).

### POST `/api/partners` 🔒
Create a partner.

---

## Error Responses

All error responses follow this format:

```json
{
    "error": "Descriptive error message",
    "status": 400
}
```

| Status | Meaning |
|--------|---------|
| 400 | Bad Request — invalid parameters |
| 401 | Unauthorized — missing or invalid token |
| 403 | Forbidden — insufficient role permissions |
| 404 | Not Found — resource doesn't exist |
| 500 | Internal Server Error |

---

🔒 = Requires authentication (JWT cookie)
