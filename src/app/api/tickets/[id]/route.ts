import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import SupportTicket from '@/models/SupportTicket';
import { staffOrAdmin } from '@/lib/rbac';
import { validateBody } from '@/lib/validate';
import { replyTicketSchema } from '@/lib/validations';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    try { await connectDB(); const { id } = await params; const ticket = await SupportTicket.findById(id).lean(); if (!ticket) return NextResponse.json({ error: 'Not found' }, { status: 404 }); return NextResponse.json({ ticket }); }
    catch (error) { console.error(error); return NextResponse.json({ error: 'Internal server error' }, { status: 500 }); }
}

// PATCH – update status or add reply
export const PATCH = staffOrAdmin(async (request, context) => {
    try {
        await connectDB();
        const { id } = await context.params;
        const body = await request.json();

        if (body.body) {
            // Add reply
            const ticket = await SupportTicket.findByIdAndUpdate(
                id,
                {
                    $push: { replies: { byUserId: context.user.userId, byName: context.user.email, body: body.body, at: new Date() } },
                    $set: { status: 'REPLIED' },
                },
                { new: true }
            );
            if (!ticket) return NextResponse.json({ error: 'Not found' }, { status: 404 });
            return NextResponse.json({ ticket });
        }

        if (body.status) {
            const ticket = await SupportTicket.findByIdAndUpdate(id, { $set: { status: body.status } }, { new: true });
            if (!ticket) return NextResponse.json({ error: 'Not found' }, { status: 404 });
            return NextResponse.json({ ticket });
        }

        return NextResponse.json({ error: 'No valid update provided' }, { status: 400 });
    } catch (error) { console.error(error); return NextResponse.json({ error: 'Internal server error' }, { status: 500 }); }
});

export const DELETE = staffOrAdmin(async (_req, context) => {
    try {
        await connectDB();
        const { id } = await context.params;
        await SupportTicket.findByIdAndUpdate(id, { $set: { isDeleted: true, deletedAt: new Date() } });
        return NextResponse.json({ success: true });
    } catch (error) { console.error(error); return NextResponse.json({ error: 'Internal server error' }, { status: 500 }); }
});
