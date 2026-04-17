export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Attachment from '@/models/Attachment';
import { staffOrAdmin } from '@/lib/rbac';
import { logAudit } from '@/lib/audit';

// DELETE /api/bookings/[id]/attachments/[attachmentId] – protected: staff/admin only
export const DELETE = staffOrAdmin(async (_request, context) => {
    try {
        await connectDB();
        const { id, attachmentId } = await context.params;

        const attachment = await Attachment.findOneAndUpdate(
            {
                _id: attachmentId,
                bookingId: id,
                isDeleted: { $ne: true },
            },
            {
                $set: {
                    isDeleted: true,
                    deletedAt: new Date(),
                },
            },
            { new: true }
        );

        if (!attachment) {
            return NextResponse.json({ error: 'Attachment not found' }, { status: 404 });
        }

        await logAudit({
            actorUserId: context.user.userId,
            action: 'DELETE_ATTACHMENT',
            entity: 'Booking',
            entityId: id,
            meta: {
                attachmentId,
                label: attachment.label,
                type: attachment.type,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
});
