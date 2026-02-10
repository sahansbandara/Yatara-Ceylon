import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Vehicle from '@/models/Vehicle';
import VehicleBlock from '@/models/VehicleBlock';
import { staffOrAdmin } from '@/lib/rbac';
import { validateBody } from '@/lib/validate';
import { updateVehicleSchema, createVehicleBlockSchema } from '@/lib/validations';
import { logAudit } from '@/lib/audit';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await params;
        const vehicle = await Vehicle.findOne({ _id: id, isDeleted: false }).lean();
        if (!vehicle) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        const blocks = await VehicleBlock.find({ vehicleId: id }).sort({ from: 1 }).lean();
        return NextResponse.json({ vehicle, blocks });
    } catch (error) { console.error(error); return NextResponse.json({ error: 'Internal server error' }, { status: 500 }); }
}

export const PATCH = staffOrAdmin(async (request, context) => {
    const { data, error } = await validateBody(request, updateVehicleSchema);
    if (error) return error;
    try {
        await connectDB();
        const { id } = await (context.params as unknown as Promise<{ id: string }>);
        const vehicle = await Vehicle.findOneAndUpdate({ _id: id, isDeleted: false }, { $set: data }, { new: true });
        if (!vehicle) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        await logAudit({ actorUserId: context.user.userId, action: 'UPDATE', entity: 'Vehicle', entityId: id });
        return NextResponse.json({ vehicle });
    } catch (error) { console.error(error); return NextResponse.json({ error: 'Internal server error' }, { status: 500 }); }
});

export const DELETE = staffOrAdmin(async (_req, context) => {
    try {
        await connectDB();
        const { id } = await (context.params as unknown as Promise<{ id: string }>);
        await Vehicle.findByIdAndUpdate(id, { $set: { isDeleted: true, deletedAt: new Date() } });
        await logAudit({ actorUserId: context.user.userId, action: 'DELETE', entity: 'Vehicle', entityId: id });
        return NextResponse.json({ success: true });
    } catch (error) { console.error(error); return NextResponse.json({ error: 'Internal server error' }, { status: 500 }); }
});

// POST block dates for a vehicle
export const POST = staffOrAdmin(async (request, context) => {
    const { data, error } = await validateBody(request, createVehicleBlockSchema);
    if (error) return error;
    try {
        await connectDB();
        const { id } = await (context.params as unknown as Promise<{ id: string }>);

        // Check for overlap
        const overlap = await VehicleBlock.findOne({
            vehicleId: id,
            from: { $lte: new Date(data!.to) },
            to: { $gte: new Date(data!.from) },
        });
        if (overlap) {
            return NextResponse.json({ error: 'Date range overlaps with existing block' }, { status: 409 });
        }

        const block = await VehicleBlock.create({
            vehicleId: id,
            from: new Date(data!.from),
            to: new Date(data!.to),
            reason: data!.reason,
            bookingId: data!.bookingId,
        });
        return NextResponse.json({ block }, { status: 201 });
    } catch (error) { console.error(error); return NextResponse.json({ error: 'Internal server error' }, { status: 500 }); }
});
