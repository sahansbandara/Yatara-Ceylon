export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Payment from '@/models/Payment';
import Booking from '@/models/Booking';
import { staffOrAdmin } from '@/lib/rbac';
import { logAudit } from '@/lib/audit';

// PATCH /api/payments/[id] – protected: staff/admin only
export const PATCH = staffOrAdmin(async (request, { user, params }) => {
    try {
        await connectDB();
        const { id } = params;
        const { action } = await request.json();

        if (action !== 'VOID') {
            return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }

        // Find the payment
        const payment = await Payment.findById(id);
        if (!payment) {
            return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
        }

        // Check if already voided
        if (payment.status === 'VOIDED' || payment.voidedAt) {
            return NextResponse.json({ error: 'Payment is already voided' }, { status: 400 });
        }

        // Update payment status to VOIDED
        const voidedAt = new Date();
        await Payment.findByIdAndUpdate(id, {
            status: 'VOIDED',
            voidedAt,
        });

        // Recalculate booking's paidAmount and remainingBalance
        const booking = await Booking.findById(payment.bookingId);
        if (booking) {
            const newPaidAmount = Math.max((booking.paidAmount || 0) - payment.amount, 0);
            const newRemainingBalance = Math.max((booking.totalCost || 0) - newPaidAmount, 0);

            await Booking.findByIdAndUpdate(payment.bookingId, {
                paidAmount: newPaidAmount,
                remainingBalance: newRemainingBalance,
            });
        }

        // Log audit trail
        await logAudit({
            actorUserId: user.userId,
            action: 'VOID',
            entity: 'Payment',
            entityId: id,
            meta: { amount: payment.amount, bookingId: payment.bookingId.toString() },
        });

        // Return updated payment
        const updatedPayment = await Payment.findById(id)
            .populate('bookingId', 'bookingNo customerName')
            .lean();

        return NextResponse.json({ payment: updatedPayment }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
});
