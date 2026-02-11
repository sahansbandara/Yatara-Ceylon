/**
 * @jest-environment node
 */
import { rateLimit } from '../rate-limit';
import { NextRequest } from 'next/server';

describe('rateLimit', () => {
    // Helper to mock request
    const createRequest = (ip: string) => {
        const req = new NextRequest('http://localhost:3000/api/test');
        // Mocking headers might be tricky with NextRequest in jsdom
        Object.defineProperty(req, 'headers', {
            value: new Headers({ 'x-forwarded-for': ip }),
            writable: true
        });
        return req;
    };

    beforeEach(() => {
        // Reset isn't easy here because `trackers` is private module state.
        // We can just use different IPs for different tests.
        // Or create a way to reset trackers (if we exported it or added a reset function).
        // Since we didn't, we'll use unique IPs.
    });

    it('should allow requests under the limit', async () => {
        const req = createRequest('192.168.1.1');
        const res = await rateLimit(req, { limit: 2, windowMs: 1000 });
        expect(res).toBeNull();
    });

    it('should block requests over the limit', async () => {
        const uniqueIp = '192.168.1.2';
        const req = createRequest(uniqueIp);
        const config = { limit: 1, windowMs: 1000 };

        // 1st request - allowed
        let res = await rateLimit(req, config);
        expect(res).toBeNull();

        // 2nd request - blocked
        res = await rateLimit(req, config);
        expect(res).not.toBeNull();
        if (res) {
            expect(res.status).toBe(429);
            const body = await res.json();
            expect(body.message).toContain('Too many requests');
        }
    });
});
