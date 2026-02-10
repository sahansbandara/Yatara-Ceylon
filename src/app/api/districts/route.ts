import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import District from '@/models/District';

export async function GET() {
    try {
        await connectDB();
        const districts = await District.find({}).sort({ name: 1 }).lean();
        return NextResponse.json({ districts });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
