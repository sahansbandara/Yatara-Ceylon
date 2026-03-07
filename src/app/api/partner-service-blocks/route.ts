import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import PartnerServiceBlock from '@/models/PartnerServiceBlock';
import PartnerService from '@/models/PartnerService';
import Partner from '@/models/Partner';
import { withAuth } from '@/lib/rbac';
import { logAudit } from '@/lib/audit';

// POST block dates for a PartnerService (Hotel)
export const POST = withAuth(async (request, context) => {
    try {
        const body = await request.json();
        const { serviceId, from, to, reason } = body;

        if (!serviceId || !from || !to || !reason) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        await connectDB();

        const service = await PartnerService.findOne({ _id: serviceId, isDeleted: false });
        if (!service) return NextResponse.json({ error: 'Service not found' }, { status: 404 });

        const partner = await Partner.findOne({ _id: service.partnerId, isDeleted: false });
        if (!partner) return NextResponse.json({ error: 'Parent partner not found' }, { status: 404 });

        const userRole = context.user.role;
        if (userRole === 'HOTEL_OWNER') {
            if (partner.ownerId?.toString() !== context.user.userId) {
                return NextResponse.json({ error: 'Permission denied. Not your property.' }, { status: 403 });
            }
        } else if (!['ADMIN', 'STAFF'].includes(userRole)) {
            return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
        }

        // Safety verification: No overlap with existing blocks
        const overlap = await PartnerServiceBlock.findOne({
            serviceId: serviceId,
            from: { $lte: new Date(to) },
            to: { $gte: new Date(from) },
        });
        if (overlap) {
            return NextResponse.json({ error: 'Date range overlaps with existing block' }, { status: 409 });
        }

        // Verify no active Yatara Bookings collide
        const Booking = (await import('@/models/Booking')).default;
        const bookingOverlap = await Booking.findOne({
            assignedPartnerServiceId: serviceId, // Assuming they might use assignedPartnerServiceId
            isDeleted: false,
            status: { $in: ['CONFIRMED', 'ASSIGNED', 'IN_PROGRESS'] },
            'dates.start': { $lte: new Date(to) },
            'dates.end': { $gte: new Date(from) }
        });

        if (bookingOverlap) {
            return NextResponse.json({ error: 'Cannot block service. Active bookings exist for these dates.' }, { status: 409 });
        }

        const block = await PartnerServiceBlock.create({
            serviceId,
            from: new Date(from),
            to: new Date(to),
            reason
        });

        await logAudit({ actorUserId: context.user.userId, action: 'CREATE', entity: 'PartnerServiceBlock', entityId: block._id.toString() });

        return NextResponse.json({ block }, { status: 201 });
    } catch (error) { console.error(error); return NextResponse.json({ error: 'Internal server error' }, { status: 500 }); }
});
