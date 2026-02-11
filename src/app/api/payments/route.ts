import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Payment from '@/models/Payment';
import { staffOrAdmin } from '@/lib/rbac';
import { validateBody } from '@/lib/validate';
import { createPaymentSchema } from '@/lib/validations';
import { logAudit } from '@/lib/audit';

export async function GET(request: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const bookingId = searchParams.get('bookingId');
        const filter: Record<string, unknown> = { isDeleted: { $ne: true } };
        if (bookingId) filter.bookingId = bookingId;
        const payments = await Payment.find(filter)
            .populate('bookingId', 'bookingNo customerName')
            .sort({ paidAt: -1 })
            .lean();
        return NextResponse.json({ payments });
    } catch (error) { console.error(error); return NextResponse.json({ error: 'Internal server error' }, { status: 500 }); }
}

export const POST = staffOrAdmin(async (request, { user }) => {
    const { data, error } = await validateBody(request, createPaymentSchema);
    if (error) return error;
    try {
        await connectDB();
        const payment = await Payment.create({
            ...data,
            paidAt: data!.paidAt ? new Date(data!.paidAt) : new Date(),
            recordedBy: user.userId,
        });
        await logAudit({ actorUserId: user.userId, action: 'CREATE', entity: 'Payment', entityId: payment._id.toString(), meta: { amount: data!.amount, type: data!.type } });
        return NextResponse.json({ payment }, { status: 201 });
    } catch (error) { console.error(error); return NextResponse.json({ error: 'Internal server error' }, { status: 500 }); }
});
