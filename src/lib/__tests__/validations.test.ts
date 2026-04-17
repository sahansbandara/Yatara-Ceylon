/**
 * @jest-environment node
 */
import {
    createPackageSchema, updatePackageSchema,
    createDestinationSchema, updateDestinationSchema,
    createFAQSchema, updateFAQSchema,
    createTestimonialSchema, updateTestimonialSchema,
    createGallerySchema, updateGallerySchema,
    createNotificationSchema, updateNotificationSchema,
    createBookingSchema, updateBookingStatusSchema, assignBookingSchema,
    createVehicleSchema, updateVehicleSchema, createVehicleBlockSchema,
    createTicketSchema, replyTicketSchema,
    createInvoiceSchema, updateInvoiceSchema,
    createPaymentSchema,
    createPartnerSchema, updatePartnerSchema, createPartnerServiceSchema,
    createPlanSchema, updatePlanSchema,
    createPlaceSchema, updatePlaceSchema,
    createUserSchema, updateUserSchema,
    createBookingPartnerSchema,
} from '../validations';

describe('Zod validation schemas', () => {

    // ─── Packages ───────────────────────────────────────────────
    describe('createPackageSchema', () => {
        const validData = {
            title: 'Cultural Tour',
            summary: 'A beautiful tour of Sri Lanka',
            duration: '5 days',
            priceMin: 500,
            priceMax: 1500,
        };

        it('should accept valid data', () => {
            const result = createPackageSchema.safeParse(validData);
            expect(result.success).toBe(true);
        });

        it('should reject missing title', () => {
            const result = createPackageSchema.safeParse({ ...validData, title: '' });
            expect(result.success).toBe(false);
        });

        it('should reject title exceeding max length', () => {
            const result = createPackageSchema.safeParse({ ...validData, title: 'a'.repeat(201) });
            expect(result.success).toBe(false);
        });

        it('should reject negative priceMin', () => {
            const result = createPackageSchema.safeParse({ ...validData, priceMin: -1 });
            expect(result.success).toBe(false);
        });

        it('should default optional arrays to empty', () => {
            const result = createPackageSchema.safeParse(validData);
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.images).toEqual([]);
                expect(result.data.highlights).toEqual([]);
                expect(result.data.tags).toEqual([]);
                expect(result.data.isPublished).toBe(false);
            }
        });

        it('should accept itinerary array', () => {
            const result = createPackageSchema.safeParse({
                ...validData,
                itinerary: [{ day: 1, title: 'Day 1' }],
            });
            expect(result.success).toBe(true);
        });

        it('should reject itinerary with day < 1', () => {
            const result = createPackageSchema.safeParse({
                ...validData,
                itinerary: [{ day: 0, title: 'Day 0' }],
            });
            expect(result.success).toBe(false);
        });
    });

    describe('updatePackageSchema', () => {
        it('should allow partial updates', () => {
            const result = updatePackageSchema.safeParse({ title: 'Updated' });
            expect(result.success).toBe(true);
        });

        it('should allow empty object', () => {
            const result = updatePackageSchema.safeParse({});
            expect(result.success).toBe(true);
        });
    });

    // ─── Destinations ───────────────────────────────────────────
    describe('createDestinationSchema', () => {
        it('should accept valid data', () => {
            const result = createDestinationSchema.safeParse({
                title: 'Sigiriya',
                description: 'Ancient rock fortress',
            });
            expect(result.success).toBe(true);
        });

        it('should reject empty title', () => {
            const result = createDestinationSchema.safeParse({ title: '', description: 'Desc' });
            expect(result.success).toBe(false);
        });

        it('should reject missing description', () => {
            const result = createDestinationSchema.safeParse({ title: 'Place' });
            expect(result.success).toBe(false);
        });
    });

    // ─── FAQs ───────────────────────────────────────────────────
    describe('createFAQSchema', () => {
        it('should accept valid data', () => {
            const result = createFAQSchema.safeParse({
                question: 'How to book?',
                answer: 'Contact us',
            });
            expect(result.success).toBe(true);
        });

        it('should reject missing answer', () => {
            const result = createFAQSchema.safeParse({ question: 'Q?' });
            expect(result.success).toBe(false);
        });
    });

    // ─── Testimonials ───────────────────────────────────────────
    describe('createTestimonialSchema', () => {
        it('should accept valid data', () => {
            const result = createTestimonialSchema.safeParse({
                name: 'John',
                rating: 5,
                comment: 'Great experience!',
            });
            expect(result.success).toBe(true);
        });

        it('should reject rating below 1', () => {
            const result = createTestimonialSchema.safeParse({
                name: 'John', rating: 0, comment: 'Bad',
            });
            expect(result.success).toBe(false);
        });

        it('should reject rating above 5', () => {
            const result = createTestimonialSchema.safeParse({
                name: 'John', rating: 6, comment: 'Over',
            });
            expect(result.success).toBe(false);
        });
    });

    // ─── Gallery ────────────────────────────────────────────────
    describe('createGallerySchema', () => {
        it('should accept IMAGE type', () => {
            const result = createGallerySchema.safeParse({ type: 'IMAGE', title: 'Photo' });
            expect(result.success).toBe(true);
        });

        it('should accept BLOG type', () => {
            const result = createGallerySchema.safeParse({ type: 'BLOG', title: 'Post' });
            expect(result.success).toBe(true);
        });

        it('should reject invalid type', () => {
            const result = createGallerySchema.safeParse({ type: 'VIDEO', title: 'Vid' });
            expect(result.success).toBe(false);
        });
    });

    // ─── Notifications ──────────────────────────────────────────
    describe('createNotificationSchema', () => {
        it('should accept valid data with defaults', () => {
            const result = createNotificationSchema.safeParse({
                title: 'New offer',
                body: 'Check it out',
            });
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.type).toBe('UPDATE');
                expect(result.data.visibleTo).toBe('ALL');
            }
        });

        it('should accept specific type and visibility', () => {
            const result = createNotificationSchema.safeParse({
                title: 'Alert', body: 'Warning',
                type: 'ALERT', visibleTo: 'STAFF',
            });
            expect(result.success).toBe(true);
        });

        it('should reject invalid type', () => {
            const result = createNotificationSchema.safeParse({
                title: 'X', body: 'Y', type: 'INVALID',
            });
            expect(result.success).toBe(false);
        });
    });

    // ─── Bookings ───────────────────────────────────────────────
    describe('createBookingSchema', () => {
        const validBooking = {
            customerName: 'Jane Doe',
            phone: '+94771234567',
            type: 'PACKAGE' as const,
            pax: 2,
            dates: { from: '2025-01-01', to: '2025-01-07' },
        };

        it('should accept valid booking', () => {
            const result = createBookingSchema.safeParse(validBooking);
            expect(result.success).toBe(true);
        });

        it('should accept valid booking types', () => {
            for (const type of ['PACKAGE', 'VEHICLE', 'CUSTOM']) {
                const result = createBookingSchema.safeParse({ ...validBooking, type });
                expect(result.success).toBe(true);
            }
        });

        it('should reject invalid booking type', () => {
            const result = createBookingSchema.safeParse({ ...validBooking, type: 'INVALID' });
            expect(result.success).toBe(false);
        });

        it('should reject pax less than 1', () => {
            const result = createBookingSchema.safeParse({ ...validBooking, pax: 0 });
            expect(result.success).toBe(false);
        });

        it('should accept empty string email', () => {
            const result = createBookingSchema.safeParse({ ...validBooking, email: '' });
            expect(result.success).toBe(true);
        });

        it('should reject invalid email format', () => {
            const result = createBookingSchema.safeParse({ ...validBooking, email: 'not-an-email' });
            expect(result.success).toBe(false);
        });

        it('should reject invalid phone number format', () => {
            const result = createBookingSchema.safeParse({ ...validBooking, phone: '123' });
            expect(result.success).toBe(false);
        });

        it('should reject when end date is before start date', () => {
            const result = createBookingSchema.safeParse({
                ...validBooking,
                dates: { from: '2025-01-10', to: '2025-01-07' },
            });
            expect(result.success).toBe(false);
        });
    });

    describe('updateBookingStatusSchema', () => {
        it('should accept valid statuses', () => {
            for (const status of ['NEW', 'CONTACTED', 'CONFIRMED', 'COMPLETED', 'CANCELLED']) {
                const result = updateBookingStatusSchema.safeParse({ status });
                expect(result.success).toBe(true);
            }
        });

        it('should reject invalid status', () => {
            const result = updateBookingStatusSchema.safeParse({ status: 'PENDING' });
            expect(result.success).toBe(false);
        });
    });

    // ─── Vehicles ───────────────────────────────────────────────
    describe('createVehicleSchema', () => {
        const validVehicle = {
            type: 'CAR' as const,
            model: 'Toyota Prius',
            seats: 4,
            dailyRate: 15000,
        };

        it('should accept valid vehicle', () => {
            const result = createVehicleSchema.safeParse(validVehicle);
            expect(result.success).toBe(true);
        });

        it('should accept all vehicle types', () => {
            for (const type of ['CAR', 'VAN', 'SUV', 'BUS', 'MINIBUS', 'TUK_TUK']) {
                const result = createVehicleSchema.safeParse({ ...validVehicle, type });
                expect(result.success).toBe(true);
            }
        });

        it('should reject seats less than 1', () => {
            const result = createVehicleSchema.safeParse({ ...validVehicle, seats: 0 });
            expect(result.success).toBe(false);
        });

        it('should reject negative daily rate', () => {
            const result = createVehicleSchema.safeParse({ ...validVehicle, dailyRate: -1 });
            expect(result.success).toBe(false);
        });

        it('should default status to AVAILABLE', () => {
            const result = createVehicleSchema.safeParse(validVehicle);
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.status).toBe('AVAILABLE');
            }
        });
    });

    describe('createVehicleBlockSchema', () => {
        it('should accept valid block', () => {
            const result = createVehicleBlockSchema.safeParse({
                from: '2025-01-01', to: '2025-01-05', reason: 'MAINTENANCE',
            });
            expect(result.success).toBe(true);
        });

        it('should default reason to OTHER', () => {
            const result = createVehicleBlockSchema.safeParse({
                from: '2025-01-01', to: '2025-01-05',
            });
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.reason).toBe('OTHER');
            }
        });
    });

    // ─── Support Tickets ────────────────────────────────────────
    describe('createTicketSchema', () => {
        it('should accept valid ticket', () => {
            const result = createTicketSchema.safeParse({
                customerName: 'Jane',
                subject: 'Help needed',
                message: 'I need assistance',
            });
            expect(result.success).toBe(true);
        });

        it('should reject missing subject', () => {
            const result = createTicketSchema.safeParse({
                customerName: 'Jane', message: 'Help',
            });
            expect(result.success).toBe(false);
        });
    });

    describe('replyTicketSchema', () => {
        it('should accept valid reply', () => {
            const result = replyTicketSchema.safeParse({ body: 'We can help!' });
            expect(result.success).toBe(true);
        });

        it('should reject empty body', () => {
            const result = replyTicketSchema.safeParse({ body: '' });
            expect(result.success).toBe(false);
        });
    });

    // ─── Invoices ───────────────────────────────────────────────
    describe('createInvoiceSchema', () => {
        const validInvoice = {
            bookingId: 'booking-123',
            items: [{ label: 'Tour Package', qty: 1, unitPrice: 50000 }],
        };

        it('should accept valid invoice', () => {
            const result = createInvoiceSchema.safeParse(validInvoice);
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.status).toBe('DRAFT');
                expect(result.data.discount).toBe(0);
            }
        });

        it('should require at least one item', () => {
            const result = createInvoiceSchema.safeParse({ ...validInvoice, items: [] });
            expect(result.success).toBe(false);
        });

        it('should reject item with qty less than 1', () => {
            const result = createInvoiceSchema.safeParse({
                ...validInvoice,
                items: [{ label: 'X', qty: 0, unitPrice: 100 }],
            });
            expect(result.success).toBe(false);
        });
    });

    // ─── Payments ───────────────────────────────────────────────
    describe('createPaymentSchema', () => {
        it('should accept valid payment', () => {
            const result = createPaymentSchema.safeParse({
                bookingId: 'b-1',
                amount: 25000,
                method: 'CASH',
            });
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.type).toBe('PAYMENT');
            }
        });

        it('should reject amount of 0', () => {
            const result = createPaymentSchema.safeParse({
                bookingId: 'b-1', amount: 0, method: 'CASH',
            });
            expect(result.success).toBe(false);
        });

        it('should accept all payment methods', () => {
            for (const method of ['CASH', 'BANK', 'CARD_OTHER']) {
                const result = createPaymentSchema.safeParse({
                    bookingId: 'b-1', amount: 100, method,
                });
                expect(result.success).toBe(true);
            }
        });

        it('should accept REFUND type', () => {
            const result = createPaymentSchema.safeParse({
                bookingId: 'b-1', amount: 100, method: 'CASH', type: 'REFUND',
            });
            expect(result.success).toBe(true);
        });
    });

    // ─── Partners ───────────────────────────────────────────────
    describe('createPartnerSchema', () => {
        it('should accept valid partner', () => {
            const result = createPartnerSchema.safeParse({
                type: 'HOTEL', name: 'Grand Hotel', phone: '+94771234567',
            });
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.status).toBe('ACTIVE');
            }
        });

        it('should accept all partner types', () => {
            for (const type of ['GUIDE', 'HOTEL', 'DRIVER', 'RESTAURANT', 'OTHER']) {
                const result = createPartnerSchema.safeParse({
                    type, name: 'Test', phone: '+94771234567',
                });
                expect(result.success).toBe(true);
            }
        });
    });

    describe('createPartnerServiceSchema', () => {
        it('should accept valid service', () => {
            const result = createPartnerServiceSchema.safeParse({
                serviceName: 'City Tour Guide', rate: 5000, unit: 'PER_DAY',
            });
            expect(result.success).toBe(true);
        });

        it('should accept all unit types', () => {
            for (const unit of ['PER_DAY', 'PER_TRIP', 'PER_PERSON', 'PER_NIGHT', 'FLAT']) {
                const result = createPartnerServiceSchema.safeParse({
                    serviceName: 'S', rate: 100, unit,
                });
                expect(result.success).toBe(true);
            }
        });

        it('should map legacy notes field into description', () => {
            const result = createPartnerServiceSchema.safeParse({
                serviceName: 'Airport pickup',
                rate: 100,
                unit: 'FLAT',
                notes: 'Legacy note',
            });

            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.description).toBe('Legacy note');
            }
        });
    });

    // ─── Custom Plans ───────────────────────────────────────────
    describe('createPlanSchema', () => {
        it('should accept valid plan', () => {
            const result = createPlanSchema.safeParse({
                days: [{ dayNo: 1, places: ['Sigiriya', 'Dambulla'] }],
            });
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.status).toBe('DRAFT');
            }
        });

        it('should reject day with dayNo less than 1', () => {
            const result = createPlanSchema.safeParse({
                days: [{ dayNo: 0, places: ['Place'] }],
            });
            expect(result.success).toBe(false);
        });
    });

    // ─── District Places ────────────────────────────────────────
    describe('createPlaceSchema', () => {
        it('should accept valid place', () => {
            const result = createPlaceSchema.safeParse({
                districtId: 'd-1',
                name: 'Temple of the Tooth',
                category: 'TEMPLE',
            });
            expect(result.success).toBe(true);
        });

        it('should accept all categories', () => {
            for (const category of ['TEMPLE', 'BEACH', 'NATURE', 'HERITAGE', 'WILDLIFE', 'ADVENTURE', 'CITY', 'FOOD', 'OTHER']) {
                const result = createPlaceSchema.safeParse({
                    districtId: 'd-1', name: 'Place', category,
                });
                expect(result.success).toBe(true);
            }
        });

        it('should accept coords', () => {
            const result = createPlaceSchema.safeParse({
                districtId: 'd-1', name: 'Place', category: 'BEACH',
                coords: { lat: 7.2906, lng: 80.6337 },
            });
            expect(result.success).toBe(true);
        });

        it('should reject invalid category', () => {
            const result = createPlaceSchema.safeParse({
                districtId: 'd-1', name: 'Place', category: 'INVALID',
            });
            expect(result.success).toBe(false);
        });
    });

    // ─── Users ──────────────────────────────────────────────────
    describe('createUserSchema', () => {
        it('should accept valid user', () => {
            const result = createUserSchema.safeParse({
                name: 'Admin User',
                email: 'admin@yatara.com',
                password: 'Strong@1234',
            });
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.role).toBe('STAFF');
            }
        });

        it('should reject passwords that do not meet the stronger complexity rules', () => {
            const result = createUserSchema.safeParse({
                name: 'User', email: 'u@test.com', password: '12345',
            });
            expect(result.success).toBe(false);
        });

        it('should reject invalid email', () => {
            const result = createUserSchema.safeParse({
                name: 'User', email: 'not-email', password: 'Strong@1234',
            });
            expect(result.success).toBe(false);
        });

        it('should accept ADMIN role', () => {
            const result = createUserSchema.safeParse({
                name: 'Admin', email: 'a@b.com', password: 'Strong@1234', role: 'ADMIN',
            });
            expect(result.success).toBe(true);
        });
    });

    describe('updateUserSchema', () => {
        it('should allow partial updates', () => {
            const result = updateUserSchema.safeParse({ name: 'Updated Name' });
            expect(result.success).toBe(true);
        });

        it('should accept status update', () => {
            const result = updateUserSchema.safeParse({ status: 'DISABLED' });
            expect(result.success).toBe(true);
        });

        it('should reject invalid status', () => {
            const result = updateUserSchema.safeParse({ status: 'BANNED' });
            expect(result.success).toBe(false);
        });
    });

    // ─── Booking Partner Assignment ─────────────────────────────
    describe('createBookingPartnerSchema', () => {
        it('should accept valid assignment', () => {
            const result = createBookingPartnerSchema.safeParse({
                bookingId: 'b-1', partnerId: 'p-1', agreedRate: 10000,
            });
            expect(result.success).toBe(true);
        });

        it('should reject negative agreedRate', () => {
            const result = createBookingPartnerSchema.safeParse({
                bookingId: 'b-1', partnerId: 'p-1', agreedRate: -100,
            });
            expect(result.success).toBe(false);
        });
    });
});
