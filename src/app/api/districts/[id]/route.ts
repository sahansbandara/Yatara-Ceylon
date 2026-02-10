import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import District from '@/models/District';
import DistrictPlace from '@/models/DistrictPlace';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await params;
        const district = await District.findById(id).lean();
        if (!district) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        const places = await DistrictPlace.find({ districtId: id, isActive: true }).lean();
        return NextResponse.json({ district, places });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
