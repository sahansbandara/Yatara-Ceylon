import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Payment from '@/models/Payment';
import Booking from '@/models/Booking';
import { getStripe, STRIPE_WEBHOOK_SECRET } from '@/lib/stripe/config';
import { BookingStatus } from '@/lib/constants';
import Stripe from 'stripe';

export async function POST(request: Request) {
    try {
        const body = await request.text();
        const sig = request.headers.get('stripe-signature');

        if (!sig) {
            console.error('Stripe webhook: No signature found');
            return NextResponse.json({ error: 'No signature' }, { status: 400 });
        }

        let event: Stripe.Event;

        try {
            event = getStripe().webhooks.constructEvent(body, sig, STRIPE_WEBHOOK_SECRET);
        } catch (err: any) {
            console.error('Stripe webhook signature verification failed:', err.message);
            return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
        }

        // Handle the event
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object as Stripe.Checkout.Session;

            await connectDB();

            const orderId = session.metadata?.orderId;
            if (!orderId) {
                console.error('Stripe webhook: No orderId in metadata');
                return NextResponse.json({ error: 'No orderId' }, { status: 400 });
            }

            // Find the payment
            const payment = await Payment.findOne({ orderId });
            if (!payment) {
                console.error('Stripe webhook: Payment not found for orderId:', orderId);
                return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
            }

            // Update payment status
            payment.status = 'SUCCESS';
            payment.method = 'ONLINE';
            payment.stripeSessionId = session.id;
            payment.stripePaymentIntentId = session.payment_intent as string;
            payment.paidAt = new Date();
            payment.rawNotifyPayload = {
                sessionId: session.id,
                paymentIntent: session.payment_intent,
                paymentStatus: session.payment_status,
                amountTotal: session.amount_total,
                currency: session.currency,
                customerEmail: session.customer_email,
            };

            await payment.save();

            // Update booking status
            const booking = await Booking.findById(payment.bookingId);
            if (booking) {
                const paidNow = payment.amount || 0;

                booking.paidAmount = (booking.paidAmount || 0) + paidNow;
                booking.remainingBalance = Math.max(0, (booking.totalCost || 0) - booking.paidAmount);

                if (booking.status === 'NEW' || booking.status === 'PAYMENT_PENDING') {
                    booking.status = BookingStatus.ADVANCE_PAID;
                }

                booking.paymentStatus = 'advance_paid';
                await booking.save();
            }
        }

        return NextResponse.json({ received: true }, { status: 200 });
    } catch (error) {
        console.error('Stripe Webhook Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
