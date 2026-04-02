export const dynamic = 'force-dynamic';
import { NextResponse, type NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { hashPassword } from '@/lib/auth';
import { z } from 'zod';
import { rateLimit } from '@/lib/rate-limit';
import { passwordSchema, phoneRegex } from '@/lib/password-policy';
import { issueEmailVerificationState } from '@/lib/account-security';
import { buildAppUrl } from '@/lib/token-utils';
import { sendVerificationEmail } from '@/lib/email';
import { verifyTurnstileToken } from '@/lib/turnstile';
import { enforceCsrf } from '@/lib/csrf';

const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional().refine(
        (phone) => !phone || phoneRegex.test(phone),
        'Invalid phone number format'
    ),
    password: passwordSchema,
    role: z.enum(['USER', 'VEHICLE_OWNER', 'HOTEL_OWNER']).default('USER'),
    turnstileToken: z.string().optional(),
});

export async function POST(request: NextRequest) {
    try {
        const csrfError = await enforceCsrf(request);
        if (csrfError) return csrfError;

        // Rate Limiting
        const limitError = await rateLimit(request);
        if (limitError) return limitError;

        const body = await request.json();
        const result = registerSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: result.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const { name, email, phone, password, role, turnstileToken } = result.data;
        const captchaResult = await verifyTurnstileToken(
            turnstileToken?.trim() || null,
            request.headers.get('x-forwarded-for')
        );
        if (!captchaResult.success) {
            return NextResponse.json({ error: captchaResult.error }, { status: 400 });
        }

        await connectDB();

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return NextResponse.json(
                { error: 'An account with this email already exists' },
                { status: 409 }
            );
        }

        // Hash password and create user
        const passwordHash = await hashPassword(password);
        const verificationState = issueEmailVerificationState();

        // Partner roles need approval, regular users are active immediately
        const status = role === 'USER' ? 'ACTIVE' : 'PENDING_APPROVAL';

        const user = await User.create({
            name,
            email: email.toLowerCase(),
            phone: phone || undefined,
            passwordHash,
            role,
            status,
            emailVerified: false,
            emailVerificationTokenHash: verificationState.tokenHash,
            emailVerificationExpires: verificationState.expiresAt,
        });

        const verificationUrl = buildAppUrl(`/api/auth/verify-email?token=${verificationState.token}`);
        await sendVerificationEmail({
            to: user.email,
            name: user.name,
            verificationUrl,
        });

        return NextResponse.json({
            success: true,
            message: role === 'USER'
                ? 'Account created. Please verify your email before signing in.'
                : 'Application submitted. Verify your email and wait for admin approval before signing in.',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        }, { status: 201 });
    } catch (error: any) {
        console.error('Registration error:', error);

        // Handle MongoDB duplicate key error
        if (error.code === 11000) {
            return NextResponse.json(
                { error: 'An account with this email already exists' },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
