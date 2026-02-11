import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Testimonial from '@/models/Testimonial';
import { staffOrAdmin } from '@/lib/rbac';
import { validateBody } from '@/lib/validate';
import { createTestimonialSchema, updateTestimonialSchema } from '@/lib/validations';

export async function GET(request: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const published = searchParams.get('published');
        const filter: Record<string, unknown> = { isDeleted: { $ne: true } };
        if (published === 'true') filter.isPublished = true;
        const testimonials = await Testimonial.find(filter).sort({ createdAt: -1 }).lean();
        return NextResponse.json({ testimonials });
    } catch (error) { console.error(error); return NextResponse.json({ error: 'Internal server error' }, { status: 500 }); }
}

export const POST = staffOrAdmin(async (request) => {
    const { data, error } = await validateBody(request, createTestimonialSchema);
    if (error) return error;
    try {
        await connectDB();
        const t = await Testimonial.create(data);
        return NextResponse.json({ testimonial: t }, { status: 201 });
    } catch (error) { console.error(error); return NextResponse.json({ error: 'Internal server error' }, { status: 500 }); }
});
