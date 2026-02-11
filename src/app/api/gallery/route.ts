import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import GalleryPost from '@/models/GalleryPost';
import { staffOrAdmin } from '@/lib/rbac';
import { validateBody } from '@/lib/validate';
import { createGallerySchema, updateGallerySchema } from '@/lib/validations';

export async function GET(request: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const published = searchParams.get('published');
        const type = searchParams.get('type');
        const filter: Record<string, unknown> = { isDeleted: { $ne: true } };
        if (published === 'true') filter.isPublished = true;
        if (type) filter.type = type;
        const posts = await GalleryPost.find(filter).sort({ createdAt: -1 }).lean();
        return NextResponse.json({ posts });
    } catch (error) { console.error(error); return NextResponse.json({ error: 'Internal server error' }, { status: 500 }); }
}

export const POST = staffOrAdmin(async (request) => {
    const { data, error } = await validateBody(request, createGallerySchema);
    if (error) return error;
    try {
        await connectDB();
        const post = await GalleryPost.create(data);
        return NextResponse.json({ post }, { status: 201 });
    } catch (error) { console.error(error); return NextResponse.json({ error: 'Internal server error' }, { status: 500 }); }
});
