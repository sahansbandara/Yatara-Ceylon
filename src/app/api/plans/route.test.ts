/**
 * @jest-environment node
 */
import { DELETE, GET, POST } from './route';

const mockConnectDB = jest.fn();
const mockFind = jest.fn();
const mockCreate = jest.fn();
const mockFindOne = jest.fn();
const mockFindByIdAndUpdate = jest.fn();
const mockGetTokenFromRequest = jest.fn();
const mockVerifyToken = jest.fn();

jest.mock('@/lib/mongodb', () => ({
    __esModule: true,
    default: (...args: unknown[]) => mockConnectDB(...args),
}));

jest.mock('@/models/CustomPlan', () => ({
    __esModule: true,
    default: {
        find: (...args: unknown[]) => mockFind(...args),
        create: (...args: unknown[]) => mockCreate(...args),
        findOne: (...args: unknown[]) => mockFindOne(...args),
        findByIdAndUpdate: (...args: unknown[]) => mockFindByIdAndUpdate(...args),
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

describe('plans route', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockConnectDB.mockResolvedValue(undefined);
    });

    it('attaches authenticated ownership details when creating a plan', async () => {
        mockGetTokenFromRequest.mockReturnValue('token');
        mockVerifyToken.mockResolvedValue({ userId: 'user-1', role: 'USER', email: 'guest@test.com' });
        mockCreate.mockResolvedValue({ _id: 'plan-1' });

        const response = await POST(new Request('http://localhost:3000/api/plans', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                cookie: 'toms_token=token; toms_csrf=csrf-token',
                'x-csrf-token': 'csrf-token',
            },
            body: JSON.stringify({
                title: 'Hill Country Draft',
                days: [{ dayNo: 1, places: ['place-1'] }],
                districtsUsed: ['Kandy'],
                status: 'SAVED',
            }),
        }));

        expect(response.status).toBe(201);
        expect(mockCreate).toHaveBeenCalledWith(
            expect.objectContaining({
                title: 'Hill Country Draft',
                userId: 'user-1',
                customerEmail: 'guest@test.com',
            })
        );
    });

    it('limits GET results to the authenticated user plans', async () => {
        mockGetTokenFromRequest.mockReturnValue('token');
        mockVerifyToken.mockResolvedValue({ userId: 'user-1', role: 'USER', email: 'guest@test.com' });
        mockFind.mockReturnValue(createFindChain([{ _id: 'plan-1' }]));

        const response = await GET(
            new Request('http://localhost:3000/api/plans?status=SAVED', {
                headers: { cookie: 'toms_token=token' },
            }),
            { params: Promise.resolve({}) }
        );

        expect(response.status).toBe(200);
        expect(mockFind).toHaveBeenCalledWith({
            isDeleted: { $ne: true },
            status: 'SAVED',
            $or: [
                { userId: 'user-1' },
                { customerEmail: 'guest@test.com' },
            ],
        });
    });

    it('blocks deleting a plan owned by another user', async () => {
        mockGetTokenFromRequest.mockReturnValue('token');
        mockVerifyToken.mockResolvedValue({ userId: 'user-1', role: 'USER', email: 'guest@test.com' });
        mockFindOne.mockResolvedValue({
            userId: { toString: () => 'someone-else' },
            customerEmail: 'other@test.com',
        });

        const response = await DELETE(
            new Request('http://localhost:3000/api/plans?id=plan-2', {
                method: 'DELETE',
                headers: {
                    cookie: 'toms_token=token; toms_csrf=csrf-token',
                    'x-csrf-token': 'csrf-token',
                },
            }),
            { params: Promise.resolve({}) }
        );
        const data = await response.json();

        expect(response.status).toBe(403);
        expect(data.error).toBe('Forbidden');
        expect(mockFindByIdAndUpdate).not.toHaveBeenCalled();
    });
});
