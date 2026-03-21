import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Package from '@/models/Package';
import { NEW_PACKAGES } from '@/lib/new-packages-data';

// Existing 8 packages with isFeaturedHome/homeRank (updating existing records)
const EXISTING_UPDATES: Record<string, { isFeaturedHome: boolean; homeRank: number }> = {
    'ceylon-grand-circuit': { isFeaturedHome: true, homeRank: 1 },
    'hill-country-tea-rail-retreat': { isFeaturedHome: true, homeRank: 4 },
    'heritage-triangle-private-edition': { isFeaturedHome: true, homeRank: 6 },
    'wildlife-coastal-luxe': { isFeaturedHome: true, homeRank: 3 },
    'ayurveda-wellness-sanctuary': { isFeaturedHome: false, homeRank: 0 },
    'honeymoon-private-villa-experiences': { isFeaturedHome: true, homeRank: 5 },
    'east-coast-summer-escape': { isFeaturedHome: false, homeRank: 0 },
    'ramayana-trail-deluxe': { isFeaturedHome: false, homeRank: 0 },
};

// GET /api/seed-packages – seed 12 new packages + update existing 8
export async function GET() {
    try {
        await connectDB();
        const results: string[] = [];

        // Update existing packages with isFeaturedHome/homeRank
        for (const [slug, updates] of Object.entries(EXISTING_UPDATES)) {
            const existing = await Package.findOne({ slug });
            if (existing) {
                await Package.findOneAndUpdate({ slug }, { $set: updates });
                results.push(`Updated featured flags: ${slug}`);
            }
        }

        // Create or update 12 new packages
        for (const pkg of NEW_PACKAGES) {
            const existing = await Package.findOne({ slug: pkg.slug });
            if (existing) {
                await Package.findOneAndUpdate({ slug: pkg.slug }, { $set: pkg });
                results.push(`Updated: ${pkg.title}`);
            } else {
                await Package.create(pkg);
                results.push(`Created: ${pkg.title}`);
            }
        }

        return NextResponse.json({
            success: true,
            message: `Processed ${results.length} packages`,
            results,
        });
    } catch (error) {
        console.error('Seed error:', error);
        return NextResponse.json({ error: 'Seed failed', details: String(error) }, { status: 500 });
    }
}
