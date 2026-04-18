export const dynamic = 'force-dynamic';
import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { hashPassword } from '@/lib/auth';
import { enforceCsrf } from '@/lib/csrf';
import { hashOpaqueToken } from '@/lib/token-utils';
import { passwordSchema } from '@/lib/password-policy';

const resetPasswordSchema = z.object({
    token: z.string().min(1, 'Token is required'),
    password: passwordSchema,
});

export async function POST(request: NextRequest) {
    const csrfError = await enforceCsrf(request);
    if (csrfError) return csrfError;

    try {
        const body = await request.json();
        const result = resetPasswordSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: result.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        await connectDB();
        const tokenHash = hashOpaqueToken(result.data.token);
        const user = await User.findOne({
            passwordResetTokenHash: tokenHash,
            passwordResetExpires: { $gt: new Date() },
            isDeleted: false,
        }).select('+passwordResetTokenHash');

        if (!user) {
            return NextResponse.json({ error: 'Reset link is invalid or expired' }, { status: 400 });
        }

        user.passwordHash = await hashPassword(result.data.password);
        user.passwordResetTokenHash = undefined;
        user.passwordResetExpires = undefined;
        user.failedLoginAttempts = 0;
        user.lockedUntil = undefined;
        await user.save();

        return NextResponse.json({
            success: true,
            message: 'Password updated successfully. You can now sign in.',
        });
    } catch (error) {
        console.error('Reset password error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
