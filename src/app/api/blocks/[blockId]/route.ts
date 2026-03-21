import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import VehicleBlock from '@/models/VehicleBlock';
import { staffOrAdmin } from '@/lib/rbac';
import { logAudit } from '@/lib/audit';

import { withAuth } from '@/lib/rbac';

export const DELETE = withAuth(async (request, context) => {
    try {
        await connectDB();
        const { blockId } = await (context.params as unknown as Promise<{ blockId: string }>);

        const block = await VehicleBlock.findById(blockId).populate('vehicleId');
        if (!block) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        const userRole = context.user.role;
        if (userRole === 'VEHICLE_OWNER') {
            if (block.vehicleId.ownerId?.toString() !== context.user.userId) {
                return NextResponse.json({ error: 'Permission denied. Not your vehicle block.' }, { status: 403 });
            }
        } else if (!['ADMIN', 'STAFF'].includes(userRole)) {
            return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
        }

        // Only allow manual deletion if it's not a booking block (or if we explicitly want to allow override)
        if (block.reason === 'BOOKING') {
            if (userRole === 'VEHICLE_OWNER') {
                return NextResponse.json({ error: 'Cannot manually delete active Booking blocks.' }, { status: 403 });
            }
        }

        await VehicleBlock.findByIdAndDelete(blockId);
        await logAudit({ actorUserId: context.user.userId, action: 'DELETE', entity: 'VehicleBlock', entityId: blockId });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
});
