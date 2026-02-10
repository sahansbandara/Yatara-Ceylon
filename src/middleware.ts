import { NextResponse, type NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

const PROTECTED_PATHS = ['/dashboard'];
const COOKIE_NAME = 'toms_token';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check if this is a protected route
    const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));
    if (!isProtected) return NextResponse.next();

    const token = request.cookies.get(COOKIE_NAME)?.value;

    if (!token) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    const payload = await verifyToken(token);
    if (!payload) {
        const loginUrl = new URL('/login', request.url);
        return NextResponse.redirect(loginUrl);
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
