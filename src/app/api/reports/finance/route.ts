export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Payment from '@/models/Payment';
import Booking from '@/models/Booking';
import Invoice from '@/models/Invoice';
import { staffOrAdmin } from '@/lib/rbac';

// GET /api/reports/finance – protected: staff/admin only
export const GET = staffOrAdmin(async (request) => {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const from = searchParams.get('from');
        const to = searchParams.get('to');
        const format = searchParams.get('format');

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

        // If format is CSV, return CSV export
        if (format === 'csv') {
            const csvHeaders = ['Date', 'BookingNo', 'CustomerName', 'Type', 'Amount', 'Provider', 'Status'];
            const csvRows = payments.map(p => [
                new Date(p.paidAt).toISOString().split('T')[0],
                p.bookingId?.bookingNo || 'N/A',
                p.bookingId?.customerName || 'N/A',
                p.type,
                p.amount.toFixed(2),
                p.provider || 'N/A',
                p.status,
            ]);

            // Build CSV string
            const csvContent = [
                csvHeaders.join(','),
                ...csvRows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
            ].join('\n');

            return new NextResponse(csvContent, {
                status: 200,
                headers: {
                    'Content-Type': 'text/csv',
                    'Content-Disposition': 'attachment; filename="finance-report.csv"',
                },
            });
        }

        // Default: return JSON
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
});
