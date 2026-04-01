/**
 * @jest-environment node
 */
import { POST } from './route';

const mockConnectDB = jest.fn();
const mockVehicleFindOne = jest.fn();
const mockVehicleBlockFindOne = jest.fn();
const mockVehicleBlockCreate = jest.fn();
const mockBookingFindOne = jest.fn();
const mockGetTokenFromRequest = jest.fn();
const mockVerifyToken = jest.fn();

jest.mock('@/lib/mongodb', () => ({
    __esModule: true,
    default: (...args: unknown[]) => mockConnectDB(...args),
}));

jest.mock('@/models/Vehicle', () => ({
    __esModule: true,
    default: {
        findOne: (...args: unknown[]) => mockVehicleFindOne(...args),
    },
}));

jest.mock('@/models/VehicleBlock', () => ({
    __esModule: true,
    default: {
        findOne: (...args: unknown[]) => mockVehicleBlockFindOne(...args),
        create: (...args: unknown[]) => mockVehicleBlockCreate(...args),
    },
}));

jest.mock('@/models/Booking', () => ({
    __esModule: true,
    default: {
        findOne: (...args: unknown[]) => mockBookingFindOne(...args),
    },
}));

jest.mock('@/lib/auth', () => ({
    getTokenFromRequest: (...args: unknown[]) => mockGetTokenFromRequest(...args),
    verifyToken: (...args: unknown[]) => mockVerifyToken(...args),
}));

describe('POST /api/vehicles/[id] block dates', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockConnectDB.mockResolvedValue(undefined);
        mockGetTokenFromRequest.mockReturnValue('token');
        mockVerifyToken.mockResolvedValue({ userId: 'admin-1', role: 'ADMIN', email: 'admin@test.com' });
        mockVehicleFindOne.mockResolvedValue({ _id: 'veh-1' });
        mockVehicleBlockFindOne.mockResolvedValue(null);
    });

    it('rejects blocking a vehicle when active booking dates overlap', async () => {
        mockBookingFindOne.mockResolvedValue({ _id: 'booking-1' });

        const response = await POST(
            new Request('http://localhost:3000/api/vehicles/veh-1', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    cookie: 'toms_token=token',
                },
                body: JSON.stringify({
                    from: '2026-04-10',
                    to: '2026-04-12',
                    reason: 'OTHER',
                }),
            }),
            { params: Promise.resolve({ id: 'veh-1' }) }
        );
        const data = await response.json();

        expect(response.status).toBe(409);
        expect(data.error).toBe('Cannot block vehicle. Active bookings exist for these dates.');
        expect(mockBookingFindOne).toHaveBeenCalledWith(
            expect.objectContaining({
                assignedVehicleId: 'veh-1',
                'dates.from': { $lte: new Date('2026-04-12') },
                'dates.to': { $gte: new Date('2026-04-10') },
            })
        );
        expect(mockVehicleBlockCreate).not.toHaveBeenCalled();
    });
});
