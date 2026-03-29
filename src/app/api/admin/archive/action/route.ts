export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Package from '@/models/Package';
import Vehicle from '@/models/Vehicle';
import Booking from '@/models/Booking';

const modelMap: Record<string, any> = {
    Users: User,
    Packages: Package,
    Vehicles: Vehicle,
    Bookings: Booking,
};

export async function POST(request: Request) {
    try {
        const session = await getSessionUser();
        
        if (!session || session.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id, collectionName, action } = await request.json();

        if (!id || !collectionName || !action) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const Model = modelMap[collectionName];
        if (!Model) {
            return NextResponse.json({ error: 'Invalid collection' }, { status: 400 });
        }

        await connectDB();

        if (action === 'restore') {
            await Model.findByIdAndUpdate(id, { $set: { isDeleted: false }, $unset: { deletedAt: "" } });
            return NextResponse.json({ success: true, message: 'Item restored successfully' });
        } else if (action === 'delete') {
            await Model.findByIdAndDelete(id);
            return NextResponse.json({ success: true, message: 'Item permanently deleted' });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error) {
        console.error('Error processing archive action:', error);
        return NextResponse.json({ error: 'Failed to process action' }, { status: 500 });
    }
}
