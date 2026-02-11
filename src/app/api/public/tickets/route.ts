import { NextResponse, type NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import SupportTicket from '@/models/SupportTicket';
import { validateBody } from '@/lib/validate';
import { createTicketSchema } from '@/lib/validations';
import { rateLimit } from '@/lib/rate-limit';

// Public ticket submission – no auth required
export async function POST(request: NextRequest) {
    const limitError = await rateLimit(request);
    if (limitError) return limitError;

    // Parse body manually since validateBody consumes the stream
    // Actually validateBody clones it? Let's check validateBody.
    // validateBody takes Request and returns parsed data.
    // Standard Request can be read multiple times if cloned, but let's see.
    // validateBody implementation matters.
    const { data, error } = await validateBody(request, createTicketSchema);
    if (error) return error;
    try {
        await connectDB();
        const ticket = await SupportTicket.create(data);
        return NextResponse.json({
            success: true,
            message: 'Your support ticket has been created. We will get back to you soon!',
        }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
