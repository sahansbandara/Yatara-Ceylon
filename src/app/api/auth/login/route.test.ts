/**
 * @jest-environment node
 */
import { POST } from './route';

const mockRateLimit = jest.fn();
const mockConnectDB = jest.fn();
const mockFindOne = jest.fn();
const mockUpdateOne = jest.fn();
const mockComparePassword = jest.fn();
const mockSignToken = jest.fn();
const mockSetAuthCookie = jest.fn();

jest.mock('@/lib/rate-limit', () => ({
    rateLimit: (...args: unknown[]) => mockRateLimit(...args),
}));

jest.mock('@/lib/mongodb', () => ({
    __esModule: true,
    default: (...args: unknown[]) => mockConnectDB(...args),
}));

jest.mock('@/models/User', () => ({
    __esModule: true,
    default: {
        findOne: (...args: unknown[]) => mockFindOne(...args),
        updateOne: (...args: unknown[]) => mockUpdateOne(...args),
    },
}));

jest.mock('@/lib/auth', () => ({
    comparePassword: (...args: unknown[]) => mockComparePassword(...args),
    signToken: (...args: unknown[]) => mockSignToken(...args),
    setAuthCookie: (...args: unknown[]) => mockSetAuthCookie(...args),
}));

describe('POST /api/auth/login', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockRateLimit.mockResolvedValue(null);
        mockConnectDB.mockResolvedValue(undefined);
        mockComparePassword.mockResolvedValue(true);
        mockSignToken.mockResolvedValue('signed-token');
        mockSetAuthCookie.mockReturnValue('toms_token=signed-token; Path=/; HttpOnly');
    });

    it('returns success even when the lastLogin update fails', async () => {
        const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
        mockFindOne.mockReturnValue({
            select: jest.fn().mockResolvedValue({
                _id: 'user-1',
                name: 'Admin',
                email: 'admin@ceylonescapes.lk',
                role: 'ADMIN',
                passwordHash: 'hashed-password',
            }),
        });
        mockUpdateOne.mockRejectedValue(new Error('write failed'));

        const request = new Request('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@ceylonescapes.lk',
                password: 'Admin@123',
            }),
        });

        const response = await POST(request as never);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data).toEqual({
            success: true,
            user: {
                id: 'user-1',
                name: 'Admin',
                email: 'admin@ceylonescapes.lk',
                role: 'ADMIN',
            },
        });
        expect(mockUpdateOne).toHaveBeenCalledWith(
            { _id: 'user-1' },
            { $set: { lastLogin: expect.any(Date) } }
        );
        expect(response.headers.get('set-cookie')).toContain('toms_token=signed-token');
        expect(warnSpy).toHaveBeenCalledWith(
            'Login lastLogin update failed:',
            expect.any(Error)
        );

        warnSpy.mockRestore();
    });
});
