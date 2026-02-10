import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Notification from '@/models/Notification';
import { staffOrAdmin } from '@/lib/rbac';
import { validateBody } from '@/lib/validate';
import { updateNotificationSchema } from '@/lib/validations';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    try { await connectDB(); const { id } = await params; const n = await Notification.findById(id).lean(); if (!n) return NextResponse.json({ error: 'Not found' }, { status: 404 }); return NextResponse.json({ notification: n }); }
    catch (error) { console.error(error); return NextResponse.json({ error: 'Internal server error' }, { status: 500 }); }
}

export const PATCH = staffOrAdmin(async (request, context) => {
    const { data, error } = await validateBody(request, updateNotificationSchema);
    if (error) return error;
    try { await connectDB(); const { id } = await context.params; const n = await Notification.findByIdAndUpdate(id, { $set: data }, { new: true }); if (!n) return NextResponse.json({ error: 'Not found' }, { status: 404 }); return NextResponse.json({ notification: n }); }
    catch (error) { console.error(error); return NextResponse.json({ error: 'Internal server error' }, { status: 500 }); }
});

export const DELETE = staffOrAdmin(async (_req, context) => {
    try { await connectDB(); const { id } = await context.params; await Notification.findByIdAndUpdate(id, { $set: { isDeleted: true, deletedAt: new Date() } }); return NextResponse.json({ success: true }); }
    catch (error) { console.error(error); return NextResponse.json({ error: 'Internal server error' }, { status: 500 }); }
});
