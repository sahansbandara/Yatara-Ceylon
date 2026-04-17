/**
 * @jest-environment node
 */
import { POST } from './route';

const mockRateLimit = jest.fn();
const mockVerifyTurnstileToken = jest.fn();
const mockBookingCreate = jest.fn();
const mockTicketCreate = jest.fn();

jest.mock('@/lib/rate-limit', () => ({
    rateLimit: (...args: unknown[]) => mockRateLimit(...args),
}));

jest.mock('@/lib/turnstile', () => ({
    verifyTurnstileToken: (...args: unknown[]) => mockVerifyTurnstileToken(...args),
}));

jest.mock('@/models/Booking', () => ({
    __esModule: true,
    default: {
        create: (...args: unknown[]) => mockBookingCreate(...args),
    },
}));

jest.mock('@/models/SupportTicket', () => ({
    __esModule: true,
    default: {
        create: (...args: unknown[]) => mockTicketCreate(...args),
    },
}));

jest.mock('@/lib/mongodb', () => ({
    __esModule: true,
    default: jest.fn(),
}));

describe('POST /api/public/booking-request', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockRateLimit.mockResolvedValue(null);
    });

    it('rejects missing CSRF tokens before processing the booking', async () => {
        const response = await POST(new Request('http://localhost:3000/api/public/booking-request', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                customerName: 'Jane Doe',
                phone: '+94771234567',
                type: 'PACKAGE',
                pax: 2,
                dates: { from: '2026-05-01', to: '2026-05-03' },
                turnstileToken: 'token',
            }),
        }) as never);
        const data = await response.json();

        expect(response.status).toBe(403);
        expect(data.error).toBe('Invalid CSRF token');
        expect(mockVerifyTurnstileToken).not.toHaveBeenCalled();
        expect(mockBookingCreate).not.toHaveBeenCalled();
    });

    it('rejects invalid captcha responses', async () => {
        mockVerifyTurnstileToken.mockResolvedValue({ success: false, error: 'Captcha verification failed' });

        const response = await POST(new Request('http://localhost:3000/api/public/booking-request', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                cookie: 'toms_csrf=csrf-token',
                'x-csrf-token': 'csrf-token',
            },
            body: JSON.stringify({
                customerName: 'Jane Doe',
                phone: '+94771234567',
                type: 'PACKAGE',
                pax: 2,
                dates: { from: '2026-05-01', to: '2026-05-03' },
                turnstileToken: 'bad-token',
            }),
        }) as never);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe('Captcha verification failed');
        expect(mockBookingCreate).not.toHaveBeenCalled();
        expect(mockTicketCreate).not.toHaveBeenCalled();
    });
});
