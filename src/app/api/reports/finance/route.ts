import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Payment from '@/models/Payment';
import Booking from '@/models/Booking';
import Invoice from '@/models/Invoice';

// GET /api/reports/finance – finance summary report
export async function GET(request: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const from = searchParams.get('from');
        const to = searchParams.get('to');

        const dateFilter: Record<string, unknown> = {};
        if (from) dateFilter.$gte = new Date(from);
        if (to) dateFilter.$lte = new Date(to);

        const paymentFilter: Record<string, unknown> = { isDeleted: { $ne: true } };
        if (Object.keys(dateFilter).length) paymentFilter.paidAt = dateFilter;

        const [payments, bookings, invoices] = await Promise.all([
            Payment.find(paymentFilter).populate('bookingId', 'bookingNo customerName').lean(),
            Booking.find({ isDeleted: false }).lean(),
            Invoice.find({ isDeleted: { $ne: true } }).lean(),
        ]);

        const totalRevenue = payments.filter(p => p.type === 'PAYMENT').reduce((s, p) => s + p.amount, 0);
        const totalRefunds = payments.filter(p => p.type === 'REFUND').reduce((s, p) => s + p.amount, 0);
        const netRevenue = totalRevenue - totalRefunds;
        const totalInvoiced = invoices.filter(i => i.status === 'FINAL').reduce((s, i) => s + i.total, 0);
        const pendingBalance = totalInvoiced - totalRevenue + totalRefunds;

        // Monthly breakdown
        const monthlyMap: Record<string, { revenue: number; refunds: number; count: number }> = {};
        payments.forEach(p => {
            const key = new Date(p.paidAt).toISOString().slice(0, 7); // YYYY-MM
            if (!monthlyMap[key]) monthlyMap[key] = { revenue: 0, refunds: 0, count: 0 };
            if (p.type === 'PAYMENT') {
                monthlyMap[key].revenue += p.amount;
                monthlyMap[key].count++;
            } else {
                monthlyMap[key].refunds += p.amount;
            }
        });

        const bookingsByStatus: Record<string, number> = {};
        bookings.forEach(b => {
            bookingsByStatus[b.status] = (bookingsByStatus[b.status] || 0) + 1;
        });

        return NextResponse.json({
            totalRevenue,
            totalRefunds,
            netRevenue,
            totalInvoiced,
            pendingBalance,
            totalPayments: payments.length,
            bookingsByStatus,
            monthlyBreakdown: Object.entries(monthlyMap)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([month, data]) => ({ month, ...data })),
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
