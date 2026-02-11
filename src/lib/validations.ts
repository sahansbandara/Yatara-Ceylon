import { z } from 'zod';

// ─── Packages ───
export const createPackageSchema = z.object({
    title: z.string().min(1, 'Title is required').max(200),
    summary: z.string().min(1, 'Summary is required'),
    fullDescription: z.string().optional(),
    duration: z.string().min(1),
    itinerary: z.array(z.object({
        day: z.number().min(1),
        title: z.string().min(1),
        description: z.string().default(''),
        activity: z.string().optional(),
    })).optional().default([]),
    priceMin: z.number().min(0),
    priceMax: z.number().min(0),
    price: z.number().optional(),
    originalPrice: z.number().optional(),
    images: z.array(z.string()).optional().default([]),
    highlights: z.array(z.string()).optional().default([]),
    inclusions: z.array(z.string()).optional().default([]),
    exclusions: z.array(z.string()).optional().default([]),
    tags: z.array(z.string()).optional().default([]),
    isPublished: z.boolean().optional().default(false),
});
export const updatePackageSchema = createPackageSchema.partial();

// ─── Destinations ───
export const createDestinationSchema = z.object({
    title: z.string().min(1).max(200),
    description: z.string().min(1),
    location: z.string().optional(),
    images: z.array(z.string()).optional().default([]),
    isPublished: z.boolean().optional().default(false),
});
export const updateDestinationSchema = createDestinationSchema.partial();

// ─── FAQs ───
export const createFAQSchema = z.object({
    question: z.string().min(1),
    answer: z.string().min(1),
    isPublished: z.boolean().optional().default(false),
});
export const updateFAQSchema = createFAQSchema.partial();

// ─── Testimonials ───
export const createTestimonialSchema = z.object({
    name: z.string().min(1),
    rating: z.number().min(1).max(5),
    comment: z.string().min(1),
    isPublished: z.boolean().optional().default(false),
});
export const updateTestimonialSchema = createTestimonialSchema.partial();

// ─── Gallery ───
export const createGallerySchema = z.object({
    type: z.enum(['IMAGE', 'BLOG']),
    title: z.string().min(1),
    content: z.string().optional(),
    images: z.array(z.string()).optional().default([]),
    isPublished: z.boolean().optional().default(false),
});
export const updateGallerySchema = createGallerySchema.partial();

// ─── Notifications ───
export const createNotificationSchema = z.object({
    title: z.string().min(1),
    body: z.string().min(1),
    type: z.enum(['OFFER', 'UPDATE', 'ALERT']).default('UPDATE'),
    visibleTo: z.enum(['CUSTOMERS', 'STAFF', 'ALL']).default('ALL'),
    isPublished: z.boolean().optional().default(false),
    publishFrom: z.string().optional(),
    publishTo: z.string().optional(),
});
export const updateNotificationSchema = createNotificationSchema.partial();

// ─── Bookings ───
export const createBookingSchema = z.object({
    customerName: z.string().min(1),
    phone: z.string().min(1),
    email: z.string().email().optional().or(z.literal('')),
    type: z.enum(['PACKAGE', 'VEHICLE', 'CUSTOM']),
    packageId: z.string().optional(),
    vehicleId: z.string().optional(),
    customPlanId: z.string().optional(),
    pax: z.number().min(1),
    pickupLocation: z.string().optional(),
    dates: z.object({
        from: z.string().min(1),
        to: z.string().min(1),
    }),
    notes: z.string().optional(),
    specialRequests: z.string().optional(),
});

export const updateBookingStatusSchema = z.object({
    status: z.enum(['NEW', 'CONTACTED', 'CONFIRMED', 'COMPLETED', 'CANCELLED']),
});

export const assignBookingSchema = z.object({
    assignedStaffId: z.string().optional(),
    assignedVehicleId: z.string().optional(),
});

// ─── Vehicles ───
export const createVehicleSchema = z.object({
    type: z.enum(['CAR', 'VAN', 'SUV', 'BUS', 'MINIBUS', 'TUK_TUK']),
    model: z.string().min(1),
    plateNumber: z.string().optional(),
    seats: z.number().min(1),
    luggage: z.number().min(0).optional(),
    dailyRate: z.number().min(0),
    status: z.enum(['AVAILABLE', 'MAINTENANCE', 'UNAVAILABLE']).optional().default('AVAILABLE'),
    images: z.array(z.string()).optional().default([]),
    features: z.array(z.string()).optional().default([]),
});
export const updateVehicleSchema = createVehicleSchema.partial();

