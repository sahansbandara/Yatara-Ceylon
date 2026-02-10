import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import { staffOrAdmin } from '@/lib/rbac';
import { validateBody } from '@/lib/validate';
import { updateBookingStatusSchema, assignBookingSchema } from '@/lib/validations';
import { logAudit } from '@/lib/audit';
import { generateWhatsAppLink } from '@/lib/whatsapp';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await params;
        const booking = await Booking.findOne({ _id: id, isDeleted: false })
            .populate('packageId', 'title slug priceMin priceMax')
            .populate('assignedStaffId', 'name email')
            .populate('assignedVehicleId', 'model type plateNumber')
            .lean();
        if (!booking) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        // Generate WhatsApp link
        const bookingAny = booking as any;
        const whatsAppLink = generateWhatsAppLink(
            process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '',
            {
                customerName: bookingAny.customerName,
                customerPhone: bookingAny.phone,
                packageName: (bookingAny.packageId as { title?: string })?.title,
                dates: bookingAny.dates ? { from: bookingAny.dates.from.toISOString().split('T')[0], to: bookingAny.dates.to.toISOString().split('T')[0] } : undefined,
                pax: bookingAny.pax,
                pickupLocation: bookingAny.pickupLocation,
            }
        );

        return NextResponse.json({ booking, whatsAppLink });
    } catch (error) { console.error(error); return NextResponse.json({ error: 'Internal server error' }, { status: 500 }); }
}

export const PATCH = staffOrAdmin(async (request, context) => {
    try {
        await connectDB();
        const { id } = await context.params;
        const body = await request.json();

        // Status update
        if (body.status) {
            const result = updateBookingStatusSchema.safeParse(body);
            if (!result.success) return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
            const booking = await Booking.findOneAndUpdate(
                { _id: id, isDeleted: false },
                { $set: { status: result.data.status } },
                { new: true }
            );
            if (!booking) return NextResponse.json({ error: 'Not found' }, { status: 404 });
            await logAudit({ actorUserId: context.user.userId, action: 'STATUS_CHANGE', entity: 'Booking', entityId: id, meta: { status: result.data.status } });
            return NextResponse.json({ booking });
        }

        // Assignment update
        if (body.assignedStaffId !== undefined || body.assignedVehicleId !== undefined) {
            const result = assignBookingSchema.safeParse(body);
            if (!result.success) return NextResponse.json({ error: 'Invalid assignment' }, { status: 400 });
            const update: Record<string, unknown> = {};
            if (result.data.assignedStaffId) update.assignedStaffId = result.data.assignedStaffId;
            if (result.data.assignedVehicleId) update.assignedVehicleId = result.data.assignedVehicleId;
            const booking = await Booking.findOneAndUpdate(
                { _id: id, isDeleted: false },
                { $set: update },
                { new: true }
            );
            if (!booking) return NextResponse.json({ error: 'Not found' }, { status: 404 });
            await logAudit({ actorUserId: context.user.userId, action: 'ASSIGN', entity: 'Booking', entityId: id, meta: update });
            return NextResponse.json({ booking });
        }

        // General update
        const booking = await Booking.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { $set: body },
            { new: true }
        );
        if (!booking) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json({ booking });
    } catch (error) { console.error(error); return NextResponse.json({ error: 'Internal server error' }, { status: 500 }); }
});

export const DELETE = staffOrAdmin(async (_req, context) => {
    try {
        await connectDB();
        const { id } = await context.params;
        await Booking.findByIdAndUpdate(id, { $set: { isDeleted: true, deletedAt: new Date() } });
        await logAudit({ actorUserId: context.user.userId, action: 'DELETE', entity: 'Booking', entityId: id });
        return NextResponse.json({ success: true });
    } catch (error) { console.error(error); return NextResponse.json({ error: 'Internal server error' }, { status: 500 }); }
});
