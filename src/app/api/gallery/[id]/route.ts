import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import GalleryPost from '@/models/GalleryPost';
import { staffOrAdmin } from '@/lib/rbac';
import { validateBody } from '@/lib/validate';
import { updateGallerySchema } from '@/lib/validations';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    try { await connectDB(); const { id } = await params; const p = await GalleryPost.findById(id).lean(); if (!p) return NextResponse.json({ error: 'Not found' }, { status: 404 }); return NextResponse.json({ post: p }); }
    catch (error) { console.error(error); return NextResponse.json({ error: 'Internal server error' }, { status: 500 }); }
}

export const PATCH = staffOrAdmin(async (request, context) => {
    const { data, error } = await validateBody(request, updateGallerySchema);
    if (error) return error;
    try { await connectDB(); const { id } = await context.params; const p = await GalleryPost.findByIdAndUpdate(id, { $set: data }, { new: true }); if (!p) return NextResponse.json({ error: 'Not found' }, { status: 404 }); return NextResponse.json({ post: p }); }
    catch (error) { console.error(error); return NextResponse.json({ error: 'Internal server error' }, { status: 500 }); }
});

export const DELETE = staffOrAdmin(async (_req, context) => {
    try { await connectDB(); const { id } = await context.params; await GalleryPost.findByIdAndDelete(id); return NextResponse.json({ success: true }); }
    catch (error) { console.error(error); return NextResponse.json({ error: 'Internal server error' }, { status: 500 }); }
});
