import { NextResponse } from 'next/server';
import { getTokenFromRequest, verifyToken, type TokenPayload, type UserRole } from './auth';

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
export function withRole(...roles: UserRole[]) {
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

// Shorthand: Customer only
export function customerOnly(handler: RouteHandler) {
    return withRole('USER')(handler);
}

// Shorthand: Any partner or Admin
export function partnerOrAdmin(handler: RouteHandler) {
    return withRole('ADMIN', 'VEHICLE_OWNER', 'HOTEL_OWNER')(handler);
}
