export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Payment from '@/models/Payment';
import Invoice from '@/models/Invoice';
import Booking from '@/models/Booking';
import { adminOnly } from '@/lib/rbac';

// GET /api/finance/audit?startDate=...&endDate=...&format=csv|json
export const GET = adminOnly(async (request) => {
    try {
        const { searchParams } = new URL(request.url);
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');
        const format = searchParams.get('format') || 'csv';

        if (!startDate || !endDate) {
            return NextResponse.json(
                { error: 'startDate and endDate are required (YYYY-MM-DD)' },
                { status: 400 }
            );
        }

        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return NextResponse.json({ error: 'Invalid date format' }, { status: 400 });
        }

        await connectDB();

        // Fetch payments in range
        const payments = await Payment.find({
            createdAt: { $gte: start, $lte: end },
            isDeleted: { $ne: true },
        })
            .populate('bookingId', 'bookingNo customerName')
            .sort({ createdAt: 1 })
            .lean();

        // Fetch invoices in range
        const invoices = await Invoice.find({
            createdAt: { $gte: start, $lte: end },
            isDeleted: { $ne: true },
        })
            .populate('bookingId', 'bookingNo customerName')
            .sort({ createdAt: 1 })
            .lean();

        // Aggregate summary
        const successPayments = payments.filter((p: any) => p.status === 'SUCCESS' && p.type === 'PAYMENT');
        const refunds = payments.filter((p: any) => p.type === 'REFUND' && p.status === 'SUCCESS');
        const totalCollected = successPayments.reduce((sum: number, p: any) => sum + (p.amount || 0), 0);
        const totalRefunded = refunds.reduce((sum: number, p: any) => sum + (p.amount || 0), 0);
        const netRevenue = totalCollected - totalRefunded;

        const invoiceTotalDraft = invoices.filter((i: any) => i.status === 'DRAFT').reduce((s: number, i: any) => s + (i.total || 0), 0);
        const invoiceTotalFinal = invoices.filter((i: any) => i.status === 'FINAL').reduce((s: number, i: any) => s + (i.total || 0), 0);
        const invoiceTotalVoid = invoices.filter((i: any) => i.status === 'VOID').reduce((s: number, i: any) => s + (i.total || 0), 0);

        // Bookings with outstanding balances created in range
        const bookingsInRange = await Booking.find({
            createdAt: { $gte: start, $lte: end },
            remainingBalance: { $gt: 0 },
        })
            .select('bookingNo customerName totalCost paidAmount remainingBalance status')
            .sort({ remainingBalance: -1 })
            .lean();

        if (format === 'json') {
            return NextResponse.json({
                period: { from: startDate, to: endDate },
                summary: {
                    totalCollected,
                    totalRefunded,
                    netRevenue,
                    paymentCount: successPayments.length,
                    refundCount: refunds.length,
                    invoiceDraftTotal: invoiceTotalDraft,
                    invoiceFinalTotal: invoiceTotalFinal,
                    invoiceVoidTotal: invoiceTotalVoid,
                    outstandingBookings: bookingsInRange.length,
                },
                payments,
                invoices,
                outstandingBookings: bookingsInRange,
            });
        }

        // CSV format
        const csvLines: string[] = [];

        // Header section
        csvLines.push('YATARA CEYLON - FINANCE AUDIT REPORT');
        csvLines.push(`Period: ${startDate} to ${endDate}`);
        csvLines.push(`Generated: ${new Date().toISOString()}`);
        csvLines.push('');

        // Summary
        csvLines.push('=== SUMMARY ===');
        csvLines.push(`Total Collected,${totalCollected}`);
        csvLines.push(`Total Refunded,${totalRefunded}`);
        csvLines.push(`Net Revenue,${netRevenue}`);
        csvLines.push(`Payment Count,${successPayments.length}`);
        csvLines.push(`Refund Count,${refunds.length}`);
        csvLines.push(`Invoice Draft Total,${invoiceTotalDraft}`);
        csvLines.push(`Invoice Final Total,${invoiceTotalFinal}`);
        csvLines.push(`Invoice Void Total,${invoiceTotalVoid}`);
        csvLines.push('');

        // Payments detail
        csvLines.push('=== PAYMENTS ===');
        csvLines.push('Date,Order ID,Booking No,Customer,Type,Method,Amount,Status,Reference');
        for (const p of payments as any[]) {
            csvLines.push([
                new Date(p.createdAt).toLocaleDateString(),
                p.orderId || '',
                p.bookingId?.bookingNo || '',
                p.bookingId?.customerName || '',
                p.type || 'PAYMENT',
                p.method || '',
                p.amount || 0,
                p.status || '',
                (p.reference || '').replace(/,/g, ';'),
            ].join(','));
        }
        csvLines.push('');

        // Invoices detail
        csvLines.push('=== INVOICES ===');
        csvLines.push('Date,Invoice No,Booking No,Customer,Status,Subtotal,Discount,Total');
        for (const inv of invoices as any[]) {
            csvLines.push([
                new Date(inv.createdAt).toLocaleDateString(),
                inv.invoiceNo || '',
                inv.bookingId?.bookingNo || '',
                inv.bookingId?.customerName || '',
                inv.status || '',
                inv.subtotal || 0,
                inv.discount || 0,
                inv.total || 0,
            ].join(','));
        }
        csvLines.push('');

        // Outstanding bookings
        csvLines.push('=== OUTSTANDING BALANCES ===');
        csvLines.push('Booking No,Customer,Total Cost,Paid,Remaining,Status');
        for (const b of bookingsInRange as any[]) {
            csvLines.push([
                b.bookingNo || '',
                (b.customerName || '').replace(/,/g, ';'),
                b.totalCost || 0,
                b.paidAmount || 0,
                b.remainingBalance || 0,
                b.status || '',
            ].join(','));
        }

        const csvContent = csvLines.join('\n');
        const fileName = `yatara-audit-${startDate}-to-${endDate}.csv`;

        return new Response(csvContent, {
            status: 200,
            headers: {
                'Content-Type': 'text/csv; charset=utf-8',
                'Content-Disposition': `attachment; filename="${fileName}"`,
            },
        });
    } catch (error: any) {
        console.error('Audit Report Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
});
