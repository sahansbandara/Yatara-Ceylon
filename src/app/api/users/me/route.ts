import { NextResponse, type NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function PATCH(request: NextRequest) {
    try {
        const token = getTokenFromRequest(request);
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyToken(token);
        if (!payload) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const body = await request.json();
        const { name, phone, avatar } = body;

        await connectDB();

        const updateData: any = {};
        if (name) updateData.name = name;
        if (phone !== undefined) updateData.phone = phone; // Allow clearing phone
        if (avatar !== undefined) updateData.avatar = avatar; // Allow setting avatar string

        const updatedUser = await User.findByIdAndUpdate(
            payload.userId,
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
}
