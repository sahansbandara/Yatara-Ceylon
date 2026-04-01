export const dynamic = 'force-dynamic';
import { NextResponse, type NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { withAuth } from '@/lib/rbac';
import { z } from 'zod';
import { phoneRegex } from '@/lib/password-policy';

const updateProfileSchema = z.object({
    name: z.string().min(1).optional(),
    phone: z.string().optional().refine(
        (phone) => !phone || phoneRegex.test(phone),
        'Invalid phone number format'
    ),
    avatar: z.string().optional(),
});

export const PATCH = withAuth(async (request, context) => {
    try {
        const body = await request.json();
        const parsed = updateProfileSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
                { status: 400 }
            );
        }
        const { name, phone, avatar } = parsed.data;

        await connectDB();

        const updateData: any = {};
        if (name) updateData.name = name;
        if (phone !== undefined) updateData.phone = phone; // Allow clearing phone
        if (avatar !== undefined) updateData.avatar = avatar; // Allow setting avatar string

        const updatedUser = await User.findByIdAndUpdate(
            context.user.userId,
            { $set: updateData },
            { new: true }
        ).select('-passwordHash').lean();

        if (!updatedUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            user: updatedUser
        });
    } catch (error: any) {
        console.error('Update profile error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
});
