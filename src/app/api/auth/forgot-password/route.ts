export const dynamic = 'force-dynamic';
import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { rateLimit } from '@/lib/rate-limit';
import { enforceCsrf } from '@/lib/csrf';
import { buildAppUrl } from '@/lib/token-utils';
import { sendPasswordResetEmail } from '@/lib/email';
import { issuePasswordResetState } from '@/lib/account-security';

const forgotPasswordSchema = z.object({
    email: z.string().email('Invalid email address'),
});

export async function POST(request: NextRequest) {
    const csrfError = await enforceCsrf(request);
    if (csrfError) return csrfError;

    const limitError = await rateLimit(request);
    if (limitError) return limitError;

    try {
        const body = await request.json();
        const result = forgotPasswordSchema.safeParse(body);
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

        if (user) {
            const resetState = issuePasswordResetState();
            user.passwordResetTokenHash = resetState.tokenHash;
            user.passwordResetExpires = resetState.expiresAt;
            await user.save();

            const resetUrl = buildAppUrl(`/auth/reset-password?token=${resetState.token}`);
            await sendPasswordResetEmail({
                to: user.email,
                name: user.name,
                resetUrl,
            });
        }

        return NextResponse.json({
            success: true,
            message: 'If that email exists, a password reset link has been sent.',
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
