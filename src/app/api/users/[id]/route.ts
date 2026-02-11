import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { adminOnly } from '@/lib/rbac';
import { validateBody } from '@/lib/validate';
import { updateUserSchema } from '@/lib/validations';
import { logAudit } from '@/lib/audit';

export const GET = adminOnly(async (_req, context) => {
    try {
        await connectDB();
        const { id } = await context.params;
        const user = await User.findOne({ _id: id, isDeleted: false }).select('-passwordHash').lean();
        if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json({ user });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
});

export const PATCH = adminOnly(async (request, context) => {
    const { data, error } = await validateBody(request, updateUserSchema);
    if (error) return error;
    try {
        await connectDB();
        const { id } = await context.params;
        const user = await User.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { $set: data },
            { new: true }
        ).select('-passwordHash');
        if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        await logAudit({ actorUserId: context.user.userId, action: 'UPDATE', entity: 'User', entityId: id });
        return NextResponse.json({ user });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
});

export const DELETE = adminOnly(async (_req, context) => {
    try {
        await connectDB();
        const { id } = await context.params;
        if (id === context.user.userId) {
            return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 });
        }
        await User.findByIdAndUpdate(id, { $set: { isDeleted: true, deletedAt: new Date(), status: 'DISABLED' } });
        await logAudit({ actorUserId: context.user.userId, action: 'DELETE', entity: 'User', entityId: id });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
});
