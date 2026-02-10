import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { adminOnly } from '@/lib/rbac';
import { validateBody } from '@/lib/validate';
import { createUserSchema, updateUserSchema } from '@/lib/validations';
import { hashPassword } from '@/lib/auth';
import { logAudit } from '@/lib/audit';

export const GET = adminOnly(async () => {
    try {
        await connectDB();
        const users = await User.find({ isDeleted: false }).select('-passwordHash').sort({ createdAt: -1 }).lean();
        return NextResponse.json({ users });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
});

export const POST = adminOnly(async (request, { user }) => {
    const { data, error } = await validateBody(request, createUserSchema);
    if (error) return error;
    try {
        await connectDB();
        const existing = await User.findOne({ email: data!.email.toLowerCase() });
        if (existing) return NextResponse.json({ error: 'Email already exists' }, { status: 409 });

        const passwordHash = await hashPassword(data!.password);
        const newUser = await User.create({
            name: data!.name,
            email: data!.email.toLowerCase(),
            phone: data!.phone,
            passwordHash,
            role: data!.role,
            status: 'ACTIVE',
        });

        await logAudit({ actorUserId: user.userId, action: 'CREATE', entity: 'User', entityId: newUser._id.toString() });
        const { passwordHash: _, ...userObj } = newUser.toObject();
        return NextResponse.json({ user: userObj }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
});
