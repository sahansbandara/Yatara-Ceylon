import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Payment from '@/models/Payment';

export async function GET(request: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const orderId = searchParams.get('orderId');

        if (!orderId) {
            return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });
        }

        const payment = await Payment.findOne({ orderId })
            .select('status md5sigVerified orderId payherePaymentId')
            .lean();

        if (!payment) {
            return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
        }

        return NextResponse.json({ payment });
    } catch (error) {
        console.error('Payment Status Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
