export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Attachment from '@/models/Attachment';
import Invoice from '@/models/Invoice';
import { staffOrAdmin } from '@/lib/rbac';
import { validateBody } from '@/lib/validate';
import { createAttachmentSchema } from '@/lib/validations';
import { logAudit } from '@/lib/audit';

function buildFileName(url: string, fileName?: string) {
    if (fileName) {
        return fileName;
    }

    try {
        const pathname = new URL(url).pathname;
        const lastSegment = pathname.split('/').filter(Boolean).pop();
        return lastSegment || 'document-link';
    } catch {
        return 'document-link';
    }
}

// GET /api/bookings/[id]/attachments – protected: staff/admin only
export const GET = staffOrAdmin(async (_request, context) => {
    try {
        await connectDB();
        const { id } = await context.params;

        const attachments = await Attachment.find({
            bookingId: id,
            isDeleted: { $ne: true },
        })
            .sort({ createdAt: -1 })
            .populate('addedBy', 'name email')
            .populate('invoiceId', 'invoiceNo status')
            .lean();

        const serializedAttachments = attachments.map((attachment: any) => ({
            _id: attachment._id.toString(),
            label: attachment.label,
            type: attachment.type,
            url: attachment.url,
            fileName: attachment.fileName,
            notes: attachment.notes,
            createdAt: attachment.createdAt,
            invoice: attachment.invoiceId
                ? {
                    _id: attachment.invoiceId._id.toString(),
                    invoiceNo: attachment.invoiceId.invoiceNo,
                    status: attachment.invoiceId.status,
                }
                : null,
            addedBy: attachment.addedBy
                ? {
                    _id: attachment.addedBy._id.toString(),
                    name: attachment.addedBy.name,
                    email: attachment.addedBy.email,
                }
                : null,
        }));

        return NextResponse.json({ attachments: serializedAttachments });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
});

// POST /api/bookings/[id]/attachments – protected: staff/admin only
export const POST = staffOrAdmin(async (request, context) => {
    try {
        await connectDB();
        const { id } = await context.params;
        const { data, error } = await validateBody(request, createAttachmentSchema);

        if (error) {
            return NextResponse.json({ error }, { status: 400 });
        }

        if (data.invoiceId) {
            const invoice = await Invoice.findOne({
                _id: data.invoiceId,
                bookingId: id,
                isDeleted: { $ne: true },
            }).select('_id');

            if (!invoice) {
                return NextResponse.json(
                    { error: 'Selected invoice does not belong to this booking' },
                    { status: 400 }
                );
            }
        }

        const attachment = await Attachment.create({
            bookingId: id,
            invoiceId: data.invoiceId || undefined,
            label: data.label,
            type: data.type,
            url: data.url,
            fileName: buildFileName(data.url, data.fileName),
            notes: data.notes,
            addedBy: context.user.userId,
        });

        await logAudit({
            actorUserId: context.user.userId,
            action: 'ATTACH',
            entity: 'Booking',
            entityId: id,
            meta: {
                attachmentId: attachment._id.toString(),
                label: attachment.label,
                type: attachment.type,
                invoiceId: data.invoiceId || null,
            },
        });

        const populatedAttachment = await Attachment.findById(attachment._id)
            .populate('addedBy', 'name email')
            .populate('invoiceId', 'invoiceNo status')
            .lean();

        return NextResponse.json({
            attachment: {
                _id: (populatedAttachment as any)._id.toString(),
                label: (populatedAttachment as any).label,
                type: (populatedAttachment as any).type,
                url: (populatedAttachment as any).url,
                fileName: (populatedAttachment as any).fileName,
                notes: (populatedAttachment as any).notes,
                createdAt: (populatedAttachment as any).createdAt,
                invoice: (populatedAttachment as any).invoiceId
                    ? {
                        _id: (populatedAttachment as any).invoiceId._id.toString(),
                        invoiceNo: (populatedAttachment as any).invoiceId.invoiceNo,
                        status: (populatedAttachment as any).invoiceId.status,
                    }
                    : null,
                addedBy: (populatedAttachment as any).addedBy
                    ? {
                        _id: (populatedAttachment as any).addedBy._id.toString(),
                        name: (populatedAttachment as any).addedBy.name,
                        email: (populatedAttachment as any).addedBy.email,
                    }
                    : null,
            },
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
});
