import { NextResponse, type NextRequest } from 'next/server';
import { signToken, setAuthCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        const { role } = await request.json();

        // Mint a valid JWT for the requested presentation role
        const token = await signToken({
            userId: '000000000000000000000000',
            role: role || 'USER',
            email: `demo-${(role || 'USER').toLowerCase()}@yataraceylon.com`,
        });

        const response = NextResponse.json({ success: true, role });
        response.headers.set('Set-Cookie', setAuthCookie(token));

        return response;
    } catch (error) {
        console.error('Mock Login error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
