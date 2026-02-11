import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import { staffOrAdmin } from '@/lib/rbac';
import { validateBody } from '@/lib/validate';
import { createBookingSchema } from '@/lib/validations';
import { logAudit } from '@/lib/audit';

export async function GET(request: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const type = searchParams.get('type');
        const search = searchParams.get('search');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');

        const filter: Record<string, unknown> = { isDeleted: false };
        if (status) filter.status = status;
        if (type) filter.type = type;
        if (search) {
            filter.$or = [
                { customerName: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } },
                { bookingNo: { $regex: search, $options: 'i' } },
            ];
        }

        const [bookings, total] = await Promise.all([
            Booking.find(filter)
                .populate('packageId', 'title slug')
                .populate('assignedStaffId', 'name')
                .populate('assignedVehicleId', 'model type')
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),
            Booking.countDocuments(filter),
        ]);

        return NextResponse.json({ bookings, total, page, totalPages: Math.ceil(total / limit) });
    } catch (error) { console.error(error); return NextResponse.json({ error: 'Internal server error' }, { status: 500 }); }
}

export const POST = staffOrAdmin(async (request, { user }) => {
    const { data, error } = await validateBody(request, createBookingSchema);
    if (error) return error;
    try {
        await connectDB();
        const booking = await Booking.create({
            ...data,
            dates: { from: new Date(data!.dates.from), to: new Date(data!.dates.to) },
        });
        await logAudit({ actorUserId: user.userId, action: 'CREATE', entity: 'Booking', entityId: booking._id.toString() });
        return NextResponse.json({ booking }, { status: 201 });
    } catch (error) { console.error(error); return NextResponse.json({ error: 'Internal server error' }, { status: 500 }); }
});
