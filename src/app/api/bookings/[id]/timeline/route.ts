export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import AuditLog from '@/models/AuditLog';
import Invoice from '@/models/Invoice';
import Payment from '@/models/Payment';
import User from '@/models/User';
import { staffOrAdmin } from '@/lib/rbac';

// GET /api/bookings/[id]/timeline – returns audit trail for a booking
export const GET = staffOrAdmin(async (_req, context) => {
    try {
        await connectDB();
        const { id } = await context.params;

        const [logs, invoices, payments] = await Promise.all([
            AuditLog.find({
                entity: 'Booking',
                entityId: id,
            })
                .sort({ at: -1 })
                .limit(50)
                .lean(),
            Invoice.find({ bookingId: id, isDeleted: { $ne: true } })
                .sort({ createdAt: -1 })
                .select('invoiceNo total status createdAt updatedAt')
                .lean(),
            Payment.find({ bookingId: id, isDeleted: { $ne: true } })
                .sort({ paidAt: -1, createdAt: -1 })
                .select('amount type method provider status orderId paidAt createdAt recordedBy voidedAt')
                .lean(),
        ]);

        // Enrich with actor names
        const actorIds = [
            ...new Set([
                ...logs.map((log) => log.actorUserId).filter(Boolean),
                ...payments
                    .map((payment) => (payment.recordedBy ? payment.recordedBy.toString() : null))
                    .filter(Boolean),
            ]),
        ];
        const users = actorIds.length > 0
            ? await User.find({ _id: { $in: actorIds } }).select('name email').lean()
            : [];
        const userMap = new Map(users.map(u => [(u as any)._id.toString(), u]));

        const bookingTimeline = logs.map(log => ({
            _id: (log as any)._id,
            action: log.action,
            meta: log.meta,
            at: log.at,
            actor: log.actorUserId
                ? userMap.get(log.actorUserId)
                    ? { name: (userMap.get(log.actorUserId) as any).name, email: (userMap.get(log.actorUserId) as any).email }
                    : { name: 'Unknown', email: '' }
                : { name: 'System', email: '' },
        }));

        const invoiceTimeline = invoices.flatMap((invoice) => {
            const createdEvent = {
                _id: `invoice-${(invoice as any)._id}-created`,
                action: 'INVOICE_CREATED',
                meta: {
                    invoiceNo: invoice.invoiceNo,
                    total: invoice.total,
                    status: invoice.status,
                },
                at: invoice.createdAt,
                actor: { name: 'Finance', email: '' },
            };

            if (invoice.status === 'DRAFT') return [createdEvent];

            const statusEvent = {
                _id: `invoice-${(invoice as any)._id}-${invoice.status.toLowerCase()}`,
                action:
                    invoice.status === 'FINAL'
                        ? 'INVOICE_FINALIZED'
                        : 'INVOICE_VOIDED',
                meta: {
                    invoiceNo: invoice.invoiceNo,
                    total: invoice.total,
                    status: invoice.status,
                },
                at:
                    invoice.updatedAt && invoice.updatedAt > invoice.createdAt
                        ? invoice.updatedAt
                        : invoice.createdAt,
                actor: { name: 'Finance', email: '' },
            };

            return [createdEvent, statusEvent];
        });

        const paymentTimeline = payments.flatMap((payment) => {
            const actorId = payment.recordedBy?.toString();
            const actor = actorId && userMap.get(actorId)
                ? {
                    name: (userMap.get(actorId) as any).name,
                    email: (userMap.get(actorId) as any).email,
                }
                : { name: 'Finance', email: '' };

            const recordedEvent = {
                _id: `payment-${(payment as any)._id}-recorded`,
                action: 'PAYMENT_RECORDED',
                meta: {
                    amount: payment.amount,
                    type: payment.type,
                    method: payment.method,
                    provider: payment.provider,
                    status: payment.status,
                    orderId: payment.orderId,
                },
                at: payment.paidAt || payment.createdAt,
                actor,
            };

            if (!payment.voidedAt) return [recordedEvent];

            return [
                recordedEvent,
                {
                    _id: `payment-${(payment as any)._id}-voided`,
                    action: 'PAYMENT_VOIDED',
                    meta: {
                        amount: payment.amount,
                        type: payment.type,
                        method: payment.method,
                        provider: payment.provider,
                        status: payment.status,
                        orderId: payment.orderId,
                    },
                    at: payment.voidedAt,
                    actor,
                },
            ];
        });

        const timeline = [
            ...bookingTimeline,
            ...invoiceTimeline,
            ...paymentTimeline,
        ]
            .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
            .slice(0, 75);

        return NextResponse.json({ timeline });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
});
