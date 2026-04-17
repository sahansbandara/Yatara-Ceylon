export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { clearAuthCookie } from '@/lib/auth';
import { enforceCsrf } from '@/lib/csrf';

export async function POST(request: Request) {
    const csrfError = await enforceCsrf(request);
    if (csrfError) return csrfError;

    const response = NextResponse.json({ success: true });
    response.headers.set('Set-Cookie', clearAuthCookie());
    return response;
}
