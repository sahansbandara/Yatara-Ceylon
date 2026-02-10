import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Invoice from '@/models/Invoice';
import Payment from '@/models/Payment';
import { staffOrAdmin } from '@/lib/rbac';
import { validateBody } from '@/lib/validate';
import { createInvoiceSchema } from '@/lib/validations';
import { logAudit } from '@/lib/audit';

export async function GET(request: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const bookingId = searchParams.get('bookingId');
        const status = searchParams.get('status');
        const filter: Record<string, unknown> = { isDeleted: { $ne: true } };
        if (bookingId) filter.bookingId = bookingId;
        if (status) filter.status = status;

        const invoices = await Invoice.find(filter).populate('bookingId', 'bookingNo customerName').sort({ createdAt: -1 }).lean();
        return NextResponse.json({ invoices });
    } catch (error) { console.error(error); return NextResponse.json({ error: 'Internal server error' }, { status: 500 }); }
}

export const POST = staffOrAdmin(async (request, { user }) => {
    const { data, error } = await validateBody(request, createInvoiceSchema);
    if (error) return error;
    try {
        await connectDB();
        const subtotal = data!.items.reduce((sum, item) => sum + item.qty * item.unitPrice, 0);
        const total = subtotal - (data!.discount || 0);

        const invoice = await Invoice.create({
            ...data,
            subtotal,
            total: Math.max(total, 0),
        });

        await logAudit({ actorUserId: user.userId, action: 'CREATE', entity: 'Invoice', entityId: invoice._id.toString() });
        return NextResponse.json({ invoice }, { status: 201 });
    } catch (error) { console.error(error); return NextResponse.json({ error: 'Internal server error' }, { status: 500 }); }
});
