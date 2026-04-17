/**
 * @jest-environment node
 */
import { NextResponse } from 'next/server';
import { signToken } from '../auth';
import { withAuth, withRole, adminOnly, staffOrAdmin } from '../rbac';

// Helper: create a Request with an auth cookie
async function createAuthRequest(role: 'ADMIN' | 'STAFF'): Promise<Request> {
    const token = await signToken({ userId: 'u1', role, email: `${role.toLowerCase()}@test.com` });
    return new Request('http://localhost:3000/api/test', {
        headers: { cookie: `toms_token=${token}` },
    });
}

function createUnauthRequest(): Request {
    return new Request('http://localhost:3000/api/test');
}

function createBadTokenRequest(): Request {
    return new Request('http://localhost:3000/api/test', {
        headers: { cookie: 'toms_token=invalid.token.here' },
    });
}

// Dummy handler that returns 200 with the user's role
const dummyHandler = async (_request: Request, context: any) => {
    return NextResponse.json({ ok: true, role: context.user.role });
};

describe('RBAC middleware', () => {
    describe('withAuth', () => {
        it('should return 401 when no token is present', async () => {
            const handler = withAuth(dummyHandler);
            const res = await handler(createUnauthRequest(), { params: Promise.resolve({}) });
            expect(res.status).toBe(401);
            const body = await res.json();
            expect(body.error).toBe('Authentication required');
        });

        it('should return 401 when token is invalid', async () => {
            const handler = withAuth(dummyHandler);
            const res = await handler(createBadTokenRequest(), { params: Promise.resolve({}) });
            expect(res.status).toBe(401);
            const body = await res.json();
            expect(body.error).toBe('Invalid or expired token');
        });

        it('should pass user to handler when token is valid', async () => {
            const handler = withAuth(dummyHandler);
            const req = await createAuthRequest('ADMIN');
            const res = await handler(req, { params: Promise.resolve({}) });
            expect(res.status).toBe(200);
            const body = await res.json();
            expect(body.ok).toBe(true);
            expect(body.role).toBe('ADMIN');
        });
    });

    describe('withRole', () => {
        it('should return 403 when user role is not in allowed roles', async () => {
            const handler = withRole('ADMIN')(dummyHandler);
            const req = await createAuthRequest('STAFF');
            const res = await handler(req, { params: Promise.resolve({}) });
            expect(res.status).toBe(403);
            const body = await res.json();
            expect(body.error).toBe('Insufficient permissions');
        });

        it('should allow ADMIN when ADMIN is in allowed roles', async () => {
            const handler = withRole('ADMIN')(dummyHandler);
            const req = await createAuthRequest('ADMIN');
            const res = await handler(req, { params: Promise.resolve({}) });
            expect(res.status).toBe(200);
        });

        it('should allow both ADMIN and STAFF when both are specified', async () => {
            const handler = withRole('ADMIN', 'STAFF')(dummyHandler);

            const adminReq = await createAuthRequest('ADMIN');
            const adminRes = await handler(adminReq, { params: Promise.resolve({}) });
            expect(adminRes.status).toBe(200);

            const staffReq = await createAuthRequest('STAFF');
            const staffRes = await handler(staffReq, { params: Promise.resolve({}) });
            expect(staffRes.status).toBe(200);
        });
    });

    describe('adminOnly', () => {
        it('should allow ADMIN', async () => {
            const handler = adminOnly(dummyHandler);
            const req = await createAuthRequest('ADMIN');
            const res = await handler(req, { params: Promise.resolve({}) });
            expect(res.status).toBe(200);
        });

        it('should deny STAFF', async () => {
            const handler = adminOnly(dummyHandler);
            const req = await createAuthRequest('STAFF');
            const res = await handler(req, { params: Promise.resolve({}) });
            expect(res.status).toBe(403);
        });
    });

    describe('staffOrAdmin', () => {
        it('should allow ADMIN', async () => {
            const handler = staffOrAdmin(dummyHandler);
            const req = await createAuthRequest('ADMIN');
            const res = await handler(req, { params: Promise.resolve({}) });
            expect(res.status).toBe(200);
        });

        it('should allow STAFF', async () => {
            const handler = staffOrAdmin(dummyHandler);
            const req = await createAuthRequest('STAFF');
            const res = await handler(req, { params: Promise.resolve({}) });
            expect(res.status).toBe(200);
        });

        it('should deny unauthenticated', async () => {
            const handler = staffOrAdmin(dummyHandler);
            const res = await handler(createUnauthRequest(), { params: Promise.resolve({}) });
            expect(res.status).toBe(401);
        });
    });
});
