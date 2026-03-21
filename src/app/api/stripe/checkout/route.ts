import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import Payment from '@/models/Payment';
import { getStripe, isStripeConfigured, STRIPE_CURRENCY, APP_BASE_URL } from '@/lib/stripe/config';
import crypto from 'crypto';

export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();
        const { bookingId, customer, items, amount } = body;

        if (!bookingId || !customer || !amount) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        }

        // Generate a unique order ID
        const orderId = `CE-${crypto.randomBytes(4).toString('hex').toUpperCase()}-${Date.now()}`;

        // Dev Mode Bypass: If Stripe is not configured, simulate success
        if (!isStripeConfigured()) {
            await Payment.create({
                bookingId: booking._id,
                amount,
                provider: 'STRIPE',
                status: 'SUCCESS',
                orderId,
                type: 'PAYMENT',
                method: 'ONLINE',
                paidAt: new Date(),
            });

            await Booking.findByIdAndUpdate(bookingId, {
                status: 'ADVANCE_PAID',
                paidAmount: amount,
                remainingBalance: Math.max(0, booking.totalCost - amount),
            });

            return NextResponse.json({
                isDevMode: true,
                orderId,
                message: 'Payment simulated successfully in development mode.',
            });
        }

        // Create Payment record with status INITIATED
        await Payment.create({
            bookingId: booking._id,
            amount,
            provider: 'STRIPE',
            status: 'INITIATED',
            orderId,
            type: 'PAYMENT',
        });

        // Create Stripe Checkout Session
        const session = await getStripe().checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            customer_email: customer.email,
            line_items: [
                {
                    price_data: {
                        currency: STRIPE_CURRENCY,
                        product_data: {
                            name: items || `Booking ${booking.bookingNo}`,
                            description: `20% Advance Payment for ${booking.bookingNo}`,
                        },
                        unit_amount: Math.round(parseFloat(amount.toString()) * 100), // Stripe uses cents
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                orderId,
                bookingId: bookingId.toString(),
                customerName: customer.firstName + ' ' + customer.lastName,
            },
            success_url: `${APP_BASE_URL}/payment/return?order_id=${orderId}&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${APP_BASE_URL}/payment/cancel?order_id=${orderId}`,
        });

        return NextResponse.json({
            sessionUrl: session.url,
            sessionId: session.id,
            orderId,
        });
    } catch (error) {
        console.error('Stripe Checkout Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
