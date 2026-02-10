import { NextResponse } from 'next/server';
import { getTokenFromRequest, verifyToken, type TokenPayload } from './auth';

type RouteHandler = (
    request: Request,
    context: { params: Promise<Record<string, string>>; user: TokenPayload }
) => Promise<NextResponse>;

// Require authentication (any valid user)
export function withAuth(handler: RouteHandler) {
    return async (request: Request, context: { params: Promise<Record<string, string>> }) => {
        const token = getTokenFromRequest(request);
        if (!token) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        const user = await verifyToken(token);
        if (!user) {
            return NextResponse.json(
                { error: 'Invalid or expired token' },
                { status: 401 }
            );
        }

        return handler(request, { ...context, user });
    };
}

// Require specific role(s)
export function withRole(...roles: Array<'ADMIN' | 'STAFF'>) {
    return (handler: RouteHandler) => {
        return withAuth(async (request, context) => {
            if (!roles.includes(context.user.role)) {
                return NextResponse.json(
                    { error: 'Insufficient permissions' },
                    { status: 403 }
                );
            }
            return handler(request, context);
        });
    };
}

// Shorthand: Admin only
export function adminOnly(handler: RouteHandler) {
    return withRole('ADMIN')(handler);
}

// Shorthand: Staff or Admin
export function staffOrAdmin(handler: RouteHandler) {
    return withRole('ADMIN', 'STAFF')(handler);
}
