import crypto from 'crypto';
import { NextResponse } from 'next/server';

export const CSRF_COOKIE_NAME = 'toms_csrf';
export const CSRF_HEADER_NAME = 'x-csrf-token';

function parseCookieValue(cookieHeader: string | null, name: string): string | null {
    if (!cookieHeader) return null;
    const target = cookieHeader
        .split(';')
        .map((part) => part.trim())
        .find((part) => part.startsWith(`${name}=`));

    if (!target) return null;
    return decodeURIComponent(target.slice(name.length + 1));
}

export function generateCsrfToken(): string {
    return crypto.randomBytes(32).toString('hex');
}

export function getCsrfTokenFromRequest(request: Request): string | null {
    return parseCookieValue(request.headers.get('cookie'), CSRF_COOKIE_NAME);
}

export function setCsrfCookie(response: NextResponse, token: string) {
    response.cookies.set({
        name: CSRF_COOKIE_NAME,
        value: token,
        httpOnly: false,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24,
    });
}

export function csrfFailureResponse() {
    return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 });
}

export function isValidCsrfRequest(request: Request): boolean {
    const cookieToken = getCsrfTokenFromRequest(request);
    const headerToken = request.headers.get(CSRF_HEADER_NAME);

    if (!cookieToken || !headerToken) return false;
    if (cookieToken.length !== headerToken.length) return false;

    try {
        return crypto.timingSafeEqual(
            Buffer.from(cookieToken),
            Buffer.from(headerToken)
        );
    } catch {
        return false;
    }
}

export async function enforceCsrf(request: Request) {
    if (isValidCsrfRequest(request)) {
        return null;
    }

    return csrfFailureResponse();
}
