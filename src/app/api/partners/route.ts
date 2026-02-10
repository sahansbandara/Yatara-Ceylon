import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Partner from '@/models/Partner';
import PartnerService from '@/models/PartnerService';
import { staffOrAdmin } from '@/lib/rbac';
import { validateBody } from '@/lib/validate';
import { createPartnerSchema } from '@/lib/validations';
import { logAudit } from '@/lib/audit';

export async function GET(request: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type');
        const status = searchParams.get('status');
        const filter: Record<string, unknown> = { isDeleted: false };
        if (type) filter.type = type;
        if (status) filter.status = status;
        const partners = await Partner.find(filter).sort({ createdAt: -1 }).lean();
        return NextResponse.json({ partners });
    } catch (error) { console.error(error); return NextResponse.json({ error: 'Internal server error' }, { status: 500 }); }
}

export const POST = staffOrAdmin(async (request, { user }) => {
    const { data, error } = await validateBody(request, createPartnerSchema);
    if (error) return error;
    try {
        await connectDB();
        const partner = await Partner.create(data);
        await logAudit({ actorUserId: user.userId, action: 'CREATE', entity: 'Partner', entityId: partner._id.toString() });
        return NextResponse.json({ partner }, { status: 201 });
    } catch (error) { console.error(error); return NextResponse.json({ error: 'Internal server error' }, { status: 500 }); }
});
