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
const mockLogAudit = jest.fn();

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

jest.mock('@/lib/audit', () => ({
    logAudit: (...args: unknown[]) => mockLogAudit(...args),
}));

describe('POST /api/auth/login', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockRateLimit.mockResolvedValue(null);
        mockConnectDB.mockResolvedValue(undefined);
        mockUpdateOne.mockResolvedValue(undefined);
        mockComparePassword.mockResolvedValue(true);
        mockSignToken.mockResolvedValue('signed-token');
        mockSetAuthCookie.mockReturnValue('toms_token=signed-token; Path=/; HttpOnly');
        mockLogAudit.mockResolvedValue(undefined);
    });

    it('rejects requests without a matching CSRF token', async () => {
        const response = await POST(new Request('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@ceylonescapes.lk',
                password: 'Admin@123',
            }),
        }) as never);
        const data = await response.json();

        expect(response.status).toBe(403);
        expect(data.error).toBe('Invalid CSRF token');
        expect(mockFindOne).not.toHaveBeenCalled();
    });

    it('returns success even when the lastLogin update fails', async () => {
        const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
        mockFindOne.mockReturnValue({
            select: jest.fn().mockResolvedValue({
                _id: 'user-1',
                name: 'Admin',
                email: 'admin@ceylonescapes.lk',
                role: 'ADMIN',
                status: 'ACTIVE',
                emailVerified: true,
                passwordHash: 'hashed-password',
            }),
        });
        mockUpdateOne.mockRejectedValueOnce(new Error('write failed'));

        const request = new Request('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                cookie: 'toms_csrf=csrf-token',
                'x-csrf-token': 'csrf-token',
            },
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
            {
                $set: {
                    lastLogin: expect.any(Date),
                    failedLoginAttempts: 0,
                },
                $unset: {
                    lockedUntil: '',
                },
            }
        );
        expect(response.headers.get('set-cookie')).toContain('toms_token=signed-token');
        expect(warnSpy).toHaveBeenCalledWith(
            'Login lastLogin update failed:',
            expect.any(Error)
        );

        warnSpy.mockRestore();
    });

    it('blocks unverified accounts even with correct credentials', async () => {
        mockFindOne.mockReturnValue({
            select: jest.fn().mockResolvedValue({
                _id: 'user-2',
                name: 'Guest',
                email: 'guest@example.com',
                role: 'USER',
                status: 'ACTIVE',
                emailVerified: false,
                passwordHash: 'hashed-password',
            }),
        });

        const response = await POST(new Request('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                cookie: 'toms_csrf=csrf-token',
                'x-csrf-token': 'csrf-token',
            },
            body: JSON.stringify({
                email: 'guest@example.com',
                password: 'Guest@1234',
            }),
        }) as never);
        const data = await response.json();

        expect(response.status).toBe(403);
        expect(data.error).toBe('Please verify your email before signing in.');
        expect(mockSignToken).not.toHaveBeenCalled();
    });

    it('locks the account after repeated failed logins', async () => {
        mockComparePassword.mockResolvedValue(false);
        mockFindOne.mockReturnValue({
            select: jest.fn().mockResolvedValue({
                _id: 'user-3',
                name: 'Locked User',
                email: 'locked@example.com',
                role: 'USER',
                status: 'ACTIVE',
                emailVerified: true,
                failedLoginAttempts: 4,
                passwordHash: 'hashed-password',
            }),
        });

        const response = await POST(new Request('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                cookie: 'toms_csrf=csrf-token',
                'x-csrf-token': 'csrf-token',
            },
            body: JSON.stringify({
                email: 'locked@example.com',
                password: 'Wrong@1234',
            }),
        }) as never);
        const data = await response.json();

        expect(response.status).toBe(423);
        expect(data.error).toBe('Account temporarily locked. Please try again later.');
        expect(mockUpdateOne).toHaveBeenCalledWith(
            { _id: 'user-3' },
            {
                $set: expect.objectContaining({
                    failedLoginAttempts: 5,
                    lockedUntil: expect.any(Date),
                }),
            }
        );
        expect(mockLogAudit).toHaveBeenCalledWith(expect.objectContaining({
            action: 'LOCKOUT',
            entity: 'User',
        }));
    });
});
