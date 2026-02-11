import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Package from '@/models/Package';
import { staffOrAdmin } from '@/lib/rbac';
import { validateBody } from '@/lib/validate';
import { updatePackageSchema } from '@/lib/validations';
import { logAudit } from '@/lib/audit';

// GET /api/packages/[id] – get single package by id or slug
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await params;
        const filter: Record<string, unknown> = { isDeleted: false };

        // Try ObjectId first, fall back to slug
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            filter._id = id;
        } else {
            filter.slug = id;
        }

        const pkg = await Package.findOne(filter).lean();
        if (!pkg) {
            return NextResponse.json({ error: 'Package not found' }, { status: 404 });
        }

        return NextResponse.json({ package: pkg });
    } catch (error) {
        console.error('GET /api/packages/[id] error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PATCH /api/packages/[id] – update package
export const PATCH = staffOrAdmin(async (request, context) => {
    const { data, error } = await validateBody(request, updatePackageSchema);
    if (error) return error;

    try {
        await connectDB();
        const { id } = await context.params;
        const pkg = await Package.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { $set: data },
            { new: true }
        );

        if (!pkg) {
            return NextResponse.json({ error: 'Package not found' }, { status: 404 });
        }

        await logAudit({ actorUserId: context.user.userId, action: 'UPDATE', entity: 'Package', entityId: id });

        return NextResponse.json({ package: pkg });
    } catch (error) {
        console.error('PATCH /api/packages/[id] error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
});

// DELETE /api/packages/[id] – soft delete
export const DELETE = staffOrAdmin(async (_request, context) => {
    try {
        await connectDB();
        const { id } = await context.params;
        const pkg = await Package.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { $set: { isDeleted: true, deletedAt: new Date() } },
            { new: true }
        );

        if (!pkg) {
            return NextResponse.json({ error: 'Package not found' }, { status: 404 });
        }

        await logAudit({ actorUserId: context.user.userId, action: 'DELETE', entity: 'Package', entityId: id });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('DELETE /api/packages/[id] error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
});
