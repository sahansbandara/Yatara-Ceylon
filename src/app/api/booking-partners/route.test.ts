/**
 * @jest-environment node
 */
import { GET, POST } from './route';

const mockConnectDB = jest.fn();
const mockAssignmentFind = jest.fn();
const mockAssignmentCreate = jest.fn();
const mockPartnerFindOne = jest.fn();
const mockPartnerServiceFindOne = jest.fn();
const mockGetTokenFromRequest = jest.fn();
const mockVerifyToken = jest.fn();

jest.mock('@/lib/mongodb', () => ({
    __esModule: true,
    default: (...args: unknown[]) => mockConnectDB(...args),
}));

jest.mock('@/models/BookingPartnerAssignment', () => ({
    __esModule: true,
    default: {
        find: (...args: unknown[]) => mockAssignmentFind(...args),
        create: (...args: unknown[]) => mockAssignmentCreate(...args),
    },
}));

jest.mock('@/models/Partner', () => ({
    __esModule: true,
    default: {
        findOne: (...args: unknown[]) => mockPartnerFindOne(...args),
    },
}));

jest.mock('@/models/PartnerService', () => ({
    __esModule: true,
    default: {
        findOne: (...args: unknown[]) => mockPartnerServiceFindOne(...args),
    },
}));

jest.mock('@/lib/auth', () => ({
    getTokenFromRequest: (...args: unknown[]) => mockGetTokenFromRequest(...args),
    verifyToken: (...args: unknown[]) => mockVerifyToken(...args),
}));

function createPopulateChain(result: unknown[]) {
    const chain = {
        populate: jest.fn(() => chain),
        lean: jest.fn().mockResolvedValue(result),
    };

    return chain;
}

describe('booking partner assignments route', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockConnectDB.mockResolvedValue(undefined);
    });

    it('rejects unauthenticated GET requests', async () => {
        mockGetTokenFromRequest.mockReturnValue(null);

        const response = await GET(new Request('http://localhost:3000/api/booking-partners'));
        const data = await response.json();

        expect(response.status).toBe(401);
        expect(data.error).toBe('Authentication required');
        expect(mockAssignmentFind).not.toHaveBeenCalled();
    });

    it('rejects GET requests from non-staff roles', async () => {
        mockGetTokenFromRequest.mockReturnValue('token');
        mockVerifyToken.mockResolvedValue({ userId: 'user-1', role: 'USER', email: 'user@test.com' });

        const response = await GET(new Request('http://localhost:3000/api/booking-partners'));
        const data = await response.json();

        expect(response.status).toBe(403);
        expect(data.error).toBe('Insufficient permissions');
        expect(mockAssignmentFind).not.toHaveBeenCalled();
    });

    it('allows staff to list filtered assignments', async () => {
        mockGetTokenFromRequest.mockReturnValue('token');
        mockVerifyToken.mockResolvedValue({ userId: 'staff-1', role: 'STAFF', email: 'staff@test.com' });
        mockAssignmentFind.mockReturnValue(createPopulateChain([{ _id: 'assign-1' }]));

        const response = await GET(new Request('http://localhost:3000/api/booking-partners?bookingId=booking-1'));
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.assignments).toHaveLength(1);
        expect(mockAssignmentFind).toHaveBeenCalledWith({ bookingId: 'booking-1' });
    });

    it('rejects POST assignments for inactive partners', async () => {
        mockGetTokenFromRequest.mockReturnValue('token');
        mockVerifyToken.mockResolvedValue({ userId: 'staff-1', role: 'STAFF', email: 'staff@test.com' });
        mockPartnerFindOne.mockResolvedValue({ _id: 'partner-1', status: 'INACTIVE' });

        const response = await POST(new Request('http://localhost:3000/api/booking-partners', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                cookie: 'toms_token=token; toms_csrf=csrf-token',
                'x-csrf-token': 'csrf-token',
            },
            body: JSON.stringify({
                bookingId: 'booking-1',
                partnerId: 'partner-1',
                agreedRate: 10000,
            }),
        }));
        const data = await response.json();

        expect(response.status).toBe(409);
        expect(data.error).toBe('Inactive partners cannot be assigned');
        expect(mockAssignmentCreate).not.toHaveBeenCalled();
    });

    it('rejects POST assignments for inactive partner services', async () => {
        mockGetTokenFromRequest.mockReturnValue('token');
        mockVerifyToken.mockResolvedValue({ userId: 'staff-1', role: 'STAFF', email: 'staff@test.com' });
        mockPartnerFindOne.mockResolvedValue({ _id: 'partner-1', status: 'ACTIVE' });
        mockPartnerServiceFindOne.mockResolvedValue({ _id: 'service-1', isActive: false });

        const response = await POST(new Request('http://localhost:3000/api/booking-partners', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                cookie: 'toms_token=token; toms_csrf=csrf-token',
                'x-csrf-token': 'csrf-token',
            },
            body: JSON.stringify({
                bookingId: 'booking-1',
                partnerId: 'partner-1',
                serviceId: 'service-1',
                agreedRate: 10000,
            }),
        }));
        const data = await response.json();

        expect(response.status).toBe(409);
        expect(data.error).toBe('Inactive partner services cannot be assigned');
        expect(mockAssignmentCreate).not.toHaveBeenCalled();
    });
});
