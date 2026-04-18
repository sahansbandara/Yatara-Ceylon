export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import SupportTicket from '@/models/SupportTicket';
import { staffOrAdmin } from '@/lib/rbac';
import { validateBody } from '@/lib/validate';
import { createTicketSchema, replyTicketSchema } from '@/lib/validations';

// GET /api/tickets – protected: staff/admin only
export const GET = staffOrAdmin(async (request) => {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const filter: Record<string, unknown> = { isDeleted: { $ne: true } };
        if (status) filter.status = status;
        const tickets = await SupportTicket.find(filter).sort({ createdAt: -1 }).lean();
        return NextResponse.json({ tickets });
    } catch (error) { console.error(error); return NextResponse.json({ error: 'Internal server error' }, { status: 500 }); }
});

export const POST = staffOrAdmin(async (request) => {
    const { data, error } = await validateBody(request, createTicketSchema);
    if (error) return error;
    try {
        await connectDB();
        const ticket = await SupportTicket.create(data);
        return NextResponse.json({ ticket }, { status: 201 });
    } catch (error) { console.error(error); return NextResponse.json({ error: 'Internal server error' }, { status: 500 }); }
});
