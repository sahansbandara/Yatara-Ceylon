import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import CustomPlan from '@/models/CustomPlan';
import { validateBody } from '@/lib/validate';
import { createPlanSchema, updatePlanSchema } from '@/lib/validations';

export async function GET(request: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const filter: Record<string, unknown> = {};
        if (status) filter.status = status;
        const plans = await CustomPlan.find(filter).sort({ createdAt: -1 }).lean();
        return NextResponse.json({ plans });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// Public – anyone can create a plan
export async function POST(request: Request) {
    const { data, error } = await validateBody(request, createPlanSchema);
    if (error) return error;
    try {
        await connectDB();
        const plan = await CustomPlan.create(data);
        return NextResponse.json({ plan }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
