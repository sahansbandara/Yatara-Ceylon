export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import BookingPartnerAssignment from '@/models/BookingPartnerAssignment';
import Partner from '@/models/Partner';
import PartnerService from '@/models/PartnerService';
import { staffOrAdmin } from '@/lib/rbac';
import { validateBody } from '@/lib/validate';
import { createBookingPartnerSchema } from '@/lib/validations';

export const GET = staffOrAdmin(async (request) => {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const bookingId = searchParams.get('bookingId');
        const filter: Record<string, unknown> = {};
        if (bookingId) filter.bookingId = bookingId;
        const assignments = await BookingPartnerAssignment.find(filter)
            .populate('partnerId', 'name type')
            .populate('bookingId', 'bookingNo customerName')
            .populate('serviceId', 'serviceName unit rate isActive')
            .lean();
        return NextResponse.json({ assignments });
    } catch (error) { console.error(error); return NextResponse.json({ error: 'Internal server error' }, { status: 500 }); }
});

export const POST = staffOrAdmin(async (request) => {
    const { data, error } = await validateBody(request, createBookingPartnerSchema);
    if (error) return error;
    try {
        await connectDB();

        const partner = await Partner.findOne({ _id: data!.partnerId, isDeleted: false });
        if (!partner) {
            return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
        }

        if (partner.status !== 'ACTIVE') {
            return NextResponse.json({ error: 'Inactive partners cannot be assigned' }, { status: 409 });
        }

        if (data!.serviceId) {
            const service = await PartnerService.findOne({
                _id: data!.serviceId,
                partnerId: data!.partnerId,
                isDeleted: false,
            });

            if (!service) {
                return NextResponse.json({ error: 'Partner service not found' }, { status: 404 });
            }

            if (!service.isActive) {
                return NextResponse.json({ error: 'Inactive partner services cannot be assigned' }, { status: 409 });
            }
        }

        const assignment = await BookingPartnerAssignment.create(data);
        return NextResponse.json({ assignment }, { status: 201 });
    } catch (error) { console.error(error); return NextResponse.json({ error: 'Internal server error' }, { status: 500 }); }
});
