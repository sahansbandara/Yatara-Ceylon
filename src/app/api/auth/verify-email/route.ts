export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { hashOpaqueToken } from '@/lib/token-utils';

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const token = url.searchParams.get('token');

        if (!token) {
            return NextResponse.redirect(new URL('/auth/login?verified=missing', request.url));
        }

        await connectDB();
        const tokenHash = hashOpaqueToken(token);
        const user = await User.findOne({
            emailVerificationTokenHash: tokenHash,
            emailVerificationExpires: { $gt: new Date() },
            isDeleted: false,
        }).select('+emailVerificationTokenHash');

        if (!user) {
            return NextResponse.redirect(new URL('/auth/login?verified=invalid', request.url));
        }

        user.emailVerified = true;
        user.emailVerificationTokenHash = undefined;
        user.emailVerificationExpires = undefined;
        await user.save();

        return NextResponse.redirect(new URL('/auth/login?verified=success', request.url));
    } catch (error) {
        console.error('Verify email error:', error);
        return NextResponse.redirect(new URL('/auth/login?verified=error', request.url));
    }
}
