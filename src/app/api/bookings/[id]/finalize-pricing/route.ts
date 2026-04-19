import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import { adminOnly } from '@/lib/rbac';
import { logAudit } from '@/lib/audit';
import { sendPricingFinalizedEmail } from '@/lib/email';
import { BookingStatus } from '@/lib/constants';

export const POST = adminOnly(async (request: Request, { user, params }: any) => {
    try {
        await connectDB();
        const resolvedParams = await params;
        const id = resolvedParams.id;
        const { totalCost } = await request.json();

        if (!totalCost || totalCost <= 0) {
            return NextResponse.json({ error: 'Total cost must be greater than 0' }, { status: 400 });
        }

        const booking = await Booking.findById(id);
        if (!booking) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        }

        // Update pricing and status
        booking.totalCost = Number(totalCost);
        booking.remainingBalance = Number(totalCost) - booking.paidAmount;
        booking.status = BookingStatus.PAYMENT_PENDING;
        await booking.save();

        // Log audit
        await logAudit({
            action: 'FINALIZE_PRICING',
            entity: 'Booking',
            entityId: String(booking._id),
            actorUserId: user.userId,
            meta: { totalCost, previousStatus: 'NEW', newStatus: 'PAYMENT_PENDING' },
        });

        // Send email notification to customer
        const advanceAmount = Math.round(Number(totalCost) * 0.2);
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_BASE_URL || 'https://yataraceylon.com';

        if (booking.email) {
            try {
                await sendPricingFinalizedEmail({
                    to: booking.email,
                    name: booking.customerName || 'Customer',
                    bookingNo: booking.bookingNo,
                    totalCost: Number(totalCost),
                    advanceAmount,
                    dashboardUrl: `${baseUrl}/dashboard/my-bookings`,
                });
            } catch (emailErr) {
                console.error('Failed to send pricing email:', emailErr);
                // Don't fail the whole request if email fails
            }
        }

        return NextResponse.json({
            success: true,
            message: 'Pricing finalized and customer notified',
            booking: {
                _id: booking._id,
                bookingNo: booking.bookingNo,
                totalCost: booking.totalCost,
                status: booking.status,
            },
        });
    } catch (error: any) {
        console.error('Finalize pricing error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
});
