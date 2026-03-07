import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import PartnerServiceBlock from '@/models/PartnerServiceBlock';
import { withAuth } from '@/lib/rbac';
import { logAudit } from '@/lib/audit';
import PartnerService from '@/models/PartnerService';
import Partner from '@/models/Partner';

export const DELETE = withAuth(async (request, context) => {
    try {
        await connectDB();
        const { blockId } = await (context.params as unknown as Promise<{ blockId: string }>);

        const block = await PartnerServiceBlock.findById(blockId);
        if (!block) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        const userRole = context.user.role;
        if (userRole === 'HOTEL_OWNER') {
            const service = await PartnerService.findById(block.serviceId);
            if (!service) return NextResponse.json({ error: 'Service missing' }, { status: 404 });

            const partner = await Partner.findById(service.partnerId);
            if (!partner) return NextResponse.json({ error: 'Partner missing' }, { status: 404 });

            if (partner.ownerId?.toString() !== context.user.userId) {
                return NextResponse.json({ error: 'Permission denied. Not your block.' }, { status: 403 });
            }
        } else if (!['ADMIN', 'STAFF'].includes(userRole)) {
            return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
        }

        // Only allow manual deletion if it's not a booking block (or if we explicitly want to allow override)
        if (block.reason === 'BOOKING') {
            if (userRole === 'HOTEL_OWNER') {
                return NextResponse.json({ error: 'Cannot manually delete active Booking blocks.' }, { status: 403 });
            }
        }

        await PartnerServiceBlock.findByIdAndDelete(blockId);
        await logAudit({ actorUserId: context.user.userId, action: 'DELETE', entity: 'PartnerServiceBlock', entityId: blockId });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
});
