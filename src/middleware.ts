import { NextResponse, type NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

const PROTECTED_PATHS = ['/dashboard'];
const COOKIE_NAME = 'toms_token';

// Multi-Role Access Constraints mapping
const ROLE_ACCESS: Record<string, string[]> = {
    ADMIN: ['/dashboard'], // Has access to wildcard /dashboard
    STAFF: ['/dashboard'],
    USER: ['/dashboard/my-journeys', '/dashboard/custom-builder'],
    VEHICLE_OWNER: ['/dashboard/vehicles', '/dashboard/maintenance'],
    HOTEL_OWNER: ['/dashboard/partners', '/dashboard/supplier-rate-cards'],
};

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check if this is a protected route
    const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));
    if (!isProtected) return NextResponse.next();

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

    const role = (payload as any).role as string;
    const allowedPaths = ROLE_ACCESS[role] || [];

    // Check boundary
    const hasAccess = allowedPaths.some(p => pathname.startsWith(p));
    if (!hasAccess) {
        // Fallback default redirect mechanism depending on tier
        const defaultPath = allowedPaths[0] || '/';
        return NextResponse.redirect(new URL(defaultPath, request.url));
    }

    // Add security headers
    const response = NextResponse.next();
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('X-XSS-Protection', '1; mode=block');

    return response;
}

export const config = {
    matcher: ['/dashboard/:path*'],
};
