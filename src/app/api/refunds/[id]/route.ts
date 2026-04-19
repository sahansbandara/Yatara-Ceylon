import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import RefundRequest from '@/models/RefundRequest';
import Booking from '@/models/Booking';
import Payment from '@/models/Payment';
import { withAuth } from '@/lib/rbac';
import { logAudit } from '@/lib/audit';

export const dynamic = 'force-dynamic';

export const GET = withAuth(async (req, context) => {
    try {
        await connectDB();
        const { id } = await context.params;

        if (!['STAFF', 'ADMIN'].includes(context.user.role)) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const refund = await RefundRequest.findById(id)
            .populate('bookingId')
            .populate('customerId', 'name email phone')
            .lean();

        if (!refund) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        return NextResponse.json(refund);
    } catch (error) {
        console.error("Fetch refund detail error:", error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
});

export const PATCH = withAuth(async (req, context) => {
    try {
        await connectDB();
        const { id } = await context.params;

        if (!['STAFF', 'ADMIN'].includes(context.user.role)) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const body = await req.json();
        const refund = await RefundRequest.findById(id);

        if (!refund) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        let needsSave = false;

        // STAFF actions
        if (body.staffRecommendation !== undefined) {
            refund.staffRecommendation = body.staffRecommendation;
            needsSave = true;
        }
        if (body.staffNotes !== undefined) {
            refund.staffNotes = body.staffNotes;
            needsSave = true;
        }
        if (body.status === 'UNDER_REVIEW') {
            refund.status = 'UNDER_REVIEW';
            needsSave = true;
        }

        // ADMIN actions
        if (context.user.role === 'ADMIN') {
            if (body.adminNotes !== undefined) {
                refund.adminNotes = body.adminNotes;
                needsSave = true;
            }
            if (['APPROVED', 'REJECTED'].includes(body.status)) {
                refund.status = body.status;
                needsSave = true;

                // Sync associated booking status if rejected
                if (body.status === 'REJECTED') {
                    const booking = await Booking.findById(refund.bookingId);
                    if (booking) {
                        booking.status = 'CANCELLED'; // Move from REFUND_PENDING to CANCELLED
                        await booking.save();
                    }
                }
            }

            // Mark as Refunded logic (Finance step)
            if (body.status === 'REFUNDED') {
                refund.status = 'REFUNDED';
                if (body.proofUrl) refund.proofUrl = body.proofUrl;

                const booking = await Booking.findById(refund.bookingId);
                if (!booking) return NextResponse.json({ error: 'Linked booking not found' }, { status: 404 });

                // Create a Payment ledger entry representing the refund
                const payment = new Payment({
                    bookingId: booking._id,
                    amount: refund.requestedAmount,
                    provider: 'MANUAL',
                    status: 'SUCCESS',
                    method: 'BANK', // Assume bank transfer for outbound manual
                    type: 'REFUND',
                    paymentStage: 'REFUND',
                    notes: `Refund processed for booking ${booking.bookingNo}`,
                    recordedBy: context.user.userId,
                    paidAt: new Date()
                });
                await payment.save();

                refund.financePaymentId = payment._id;
                needsSave = true;

                // Adjust the Booking balances and status
                booking.paidAmount = Math.max(0, (booking.paidAmount || 0) - refund.requestedAmount);
                booking.status = 'REFUNDED'; // Or keep it CANCELLED? The requirement says REFUNDED.
                booking.remainingBalance = booking.totalCost - booking.paidAmount;
                await booking.save();
            }
        }

        if (needsSave) {
            await refund.save();
            await logAudit({
                actorUserId: context.user.userId,
                action: 'UPDATE',
                entity: 'RefundRequest',
                entityId: id,
                meta: { patchedPayload: body }
            });
        }

        return NextResponse.json({ success: true, refund });
    } catch (error) {
        console.error("Update refund error:", error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
});
