import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import DistrictPlace from '@/models/DistrictPlace';
import { staffOrAdmin } from '@/lib/rbac';
import { validateBody } from '@/lib/validate';
import { createPlaceSchema } from '@/lib/validations';

export async function GET(request: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const districtId = searchParams.get('districtId');
        const category = searchParams.get('category');
        const filter: Record<string, unknown> = { isActive: true };
        if (districtId) filter.districtId = districtId;
        if (category) filter.category = category;
        const places = await DistrictPlace.find(filter).populate('districtId', 'name').lean();
        return NextResponse.json({ places });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export const POST = staffOrAdmin(async (request) => {
    const { data, error } = await validateBody(request, createPlaceSchema);
    if (error) return error;
    try {
        await connectDB();
        const place = await DistrictPlace.create(data);
        return NextResponse.json({ place }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
});
