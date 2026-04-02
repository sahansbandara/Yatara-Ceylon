/**
 * @jest-environment node
 */
import { POST } from './route';

const mockEnforceCsrf = jest.fn();
const mockConnectDB = jest.fn();
const mockFindOne = jest.fn();
const mockIssueEmailVerificationState = jest.fn();
const mockBuildAppUrl = jest.fn();
const mockSendVerificationEmail = jest.fn();

jest.mock('@/lib/csrf', () => ({
    enforceCsrf: (...args: unknown[]) => mockEnforceCsrf(...args),
}));

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

jest.mock('@/lib/account-security', () => ({
    issueEmailVerificationState: (...args: unknown[]) => mockIssueEmailVerificationState(...args),
}));

jest.mock('@/lib/token-utils', () => ({
    buildAppUrl: (...args: unknown[]) => mockBuildAppUrl(...args),
}));

jest.mock('@/lib/email', () => ({
    sendVerificationEmail: (...args: unknown[]) => mockSendVerificationEmail(...args),
}));

describe('POST /api/auth/resend-verification', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockEnforceCsrf.mockResolvedValue(null);
        mockConnectDB.mockResolvedValue(undefined);
        mockIssueEmailVerificationState.mockReturnValue({
            token: 'verification-token-2',
            tokenHash: 'verification-hash-2',
            expiresAt: new Date('2026-05-01T00:00:00.000Z'),
        });
        mockBuildAppUrl.mockReturnValue('http://localhost:3000/api/auth/verify-email?token=verification-token-2');
        mockSendVerificationEmail.mockResolvedValue({ delivered: true });
    });

    it('rotates the verification token and sends a resend-specific email for unverified users', async () => {
        const save = jest.fn().mockResolvedValue(undefined);
        const user = {
            email: 'test@example.com',
            name: 'Test User',
            emailVerified: false,
            emailVerificationTokenHash: 'old-hash',
            emailVerificationExpires: new Date('2026-04-01T00:00:00.000Z'),
            save,
        };
        mockFindOne.mockResolvedValue(user);

        const response = await POST(new Request('http://localhost:3000/api/auth/resend-verification', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                cookie: 'toms_csrf=csrf-token',
                'x-csrf-token': 'csrf-token',
            },
            body: JSON.stringify({ email: 'Test@Example.com' }),
        }) as never);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.message).toContain('Only the latest verification link will work');
        expect(user.emailVerificationTokenHash).toBe('verification-hash-2');
        expect(user.emailVerificationExpires).toEqual(new Date('2026-05-01T00:00:00.000Z'));
        expect(save).toHaveBeenCalledTimes(1);
        expect(mockSendVerificationEmail).toHaveBeenCalledWith({
            to: 'test@example.com',
            name: 'Test User',
            verificationUrl: 'http://localhost:3000/api/auth/verify-email?token=verification-token-2',
            mode: 'resend',
        });
    });

    it('keeps the response generic and skips sending when the account is already verified or missing', async () => {
        mockFindOne.mockResolvedValue(null);

        const response = await POST(new Request('http://localhost:3000/api/auth/resend-verification', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                cookie: 'toms_csrf=csrf-token',
                'x-csrf-token': 'csrf-token',
            },
            body: JSON.stringify({ email: 'missing@example.com' }),
        }) as never);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.message).toContain('If the account requires verification');
        expect(mockIssueEmailVerificationState).not.toHaveBeenCalled();
        expect(mockSendVerificationEmail).not.toHaveBeenCalled();
    });
});
