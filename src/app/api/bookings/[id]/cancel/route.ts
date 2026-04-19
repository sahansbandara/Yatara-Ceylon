export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import VehicleBlock from '@/models/VehicleBlock';
import RefundRequest from '@/models/RefundRequest';
import { withAuth } from '@/lib/rbac';
import { logAudit } from '@/lib/audit';

// POST /api/bookings/[id]/cancel
// Accessible by the booking owner (USER) to request a cancellation/refund
export const POST = withAuth(async (req, context) => {
    try {
        await connectDB();
        const { id } = await context.params;

        const body = await req.json().catch(() => ({}));

        const booking = await Booking.findOne({ _id: id, isDeleted: false });
        if (!booking) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        // Ensure user is the owner
        if (context.user.role === 'USER' && booking.email !== context.user.email) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Check if it's already cancelled or completed
        if (['CANCELLED', 'REFUND_PENDING', 'REFUNDED', 'COMPLETED'].includes(booking.status)) {
            return NextResponse.json({ error: 'Booking cannot be cancelled from its current state.' }, { status: 400 });
        }

        const paidAmount = booking.paidAmount || 0;
        
        let newStatus = 'CANCELLED';

        const tripStartDate = new Date(booking.dates.from);
        const today = new Date();
        const diffTime = tripStartDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (paidAmount > 0) {
            if (diffDays >= 5) {
                newStatus = 'REFUND_PENDING';
                
                // Create refund request
                const { reason, refundMethod, bankDetails } = body;
                if (!reason || !refundMethod) {
                    return NextResponse.json({ error: 'Reason and refund method are required for a refund request.' }, { status: 400 });
                }

                await RefundRequest.create({
                    bookingId: booking._id,
                    customerId: booking.customerId || context.user.userId,
                    status: 'SUBMITTED',
                    requestedAmount: paidAmount,
                    reason,
                    refundMethod,
                    bankDetails: bankDetails || {}
                });
            } else {
                // Not eligible for refund, forced cancellation with no money back
                newStatus = 'CANCELLED';
            }
        }

        // Delete blocks if changing status to cancelled or refund_pending
        if (newStatus === 'CANCELLED' || newStatus === 'REFUND_PENDING') {
            await VehicleBlock.deleteMany({ bookingId: booking._id });
        }

        booking.status = newStatus;
        await booking.save();

        await logAudit({
            actorUserId: context.user.userId,
            action: 'STATUS_CHANGE',
            entity: 'Booking',
            entityId: id,
            meta: { status: newStatus, requestedByOwner: true }
        });

        return NextResponse.json({ success: true, status: newStatus, booking });
    } catch (error) { 
        console.error("Booking Cancel API Error:", error); 
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 }); 
    }
});
