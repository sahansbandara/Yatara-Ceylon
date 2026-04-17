/**
 * @jest-environment node
 */
import { NextRequest, NextResponse } from 'next/server';
import { signToken } from '../auth';

// We'll test the middleware logic by importing it
// Since Next.js middleware uses module-level exports, we test the function directly
import { middleware, config } from '../../middleware';

describe('Auth middleware', () => {
    const baseUrl = 'http://localhost:3000';

    function createRequest(path: string, token?: string): NextRequest {
        const url = `${baseUrl}${path}`;
        const headers: Record<string, string> = {};
        if (token) {
            headers.cookie = `toms_token=${token}`;
        }
        return new NextRequest(url, { headers });
    }

    describe('config.matcher', () => {
        it('should match dashboard paths', () => {
            expect(config.matcher).toContain('/dashboard/:path*');
        });
    });

    describe('public routes', () => {
        it('should pass through non-protected routes', async () => {
            const req = createRequest('/');
            const res = await middleware(req);
            expect(res.status).not.toBe(302); // not a redirect
        });

        it('should pass through API routes', async () => {
            const req = createRequest('/api/packages');
            const res = await middleware(req);
            expect(res.status).not.toBe(302);
        });
    });

    describe('protected routes', () => {
        it('should redirect to login when no token is present', async () => {
            const req = createRequest('/dashboard');
            const res = await middleware(req);
            expect(res.status).toBe(307);
            const location = res.headers.get('location');
            expect(location).toContain('/auth/login');
            expect(location).toContain('redirect=%2Fdashboard');
        });

        it('should redirect to login for invalid token', async () => {
            const req = createRequest('/dashboard', 'invalid-token');
            const res = await middleware(req);
            expect(res.status).toBe(307);
            const location = res.headers.get('location');
            expect(location).toContain('/auth/login');
        });

        it('should allow ADMIN access to /dashboard', async () => {
            const token = await signToken({ userId: 'u1', role: 'ADMIN', email: 'admin@test.com' });
            const req = createRequest('/dashboard', token);
            const res = await middleware(req);
            // Should not redirect (200 = NextResponse.next())
            expect(res.status).toBe(200);
        });

        it('should allow STAFF access to /dashboard', async () => {
            const token = await signToken({ userId: 'u2', role: 'STAFF', email: 'staff@test.com' });
            const req = createRequest('/dashboard', token);
            const res = await middleware(req);
            expect(res.status).toBe(200);
        });

        it('should set security headers on successful access', async () => {
            const token = await signToken({ userId: 'u1', role: 'ADMIN', email: 'admin@test.com' });
            const req = createRequest('/dashboard', token);
            const res = await middleware(req);
            expect(res.headers.get('X-Frame-Options')).toBe('DENY');
            expect(res.headers.get('X-Content-Type-Options')).toBe('nosniff');
            expect(res.headers.get('Referrer-Policy')).toBe('strict-origin-when-cross-origin');
            expect(res.headers.get('X-XSS-Protection')).toBe('1; mode=block');
        });

        it('should allow ADMIN access to sub-paths', async () => {
            const token = await signToken({ userId: 'u1', role: 'ADMIN', email: 'admin@test.com' });
            const req = createRequest('/dashboard/bookings', token);
            const res = await middleware(req);
            expect(res.status).toBe(200);
        });
    });
});
