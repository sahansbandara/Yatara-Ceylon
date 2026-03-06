import { NextResponse, type NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import PartnerRequest from '@/models/PartnerRequest';
import User from '@/models/User';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const resolvedParams = await context.params;

        const token = getTokenFromRequest(request);
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyToken(token);
        if (!payload || (payload.role !== 'ADMIN' && payload.role !== 'STAFF')) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { status } = await request.json();

        if (!['APPROVED', 'REJECTED'].includes(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
        }

        await connectDB();

        const partnerRequest = await PartnerRequest.findById(resolvedParams.id);
        if (!partnerRequest) {
            return NextResponse.json({ error: 'Request not found' }, { status: 404 });
        }

        // If the admin is approving it, we elevate the user account explicitly.
        if (status === 'APPROVED' && partnerRequest.status !== 'APPROVED') {
            await User.findByIdAndUpdate(partnerRequest.userId, {
                role: partnerRequest.requestType
            });
        }

        // Apply updated state to Request model
        partnerRequest.status = status;
        await partnerRequest.save();

        return NextResponse.json({
            success: true,
            data: partnerRequest
        });

    } catch (error: any) {
        console.error('Partner request update error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