export const createVehicleBlockSchema = z.object({
    from: z.string().min(1),
    to: z.string().min(1),
    reason: z.enum(['BOOKING', 'MAINTENANCE', 'PERSONAL', 'OTHER']).default('OTHER'),
    bookingId: z.string().optional(),
});

// ─── Support Tickets ───
export const createTicketSchema = z.object({
    customerName: z.string().min(1),
    phone: z.string().optional(),
    email: z.string().email().optional().or(z.literal('')),
    subject: z.string().min(1),
    message: z.string().min(1),
    bookingId: z.string().optional(),
});

export const replyTicketSchema = z.object({
    body: z.string().min(1),
});

// ─── Invoices ───
export const createInvoiceSchema = z.object({
    bookingId: z.string().min(1),
    items: z.array(z.object({
        label: z.string().min(1),
        qty: z.number().min(1),
        unitPrice: z.number().min(0),
    })).min(1),
    discount: z.number().min(0).optional().default(0),
    advanceRequired: z.number().min(0).optional(),
    notes: z.string().optional(),
    status: z.enum(['DRAFT', 'FINAL']).optional().default('DRAFT'),
});
export const updateInvoiceSchema = createInvoiceSchema.partial();

// ─── Payments ───
export const createPaymentSchema = z.object({
    bookingId: z.string().min(1),
    invoiceId: z.string().optional(),
    amount: z.number().min(0.01),
    method: z.enum(['CASH', 'BANK', 'CARD_OTHER']),
    paidAt: z.string().optional(),
    reference: z.string().optional(),
    type: z.enum(['PAYMENT', 'REFUND']).default('PAYMENT'),
    notes: z.string().optional(),
});

// ─── Partners ───
export const createPartnerSchema = z.object({
    type: z.enum(['GUIDE', 'HOTEL', 'DRIVER', 'RESTAURANT', 'OTHER']),
    name: z.string().min(1),
    contactPerson: z.string().optional(),
    phone: z.string().min(1),
    email: z.string().email().optional().or(z.literal('')),
    address: z.string().optional(),
    status: z.enum(['ACTIVE', 'INACTIVE']).optional().default('ACTIVE'),
    notes: z.string().optional(),
});
export const updatePartnerSchema = createPartnerSchema.partial();

export const createPartnerServiceSchema = z.object({
    serviceName: z.string().min(1),
    rate: z.number().min(0),
    unit: z.enum(['PER_DAY', 'PER_TRIP', 'PER_PERSON', 'PER_NIGHT', 'FLAT']),
    notes: z.string().optional(),
});

// ─── Custom Plans ───
export const createPlanSchema = z.object({
    customerName: z.string().optional(),
    customerPhone: z.string().optional(),
    days: z.array(z.object({
        dayNo: z.number().min(1),
        places: z.array(z.string()),
        notes: z.string().optional(),
    })).default([]),
    districtsUsed: z.array(z.string()).optional().default([]),
    status: z.enum(['DRAFT', 'SAVED']).default('DRAFT'),
});
export const updatePlanSchema = createPlanSchema.partial();

// ─── District Places ───
export const createPlaceSchema = z.object({
    districtId: z.string().min(1),
    name: z.string().min(1),
    category: z.enum(['TEMPLE', 'BEACH', 'NATURE', 'HERITAGE', 'WILDLIFE', 'ADVENTURE', 'CITY', 'FOOD', 'OTHER']),
    description: z.string().optional(),
    coords: z.object({ lat: z.number(), lng: z.number() }).optional(),
    images: z.array(z.string()).optional().default([]),
    isActive: z.boolean().optional().default(true),
});
export const updatePlaceSchema = createPlaceSchema.partial();

// ─── Users ───
export const createUserSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().optional(),
    password: z.string().min(6),
    role: z.enum(['ADMIN', 'STAFF']).default('STAFF'),
});
export const updateUserSchema = z.object({
    name: z.string().min(1).optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    role: z.enum(['ADMIN', 'STAFF']).optional(),
    status: z.enum(['ACTIVE', 'DISABLED']).optional(),
});

// ─── Booking Partner Assignment ───
export const createBookingPartnerSchema = z.object({
    bookingId: z.string().min(1),
    partnerId: z.string().min(1),
    serviceId: z.string().optional(),
    agreedRate: z.number().min(0),
    notes: z.string().optional(),
});
