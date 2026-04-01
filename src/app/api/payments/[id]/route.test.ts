/**
 * @jest-environment node
 */
import { PATCH } from './route';

const mockConnectDB = jest.fn();
const mockPaymentFindById = jest.fn();
const mockPaymentFindByIdAndUpdate = jest.fn();
const mockBookingFindById = jest.fn();
const mockBookingFindByIdAndUpdate = jest.fn();
const mockLogAudit = jest.fn();
const mockGetTokenFromRequest = jest.fn();
const mockVerifyToken = jest.fn();

jest.mock('@/lib/mongodb', () => ({
    __esModule: true,
    default: (...args: unknown[]) => mockConnectDB(...args),
}));

jest.mock('@/models/Payment', () => ({
    __esModule: true,
    default: {
        findById: (...args: unknown[]) => mockPaymentFindById(...args),
        findByIdAndUpdate: (...args: unknown[]) => mockPaymentFindByIdAndUpdate(...args),
    },
}));

jest.mock('@/models/Booking', () => ({
    __esModule: true,
    default: {
        findById: (...args: unknown[]) => mockBookingFindById(...args),
        findByIdAndUpdate: (...args: unknown[]) => mockBookingFindByIdAndUpdate(...args),
    },
}));

jest.mock('@/lib/audit', () => ({
    logAudit: (...args: unknown[]) => mockLogAudit(...args),
}));

jest.mock('@/lib/auth', () => ({
    getTokenFromRequest: (...args: unknown[]) => mockGetTokenFromRequest(...args),
    verifyToken: (...args: unknown[]) => mockVerifyToken(...args),
}));

describe('PATCH /api/payments/[id]', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockConnectDB.mockResolvedValue(undefined);
        mockGetTokenFromRequest.mockReturnValue('token');
        mockVerifyToken.mockResolvedValue({ userId: 'staff-1', role: 'STAFF', email: 'staff@test.com' });
    });

    it('voids a payment and recalculates the booking balance', async () => {
        mockPaymentFindById
            .mockResolvedValueOnce({
                _id: 'pay-1',
                bookingId: { toString: () => 'booking-1' },
                amount: 400,
                status: 'SUCCESS',
                voidedAt: null,
            })
            .mockReturnValueOnce({
                populate: jest.fn().mockReturnValue({
                    lean: jest.fn().mockResolvedValue({
                        _id: 'pay-1',
                        status: 'VOIDED',
                    }),
                }),
            });
        mockBookingFindById.mockResolvedValue({
            _id: 'booking-1',
            paidAmount: 900,
            totalCost: 1500,
        });

        const response = await PATCH(
            new Request('http://localhost:3000/api/payments/pay-1', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    cookie: 'toms_token=token',
                },
                body: JSON.stringify({ action: 'VOID' }),
            }),
            { params: Promise.resolve({ id: 'pay-1' }) }
        );

        expect(response.status).toBe(200);
        expect(mockPaymentFindByIdAndUpdate).toHaveBeenCalledWith(
            'pay-1',
            expect.objectContaining({
                status: 'VOIDED',
                voidedAt: expect.any(Date),
            })
        );
        const [bookingIdArg, bookingUpdateArg] = mockBookingFindByIdAndUpdate.mock.calls[0];
        expect(typeof bookingIdArg?.toString).toBe('function');
        expect(bookingIdArg.toString()).toBe('booking-1');
        expect(bookingUpdateArg).toEqual({
            paidAmount: 500,
            remainingBalance: 1000,
        });
        expect(mockLogAudit).toHaveBeenCalled();
    });
});
