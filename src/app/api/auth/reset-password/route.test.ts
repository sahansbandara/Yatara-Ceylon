/**
 * @jest-environment node
 */
import { POST } from './route';

const mockConnectDB = jest.fn();
const mockFindOne = jest.fn();
const mockHashPassword = jest.fn();
const mockHashOpaqueToken = jest.fn();

jest.mock('@/lib/mongodb', () => ({
    __esModule: true,
    default: (...args: unknown[]) => mockConnectDB(...args),
}));

jest.mock('@/models/User', () => ({
    __esModule: true,
    default: {
        findOne: (...args: unknown[]) => mockFindOne(...args),
    },
}));

jest.mock('@/lib/auth', () => ({
    hashPassword: (...args: unknown[]) => mockHashPassword(...args),
}));

jest.mock('@/lib/token-utils', () => ({
    hashOpaqueToken: (...args: unknown[]) => mockHashOpaqueToken(...args),
}));

describe('POST /api/auth/reset-password', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockConnectDB.mockResolvedValue(undefined);
        mockHashOpaqueToken.mockReturnValue('hashed-token');
        mockHashPassword.mockResolvedValue('new-password-hash');
    });

    it('rejects expired or invalid reset tokens', async () => {
        mockFindOne.mockReturnValue({
            select: jest.fn().mockResolvedValue(null),
        });

        const response = await POST(new Request('http://localhost:3000/api/auth/reset-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                cookie: 'toms_csrf=csrf-token',
                'x-csrf-token': 'csrf-token',
            },
            body: JSON.stringify({
                token: 'expired-token',
                password: 'Strong@1234',
            }),
        }) as never);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe('Reset link is invalid or expired');
    });

    it('clears the reset token after a successful password update', async () => {
        const mockSave = jest.fn().mockResolvedValue(undefined);
        const user = {
            passwordHash: 'old-hash',
            passwordResetTokenHash: 'hashed-token',
            passwordResetExpires: new Date('2026-04-02T00:00:00.000Z'),
            failedLoginAttempts: 3,
            lockedUntil: new Date('2026-04-01T11:00:00.000Z'),
            save: mockSave,
        };
        mockFindOne.mockReturnValue({
            select: jest.fn().mockResolvedValue(user),
        });

        const response = await POST(new Request('http://localhost:3000/api/auth/reset-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                cookie: 'toms_csrf=csrf-token',
                'x-csrf-token': 'csrf-token',
            },
            body: JSON.stringify({
                token: 'valid-token',
                password: 'Strong@1234',
            }),
        }) as never);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
        expect(user.passwordHash).toBe('new-password-hash');
        expect(user.passwordResetTokenHash).toBeUndefined();
        expect(user.passwordResetExpires).toBeUndefined();
        expect(user.failedLoginAttempts).toBe(0);
        expect(user.lockedUntil).toBeUndefined();
        expect(mockSave).toHaveBeenCalled();
    });
});
