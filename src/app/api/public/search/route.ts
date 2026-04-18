export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Package from '@/models/Package';
import Destination from '@/models/Destination';

export async function GET(req: NextRequest) {
    const q = req.nextUrl.searchParams.get('q')?.trim();

    if (!q || q.length < 1) {
        return NextResponse.json({ results: [] });
    }

    try {
        await connectDB();
        const regex = new RegExp(q, 'i');

        const [packages, destinations] = await Promise.all([
            Package.find({
                isDeleted: { $ne: true },
                isPublished: true,
                type: { $ne: 'transfer' },
                $or: [{ title: regex }, { summary: regex }, { tags: regex }],
            })
                .limit(5)
                .select('title slug summary style')
                .lean(),
            Destination.find({
                isDeleted: { $ne: true },
                isPublished: true,
                $or: [{ title: regex }, { description: regex }, { region: regex }],
            })
                .limit(5)
                .select('title slug description shortTagline')
                .lean(),
        ]);

        const results = [
            {
                type: 'Destinations',
                items: destinations.map((d: any) => ({
                    id: d._id.toString(),
                    title: d.title,
                    description: d.shortTagline || d.description || 'Discover this destination',
                    href: `/destinations/${d.slug}`,
                    type: 'destination',
                })),
            },
            {
                type: 'Journeys',
                items: packages.map((p: any) => ({
                    id: p._id.toString(),
                    title: p.title,
                    description: p.summary || 'Explore this curated journey',
                    href: `/packages/${p.slug}`,
                    type: 'journey',
                })),
            },
        ].filter((g) => g.items.length > 0);

        return NextResponse.json({ results });
    } catch (error) {
        console.error('API Search Error:', error);
        return NextResponse.json({ results: [] }, { status: 500 });
    }
}
