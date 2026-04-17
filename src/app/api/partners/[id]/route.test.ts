/**
 * @jest-environment node
 */
import { GET } from './route';

const mockConnectDB = jest.fn();
const mockPartnerFindOne = jest.fn();
const mockPartnerServiceFind = jest.fn();
const mockGetTokenFromRequest = jest.fn();
const mockVerifyToken = jest.fn();

jest.mock('@/lib/mongodb', () => ({
    __esModule: true,
    default: (...args: unknown[]) => mockConnectDB(...args),
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
        find: (...args: unknown[]) => mockPartnerServiceFind(...args),
    },
}));

jest.mock('@/lib/auth', () => ({
    getTokenFromRequest: (...args: unknown[]) => mockGetTokenFromRequest(...args),
    verifyToken: (...args: unknown[]) => mockVerifyToken(...args),
}));

describe('GET /api/partners/[id]', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockConnectDB.mockResolvedValue(undefined);
        mockPartnerServiceFind.mockReturnValue({
            lean: jest.fn().mockResolvedValue([{ _id: 'service-1' }]),
        });
    });

    it('rejects unauthenticated requests', async () => {
        mockGetTokenFromRequest.mockReturnValue(null);

        const response = await GET(
            new Request('http://localhost:3000/api/partners/partner-1'),
            { params: Promise.resolve({ id: 'partner-1' }) }
        );
        const data = await response.json();

        expect(response.status).toBe(401);
        expect(data.error).toBe('Authentication required');
    });

    it('rejects unrelated customers', async () => {
        mockGetTokenFromRequest.mockReturnValue('token');
        mockVerifyToken.mockResolvedValue({ userId: 'user-1', role: 'USER', email: 'user@test.com' });
        mockPartnerFindOne.mockReturnValue({
            lean: jest.fn().mockResolvedValue({
                _id: 'partner-1',
                ownerId: { toString: () => 'owner-1' },
            }),
        });

        const response = await GET(
            new Request('http://localhost:3000/api/partners/partner-1', {
                headers: { cookie: 'toms_token=token' },
            }),
            { params: Promise.resolve({ id: 'partner-1' }) }
        );
        const data = await response.json();

        expect(response.status).toBe(403);
        expect(data.error).toBe('Insufficient permissions');
        expect(mockPartnerServiceFind).not.toHaveBeenCalled();
    });

    it('allows the owning hotel partner to read their partner record', async () => {
        mockGetTokenFromRequest.mockReturnValue('token');
        mockVerifyToken.mockResolvedValue({ userId: 'owner-1', role: 'HOTEL_OWNER', email: 'owner@test.com' });
        mockPartnerFindOne.mockReturnValue({
            lean: jest.fn().mockResolvedValue({
                _id: 'partner-1',
                ownerId: { toString: () => 'owner-1' },
            }),
        });

        const response = await GET(
            new Request('http://localhost:3000/api/partners/partner-1', {
                headers: { cookie: 'toms_token=token' },
            }),
            { params: Promise.resolve({ id: 'partner-1' }) }
        );
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.partner._id).toBe('partner-1');
        expect(data.services).toHaveLength(1);
        expect(mockPartnerServiceFind).toHaveBeenCalledWith({ partnerId: 'partner-1', isDeleted: false });
    });
});
