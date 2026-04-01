export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Invoice from '@/models/Invoice';
import { staffOrAdmin } from '@/lib/rbac';
import { logAudit } from '@/lib/audit';

// GET /api/invoices/[id] – protected: staff/admin only
export const GET = staffOrAdmin(async (_req, context) => {
    try {
        await connectDB();
        const { id } = await context.params;
        const invoice = await Invoice.findOne({ _id: id, isDeleted: { $ne: true } })
            .populate('bookingId', 'bookingNo customerName email phone totalCost paidAmount remainingBalance')
            .lean();
        if (!invoice) return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
        return NextResponse.json({ invoice });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
});

export const PATCH = staffOrAdmin(async (request, { params, user }) => {
    try {
        const { id } = await params;
        const body = await request.json();

        await connectDB();

        const invoice = await Invoice.findById(id);
        if (!invoice) {
            return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
        }

        // We only allow updating the status from DRAFT to FINAL
        if (body.status === 'FINAL' && invoice.status === 'DRAFT') {
            invoice.status = 'FINAL';
            await invoice.save();

            await logAudit({
                actorUserId: user.userId,
                action: 'UPDATE',
                entity: 'Invoice',
                entityId: invoice._id.toString(),
                meta: { status: 'FINAL' }
            });

            return NextResponse.json({ invoice, message: 'Invoice finalized successfully' });
        }

        return NextResponse.json({ error: 'Invalid state transition' }, { status: 400 });
    } catch (error: any) {
        console.error('Invoice Update Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
});
