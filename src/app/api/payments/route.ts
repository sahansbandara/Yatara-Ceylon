import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Payment from '@/models/Payment';
import Booking from '@/models/Booking';
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
            provider: 'MANUAL',
            status: 'SUCCESS',
            paidAt: data!.paidAt ? new Date(data!.paidAt) : new Date(),
            recordedBy: user.userId,
        });

        // Automatically update the booking balances
        const booking = await Booking.findById(payment.bookingId);
        if (booking) {
            const newPaidAmount = (booking.paidAmount || 0) + payment.amount;
            let newStatus = booking.status;

            // Advance status if this is the first payment
            if (['NEW', 'PAYMENT_PENDING', 'CONTACTED'].includes(booking.status)) {
                newStatus = 'ADVANCE_PAID';
            }

            await Booking.findByIdAndUpdate(payment.bookingId, {
                paidAmount: newPaidAmount,
                remainingBalance: Math.max((booking.totalCost || 0) - newPaidAmount, 0),
                status: newStatus
            });
        }

        await logAudit({ actorUserId: user.userId, action: 'CREATE', entity: 'Payment', entityId: payment._id.toString(), meta: { amount: data!.amount, type: data!.type } });
        return NextResponse.json({ payment }, { status: 201 });
    } catch (error) { console.error(error); return NextResponse.json({ error: 'Internal server error' }, { status: 500 }); }
});
