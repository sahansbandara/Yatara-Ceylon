/**
 * @jest-environment node
 */
import { verifyTurnstileToken } from '../turnstile';

describe('verifyTurnstileToken', () => {
    const originalSecret = process.env.TURNSTILE_SECRET_KEY;
    const originalNodeEnv = process.env.NODE_ENV;
    const originalVercelEnv = process.env.VERCEL_ENV;
    const originalFetch = global.fetch;
    let consoleErrorSpy: jest.SpyInstance;

    beforeEach(() => {
        process.env.TURNSTILE_SECRET_KEY = 'test-secret';
        process.env.NODE_ENV = 'test';
        process.env.VERCEL_ENV = 'production';
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => ({ success: true }),
        }) as unknown as typeof fetch;
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        process.env.TURNSTILE_SECRET_KEY = originalSecret;
        process.env.NODE_ENV = originalNodeEnv;
        process.env.VERCEL_ENV = originalVercelEnv;
        global.fetch = originalFetch;
        consoleErrorSpy.mockRestore();
        jest.clearAllMocks();
    });

    it('uses only the first forwarded IP when a proxy chain is present', async () => {
        const result = await verifyTurnstileToken(
            'turnstile-token',
            '203.0.113.10, 70.41.3.18, 150.172.238.178'
        );

        expect(result).toEqual({ success: true });
        expect(global.fetch).toHaveBeenCalledTimes(1);

        const [, options] = (global.fetch as jest.Mock).mock.calls[0];
        const body = new URLSearchParams(options.body as string);

        expect(body.get('secret')).toBe('test-secret');
        expect(body.get('response')).toBe('turnstile-token');
        expect(body.get('remoteip')).toBe('203.0.113.10');
    });

    it('logs safe diagnostic details when siteverify rejects the token', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                success: false,
                hostname: 'www.yataraceylon.me',
                'error-codes': ['invalid-input-response'],
            }),
        } as Response);

        const result = await verifyTurnstileToken('turnstile-token', '203.0.113.10');

        expect(result).toEqual({ success: false, error: 'Captcha verification failed' });
        expect(consoleErrorSpy).toHaveBeenCalledWith(
            '[Turnstile] siteverify rejected token',
            expect.objectContaining({
                tokenPresent: true,
                remoteIpProvided: true,
                hostname: 'www.yataraceylon.me',
                errorCodes: ['invalid-input-response'],
            })
        );

        const loggedPayload = JSON.stringify(consoleErrorSpy.mock.calls[0]);
        expect(loggedPayload).not.toContain('turnstile-token');
        expect(loggedPayload).not.toContain('test-secret');
    });
});
