export const dynamic = 'force-dynamic';
import { NextResponse, type NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { comparePassword, signToken, setAuthCookie } from '@/lib/auth';
import { z } from 'zod';
import { rateLimit } from '@/lib/rate-limit';
import { enforceCsrf } from '@/lib/csrf';
import { LOGIN_LOCKOUT_THRESHOLD, LOGIN_LOCKOUT_TTL_MS } from '@/lib/account-security';
import { logAudit } from '@/lib/audit';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

async function updateLastLogin(userId: string) {
    try {
        await User.updateOne(
            { _id: userId },
            {
                $set: {
                    lastLogin: new Date(),
                    failedLoginAttempts: 0,
                },
                $unset: {
                    lockedUntil: '',
                },
            }
        );
    } catch (error) {
        console.warn('Login lastLogin update failed:', error);
    }
}

async function recordFailedLogin(user: {
    _id: { toString(): string };
    email: string;
    failedLoginAttempts?: number;
}, request: NextRequest) {
    const failedAttempts = (user.failedLoginAttempts || 0) + 1;
    const lockedUntil = failedAttempts >= LOGIN_LOCKOUT_THRESHOLD
        ? new Date(Date.now() + LOGIN_LOCKOUT_TTL_MS)
        : undefined;

    await User.updateOne(
        { _id: user._id },
        {
            $set: {
                failedLoginAttempts: failedAttempts,
                ...(lockedUntil ? { lockedUntil } : {}),
            },
        }
    );

    if (lockedUntil) {
        await logAudit({
            action: 'LOCKOUT',
            entity: 'User',
            entityId: user._id.toString(),
            meta: { email: user.email, lockedUntil: lockedUntil.toISOString() },
            ip: request.headers.get('x-forwarded-for') || undefined,
        });
    }

    return lockedUntil;
}

export async function POST(request: NextRequest) {
    try {
        const csrfError = await enforceCsrf(request);
        if (csrfError) return csrfError;

        // Rate Limiting
        const limitError = await rateLimit(request);
        if (limitError) return limitError;

        const body = await request.json();
        const result = loginSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: result.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const { email, password } = result.data;
        await connectDB();

        const user = await User.findOne({
            email: email.toLowerCase(),
            isDeleted: false,
        }).select('+passwordHash');

        if (!user) {
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
            return NextResponse.json(
                { error: 'Account temporarily locked. Please try again later.' },
                { status: 423 }
            );
        }

        if (user.status !== 'ACTIVE') {
            const message = user.status === 'PENDING_APPROVAL'
                ? 'Your account is pending approval.'
                : 'Your account is not allowed to sign in.';
            return NextResponse.json({ error: message }, { status: 403 });
        }

        const valid = await comparePassword(password, user.passwordHash);
        if (!valid) {
            const lockedUntil = await recordFailedLogin(user, request);
            return NextResponse.json(
                {
                    error: lockedUntil
                        ? 'Account temporarily locked. Please try again later.'
                        : 'Invalid email or password',
                },
                { status: lockedUntil ? 423 : 401 }
            );
        }

        if (!user.emailVerified) {
            return NextResponse.json(
                { error: 'Please verify your email before signing in.' },
                { status: 403 }
            );
        }

        await updateLastLogin(user._id.toString());

        const token = await signToken({
            userId: user._id.toString(),
            role: user.role,
            email: user.email,
        });

        const response = NextResponse.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });

        response.headers.set('Set-Cookie', setAuthCookie(token));
        return response;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
