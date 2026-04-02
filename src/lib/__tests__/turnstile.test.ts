/**
 * @jest-environment node
 */
import { verifyTurnstileToken } from '../turnstile';

describe('verifyTurnstileToken', () => {
    const originalSecret = process.env.TURNSTILE_SECRET_KEY;
    const originalNodeEnv = process.env.NODE_ENV;
    const originalFetch = global.fetch;

    beforeEach(() => {
        process.env.TURNSTILE_SECRET_KEY = 'test-secret';
        process.env.NODE_ENV = 'test';
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => ({ success: true }),
        }) as unknown as typeof fetch;
    });

    afterEach(() => {
        process.env.TURNSTILE_SECRET_KEY = originalSecret;
        process.env.NODE_ENV = originalNodeEnv;
        global.fetch = originalFetch;
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
});
