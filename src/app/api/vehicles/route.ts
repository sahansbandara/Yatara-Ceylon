import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Vehicle from '@/models/Vehicle';
import VehicleBlock from '@/models/VehicleBlock';
import { staffOrAdmin } from '@/lib/rbac';
import { validateBody } from '@/lib/validate';
import { createVehicleSchema } from '@/lib/validations';

export async function GET(request: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type');
        const status = searchParams.get('status');
        const transferType = searchParams.get('transferType');
        const from = searchParams.get('from');
        const to = searchParams.get('to');

        const filter: Record<string, unknown> = { isDeleted: false };
        if (type) filter.type = type;
        if (status) filter.status = status;
        if (transferType) filter.transferTypes = transferType;

        let vehicles = await Vehicle.find(filter).sort({ createdAt: -1 }).lean();

        // If date range provided, check availability
        if (from && to) {
            const fromDate = new Date(from);
            const toDate = new Date(to);
            const blocks = await VehicleBlock.find({
                from: { $lte: toDate },
                to: { $gte: fromDate },
            }).lean();
            const blockedVehicleIds = new Set(blocks.map(b => b.vehicleId.toString()));
            vehicles = vehicles.filter(v => !blockedVehicleIds.has((v._id as string).toString()));
        }

        return NextResponse.json({ vehicles });
    } catch (error) { console.error(error); return NextResponse.json({ error: 'Internal server error' }, { status: 500 }); }
}

export const POST = staffOrAdmin(async (request) => {
    const { data, error } = await validateBody(request, createVehicleSchema);
    if (error) return error;
    try {
        await connectDB();
        const vehicle = await Vehicle.create(data);
        return NextResponse.json({ vehicle }, { status: 201 });
    } catch (error) { console.error(error); return NextResponse.json({ error: 'Internal server error' }, { status: 500 }); }
});
