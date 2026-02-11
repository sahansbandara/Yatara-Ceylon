import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import BookingPartnerAssignment from '@/models/BookingPartnerAssignment';
import { staffOrAdmin } from '@/lib/rbac';
import { validateBody } from '@/lib/validate';
import { createBookingPartnerSchema } from '@/lib/validations';

export async function GET(request: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const bookingId = searchParams.get('bookingId');
        const filter: Record<string, unknown> = {};
        if (bookingId) filter.bookingId = bookingId;
        const assignments = await BookingPartnerAssignment.find(filter)
            .populate('partnerId', 'name type')
            .populate('bookingId', 'bookingNo customerName')
            .lean();
        return NextResponse.json({ assignments });
    } catch (error) { console.error(error); return NextResponse.json({ error: 'Internal server error' }, { status: 500 }); }
}

export const POST = staffOrAdmin(async (request) => {
    const { data, error } = await validateBody(request, createBookingPartnerSchema);
    if (error) return error;
    try {
        await connectDB();
        const assignment = await BookingPartnerAssignment.create(data);
        return NextResponse.json({ assignment }, { status: 201 });
    } catch (error) { console.error(error); return NextResponse.json({ error: 'Internal server error' }, { status: 500 }); }
});
