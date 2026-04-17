export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Payment from '@/models/Payment';
import Booking from '@/models/Booking';
import { BookingStatus } from '@/lib/constants';

export async function POST(request: Request) {
    // Allow in development OR when PAYHERE_MODE is sandbox
    const isSandbox = process.env.PAYHERE_MODE === 'sandbox';
    const isDev = process.env.NODE_ENV === 'development';

    if (!isDev && !isSandbox) {
        return NextResponse.json({ error: 'Only allowed in sandbox/development mode' }, { status: 403 });
    }

    try {
        await connectDB();
        const { order_id } = await request.json();

        if (!order_id) {
            return NextResponse.json({ error: 'Missing order_id' }, { status: 400 });
        }

        const payment = await Payment.findOne({ orderId: order_id });

        if (!payment) {
            return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
        }

        // Don't re-process already successful payments
        if (payment.status === 'SUCCESS') {
            return NextResponse.json({ success: true, alreadyProcessed: true });
        }

        payment.status = 'SUCCESS';
        payment.md5sigVerified = true;
        payment.paidAt = new Date();
        await payment.save();

        const booking = await Booking.findById(payment.bookingId);
        if (booking) {
            booking.paidAmount = (booking.paidAmount || 0) + payment.amount;
            booking.remainingBalance = Math.max(0, (booking.totalCost || 0) - booking.paidAmount);

            if (booking.status === 'NEW' || booking.status === 'PAYMENT_PENDING') {
                booking.status = BookingStatus.ADVANCE_PAID;
            }
            booking.paymentStatus = 'advance_paid';
            await booking.save();
        }

        return NextResponse.json({ success: true });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
