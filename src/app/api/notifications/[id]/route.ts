export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Notification from '@/models/Notification';
import { staffOrAdmin } from '@/lib/rbac';
import { validateBody } from '@/lib/validate';
import { updateNotificationSchema } from '@/lib/validations';
import { logAudit } from '@/lib/audit';

export const GET = staffOrAdmin(async (_req, context) => {
    try {
        await connectDB();
        const { id } = await context.params;
        const notification = await Notification.findOne({ _id: id, isDeleted: { $ne: true } }).lean();
        if (!notification) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json({ notification });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
});

export const PATCH = staffOrAdmin(async (request, context) => {
    const { data, error } = await validateBody(request, updateNotificationSchema);
    if (error) return error;
    try {
        await connectDB();
        const { id } = await context.params;
        const notification = await Notification.findByIdAndUpdate(
            id,
            { $set: data },
            { new: true }
        );
        if (!notification) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        await logAudit({ actorUserId: context.user.userId, action: 'UPDATE', entity: 'Notification', entityId: id, meta: data });
        return NextResponse.json({ notification });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
});

export const DELETE = staffOrAdmin(async (_req, context) => {
    try {
        await connectDB();
        const { id } = await context.params;
        await Notification.findByIdAndUpdate(id, { $set: { isDeleted: true, deletedAt: new Date() } });
        await logAudit({ actorUserId: context.user.userId, action: 'DELETE', entity: 'Notification', entityId: id });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
});
