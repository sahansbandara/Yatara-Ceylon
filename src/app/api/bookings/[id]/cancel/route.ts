export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import VehicleBlock from '@/models/VehicleBlock';
import { withAuth } from '@/lib/rbac';
import { logAudit } from '@/lib/audit';

// POST /api/bookings/[id]/cancel
// Accessible by the booking owner (USER) to request a cancellation/refund
export const POST = withAuth(async (_req, context) => {
    try {
        await connectDB();
        const { id } = await context.params;

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
        if (paidAmount > 0) {
            newStatus = 'REFUND_PENDING';
            // If it's refund pending, we don't immediately unblock the vehicle?
            // Actually, we should probably unblock the vehicle if it's cancelled
            // A REFUND_PENDING is essentially cancelled but requires financial settlement.
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
