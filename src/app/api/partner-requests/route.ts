import { NextResponse, type NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import PartnerRequest from '@/models/PartnerRequest';
import User from '@/models/User';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        const token = getTokenFromRequest(request);
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyToken(token);
        if (!payload) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const body = await request.json();
        const { requestType, businessName, contactNumber, verificationLink, vehicleDetails, hotelDetails, documents } = body;

        if (!requestType || !['VEHICLE_OWNER', 'HOTEL_OWNER'].includes(requestType)) {
            return NextResponse.json({ error: 'Invalid request type. Must be VEHICLE_OWNER or HOTEL_OWNER' }, { status: 400 });
        }

        if (!businessName || !contactNumber) {
            return NextResponse.json({ error: 'Business Name and Contact Number are required' }, { status: 400 });
        }

        await connectDB();

        // Optional: Check if a pending request already exists for this user to prevent spam
        const existingRequest = await PartnerRequest.findOne({ userId: payload.userId, status: 'PENDING' });
        if (existingRequest) {
            return NextResponse.json({ error: 'You already have a pending partner request. Please wait for an administrator to review it.' }, { status: 400 });
        }

        const newRequest = await PartnerRequest.create({
            userId: payload.userId,
            requestType,
            status: 'PENDING',
            businessName,
            contactNumber,
            verificationLink,
            vehicleDetails,
            hotelDetails,
            documents
        });

        return NextResponse.json({
            success: true,
            data: newRequest
        }, { status: 201 });

    } catch (error: any) {
        console.error('Partner request creation error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const token = getTokenFromRequest(request);
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyToken(token);
        // Only admins and staff can see the pool of requests
        if (!payload || (payload.role !== 'ADMIN' && payload.role !== 'STAFF')) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        await connectDB();

        // Return latest requests first
        const requests = await PartnerRequest.find()
            .populate('userId', 'name email avatar phone')
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({
            success: true,
            data: requests
        });

    } catch (error: any) {
        console.error('Partner request fetch error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
