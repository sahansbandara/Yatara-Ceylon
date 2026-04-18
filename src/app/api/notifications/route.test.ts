/**
 * @jest-environment node
 */
import { GET } from './route';

const mockConnectDB = jest.fn();
const mockFind = jest.fn();
const mockGetTokenFromRequest = jest.fn();
const mockVerifyToken = jest.fn();

jest.mock('@/lib/mongodb', () => ({
    __esModule: true,
    default: (...args: unknown[]) => mockConnectDB(...args),
}));

jest.mock('@/models/Notification', () => ({
    __esModule: true,
    default: {
        find: (...args: unknown[]) => mockFind(...args),
    },
}));

jest.mock('@/lib/auth', () => ({
    getTokenFromRequest: (...args: unknown[]) => mockGetTokenFromRequest(...args),
    verifyToken: (...args: unknown[]) => mockVerifyToken(...args),
}));

function createFindChain(result: unknown[]) {
    return {
        sort: jest.fn().mockReturnValue({
            lean: jest.fn().mockResolvedValue(result),
        }),
    };
}

describe('GET /api/notifications', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockConnectDB.mockResolvedValue(undefined);
    });

    it('allows public access only for published notifications', async () => {
        mockFind.mockReturnValue(createFindChain([{ _id: 'n1', title: 'Live' }]));

        const response = await GET(new Request('http://localhost:3000/api/notifications?published=true'));
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.notifications).toHaveLength(1);
        expect(mockFind).toHaveBeenCalledWith(
            expect.objectContaining({
                isDeleted: { $ne: true },
                isPublished: true,
                $or: expect.any(Array),
            })
        );
        expect(mockGetTokenFromRequest).not.toHaveBeenCalled();
    });

    it('blocks unfiltered reads when the request is unauthenticated', async () => {
        mockGetTokenFromRequest.mockReturnValue(null);

        const response = await GET(new Request('http://localhost:3000/api/notifications'));
        const data = await response.json();

        expect(response.status).toBe(401);
        expect(data.error).toBe('Authentication required');
        expect(mockFind).not.toHaveBeenCalled();
    });

    it('allows staff and admin to fetch the full notification list', async () => {
        mockGetTokenFromRequest.mockReturnValue('token');
        mockVerifyToken.mockResolvedValue({ userId: 'u1', role: 'STAFF', email: 'staff@test.com' });
        mockFind.mockReturnValue(createFindChain([{ _id: 'n2', title: 'Draft' }]));

        const response = await GET(new Request('http://localhost:3000/api/notifications?type=ALERT'));
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.notifications[0]._id).toBe('n2');
        expect(mockFind).toHaveBeenCalledWith(
            expect.objectContaining({
                isDeleted: { $ne: true },
                type: 'ALERT',
            })
        );
    });
});
