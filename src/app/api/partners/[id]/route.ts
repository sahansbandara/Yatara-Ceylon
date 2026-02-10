import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Partner from '@/models/Partner';
import PartnerService from '@/models/PartnerService';
import { staffOrAdmin } from '@/lib/rbac';
import { validateBody } from '@/lib/validate';
import { updatePartnerSchema, createPartnerServiceSchema } from '@/lib/validations';
import { logAudit } from '@/lib/audit';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await params;
        const partner = await Partner.findOne({ _id: id, isDeleted: false }).lean();
        if (!partner) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        const services = await PartnerService.find({ partnerId: id }).lean();
        return NextResponse.json({ partner, services });
    } catch (error) { console.error(error); return NextResponse.json({ error: 'Internal server error' }, { status: 500 }); }
}

export const PATCH = staffOrAdmin(async (request, context) => {
    const { data, error } = await validateBody(request, updatePartnerSchema);
    if (error) return error;
    try {
        await connectDB();
        const { id } = await context.params;
        const partner = await Partner.findOneAndUpdate({ _id: id, isDeleted: false }, { $set: data }, { new: true });
        if (!partner) return NextResponse.json({ error: 'Not found' }, { status: 404 });
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
        const service = await PartnerService.create({ ...data, partnerId: id });
        return NextResponse.json({ service }, { status: 201 });
    } catch (error) { console.error(error); return NextResponse.json({ error: 'Internal server error' }, { status: 500 }); }
});
