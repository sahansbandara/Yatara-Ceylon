import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Vehicle from '@/models/Vehicle';
import VehicleBlock from '@/models/VehicleBlock';
import { staffOrAdmin, withAuth } from '@/lib/rbac';
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

export const PATCH = withAuth(async (request, context) => {
    const { data, error } = await validateBody(request, updateVehicleSchema);
    if (error) return error;
    try {
        await connectDB();
        const { id } = await (context.params as unknown as Promise<{ id: string }>);

        // Ensure only Staff, Admins, or the exact Owner can edit
        const vehicleDoc = await Vehicle.findOne({ _id: id, isDeleted: false });
        if (!vehicleDoc) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        const userRole = context.user.role;
        if (userRole === 'VEHICLE_OWNER') {
            if (vehicleDoc.ownerId?.toString() !== context.user.userId) {
                return NextResponse.json({ error: 'Permission denied. Not your vehicle.' }, { status: 403 });
            }
            // Force status to PENDING_APPROVAL on owner edit
            data.status = 'PENDING_APPROVAL';
        } else if (!['ADMIN', 'STAFF'].includes(userRole)) {
            return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
        }

        const vehicle = await Vehicle.findOneAndUpdate({ _id: id, isDeleted: false }, { $set: data }, { new: true });

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
export const POST = withAuth(async (request, context) => {
    const { data, error } = await validateBody(request, createVehicleBlockSchema);
    if (error) return error;
    try {
        await connectDB();
        const { id } = await (context.params as unknown as Promise<{ id: string }>);

        const vehicle = await Vehicle.findOne({ _id: id, isDeleted: false });
        if (!vehicle) return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });

        const userRole = context.user.role;
        if (userRole === 'VEHICLE_OWNER') {
            if (vehicle.ownerId?.toString() !== context.user.userId) {
                return NextResponse.json({ error: 'Permission denied. Not your vehicle.' }, { status: 403 });
            }
        } else if (!['ADMIN', 'STAFF'].includes(userRole)) {
            return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
        }

        // Safety verification: No overlap with existing blocks
        const overlap = await VehicleBlock.findOne({
            vehicleId: id,
            from: { $lte: new Date(data!.to) },
            to: { $gte: new Date(data!.from) },
        });
        if (overlap) {
            return NextResponse.json({ error: 'Date range overlaps with existing block' }, { status: 409 });
        }

        // Verify no active Yatara Bookings collide
        const Booking = (await import('@/models/Booking')).default;
        const bookingOverlap = await Booking.findOne({
            assignedVehicleId: id,
            isDeleted: false,
            status: { $in: ['CONFIRMED', 'ASSIGNED', 'IN_PROGRESS'] },
            'dates.start': { $lte: new Date(data!.to) },
            'dates.end': { $gte: new Date(data!.from) }
        });

        if (bookingOverlap) {
            return NextResponse.json({ error: 'Cannot block vehicle. Active bookings exist for these dates.' }, { status: 409 });
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
