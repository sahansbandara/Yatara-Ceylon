export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Invoice from '@/models/Invoice';
import { staffOrAdmin } from '@/lib/rbac';
import { logAudit } from '@/lib/audit';

// GET /api/invoices/[id] – protected: staff/admin only
export const GET = staffOrAdmin(async (_req, context) => {
    try {
        await connectDB();
        const { id } = await context.params;
        const invoice = await Invoice.findOne({ _id: id, isDeleted: { $ne: true } })
            .populate('bookingId', 'bookingNo customerName email phone totalCost paidAmount remainingBalance')
            .lean();
        if (!invoice) return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
        return NextResponse.json({ invoice });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
});

export const PATCH = staffOrAdmin(async (request, { params, user }) => {
    try {
        const { id } = await params;
        const body = await request.json();

        await connectDB();

        const invoice = await Invoice.findById(id);
        if (!invoice) {
            return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
        }

        // State transitions: DRAFT → FINAL, FINAL → VOID
        if (body.status === 'FINAL' && invoice.status === 'DRAFT') {
            invoice.status = 'FINAL';
            await invoice.save();

            await logAudit({
                actorUserId: user.userId,
                action: 'UPDATE',
                entity: 'Invoice',
                entityId: invoice._id.toString(),
                meta: { status: 'FINAL' }
            });

            return NextResponse.json({ invoice, message: 'Invoice finalized successfully' });
        }

        if (body.status === 'VOID' && invoice.status === 'FINAL') {
            invoice.status = 'VOID';
            await invoice.save();

            await logAudit({
                actorUserId: user.userId,
                action: 'VOID',
                entity: 'Invoice',
                entityId: invoice._id.toString(),
                meta: { status: 'VOID', reason: body.reason || 'No reason provided' }
            });

            return NextResponse.json({ invoice, message: 'Invoice voided successfully' });
        }

        // Edit DRAFT invoice fields (items, discount, advanceRequired, notes)
        if (invoice.status === 'DRAFT' && !body.status) {
            if (body.items && Array.isArray(body.items) && body.items.length > 0) {
                invoice.items = body.items;
            }
            if (typeof body.discount === 'number') {
                invoice.discount = body.discount;
            }
            if (typeof body.advanceRequired === 'number') {
                invoice.advanceRequired = body.advanceRequired;
            }
            if (typeof body.notes === 'string') {
                invoice.notes = body.notes;
            }

            // Recompute subtotal / total
            const subtotal = invoice.items.reduce(
                (sum: number, item: any) => sum + item.qty * item.unitPrice, 0
            );
            invoice.subtotal = subtotal;
            invoice.total = Math.max(subtotal - (invoice.discount || 0), 0);

            await invoice.save();

            await logAudit({
                actorUserId: user.userId,
                action: 'UPDATE',
                entity: 'Invoice',
                entityId: invoice._id.toString(),
                meta: { editedFields: Object.keys(body) }
            });

            return NextResponse.json({ invoice, message: 'Invoice updated successfully' });
        }

        return NextResponse.json({ error: 'Invalid state transition or operation' }, { status: 400 });
    } catch (error: any) {
        console.error('Invoice Update Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
});

// DELETE /api/invoices/[id] – only DRAFT invoices can be deleted
export const DELETE = staffOrAdmin(async (_req, { params, user }) => {
    try {
        const { id } = await params;
        await connectDB();

        const invoice = await Invoice.findById(id);
        if (!invoice) {
            return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
        }

        if (invoice.status !== 'DRAFT') {
            return NextResponse.json(
                { error: 'Only DRAFT invoices can be deleted. Use VOID for finalized invoices.' },
                { status: 400 }
            );
        }

        await Invoice.findByIdAndDelete(id);

        await logAudit({
            actorUserId: user.userId,
            action: 'DELETE',
            entity: 'Invoice',
            entityId: id,
            meta: { invoiceNo: invoice.invoiceNo }
        });

        return NextResponse.json({ message: 'Draft invoice deleted successfully' });
    } catch (error: any) {
        console.error('Invoice Delete Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
});
