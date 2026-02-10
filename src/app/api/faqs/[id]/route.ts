import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import FAQ from '@/models/FAQ';
import { staffOrAdmin } from '@/lib/rbac';
import { validateBody } from '@/lib/validate';
import { updateFAQSchema } from '@/lib/validations';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await params;
        const faq = await FAQ.findById(id).lean();
        if (!faq) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json({ faq });
    } catch (error) { console.error(error); return NextResponse.json({ error: 'Internal server error' }, { status: 500 }); }
}

export const PATCH = staffOrAdmin(async (request, context) => {
    const { data, error } = await validateBody(request, updateFAQSchema);
    if (error) return error;
    try {
        await connectDB();
        const { id } = await context.params;
        const faq = await FAQ.findByIdAndUpdate(id, { $set: data }, { new: true });
        if (!faq) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json({ faq });
    } catch (error) { console.error(error); return NextResponse.json({ error: 'Internal server error' }, { status: 500 }); }
});

export const DELETE = staffOrAdmin(async (_req, context) => {
    try {
        await connectDB();
        const { id } = await context.params;
        await FAQ.findByIdAndDelete(id);
        return NextResponse.json({ success: true });
    } catch (error) { console.error(error); return NextResponse.json({ error: 'Internal server error' }, { status: 500 }); }
});
