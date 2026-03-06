import { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import DestinationCard from '@/components/public/DestinationCard';
import DestinationsToolbar from '@/components/public/DestinationsToolbar';
import connectDB from '@/lib/mongodb';
import Destination from '@/models/Destination';
import { DESTINATIONS } from '@/data/destinations';
import { Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Destinations — Sri Lanka, Curated | Yatara Ceylon',
    description: 'Hand-selected destinations for high-comfort, high-authenticity luxury journeys across Sri Lanka. Browse by region, explore the interactive map, or inquire with our concierge.',
};

interface DestinationsPageProps {
    searchParams: Promise<{ region?: string; q?: string; sort?: string }>;
}

async function getDestinations(region?: string, q?: string) {
    await connectDB();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = { isPublished: true, isDeleted: false };

    if (region && region !== 'all') {
        // Match region case-insensitively
        const regionMap: Record<string, string> = {
            'hill-country': 'Hill Country',
            'cultural-triangle': 'Cultural Triangle',
            'south-coast': 'South Coast',
            'east-coast': 'East Coast',
            'north': 'North',
            'west-coast': 'West Coast',
            'colombo': 'Colombo',
            'wildlife': 'Wildlife',
            // Signature Region aliases (from bespoke tour builder)
            'tea-highlands': 'Hill Country',
            'wildlife-safari': 'Wildlife',
            'city-arrival': 'Colombo',
            'northern-heritage': 'North',
        };
        const mappedRegion = regionMap[region] || region;
        filter.region = { $regex: new RegExp(`^${mappedRegion}$`, 'i') };
    }

    if (q) {
        filter.$or = [
            { title: { $regex: q, $options: 'i' } },
            { location: { $regex: q, $options: 'i' } },
            { description: { $regex: q, $options: 'i' } },
        ];
    }

    const dbDestinations = await Destination.find(filter)
        .sort({ priority: -1, title: 1 })
        .lean();

    if (dbDestinations.length > 0) {
        return JSON.parse(JSON.stringify(dbDestinations));
    }

    // Fallback to static data if DB has no published destinations
    let fallback = [...DESTINATIONS];

    if (region && region !== 'all') {
        const regionMap: Record<string, string> = {
            'hill-country': 'Hill Country',
            'cultural-triangle': 'Cultural Triangle',
            'south-coast': 'South Coast',
            'east-coast': 'East Coast',
            'north': 'North',
            'west-coast': 'West Coast',
            'colombo': 'Colombo',
            'wildlife': 'Wildlife',
            'tea-highlands': 'Hill Country',
            'wildlife-safari': 'Wildlife',
            'city-arrival': 'Colombo',
            'northern-heritage': 'North',
        };
        const mappedRegion = regionMap[region] || region;
        fallback = fallback.filter(
            (d) => d.region.toLowerCase() === mappedRegion.toLowerCase()
        );
    }

    if (q) {
        const search = q.toLowerCase();
        fallback = fallback.filter(
            (d) =>
                d.title.toLowerCase().includes(search) ||
                d.location.toLowerCase().includes(search) ||
                d.description.toLowerCase().includes(search)
        );
    }

    return fallback;
}

// Concierge picks — first 5 "iconic" destinations
const CONCIERGE_SLUGS = ['ella', 'sigiriya', 'galle', 'kandy', 'yala'];

export default async function DestinationsPage({ searchParams }: DestinationsPageProps) {
    const { region, q } = await searchParams;
    const destinations = await getDestinations(region, q);
    const hasFilters = !!region || !!q;

    // Get concierge picks from full list (only show when not filtering)
    const conciergePicks = !hasFilters
        ? DESTINATIONS.filter((d) => CONCIERGE_SLUGS.includes(d.slug))
        : [];

    return (
        <div className="min-h-screen bg-[#f8f7f4] pt-28 pb-24">
            {/* Hero — Short, confident */}
            <div className="relative overflow-hidden mb-4">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 py-12 md:py-16">
                    <div className="max-w-3xl">
                        <span className="inline-block py-1.5 px-5 text-[10px] tracking-[0.35em] uppercase font-medium text-[#D4AF37] border border-[#D4AF37]/25 rounded-full mb-6 bg-[#D4AF37]/[0.04]">
                            Curated Destinations
                        </span>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#043927] mb-5 leading-[1.1] tracking-tight">
                            Sri Lanka, <span className="italic font-light text-[#D4AF37]">Curated.</span>
                        </h1>
                        <p className="text-gray-500 text-base md:text-lg font-light leading-relaxed max-w-xl mb-8">
                            Hand-selected destinations for high-comfort, high-authenticity journeys.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <Link
                                href="/inquire"
                                className="inline-flex items-center px-7 py-3 bg-[#043927] text-white text-[11px] tracking-[0.18em] uppercase font-medium rounded-full hover:bg-[#043927]/90 transition-all duration-300 shadow-md"
                            >
                                Inquire
                            </Link>
                            <Link
                                href="/build-tour"
                                className="inline-flex items-center px-7 py-3 border border-[#043927]/20 text-[#043927] text-[11px] tracking-[0.18em] uppercase font-medium rounded-full hover:bg-[#043927]/5 transition-all duration-300"
                            >
                                Build a Bespoke Tour
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8">
                {/* Toolbar */}
                <Suspense fallback={<div className="h-16 rounded-2xl bg-[#043927]/5 animate-pulse mb-10" />}>
                    <DestinationsToolbar />
                </Suspense>

                {/* Concierge Picks Row */}
                {conciergePicks.length > 0 && (
                    <div className="mb-14">
                        <div className="flex items-center gap-3 mb-6">
                            <Sparkles className="h-4 w-4 text-[#D4AF37]" />
                            <h2 className="text-sm tracking-[0.2em] uppercase text-[#043927]/60 font-medium">
                                Concierge Picks
                            </h2>
                            <div className="flex-1 h-px bg-gradient-to-r from-[#D4AF37]/20 to-transparent" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
                            {conciergePicks.map((dest) => (
                                <DestinationCard key={dest._id} destination={dest} variant="featured" />
                            ))}
                        </div>
                    </div>
                )}

                {/* Results count */}
                {hasFilters && (
                    <p className="text-[12px] tracking-[0.15em] uppercase text-gray-400 mb-6">
                        {destinations.length} destination{destinations.length !== 1 ? 's' : ''} found
                        {region && ` in ${region.replace(/-/g, ' ')}`}
                        {q && ` matching "${q}"`}
                    </p>
                )}

                {/* Main Destinations Grid */}
                {destinations.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-7">
                        {destinations.map((dest: any) => (
                            <DestinationCard key={dest._id || dest.slug} destination={dest} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="liquid-glass-toolbar rounded-2xl p-10 max-w-lg mx-auto">
                            <p className="text-white/60 text-sm tracking-wide mb-4">No destinations match your criteria.</p>
                            <Link
                                href="/destinations"
                                className="inline-flex items-center px-6 py-2.5 bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] text-[11px] tracking-[0.15em] uppercase rounded-full hover:bg-[#D4AF37]/25 transition-all duration-300"
                            >
                                View All Destinations
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
