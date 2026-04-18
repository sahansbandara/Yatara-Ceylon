export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import CustomPlan from '@/models/CustomPlan';
import { validateBody } from '@/lib/validate';
import { createPlanSchema, updatePlanSchema } from '@/lib/validations';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';
import { withAuth } from '@/lib/rbac';

function canAccessPlan(plan: any, user: { role: string; userId: string; email: string }) {
    if (['ADMIN', 'STAFF'].includes(user.role)) return true;
    if (plan.userId?.toString?.() === user.userId) return true;
    if (plan.customerEmail && plan.customerEmail === user.email) return true;
    return false;
}

export const GET = withAuth(async (request, { user }) => {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const status = searchParams.get('status');
        const filter: Record<string, unknown> = { isDeleted: { $ne: true } };
        if (id) filter._id = id;
        if (status) filter.status = status;
        if (!['ADMIN', 'STAFF'].includes(user.role)) {
            filter.$or = [
                { userId: user.userId },
                { customerEmail: user.email },
            ];
        }
        const plans = await CustomPlan.find(filter).sort({ createdAt: -1 }).lean();

        if (id) {
            const plan = plans[0];
            if (!plan) {
                return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
            }

            return NextResponse.json({ plan });
        }

        return NextResponse.json({ plans });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
});

// Public – anyone can create a plan
export async function POST(request: Request) {
    const { data, error } = await validateBody(request, createPlanSchema);
    if (error) return error;
    try {
        await connectDB();
        const token = getTokenFromRequest(request);
        const payload = token ? await verifyToken(token) : null;
        const plan = await CustomPlan.create({
            ...data,
            userId: payload?.userId,
            customerEmail: data!.customerEmail || payload?.email,
        });
        return NextResponse.json({ plan }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export const PATCH = withAuth(async (request, { user }) => {
    const { data, error } = await validateBody(request, updatePlanSchema);
    if (error) return error;
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) {
            return NextResponse.json({ error: 'Plan id is required' }, { status: 400 });
        }

        const existingPlan = await CustomPlan.findOne({ _id: id, isDeleted: { $ne: true } });
        if (!existingPlan) {
            return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
        }
        if (!canAccessPlan(existingPlan, user)) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const update: Record<string, unknown> = { ...data };
        if (data?.customerEmail === '') {
            update.customerEmail = user.email;
        }

        const plan = await CustomPlan.findByIdAndUpdate(
            id,
            { $set: update },
            { new: true }
        );
        return NextResponse.json({ plan });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
});

export const DELETE = withAuth(async (request, { user }) => {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) {
            return NextResponse.json({ error: 'Plan id is required' }, { status: 400 });
        }

        const existingPlan = await CustomPlan.findOne({ _id: id, isDeleted: { $ne: true } });
        if (!existingPlan) {
            return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
        }
        if (!canAccessPlan(existingPlan, user)) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        await CustomPlan.findByIdAndUpdate(id, {
            $set: { isDeleted: true, deletedAt: new Date() },
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
});
