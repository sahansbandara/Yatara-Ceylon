export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Package from '@/models/Package';
import Vehicle from '@/models/Vehicle';
import Booking from '@/models/Booking';

export async function GET(request: Request) {
    try {
        const session = await getSessionUser();
        
        if (!session || session.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const [users, packages, vehicles, bookings] = await Promise.all([
            User.find({ isDeleted: true }).lean(),
            Package.find({ isDeleted: true }).lean(),
            Vehicle.find({ isDeleted: true }).lean(),
            Booking.find({ isDeleted: true }).lean()
        ]);

        const archivedItems = [
            ...users.map((item: any) => ({ ...item, collectionName: 'Users' })),
            ...packages.map((item: any) => ({ ...item, collectionName: 'Packages' })),
            ...vehicles.map((item: any) => ({ ...item, collectionName: 'Vehicles' })),
            ...bookings.map((item: any) => ({ ...item, collectionName: 'Bookings' }))
        ].sort((a, b) => {
            const dateA = new Date(a.deletedAt || a.updatedAt).getTime();
            const dateB = new Date(b.deletedAt || b.updatedAt).getTime();
            return dateB - dateA; // Newest first
        });

        return NextResponse.json({ items: archivedItems });
    } catch (error) {
        console.error('Error fetching archive:', error);
        return NextResponse.json({ error: 'Failed to fetch archived items' }, { status: 500 });
    }
}
