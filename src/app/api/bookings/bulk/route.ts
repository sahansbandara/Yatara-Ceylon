export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import { staffOrAdmin } from '@/lib/rbac';
import { logAudit } from '@/lib/audit';

// PATCH /api/bookings/bulk – bulk update status for multiple bookings
export const PATCH = staffOrAdmin(async (request, { user }) => {
    try {
        const body = await request.json();
        const { bookingIds, status } = body;

        if (!Array.isArray(bookingIds) || bookingIds.length === 0) {
            return NextResponse.json({ error: 'bookingIds array is required' }, { status: 400 });
        }

        if (!status || typeof status !== 'string') {
            return NextResponse.json({ error: 'status is required' }, { status: 400 });
        }

        // Cap at 50 bookings per bulk operation
        if (bookingIds.length > 50) {
            return NextResponse.json({ error: 'Maximum 50 bookings per bulk operation' }, { status: 400 });
        }

        await connectDB();

        const result = await Booking.updateMany(
            { _id: { $in: bookingIds }, isDeleted: false },
            { $set: { status } }
        );

        // Log audit for each booking
        await Promise.all(
            bookingIds.map((id: string) =>
                logAudit({
                    actorUserId: user.userId,
                    action: 'STATUS_CHANGE',
                    entity: 'Booking',
                    entityId: id,
                    meta: { status, bulkUpdate: true },
                })
            )
        );

        return NextResponse.json({
            success: true,
            updated: result.modifiedCount,
            total: bookingIds.length,
        });
    } catch (error) {
        console.error('Bulk update error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
});
