export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Payment from '@/models/Payment';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('order_id');

    if (!orderId) {
        return NextResponse.json({ error: 'Missing order_id' }, { status: 400 });
    }

    await connectDB();
    const payment = await Payment.findOne({ orderId })
        .select('status')
        .lean() as { status: string } | null;

    if (!payment) {
        return NextResponse.json({ status: 'NOT_FOUND' });
    }

    return NextResponse.json({ status: payment.status });
}
