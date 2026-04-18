export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { z } from 'zod';
import connectDB from '@/lib/mongodb';
import Destination from '@/models/Destination';
import { staffOrAdmin } from '@/lib/rbac';
import { logAudit } from '@/lib/audit';

const bulkDestinationSchema = z.object({
    ids: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/)).min(1).max(100),
    action: z.enum(['publish', 'unpublish', 'archive']),
});

export const PATCH = staffOrAdmin(async (request, { user }) => {
    try {
        const body = await request.json();
        const parsed = bulkDestinationSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json({ error: 'Invalid bulk request payload' }, { status: 400 });
        }

        await connectDB();

        const { ids, action } = parsed.data;
        const update =
            action === 'archive'
                ? { isDeleted: true, deletedAt: new Date() }
                : { isPublished: action === 'publish' };

        const result = await Destination.updateMany(
            { _id: { $in: ids }, isDeleted: false },
            { $set: update }
        );

        await logAudit({
            actorUserId: user.userId,
            action: 'BULK_UPDATE',
            entity: 'Destination',
            meta: { action, count: result.modifiedCount, ids },
        });

        return NextResponse.json({ success: true, modifiedCount: result.modifiedCount });
    } catch (error) {
        console.error('PATCH /api/destinations/bulk error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
});
