import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Testimonial from '@/models/Testimonial';
import { staffOrAdmin } from '@/lib/rbac';
import { validateBody } from '@/lib/validate';
import { updateTestimonialSchema } from '@/lib/validations';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    try { await connectDB(); const { id } = await params; const t = await Testimonial.findById(id).lean(); if (!t) return NextResponse.json({ error: 'Not found' }, { status: 404 }); return NextResponse.json({ testimonial: t }); }
    catch (error) { console.error(error); return NextResponse.json({ error: 'Internal server error' }, { status: 500 }); }
}

export const PATCH = staffOrAdmin(async (request, context) => {
    const { data, error } = await validateBody(request, updateTestimonialSchema);
    if (error) return error;
    try { await connectDB(); const { id } = await context.params; const t = await Testimonial.findByIdAndUpdate(id, { $set: data }, { new: true }); if (!t) return NextResponse.json({ error: 'Not found' }, { status: 404 }); return NextResponse.json({ testimonial: t }); }
    catch (error) { console.error(error); return NextResponse.json({ error: 'Internal server error' }, { status: 500 }); }
});

export const DELETE = staffOrAdmin(async (_req, context) => {
    try { await connectDB(); const { id } = await context.params; await Testimonial.findByIdAndDelete(id); return NextResponse.json({ success: true }); }
    catch (error) { console.error(error); return NextResponse.json({ error: 'Internal server error' }, { status: 500 }); }
});
