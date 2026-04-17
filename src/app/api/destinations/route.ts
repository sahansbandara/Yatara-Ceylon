export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Destination from '@/models/Destination';
import { staffOrAdmin } from '@/lib/rbac';
import { validateBody } from '@/lib/validate';
import { createDestinationSchema, updateDestinationSchema } from '@/lib/validations';
import { logAudit } from '@/lib/audit';
import { buildUniqueSlug } from '@/lib/slug';

export async function GET(request: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const published = searchParams.get('published');
        const filter: Record<string, unknown> = { isDeleted: false };
        if (published === 'true') filter.isPublished = true;

        const destinations = await Destination.find(filter).sort({ createdAt: -1 }).lean();
        return NextResponse.json({ destinations });
    } catch (error) {
        console.error('GET /api/destinations error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export const POST = staffOrAdmin(async (request, { user }) => {
    const { data, error } = await validateBody(request, createDestinationSchema);
    if (error) return error;

    try {
        await connectDB();
        const finalSlug = await buildUniqueSlug(Destination, data!.title);

        const dest = await Destination.create({ ...data, slug: finalSlug });
        await logAudit({ actorUserId: user.userId, action: 'CREATE', entity: 'Destination', entityId: dest._id.toString() });
        return NextResponse.json({ destination: dest }, { status: 201 });
    } catch (error) {
        console.error('POST /api/destinations error:', error);
        if ((error as { code?: number }).code === 11000) {
            return NextResponse.json({ error: 'A destination with a conflicting slug already exists. Update the title and try again.' }, { status: 409 });
        }
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
});
