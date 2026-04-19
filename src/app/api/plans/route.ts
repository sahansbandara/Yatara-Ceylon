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

// Only normal users can create and save plans
export const POST = withAuth(async (request, { user }) => {
    const { data, error } = await validateBody(request, createPlanSchema);
    if (error) return error;

    try {
        await connectDB();

        if (user.role !== 'USER') {
            return NextResponse.json({ error: 'Only regular users can save plans' }, { status: 403 });
        }

        const plan = await CustomPlan.create({
            ...data,
            userId: user.userId,
            customerEmail: data?.customerEmail || user.email,
        });

        return NextResponse.json({ plan }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
});

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

        // If the plan was previously submitted, reset proposal flags
        // so the user can re-submit after modifying
        if (existingPlan.isProposalRequested || existingPlan.status === 'SUBMITTED') {
            update.isProposalRequested = false;
            update.status = 'DRAFT';
            update.linkedBookingId = null;
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

        // Block deletion of plans with active proposals
        if (existingPlan.status === 'SUBMITTED' || existingPlan.isProposalRequested) {
            return NextResponse.json({ error: 'Cannot delete a plan with an active proposal. Please contact support if you need to cancel.' }, { status: 400 });
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
