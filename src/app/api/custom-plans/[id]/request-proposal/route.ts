import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import CustomPlan from '@/models/CustomPlan';
import Booking from '@/models/Booking';
import { withAuth } from '@/lib/rbac';
import { BookingStatus, BookingTypes } from '@/lib/constants';

export const POST = withAuth(async (request, { user, params }: any) => {
    try {
        await connectDB();
        const resolvedParams = await params;
        const id = resolvedParams.id;
        const body = await request.json();

        const plan = await CustomPlan.findOne({ _id: id, isDeleted: { $ne: true } });
        if (!plan) {
            return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
        }

        // Must own the plan or be an admin
        if (!['ADMIN', 'STAFF'].includes(user.role) && plan.userId?.toString() !== user.userId) {
            if (plan.customerEmail !== user.email) {
                return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
            }
        }

        // If a previous proposal was submitted, cancel the old booking to allow a fresh one
        const existingBooking = await Booking.findOne({ customPlanId: plan._id, status: { $ne: 'CANCELLED' } });
        if (existingBooking) {
            existingBooking.status = 'CANCELLED';
            existingBooking.notes = (existingBooking.notes || '') + ' [Auto-cancelled: plan was modified and re-submitted]';
            await existingBooking.save();
        }

        // Reset the plan flags (in case they weren't reset during editing)
        plan.isProposalRequested = false;

        // Create the booking
        const booking = await Booking.create({
            customerId: user.userId,
            customerName: body.name || user.name || 'Customer',
            email: body.email || user.email,
            phone: body.phone || 'N/A',
            type: BookingTypes.CUSTOM,
            customPlanId: plan._id,
            pax: body.pax || 1,
            dates: {
                from: new Date(body.dateFrom),
                to: new Date(body.dateTo)
            },
            status: BookingStatus.NEW,
            quoteStatus: 'DRAFT',
            hotelPreference: body.hotelPreference,
            transferPreference: body.transferPreference,
            specialRequests: body.notes,
            totalCost: body.estimatedCost || 0,
        });

        // Update the CustomPlan using findByIdAndUpdate to avoid stale enum validation
        await CustomPlan.findByIdAndUpdate(plan._id, {
            $set: {
                status: 'SUBMITTED',
                isProposalRequested: true,
                linkedBookingId: booking._id,
                submittedAt: new Date(),
            }
        });

        return NextResponse.json({ success: true, bookingId: booking._id }, { status: 201 });
    } catch (error: any) {
        console.error('Request proposal error:', error?.message || error);
        if (error?.name === 'ValidationError') {
            const messages = Object.values(error.errors || {}).map((e: any) => e.message).join(', ');
            return NextResponse.json({ error: `Validation failed: ${messages}` }, { status: 400 });
        }
        if (error?.code === 11000) {
            return NextResponse.json({ error: 'Duplicate booking detected. Please try again.' }, { status: 409 });
        }
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
});
