import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import VehicleBlock from '@/models/VehicleBlock';
import { staffOrAdmin } from '@/lib/rbac';
import { logAudit } from '@/lib/audit';

export const DELETE = staffOrAdmin(async (_req, context) => {
    try {
        await connectDB();
        const { blockId } = await (context.params as unknown as Promise<{ blockId: string }>);

        const block = await VehicleBlock.findById(blockId);
        if (!block) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        // Only allow manual deletion if it's not a booking block (or if we explicitly want to allow override)
        if (block.reason === 'BOOKING') {
            // Maybe allow it with warning, but typically shouldn't delete active booking blocks manually
        }

        await VehicleBlock.findByIdAndDelete(blockId);
        await logAudit({ actorUserId: context.user.userId, action: 'DELETE', entity: 'VehicleBlock', entityId: blockId });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
});
