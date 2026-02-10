import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import AuditLog from '@/models/AuditLog';
import { adminOnly } from '@/lib/rbac';

export const GET = adminOnly(async (request, context) => {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const entity = searchParams.get('entity');
        const action = searchParams.get('action');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');

        const filter: Record<string, unknown> = {};
        if (entity) filter.entity = entity;
        if (action) filter.action = action;

        const [logs, total] = await Promise.all([
            AuditLog.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
            AuditLog.countDocuments(filter),
        ]);

        return NextResponse.json({ logs, total, page, totalPages: Math.ceil(total / limit) });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
});
