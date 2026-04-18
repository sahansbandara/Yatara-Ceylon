export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import Package from '@/models/Package';
import Destination from '@/models/Destination';
import Vehicle from '@/models/Vehicle';
import Partner from '@/models/Partner';
import User from '@/models/User';

interface SearchItem {
    _id: string;
    label: string;
    sublabel: string;
    href: string;
}

interface SearchResult {
    type: string;
    items: SearchItem[];
}

export async function GET(req: NextRequest) {
    const q = req.nextUrl.searchParams.get('q')?.trim();

    if (!q || q.length < 2) {
        return NextResponse.json({ results: [] });
    }

    try {
        await connectDB();
        const regex = new RegExp(q, 'i');

        // Run all searches in parallel
        const [bookings, packages, destinations, vehicles, partners, users] = await Promise.all([
            Booking.find({
                isDeleted: false,
                $or: [{ bookingNo: regex }, { customerName: regex }]
            })
                .limit(5)
                .select('bookingNo customerName')
                .lean(),
            Package.find({
                isDeleted: false,
                title: regex
            })
                .limit(5)
                .select('title slug')
                .lean(),
            Destination.find({
                isDeleted: false,
                title: regex
            })
                .limit(5)
                .select('title slug')
                .lean(),
            Vehicle.find({
                isDeleted: false,
                $or: [{ model: regex }, { plateNumber: regex }]
            })
                .limit(5)
                .select('model plateNumber brand')
                .lean(),
            Partner.find({
                isDeleted: false,
                $or: [{ name: regex }, { businessName: regex }]
            })
                .limit(5)
                .select('name businessName type')
                .lean(),
            User.find({
                isDeleted: false,
                $or: [{ name: regex }, { email: regex }]
            })
                .limit(5)
                .select('name email role')
                .lean(),
        ]);

        // Format results with proper types
        const results: SearchResult[] = [
            {
                type: 'Bookings',
                items: bookings.map((b: any) => ({
                    _id: b._id.toString(),
                    label: b.bookingNo,
                    sublabel: b.customerName || 'No customer',
                    href: `/dashboard/bookings/${b._id}`,
                })),
            },
            {
                type: 'Packages',
                items: packages.map((p: any) => ({
                    _id: p._id.toString(),
                    label: p.title,
                    sublabel: p.slug || '',
                    href: `/dashboard/packages/${p._id}`,
                })),
            },
            {
                type: 'Destinations',
                items: destinations.map((d: any) => ({
                    _id: d._id.toString(),
                    label: d.title,
                    sublabel: d.slug || '',
                    href: `/dashboard/destinations/${d._id}`,
                })),
            },
            {
                type: 'Vehicles',
                items: vehicles.map((v: any) => ({
                    _id: v._id.toString(),
                    label: `${v.brand || ''} ${v.model}`.trim(),
                    sublabel: v.plateNumber || 'No plate',
                    href: `/dashboard/vehicles/${v._id}`,
                })),
            },
            {
                type: 'Partners',
                items: partners.map((p: any) => ({
                    _id: p._id.toString(),
                    label: p.name || p.businessName || 'Unnamed',
                    sublabel: p.type || '',
                    href: `/dashboard/partners/${p._id}`,
                })),
            },
            {
                type: 'Users',
                items: users.map((u: any) => ({
                    _id: u._id.toString(),
                    label: u.name || 'Unnamed',
                    sublabel: `${u.email} · ${u.role}`,
                    href: `/dashboard/users/${u._id}`,
                })),
            },
        ].filter(group => group.items.length > 0);

        return NextResponse.json({ results });
    } catch (error) {
        console.error('Search API error:', error);
        return NextResponse.json({ results: [] }, { status: 500 });
    }
}
