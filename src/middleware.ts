import { NextResponse, type NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth-edge';

const COOKIE_NAME = 'toms_token';

// Role-based access: each role lists the paths it CAN access.
// ADMIN gets wildcard '/dashboard' (everything).
// Others get specific sub-paths only.
const ROLE_ACCESS: Record<string, string[]> = {
    ADMIN: ['/dashboard'],
    STAFF: [
        '/dashboard',
        // Staff is blocked from these via explicit deny below
    ],
    USER: [
        '/dashboard/my-bookings',
        '/dashboard/my-plans',
        '/dashboard/profile',
    ],
    VEHICLE_OWNER: [
        '/dashboard/fleet',
        '/dashboard/profile',
    ],
    HOTEL_OWNER: [
        '/dashboard/hotel',
        '/dashboard/profile',
    ],
};

// Paths that staff CANNOT access (even though they have /dashboard)
const STAFF_DENIED: string[] = [
    '/dashboard/users',
];

// Default landing page per role
const ROLE_DEFAULT: Record<string, string> = {
    ADMIN: '/dashboard',
    STAFF: '/dashboard',
    USER: '/dashboard/my-bookings',
    VEHICLE_OWNER: '/dashboard/fleet',
    HOTEL_OWNER: '/dashboard/hotel',
};

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Only protect /dashboard routes
    if (!pathname.startsWith('/dashboard')) {
        return NextResponse.next();
    }

    const token = request.cookies.get(COOKIE_NAME)?.value;

    if (!token) {
        const loginUrl = new URL('/auth/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    const payload = await verifyToken(token);
    if (!payload) {
        const loginUrl = new URL('/auth/login', request.url);
        return NextResponse.redirect(loginUrl);
    }

    const role = payload.role as string;
    const allowedPaths = ROLE_ACCESS[role] || [];

    // Check if role has access to this specific path
    const hasAccess = allowedPaths.some(p => pathname.startsWith(p));

    // Staff explicit deny check
    if (role === 'STAFF' && STAFF_DENIED.some(d => pathname.startsWith(d))) {
        return NextResponse.redirect(new URL(ROLE_DEFAULT[role] || '/', request.url));
    }

    if (!hasAccess) {
        const defaultPath = ROLE_DEFAULT[role] || '/';
        return NextResponse.redirect(new URL(defaultPath, request.url));
    }

    // Inject role into headers for server components to read
    const response = NextResponse.next();
    response.headers.set('x-user-role', role);
    response.headers.set('x-user-id', payload.userId);
    response.headers.set('x-user-email', payload.email);

    // Security headers
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('X-XSS-Protection', '1; mode=block');

    return response;
}

export const runtime = 'nodejs';

export const config = {
    matcher: ['/dashboard/:path*'],
};
