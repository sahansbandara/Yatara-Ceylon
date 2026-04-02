export const dynamic = 'force-dynamic';
import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { enforceCsrf } from '@/lib/csrf';
import { issueEmailVerificationState } from '@/lib/account-security';
import { buildAppUrl } from '@/lib/token-utils';
import { sendVerificationEmail } from '@/lib/email';

const resendVerificationSchema = z.object({
    email: z.string().email('Invalid email address'),
});

export async function POST(request: NextRequest) {
    const csrfError = await enforceCsrf(request);
    if (csrfError) return csrfError;

    try {
        const body = await request.json();
        const result = resendVerificationSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: result.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        await connectDB();
        const user = await User.findOne({
            email: result.data.email.toLowerCase(),
            isDeleted: false,
        });

        if (user && !user.emailVerified) {
            const verificationState = issueEmailVerificationState();
            user.emailVerificationTokenHash = verificationState.tokenHash;
            user.emailVerificationExpires = verificationState.expiresAt;
            await user.save();

            const verificationUrl = buildAppUrl(`/api/auth/verify-email?token=${verificationState.token}`);
            await sendVerificationEmail({
                to: user.email,
                name: user.name,
                verificationUrl,
                mode: 'resend',
            });
        }

        return NextResponse.json({
            success: true,
            message: 'If the account requires verification, a new verification email has been sent. Only the latest verification link will work.',
        });
    } catch (error) {
        console.error('Resend verification error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
