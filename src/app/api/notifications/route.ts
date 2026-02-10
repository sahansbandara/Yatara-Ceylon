import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Notification from '@/models/Notification';
import { staffOrAdmin } from '@/lib/rbac';
import { validateBody } from '@/lib/validate';
import { createNotificationSchema, updateNotificationSchema } from '@/lib/validations';

export async function GET(request: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const published = searchParams.get('published');
        const type = searchParams.get('type');
        const filter: Record<string, unknown> = { isDeleted: { $ne: true } };
        if (published === 'true') {
            filter.isPublished = true;
            const now = new Date();
            filter.$or = [
                { publishFrom: { $exists: false } },
                { publishFrom: null },
                { publishFrom: { $lte: now } },
            ];
        }
        if (type) filter.type = type;
        const notifications = await Notification.find(filter).sort({ createdAt: -1 }).lean();
        return NextResponse.json({ notifications });
    } catch (error) { console.error(error); return NextResponse.json({ error: 'Internal server error' }, { status: 500 }); }
}

export const POST = staffOrAdmin(async (request, { user }) => {
    const { data, error } = await validateBody(request, createNotificationSchema);
    if (error) return error;
    try {
        await connectDB();
        const notif = await Notification.create({ ...data, createdBy: user.userId });
        return NextResponse.json({ notification: notif }, { status: 201 });
    } catch (error) { console.error(error); return NextResponse.json({ error: 'Internal server error' }, { status: 500 }); }
});
