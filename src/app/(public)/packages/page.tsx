import { Metadata } from 'next';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import connectDB from '@/lib/mongodb';
import Package from '@/models/Package';
import JourneysGrid from '@/components/public/JourneysGrid';
import PackagesHero from './_components/PackagesHero';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Curated Journeys | Yatara Ceylon',
    description: 'Explore our complete collection of Sri Lanka luxury itineraries. Handcrafted journeys designed around pace, privacy, and purpose.',
};

async function getJourneys() {
    try {
        await connectDB();
        const packages = await Package.find({
            isPublished: true,
            isDeleted: { $ne: true },
            type: { $ne: 'transfer' },
            $or: [{ type: 'journey' }, { type: { $exists: false } }],
        })
            .sort({ isFeatured: -1, homeRank: -1, createdAt: -1 })
            .lean();

        // Filter out broken/placeholder items (price <= 5 USD is suspicious)
        const filtered = (packages || []).filter((p: any) => p.priceMin > 500 || p.priceMax > 500);
        return JSON.parse(JSON.stringify(filtered));
    } catch {
        return [];
    }
}

export default async function PackagesPage({
    searchParams,
}: {
    searchParams: Promise<{ style?: string; duration?: string; featured?: string }>;
}) {
    const params = await searchParams;
    const packages = await getJourneys();

    return (
        <main className="min-h-screen bg-off-white">
            <PackagesHero packageCount={packages.length} />

            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative z-20">
                {/* Client-side filterable grid */}
                <JourneysGrid
                    packages={packages}
                    initialStyle={params?.style || ''}
                    initialDuration={params?.duration || ''}
                />

                {/* Concierge CTA */}
                <div className="mt-8 p-10 md:p-14 rounded-2xl bg-deep-emerald relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-deep-emerald via-deep-emerald/95 to-deep-emerald/80" />
                    <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-antique-gold/[0.06] rounded-full blur-3xl" />
                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <Sparkles className="w-4 h-4 text-antique-gold" />
                                <span className="text-[11px] tracking-[0.25em] uppercase text-antique-gold font-medium">Concierge Service</span>
                            </div>
                            <h3 className="text-2xl md:text-3xl font-display text-white mb-3">
                                Design Your Journey
                            </h3>
                            <p className="text-white/60 font-light text-sm max-w-md leading-relaxed">
                                Tell us your dates, pace, and interests. Our travel designers craft a bespoke itinerary with private guiding, boutique stays, and concierge-level timing.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                href="/build-tour"
                                className="inline-flex items-center gap-2.5 px-8 py-4 bg-antique-gold text-deep-emerald hover:bg-white text-[11px] tracking-[0.2em] uppercase font-semibold rounded-full transition-all duration-300 shrink-0"
                            >
                                <Sparkles className="w-3.5 h-3.5" />
                                Design My Trip
                            </Link>
                            <Link
                                href="/inquire"
                                className="inline-flex items-center gap-2.5 px-8 py-4 border border-white/20 text-white hover:bg-white/10 text-[11px] tracking-[0.2em] uppercase font-semibold rounded-full transition-all duration-300 shrink-0"
                            >
                                Request a Proposal
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
