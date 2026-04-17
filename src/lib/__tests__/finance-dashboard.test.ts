/**
 * @jest-environment node
 */
import { rankOutstandingBookings } from '../finance-dashboard';

describe('rankOutstandingBookings', () => {
    const now = '2026-04-02T00:00:00.000Z';

    it('prioritizes upcoming non-settled bookings ahead of older higher-balance records', () => {
        const ranked = rankOutstandingBookings([
            {
                bookingNo: 'YC-01001',
                remainingBalance: 900000,
                status: 'COMPLETED',
                dates: {
                    from: '2025-12-20T08:00:00.000Z',
                    to: '2025-12-24T18:00:00.000Z',
                },
                createdAt: '2025-12-01T10:00:00.000Z',
            },
            {
                bookingNo: 'YC-DEMO-1006',
                remainingBalance: 165000,
                status: 'ASSIGNED',
                dates: {
                    from: '2026-04-11T08:00:00.000Z',
                    to: '2026-04-13T19:00:00.000Z',
                },
                createdAt: '2026-04-01T11:00:00.000Z',
            },
            {
                bookingNo: 'YC-DEMO-1005',
                remainingBalance: 300000,
                status: 'CONFIRMED',
                dates: {
                    from: '2026-04-07T07:00:00.000Z',
                    to: '2026-04-10T18:00:00.000Z',
                },
                createdAt: '2026-04-01T10:00:00.000Z',
            },
            {
                bookingNo: 'YC-01004',
                remainingBalance: 640000,
                status: 'CANCELLED',
                dates: {
                    from: '2026-03-15T08:00:00.000Z',
                    to: '2026-03-19T18:00:00.000Z',
                },
                createdAt: '2026-03-01T09:00:00.000Z',
            },
        ], now);

        expect(ranked.map((booking) => booking.bookingNo)).toEqual([
            'YC-DEMO-1006',
            'YC-DEMO-1005',
            'YC-01001',
            'YC-01004',
        ]);
    });

    it('uses departure date and balance as tie-breakers within actionable bookings of the same status', () => {
        const ranked = rankOutstandingBookings([
            {
                bookingNo: 'YC-DEMO-1004',
                remainingBalance: 320000,
                status: 'ADVANCE_PAID',
                dates: {
                    from: '2026-04-22T09:00:00.000Z',
                    to: '2026-04-25T18:00:00.000Z',
                },
            },
            {
                bookingNo: 'YC-DEMO-1003',
                remainingBalance: 320000,
                status: 'PAYMENT_PENDING',
                dates: {
                    from: '2026-04-14T08:00:00.000Z',
                    to: '2026-04-17T18:00:00.000Z',
                },
            },
            {
                bookingNo: 'YC-DEMO-1005',
                remainingBalance: 300000,
                status: 'CONFIRMED',
                dates: {
                    from: '2026-04-07T07:00:00.000Z',
                    to: '2026-04-10T18:00:00.000Z',
                },
            },
            {
                bookingNo: 'YC-DEMO-1006',
                remainingBalance: 165000,
                status: 'ASSIGNED',
                dates: {
                    from: '2026-04-11T08:00:00.000Z',
                    to: '2026-04-13T19:00:00.000Z',
                },
            },
        ], now);

        expect(ranked.map((booking) => booking.bookingNo)).toEqual([
            'YC-DEMO-1006',
            'YC-DEMO-1005',
            'YC-DEMO-1004',
            'YC-DEMO-1003',
        ]);
    });
});
