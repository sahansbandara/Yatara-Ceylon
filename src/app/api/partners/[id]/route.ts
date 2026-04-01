export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Partner from '@/models/Partner';
import PartnerService from '@/models/PartnerService';
import { staffOrAdmin, withAuth } from '@/lib/rbac';
import { validateBody } from '@/lib/validate';
import { updatePartnerSchema, createPartnerServiceSchema } from '@/lib/validations';
import { logAudit } from '@/lib/audit';

export const GET = withAuth(async (_req, context) => {
    try {
        await connectDB();
        const { id } = await context.params;
        const partner = await Partner.findOne({ _id: id, isDeleted: false }).lean() as { ownerId?: { toString(): string } } | null;
        if (!partner) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        const userRole = context.user.role;
        const isOwner = ['HOTEL_OWNER', 'VEHICLE_OWNER'].includes(userRole) && partner.ownerId?.toString() === context.user.userId;
        if (!['ADMIN', 'STAFF'].includes(userRole) && !isOwner) {
            return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
        }

        const services = await PartnerService.find({ partnerId: id, isDeleted: false }).lean();
        return NextResponse.json({ partner, services });
    } catch (error) { console.error(error); return NextResponse.json({ error: 'Internal server error' }, { status: 500 }); }
});

export const PATCH = withAuth(async (request, context) => {
    const { data, error } = await validateBody(request, updatePartnerSchema);
    if (error) return error;
    try {
        await connectDB();
        const { id } = await context.params;

        const partnerDoc = await Partner.findOne({ _id: id, isDeleted: false });
        if (!partnerDoc) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        const userRole = context.user.role;
        if (userRole === 'HOTEL_OWNER') {
            if (partnerDoc.ownerId?.toString() !== context.user.userId) {
                return NextResponse.json({ error: 'Permission denied. Not your property.' }, { status: 403 });
            }
            data.status = 'PENDING_APPROVAL';
        } else if (!['ADMIN', 'STAFF'].includes(userRole)) {
            return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
        }

        const partner = await Partner.findOneAndUpdate({ _id: id, isDeleted: false }, { $set: data }, { new: true });
        await logAudit({ actorUserId: context.user.userId, action: 'UPDATE', entity: 'Partner', entityId: id });
        return NextResponse.json({ partner });
    } catch (error) { console.error(error); return NextResponse.json({ error: 'Internal server error' }, { status: 500 }); }
});

export const DELETE = staffOrAdmin(async (_req, context) => {
    try {
        await connectDB();
        const { id } = await context.params;
        await Partner.findByIdAndUpdate(id, { $set: { isDeleted: true, deletedAt: new Date() } });
        await logAudit({ actorUserId: context.user.userId, action: 'DELETE', entity: 'Partner', entityId: id });
        return NextResponse.json({ success: true });
    } catch (error) { console.error(error); return NextResponse.json({ error: 'Internal server error' }, { status: 500 }); }
});

// POST – add service to partner
export const POST = staffOrAdmin(async (request, context) => {
    const { data, error } = await validateBody(request, createPartnerServiceSchema);
    if (error) return error;
    try {
        await connectDB();
        const { id } = await context.params;
        const partner = await Partner.findOne({ _id: id, isDeleted: false });
        if (!partner) {
            return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
        }

        const service = await PartnerService.create({ ...data, partnerId: id });
        await logAudit({ actorUserId: context.user.userId, action: 'CREATE', entity: 'PartnerService', entityId: service._id.toString() });
        return NextResponse.json({ service }, { status: 201 });
    } catch (error) { console.error(error); return NextResponse.json({ error: 'Internal server error' }, { status: 500 }); }
});
