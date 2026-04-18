export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import { staffOrAdmin } from '@/lib/rbac';
import { generateWhatsAppLink } from '@/lib/whatsapp';

// GET /api/bookings/[id]/whatsapp – protected concierge shortcut for operators
export const GET = staffOrAdmin(async (_request, context) => {
    try {
        await connectDB();
        const { id } = await context.params;
        const booking = await Booking.findOne({ _id: id, isDeleted: false })
            .populate('packageId', 'title')
            .lean();

        if (!booking) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        }

        const configuredNumber =
            process.env.WHATSAPP_NUMBER ||
            process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ||
            '';

        const bookingAny = booking as any;

        if (!configuredNumber) {
            return NextResponse.json({
                configured: false,
                whatsAppLink: null,
                messagePreview: null,
            });
        }

        const messageData = {
            customerName: bookingAny.customerName,
            customerPhone: bookingAny.phone,
            packageName: (bookingAny.packageId as { title?: string } | null)?.title,
            dates: bookingAny.dates
                ? {
                    from: bookingAny.dates.from.toISOString().split('T')[0],
                    to: bookingAny.dates.to.toISOString().split('T')[0],
                }
                : undefined,
            pax: bookingAny.pax,
            pickupLocation: bookingAny.pickupLocation,
        };

        return NextResponse.json({
            configured: true,
            whatsAppLink: generateWhatsAppLink(configuredNumber, messageData),
            messagePreview: messageData,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
});
