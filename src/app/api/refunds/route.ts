import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import RefundRequest from '@/models/RefundRequest';
import Booking from '@/models/Booking'; // Ensure Booking model is loaded
import User from '@/models/User'; // Ensure User model is loaded
import { withAuth } from '@/lib/rbac';

export const dynamic = 'force-dynamic';

// GET /api/refunds
export const GET = withAuth(async (req, context) => {
    try {
        await connectDB();
        
        // Ensure user belongs to STAFF or ADMIN
        if (!['STAFF', 'ADMIN'].includes(context.user.role)) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const url = new URL(req.url);
        const status = url.searchParams.get('status');

        const query: any = {};
        if (status) query.status = status;

        const refunds = await RefundRequest.find(query)
            .populate('bookingId', 'bookingNo status type dates totalCost paidAmount')
            .populate('customerId', 'name email phone')
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json(refunds);
    } catch (error) {
        console.error("Fetch refunds API error:", error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
});
