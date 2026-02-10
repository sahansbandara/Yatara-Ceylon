import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Invoice from '@/models/Invoice';
import Payment from '@/models/Payment';
import { staffOrAdmin } from '@/lib/rbac';
import { validateBody } from '@/lib/validate';
import { updateInvoiceSchema } from '@/lib/validations';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await params;
        const invoice = await Invoice.findById(id).populate('bookingId', 'bookingNo customerName phone').lean();
        if (!invoice) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        // Get related payments
        const invoiceAny = invoice as any;
        const payments = await Payment.find({ bookingId: invoiceAny.bookingId._id || invoiceAny.bookingId, isDeleted: { $ne: true } }).lean() as any[];
        const totalPaid = payments.filter(p => p.type === 'PAYMENT').reduce((s, p) => s + p.amount, 0);
        const totalRefunded = payments.filter(p => p.type === 'REFUND').reduce((s, p) => s + p.amount, 0);
        const remaining = invoiceAny.total - totalPaid + totalRefunded;

        return NextResponse.json({ invoice, payments, totalPaid, totalRefunded, remaining });
    } catch (error) { console.error(error); return NextResponse.json({ error: 'Internal server error' }, { status: 500 }); }
}

export const PATCH = staffOrAdmin(async (request, context) => {
    const { data, error } = await validateBody(request, updateInvoiceSchema);
    if (error) return error;
    try {
        await connectDB();
        const { id } = await context.params;

        // Recalculate if items changed
        if (data?.items) {
            const subtotal = data.items.reduce((sum: number, item: { qty: number; unitPrice: number }) => sum + item.qty * item.unitPrice, 0);
            (data as Record<string, unknown>).subtotal = subtotal;
            (data as Record<string, unknown>).total = Math.max(subtotal - (data.discount || 0), 0);
        }

        const invoice = await Invoice.findByIdAndUpdate(id, { $set: data }, { new: true });
        if (!invoice) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json({ invoice });
    } catch (error) { console.error(error); return NextResponse.json({ error: 'Internal server error' }, { status: 500 }); }
});

export const DELETE = staffOrAdmin(async (_req, context) => {
    try {
        await connectDB();
        const { id } = await context.params;
        await Invoice.findByIdAndUpdate(id, { $set: { isDeleted: true, deletedAt: new Date() } });
        return NextResponse.json({ success: true });
    } catch (error) { console.error(error); return NextResponse.json({ error: 'Internal server error' }, { status: 500 }); }
});
