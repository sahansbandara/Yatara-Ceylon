/**
 * @jest-environment node
 */
import { signToken, verifyToken, setAuthCookie, clearAuthCookie, hashPassword, comparePassword, getTokenFromRequest } from '../auth';

describe('auth utilities', () => {
    describe('signToken / verifyToken', () => {
        it('should produce a token that verifyToken can decode', async () => {
            const payload = { userId: 'u1', role: 'ADMIN' as const, email: 'admin@test.com' };
            const token = await signToken(payload);
            expect(typeof token).toBe('string');
            expect(token.split('.')).toHaveLength(3); // JWT has 3 parts

            const decoded = await verifyToken(token);
            expect(decoded).not.toBeNull();
            expect(decoded!.userId).toBe('u1');
            expect(decoded!.role).toBe('ADMIN');
            expect(decoded!.email).toBe('admin@test.com');
        });

        it('should return null for a tampered token', async () => {
            const payload = { userId: 'u1', role: 'STAFF' as const, email: 'staff@test.com' };
            const token = await signToken(payload);
            const tampered = token.slice(0, -5) + 'XXXXX';
            const decoded = await verifyToken(tampered);
            expect(decoded).toBeNull();
        });

        it('should return null for a completely invalid token', async () => {
            const decoded = await verifyToken('not.a.jwt');
            expect(decoded).toBeNull();
        });

        it('should return null for an empty string', async () => {
            const decoded = await verifyToken('');
            expect(decoded).toBeNull();
        });
    });

    describe('setAuthCookie', () => {
        it('should include HttpOnly and SameSite=Strict', () => {
            const cookie = setAuthCookie('mytoken');
            expect(cookie).toContain('toms_token=mytoken');
            expect(cookie).toContain('HttpOnly');
            expect(cookie).toContain('SameSite=Strict');
            expect(cookie).toContain('Max-Age=86400');
            expect(cookie).toContain('Path=/');
        });

        it('should include Secure flag in production', () => {
            const origEnv = process.env.NODE_ENV;
            Object.defineProperty(process.env, 'NODE_ENV', { value: 'production', writable: true, configurable: true });
            const cookie = setAuthCookie('mytoken');
            expect(cookie).toContain('Secure');
            Object.defineProperty(process.env, 'NODE_ENV', { value: origEnv, writable: true, configurable: true });
        });

        it('should not include Secure flag in development', () => {
            const origEnv = process.env.NODE_ENV;
            Object.defineProperty(process.env, 'NODE_ENV', { value: 'development', writable: true, configurable: true });
            const cookie = setAuthCookie('mytoken');
            expect(cookie).not.toContain('Secure');
            Object.defineProperty(process.env, 'NODE_ENV', { value: origEnv, writable: true, configurable: true });
        });
    });

    describe('clearAuthCookie', () => {
        it('should set Max-Age=0 to expire the cookie', () => {
            const cookie = clearAuthCookie();
            expect(cookie).toContain('toms_token=');
            expect(cookie).toContain('Max-Age=0');
            expect(cookie).toContain('HttpOnly');
        });
    });

    describe('hashPassword / comparePassword', () => {
        it('should hash and then correctly verify a password', async () => {
            const password = 'MySecureP@ss123';
            const hash = await hashPassword(password);
            expect(hash).not.toBe(password);
            expect(hash.startsWith('$2')).toBe(true); // bcrypt prefix

            const match = await comparePassword(password, hash);
            expect(match).toBe(true);
        });

        it('should reject a wrong password', async () => {
            const hash = await hashPassword('correctPassword');
            const match = await comparePassword('wrongPassword', hash);
            expect(match).toBe(false);
        });
    });

    describe('getTokenFromRequest', () => {
        it('should extract token from cookie header', () => {
            const request = new Request('http://localhost:3000/api/test', {
                headers: { cookie: 'toms_token=abc123; other=val' },
            });
            expect(getTokenFromRequest(request)).toBe('abc123');
        });

        it('should return null when cookie header is missing', () => {
            const request = new Request('http://localhost:3000/api/test');
            expect(getTokenFromRequest(request)).toBeNull();
        });

        it('should return null when toms_token cookie is not present', () => {
            const request = new Request('http://localhost:3000/api/test', {
                headers: { cookie: 'session=xyz; other=val' },
            });
            expect(getTokenFromRequest(request)).toBeNull();
        });
    });
});
