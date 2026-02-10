import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import FAQ from '@/models/FAQ';
import { staffOrAdmin } from '@/lib/rbac';
import { validateBody } from '@/lib/validate';
import { createFAQSchema, updateFAQSchema } from '@/lib/validations';

export async function GET(request: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const published = searchParams.get('published');
        const filter: Record<string, unknown> = { isDeleted: { $ne: true } };
        if (published === 'true') filter.isPublished = true;
        const faqs = await FAQ.find(filter).sort({ createdAt: -1 }).lean();
        return NextResponse.json({ faqs });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export const POST = staffOrAdmin(async (request) => {
    const { data, error } = await validateBody(request, createFAQSchema);
    if (error) return error;
    try {
        await connectDB();
        const faq = await FAQ.create(data);
        return NextResponse.json({ faq }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
});
