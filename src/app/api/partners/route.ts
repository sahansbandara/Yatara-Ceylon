import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Partner from '@/models/Partner';
import PartnerService from '@/models/PartnerService';
import { withAuth } from '@/lib/rbac';
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

export const POST = withAuth(async (request: Request, context: any) => {
    const user = context.user;
    if (!['ADMIN', 'STAFF', 'HOTEL_OWNER'].includes(user.role)) {
        return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const { data, error } = await validateBody(request, createPartnerSchema);
    if (error) return error;

    const partnerData: any = { ...data };

    if (user.role === 'HOTEL_OWNER') {
        partnerData.status = 'PENDING_APPROVAL';
        partnerData.ownerId = user.userId;
        partnerData.type = 'HOTEL';
    }

    try {
        await connectDB();
        const partner = await Partner.create(partnerData);
        await logAudit({ actorUserId: user.userId, action: 'CREATE', entity: 'Partner', entityId: partner._id.toString() });
        return NextResponse.json({ partner }, { status: 201 });
    } catch (error) { console.error(error); return NextResponse.json({ error: 'Internal server error' }, { status: 500 }); }
});
