import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Payment from '@/models/Payment';
import Booking from '@/models/Booking';
import { verifyPayhereSignature } from '@/lib/payhere/hash';
import { BookingStatus } from '@/lib/constants';

export async function POST(request: Request) {
    try {
        await connectDB();

        const contentType = request.headers.get('content-type') || '';
        let formData = new URLSearchParams();

        if (contentType.includes('application/x-www-form-urlencoded')) {
            const body = await request.text();
            formData = new URLSearchParams(body);
        } else {
            console.warn('PayHere notify: Wrong content type:', contentType);
            return NextResponse.json({ error: 'Invalid content type' }, { status: 400 });
        }

        const merchant_id = formData.get('merchant_id') || '';
        const order_id = formData.get('order_id') || '';
        const payment_id = formData.get('payment_id') || '';
        const payhere_amount = formData.get('payhere_amount') || '';
        const payhere_currency = formData.get('payhere_currency') || '';
        const status_code = formData.get('status_code') || '';
        const md5sig = formData.get('md5sig') || '';
        const method = formData.get('method') || '';

        // Verify md5sig
        const isVerified = verifyPayhereSignature(
            order_id,
            payhere_amount,
            payhere_currency,
            status_code,
            md5sig
        );

        let paymentStatus: 'SUCCESS' | 'PENDING' | 'FAILED' | 'CANCELED' | 'CHARGEDBACK' = 'PENDING';

        switch (parseInt(status_code, 10)) {
            case 2: paymentStatus = 'SUCCESS'; break;
            case 0: paymentStatus = 'PENDING'; break;
            case -1: paymentStatus = 'CANCELED'; break;
            case -2: paymentStatus = 'FAILED'; break;
            case -3: paymentStatus = 'CHARGEDBACK'; break;
            default: paymentStatus = 'FAILED';
        }

        // Find payment
        const payment = await Payment.findOne({ orderId: order_id });

        if (!payment) {
            console.error('PayHere notify: Payment not found for orderId:', order_id);
            return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
        }

        // Update payment
        payment.status = isVerified ? paymentStatus : 'FAILED';
        payment.md5sigVerified = isVerified;
        payment.payherePaymentId = payment_id;
        payment.method = 'ONLINE';
        payment.rawNotifyPayload = Object.fromEntries(formData);

        if (paymentStatus === 'SUCCESS' && isVerified) {
            payment.paidAt = new Date();
        }

        await payment.save();

        if (!isVerified) {
            console.warn('PayHere notify: Signature verification failed for orderId:', order_id);
            return new NextResponse('Signature Verification Failed', { status: 400 });
        }

        // If SUCCESS, update booking status and financial fields
        if (paymentStatus === 'SUCCESS') {
            const booking = await Booking.findById(payment.bookingId);
            if (booking) {
                const paidNow = parseFloat(payhere_amount) || payment.amount || 0;

                // Update financial fields
                booking.paidAmount = (booking.paidAmount || 0) + paidNow;
                booking.remainingBalance = Math.max(0, (booking.totalCost || 0) - booking.paidAmount);

                // Transition status
                if (booking.status === 'NEW' || booking.status === 'PAYMENT_PENDING') {
                    booking.status = BookingStatus.ADVANCE_PAID;
                }

                booking.paymentStatus = 'advance_paid';
                await booking.save();
            }
        }

        // Must return 200 OK quickly
        return new NextResponse('OK', { status: 200 });
    } catch (error) {
        console.error('PayHere Notify Error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
