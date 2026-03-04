import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Clock, Sparkles } from 'lucide-react';
import connectDB from '@/lib/mongodb';
import Package from '@/models/Package';
import PackagePriceDisplay from '@/components/public/PackagePriceDisplay';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Signature Journeys | Yatara Ceylon',
    description: 'Explore our curated collection of Sri Lanka luxury itineraries. Handcrafted journeys designed around pace, privacy, and purpose.',
};

async function getPackages() {
    try {
        await connectDB();
        const packages = await Package.find({ isPublished: true, isDeleted: false })
            .sort({ createdAt: -1 })
            .lean();
        return JSON.parse(JSON.stringify(packages || []));
    } catch {
        return [];
    }
}


const themeChips = ['All', 'Wildlife', 'Hill Country', 'Family', 'Beach', 'Heritage', 'Wellness', 'Luxury', 'Culture', 'Marine'];

export default async function PackagesPage() {
    const packages = await getPackages();

    return (
        <div className="min-h-screen bg-off-white pt-32 pb-24">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                {/* Header */}
                <div className="mb-16 max-w-3xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <span className="inline-block py-1.5 px-5 text-[11px] tracking-[0.25em] uppercase font-medium text-antique-gold border border-antique-gold/30 mb-8 bg-deep-emerald/5">
                        Curated Itineraries
                    </span>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-display text-deep-emerald mb-6 leading-[1.1]">
                        Signature <span className="italic font-light">Journeys</span>
                    </h1>
                    <p className="text-gray-500 text-lg font-light leading-relaxed max-w-2xl">
                        Handcrafted luxury itineraries for the discerning traveler. Each journey is meticulously designed to unveil the authentic soul of Ceylon with private guides and elite comforts.
                    </p>
                    <div className="h-px w-20 bg-gradient-to-r from-antique-gold to-transparent mt-8" />
                </div>

                {/* Bespoke CTA Banner */}
                <div className="mb-16 p-8 md:p-12 rounded-2xl bg-deep-emerald relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-deep-emerald via-deep-emerald/95 to-deep-emerald/80" />
                    <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-antique-gold/[0.06] rounded-full blur-3xl" />
                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <Sparkles className="w-4 h-4 text-antique-gold" />
                                <span className="text-[11px] tracking-[0.25em] uppercase text-antique-gold font-medium">Bespoke Service</span>
                            </div>
                            <h3 className="text-2xl md:text-3xl font-display text-white mb-2">
                                Design Your Own Journey
                            </h3>
                            <p className="text-white/60 font-light text-sm max-w-md">
                                Tell us your dates and pace. We build the itinerary around your vision with private guiding, boutique stays, and concierge-level timing.
                            </p>
                        </div>
                        <Link
                            href="/build-tour"
                            className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-antique-gold text-deep-emerald hover:bg-white text-[11px] tracking-[0.2em] uppercase font-semibold rounded-full transition-all duration-300 shrink-0"
                        >
                            <Sparkles className="w-3.5 h-3.5" />
                            Design My Trip
                        </Link>
                    </div>
                </div>

                {/* Package Grid — 2 columns for editorial feel */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 mb-16">
                    {packages.map((pkg: any) => (
                        <Link key={pkg._id} href={`/packages/${pkg.slug}`} className="group block">
                            <article className="rounded-2xl overflow-hidden liquid-glass-card flex flex-col h-full">
                                {/* Image */}
                                <div className="relative h-[300px] md:h-[340px] overflow-hidden">
                                    <Image
                                        src={pkg.images?.[0] || '/images/home/curated-kingdoms.png'}
                                        alt={pkg.title}
                                        fill
                                        className="object-cover transform group-hover:scale-[1.03] transition-transform duration-1000 ease-out"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                                    {/* Duration badge */}
                                    <div className="absolute top-5 right-5">
                                        <span className="text-[10px] tracking-[0.15em] uppercase font-medium text-white/90 bg-white/15 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                                            {pkg.duration}
                                        </span>
                                    </div>

                                    {/* Tags on image */}
                                    <div className="absolute bottom-5 left-5 flex flex-wrap gap-1.5">
                                        {(pkg.tags || []).slice(0, 3).map((tag: string) => (
                                            <span
                                                key={tag}
                                                className="text-[9px] tracking-[0.15em] uppercase font-medium text-white/80 bg-white/10 backdrop-blur-sm px-2 py-1 rounded-full border border-white/10"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-7 md:p-8 flex flex-col flex-grow">
                                    <h3 className="text-xl md:text-2xl font-display text-deep-emerald group-hover:text-antique-gold transition-colors duration-500 mb-3 leading-snug">
                                        {pkg.title}
                                    </h3>

                                    <p className="text-gray-500 font-light text-sm line-clamp-2 leading-relaxed mb-5 flex-grow">
                                        {pkg.summary || pkg.description}
                                    </p>

                                    {/* Highlights preview */}
                                    {pkg.highlights && pkg.highlights.length > 0 && (
                                        <div className="mb-5 space-y-1.5">
                                            {pkg.highlights.slice(0, 2).map((h: string, i: number) => (
                                                <p key={i} className="text-[12px] text-gray-400 font-light flex items-start gap-2">
                                                    <span className="text-antique-gold mt-0.5">&#9670;</span>
                                                    {h}
                                                </p>
                                            ))}
                                        </div>
                                    )}

                                    <div className="mt-auto pt-5 border-t border-gray-100/50 flex items-center justify-between">
                                        <div>
                                            {pkg.priceMin > 0 && (
                                                <PackagePriceDisplay priceMin={pkg.priceMin} />
                                            )}
                                        </div>
                                        <span className="inline-flex items-center gap-1.5 text-[11px] tracking-[0.15em] uppercase font-semibold text-deep-emerald group-hover:text-antique-gold transition-colors duration-300">
                                            Explore
                                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                                        </span>
                                    </div>
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>

                {/* Bottom CTAs */}
                <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-5">
                    <Link
                        href="/build-tour"
                        className="inline-flex items-center gap-3 px-9 py-4 bg-deep-emerald text-antique-gold hover:bg-deep-emerald/90 border border-antique-gold/30 font-display uppercase tracking-[0.2em] text-[12px] transition-all duration-300 rounded-full"
                    >
                        <Sparkles className="w-4 h-4" />
                        Build Custom Tour
                    </Link>
                    <Link
                        href="/inquire"
                        className="inline-flex items-center gap-3 px-9 py-4 bg-white text-deep-emerald hover:bg-off-white border border-deep-emerald/20 font-display uppercase tracking-[0.2em] text-[12px] transition-all duration-300 rounded-full"
                    >
                        Request a Proposal
                    </Link>
                </div>
            </div>
        </div>
    );
}
