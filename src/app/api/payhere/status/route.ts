export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Payment from '@/models/Payment';
import Booking from '@/models/Booking';
import { BookingStatus } from '@/lib/constants';
import { PAYHERE_MERCHANT_ID, PAYHERE_MODE } from '@/lib/payhere/config';

/**
 * When PayHere webhook hasn't arrived yet, query PayHere's Payment
 * Retrieval API to check the real status and update locally.
 */
async function checkPayhereDirectly(orderId: string, payment: any) {
    try {
        // PayHere Payment Retrieval API requires an Authorization header.
        // We use the merchant_id + merchant_secret from the API key settings.
        const appId = process.env.PAYHERE_APP_ID;
        const appSecret = process.env.PAYHERE_APP_SECRET;

        if (!appId || !appSecret) {
            console.log('PayHere API keys (APP_ID / APP_SECRET) not configured — skipping direct check');
            return null;
        }

        // Step 1: Get OAuth token
        const baseUrl = PAYHERE_MODE === 'sandbox'
            ? 'https://sandbox.payhere.lk'
            : 'https://www.payhere.lk';

        const tokenRes = await fetch(`${baseUrl}/merchant/v1/oauth/token`, {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + Buffer.from(`${appId}:${appSecret}`).toString('base64'),
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'grant_type=client_credentials',
        });

        if (!tokenRes.ok) {
            console.error('PayHere OAuth token request failed:', tokenRes.status);
            return null;
        }

        const tokenData = await tokenRes.json();
        const accessToken = tokenData.access_token;

        // Step 2: Retrieve payment by order_id
        const paymentRes = await fetch(`${baseUrl}/merchant/v1/payment/search?order_id=${orderId}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        if (!paymentRes.ok) {
            console.error('PayHere payment search failed:', paymentRes.status);
            return null;
        }

        const paymentData = await paymentRes.json();

        if (paymentData.status === 1 && paymentData.data && paymentData.data.length > 0) {
            // Find the latest successful payment
            const successfulPayment = paymentData.data.find(
                (p: any) => p.status_code === 2
            );

            if (successfulPayment) {
                // Update local payment record
                payment.status = 'SUCCESS';
                payment.md5sigVerified = true;
                payment.payherePaymentId = successfulPayment.payment_id?.toString() || '';
                payment.paidAt = new Date();
                payment.method = 'ONLINE';
                await payment.save();

                // Update booking
                const booking = await Booking.findById(payment.bookingId);
                if (booking) {
                    const paidNow = parseFloat(successfulPayment.payhere_amount) || payment.amount || 0;
                    booking.paidAmount = (booking.paidAmount || 0) + paidNow;
                    booking.remainingBalance = Math.max(0, (booking.totalCost || 0) - booking.paidAmount);

                    if (booking.status === 'NEW' || booking.status === 'PAYMENT_PENDING') {
                        booking.status = BookingStatus.ADVANCE_PAID;
                    }
                    booking.paymentStatus = 'advance_paid';
                    await booking.save();
                }

                return 'SUCCESS';
            }

            // Check if there's a failed/cancelled payment
            const failedPayment = paymentData.data.find(
                (p: any) => p.status_code === -1 || p.status_code === -2 || p.status_code === -3
            );

            if (failedPayment) {
                payment.status = 'FAILED';
                await payment.save();
                return 'FAILED';
            }
        }

        return null; // No conclusive result
    } catch (err) {
        console.error('PayHere direct check error:', err);
        return null;
    }
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('order_id');

    if (!orderId) {
        return NextResponse.json({ error: 'Missing order_id' }, { status: 400 });
    }

    await connectDB();
    const payment = await Payment.findOne({ orderId });

    if (!payment) {
        return NextResponse.json({ status: 'NOT_FOUND' });
    }

    // If already resolved, return immediately
    if (payment.status === 'SUCCESS' || payment.status === 'FAILED' ||
        payment.status === 'CANCELED' || payment.status === 'CHARGEDBACK') {
        return NextResponse.json({ status: payment.status });
    }

    // Payment is still INITIATED or PENDING — try checking PayHere directly
    const directStatus = await checkPayhereDirectly(orderId, payment);

    if (directStatus) {
        return NextResponse.json({ status: directStatus });
    }

    // Still pending
    return NextResponse.json({ status: payment.status });
}
