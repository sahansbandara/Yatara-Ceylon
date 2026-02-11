import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Destination from '@/models/Destination';
import { staffOrAdmin } from '@/lib/rbac';
import { validateBody } from '@/lib/validate';
import { updateDestinationSchema } from '@/lib/validations';
import { logAudit } from '@/lib/audit';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await params;
        const filter: Record<string, unknown> = { isDeleted: false };
        if (id.match(/^[0-9a-fA-F]{24}$/)) filter._id = id;
        else filter.slug = id;

        const dest = await Destination.findOne(filter).lean();
        if (!dest) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json({ destination: dest });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export const PATCH = staffOrAdmin(async (request, context) => {
    const { data, error } = await validateBody(request, updateDestinationSchema);
    if (error) return error;
    try {
        await connectDB();
        const { id } = await context.params;
        const dest = await Destination.findOneAndUpdate({ _id: id, isDeleted: false }, { $set: data }, { new: true });
        if (!dest) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        await logAudit({ actorUserId: context.user.userId, action: 'UPDATE', entity: 'Destination', entityId: id });
        return NextResponse.json({ destination: dest });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
});

export const DELETE = staffOrAdmin(async (_request, context) => {
    try {
        await connectDB();
        const { id } = await context.params;
        const dest = await Destination.findOneAndUpdate({ _id: id, isDeleted: false }, { $set: { isDeleted: true, deletedAt: new Date() } });
        if (!dest) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        await logAudit({ actorUserId: context.user.userId, action: 'DELETE', entity: 'Destination', entityId: id });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
});
