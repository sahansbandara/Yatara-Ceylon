export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Partner from '@/models/Partner';
import PartnerService from '@/models/PartnerService';
import { withAuth } from '@/lib/rbac';
import { validateBody } from '@/lib/validate';
import { updatePartnerServiceSchema } from '@/lib/validations';
import { logAudit } from '@/lib/audit';

function canManagePartnerService(role: string, ownerId: string | undefined, userId: string) {
    if (['ADMIN', 'STAFF'].includes(role)) return true;
    if (['HOTEL_OWNER', 'VEHICLE_OWNER'].includes(role) && ownerId === userId) return true;
    return false;
}

export const PATCH = withAuth(async (request, context) => {
    const { data, error } = await validateBody(request, updatePartnerServiceSchema);
    if (error) return error;

    try {
        await connectDB();
        const { id } = await context.params;

        const service = await PartnerService.findOne({ _id: id, isDeleted: false });
        if (!service) {
            return NextResponse.json({ error: 'Partner service not found' }, { status: 404 });
        }

        const partner = await Partner.findOne({ _id: service.partnerId, isDeleted: false });
        if (!partner) {
            return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
        }

        const ownerId = partner.ownerId?.toString();
        if (!canManagePartnerService(context.user.role, ownerId, context.user.userId)) {
            return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
        }

        const update = { ...(data as Record<string, unknown>) };
        const updatedService = await PartnerService.findByIdAndUpdate(
            id,
            { $set: update },
            { new: true }
        );

        await logAudit({
            actorUserId: context.user.userId,
            action: 'UPDATE',
            entity: 'PartnerService',
            entityId: id,
        });

        return NextResponse.json({ service: updatedService });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
});

export const DELETE = withAuth(async (_request, context) => {
    try {
        await connectDB();
        const { id } = await context.params;

        const service = await PartnerService.findOne({ _id: id, isDeleted: false });
        if (!service) {
            return NextResponse.json({ error: 'Partner service not found' }, { status: 404 });
        }

        const partner = await Partner.findOne({ _id: service.partnerId, isDeleted: false });
        if (!partner) {
            return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
        }

        const ownerId = partner.ownerId?.toString();
        if (!canManagePartnerService(context.user.role, ownerId, context.user.userId)) {
            return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
        }

        await PartnerService.findByIdAndUpdate(id, {
            $set: {
                isDeleted: true,
                deletedAt: new Date(),
                isActive: false,
            },
        });

        await logAudit({
            actorUserId: context.user.userId,
            action: 'DELETE',
            entity: 'PartnerService',
            entityId: id,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
});
