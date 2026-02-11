import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Package from '@/models/Package';
import { withAuth, staffOrAdmin } from '@/lib/rbac';
import { validateBody } from '@/lib/validate';
import { createPackageSchema, updatePackageSchema } from '@/lib/validations';
import slugify from 'slugify';
import { logAudit } from '@/lib/audit';

// GET /api/packages – list packages (public: published only, dashboard: all)
export async function GET(request: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const published = searchParams.get('published');
        const tag = searchParams.get('tag');
        const search = searchParams.get('search');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');

        const filter: Record<string, unknown> = { isDeleted: false };
        if (published === 'true') filter.isPublished = true;
        if (tag) filter.tags = tag;
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { summary: { $regex: search, $options: 'i' } },
                { tags: { $regex: search, $options: 'i' } },
            ];
        }

        const [packages, total] = await Promise.all([
            Package.find(filter)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),
            Package.countDocuments(filter),
        ]);

        return NextResponse.json({ packages, total, page, totalPages: Math.ceil(total / limit) });
    } catch (error) {
        console.error('GET /api/packages error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST /api/packages – create package (auth required)
export const POST = staffOrAdmin(async (request, { user }) => {
    const { data, error } = await validateBody(request, createPackageSchema);
    if (error) return error;

    try {
        await connectDB();
        const slug = slugify(data!.title, { lower: true, strict: true });

        // Check unique slug
        const existing = await Package.findOne({ slug });
        const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

        const pkg = await Package.create({
            ...data,
            slug: finalSlug,
        });

        await logAudit({ actorUserId: user.userId, action: 'CREATE', entity: 'Package', entityId: pkg._id.toString() });

        return NextResponse.json({ package: pkg }, { status: 201 });
    } catch (error) {
        console.error('POST /api/packages error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
});
