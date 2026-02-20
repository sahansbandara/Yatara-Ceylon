import { NextResponse, type NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import SupportTicket from '@/models/SupportTicket';
import { validateBody } from '@/lib/validate';
import { createBookingSchema } from '@/lib/validations';
import { rateLimit } from '@/lib/rate-limit';

// Public booking request – no auth required
export async function POST(request: NextRequest) {
    const limitError = await rateLimit(request);
    if (limitError) return limitError;

    // Parse body
    const { data, error } = await validateBody(request, createBookingSchema);
    if (error) return error;

    try {
        await connectDB();
        const booking = await Booking.create({
            ...data,
            dates: { from: new Date(data!.dates.from), to: new Date(data!.dates.to) },
            status: 'NEW',
        });

        // Also create a support ticket for the booking
        await SupportTicket.create({
            customerName: data!.customerName,
            phone: data!.phone,
            email: data!.email,
            subject: `New Booking Request - ${booking.bookingNo}`,
            message: `New ${data!.type} booking request from ${data!.customerName}. Pax: ${data!.pax}. Dates: ${data!.dates.from} to ${data!.dates.to}.${data!.notes ? ` Notes: ${data!.notes}` : ''}`,
            bookingId: booking._id,
            status: 'OPEN',
        });

        return NextResponse.json({
            success: true,
            bookingNo: booking.bookingNo,
            bookingId: booking._id,
            message: 'Your booking request has been submitted. We will contact you shortly!',
        }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
