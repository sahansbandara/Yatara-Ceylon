import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import Payment from '@/models/Payment';
import { generatePayhereHash } from '@/lib/payhere/hash';
import { getPayhereCheckoutUrl, PAYHERE_MERCHANT_ID, PAYHERE_MERCHANT_SECRET, PAYHERE_CURRENCY, APP_BASE_URL } from '@/lib/payhere/config';
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

        // Check if using dummy/development credentials
        if (!PAYHERE_MERCHANT_ID || PAYHERE_MERCHANT_ID === '12345' || !PAYHERE_MERCHANT_SECRET || PAYHERE_MERCHANT_SECRET === 'your_merchant_secret') {
            // Dev Mode Bypass: Automatically simulate success
            await Payment.create({
                bookingId: booking._id,
                amount,
                provider: 'PAYHERE',
                status: 'SUCCESS',
                orderId,
                type: 'PAYMENT',
            });

            await Booking.findByIdAndUpdate(bookingId, {
                status: 'ADVANCE_PAID',
                paidAmount: amount,
                remainingBalance: Math.max(0, booking.totalCost - amount),
            });

            return NextResponse.json({
                isDevMode: true,
                orderId,
                message: 'Payment simulated successfully in development mode.'
            });
        }

        // Create Payment record with status INITIATED
        await Payment.create({
            bookingId: booking._id,
            amount,
            provider: 'PAYHERE',
            status: 'INITIATED',
            orderId,
            type: 'PAYMENT',
        });

        const checkoutUrl = getPayhereCheckoutUrl();
        const return_url = `${APP_BASE_URL}/payment/return?order_id=${orderId}`;
        const cancel_url = `${APP_BASE_URL}/payment/cancel?order_id=${orderId}`;
        const notify_url = `${APP_BASE_URL}/api/payhere/notify`;

        // Generate Hash
        const hash = generatePayhereHash(orderId, amount, PAYHERE_CURRENCY);

        return NextResponse.json({
            checkoutUrl,
            fields: {
                merchant_id: PAYHERE_MERCHANT_ID,
                return_url,
                cancel_url,
                notify_url,
                order_id: orderId,
                items: items || `Booking ${booking.bookingNo}`,
                currency: PAYHERE_CURRENCY,
                amount: parseFloat(amount.toString()).toFixed(2),
                first_name: customer.firstName,
                last_name: customer.lastName,
                email: customer.email,
                phone: customer.phone,
                address: customer.address || 'N/A',
                city: customer.city || 'Colombo',
                country: customer.country || 'Sri Lanka',
                hash
            }
        });
    } catch (error) {
        console.error('PayHere Create Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
