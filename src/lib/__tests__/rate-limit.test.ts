/**
 * @jest-environment node
 */
import { rateLimit, _resetTrackers } from '../rate-limit';
import { NextRequest } from 'next/server';

describe('rateLimit', () => {
    const createRequest = (ip: string) => {
        const req = new NextRequest('http://localhost:3000/api/test');
        Object.defineProperty(req, 'headers', {
            value: new Headers({ 'x-forwarded-for': ip }),
            writable: true,
        });
        return req;
    };

    beforeEach(() => {
        _resetTrackers();
    });

    it('should allow requests under the limit', async () => {
        const req = createRequest('10.0.0.1');
        const res = await rateLimit(req, { limit: 5, windowMs: 10000 });
        expect(res).toBeNull();
    });

    it('should allow exactly "limit" number of requests', async () => {
        const req = createRequest('10.0.0.2');
        const config = { limit: 3, windowMs: 10000 };

        expect(await rateLimit(req, config)).toBeNull(); // 1
        expect(await rateLimit(req, config)).toBeNull(); // 2
        expect(await rateLimit(req, config)).toBeNull(); // 3
    });

    it('should block the request exceeding the limit', async () => {
        const req = createRequest('10.0.0.3');
        const config = { limit: 2, windowMs: 10000 };

        expect(await rateLimit(req, config)).toBeNull(); // 1
        expect(await rateLimit(req, config)).toBeNull(); // 2

        const blocked = await rateLimit(req, config); // 3 — blocked
        expect(blocked).not.toBeNull();
        expect(blocked!.status).toBe(429);

        const body = await blocked!.json();
        expect(body.message).toContain('Too many requests');
    });

    it('should include Retry-After header when blocked', async () => {
        const req = createRequest('10.0.0.4');
        const config = { limit: 1, windowMs: 60000 };

        await rateLimit(req, config); // 1 — allowed
        const blocked = await rateLimit(req, config); // 2 — blocked

        expect(blocked).not.toBeNull();
        const retryAfter = blocked!.headers.get('Retry-After');
        expect(retryAfter).toBeTruthy();
        const seconds = parseInt(retryAfter!, 10);
        expect(seconds).toBeGreaterThan(0);
        expect(seconds).toBeLessThanOrEqual(60);
    });

    it('should track different IPs independently', async () => {
        const config = { limit: 1, windowMs: 10000 };

        const reqA = createRequest('10.0.0.10');
        const reqB = createRequest('10.0.0.11');

        expect(await rateLimit(reqA, config)).toBeNull(); // A: 1
        expect(await rateLimit(reqB, config)).toBeNull(); // B: 1

        // A should be blocked, B unaffected
        const blockedA = await rateLimit(reqA, config);
        expect(blockedA).not.toBeNull();
        expect(blockedA!.status).toBe(429);
    });

    it('should use default config when none provided', async () => {
        const req = createRequest('10.0.0.20');
        // Default is limit: 10, windowMs: 60000
        const res = await rateLimit(req);
        expect(res).toBeNull();
    });

    it('should reset count after window expires', async () => {
        jest.useFakeTimers();
        const req = createRequest('10.0.0.30');
        const config = { limit: 1, windowMs: 1000 };

        expect(await rateLimit(req, config)).toBeNull(); // allowed

        // Should be blocked within window
        const blocked = await rateLimit(req, config);
        expect(blocked).not.toBeNull();

        // Advance past the window
        jest.advanceTimersByTime(1500);

        // After window expires, a new request should be allowed
        const afterExpiry = await rateLimit(req, config);
        expect(afterExpiry).toBeNull(); // allowed again

        jest.useRealTimers();
    });

    it('should fall back to 127.0.0.1 when x-forwarded-for is missing', async () => {
        const req = new NextRequest('http://localhost:3000/api/test');
        const config = { limit: 1, windowMs: 10000 };
        const res = await rateLimit(req, config);
        expect(res).toBeNull();
    });
});
