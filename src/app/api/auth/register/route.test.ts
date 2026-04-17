/**
 * @jest-environment node
 */
import { POST } from './route';

const mockEnforceCsrf = jest.fn();
const mockRateLimit = jest.fn();
const mockVerifyTurnstileToken = jest.fn();
const mockConnectDB = jest.fn();
const mockFindOne = jest.fn();
const mockCreate = jest.fn();
const mockHashPassword = jest.fn();
const mockIssueEmailVerificationState = jest.fn();
const mockBuildAppUrl = jest.fn();
const mockSendVerificationEmail = jest.fn();

jest.mock('@/lib/csrf', () => ({
    enforceCsrf: (...args: unknown[]) => mockEnforceCsrf(...args),
}));

jest.mock('@/lib/rate-limit', () => ({
    rateLimit: (...args: unknown[]) => mockRateLimit(...args),
}));

jest.mock('@/lib/turnstile', () => ({
    verifyTurnstileToken: (...args: unknown[]) => mockVerifyTurnstileToken(...args),
}));

jest.mock('@/lib/mongodb', () => ({
    __esModule: true,
    default: (...args: unknown[]) => mockConnectDB(...args),
}));

jest.mock('@/models/User', () => ({
    __esModule: true,
    default: {
        findOne: (...args: unknown[]) => mockFindOne(...args),
        create: (...args: unknown[]) => mockCreate(...args),
    },
}));

jest.mock('@/lib/auth', () => ({
    hashPassword: (...args: unknown[]) => mockHashPassword(...args),
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

describe('POST /api/auth/register', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockEnforceCsrf.mockResolvedValue(null);
        mockRateLimit.mockResolvedValue(null);
        mockConnectDB.mockResolvedValue(undefined);
        mockFindOne.mockResolvedValue(null);
        mockCreate.mockResolvedValue({
            _id: 'user-1',
            name: 'Test User',
            email: 'test@example.com',
            role: 'USER',
        });
        mockHashPassword.mockResolvedValue('hashed-password');
        mockIssueEmailVerificationState.mockReturnValue({
            token: 'verification-token',
            tokenHash: 'verification-hash',
            expiresAt: new Date('2026-05-01T00:00:00.000Z'),
        });
        mockBuildAppUrl.mockReturnValue('http://localhost:3000/api/auth/verify-email?token=verification-token');
        mockSendVerificationEmail.mockResolvedValue(undefined);
    });

    it('returns a captcha-specific error instead of generic validation failure when the token is missing', async () => {
        mockVerifyTurnstileToken.mockResolvedValue({
            success: false,
            error: 'Captcha verification is unavailable',
        });

        const response = await POST(new Request('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                cookie: 'toms_csrf=csrf-token',
                'x-csrf-token': 'csrf-token',
            },
            body: JSON.stringify({
                name: 'Test User',
                email: 'test@example.com',
                password: 'Password@123',
                role: 'USER',
            }),
        }) as never);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe('Captcha verification is unavailable');
        expect(mockVerifyTurnstileToken).toHaveBeenCalledWith(null, null);
        expect(mockConnectDB).not.toHaveBeenCalled();
        expect(mockCreate).not.toHaveBeenCalled();
    });
});
