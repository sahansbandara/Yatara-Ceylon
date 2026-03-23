import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';
import SectionHeading from './SectionHeading';
import connectDB from '@/lib/mongodb';
import Package from '@/models/Package';

async function getFeaturedPackages() {
    try {
        await connectDB();
        const packages = await Package.find({
            isPublished: true,
            isDeleted: false,
            isFeaturedHome: true,
        })
            .sort({ homeRank: 1 })
            .limit(9)
            .lean();
        return JSON.parse(JSON.stringify(packages));
    } catch {
        return [];
    }
}

// Theme label mapping: first tag → display label
function getThemeLabel(tags: string[]): string {
    if (!tags || tags.length === 0) return 'CURATED JOURNEY';
    const tagMap: Record<string, string> = {
        'Wildlife': 'WILDLIFE TOURS',
        'Luxury': 'LUXURY TOURS',
        'Hill Country': 'HILL COUNTRY TOURS',
        'Family': 'FAMILY TOURS',
        'Heritage': 'HERITAGE TOURS',
        'Honeymoon': 'HONEYMOON TOURS',
        'Wellness': 'WELLNESS TOURS',
        'Beach': 'COASTAL TOURS',
        'Nature': 'NATURE TOURS',
        'Rail': 'RAIL JOURNEYS',
        'First-Time': 'SIGNATURE TOURS',
        'Photography': 'PHOTOGRAPHY TOURS',
        'Adventure': 'ADVENTURE TOURS',
        'Couples': 'COUPLES TOURS',
    };
    for (const tag of tags) {
        if (tagMap[tag]) return tagMap[tag];
    }
    return 'CURATED JOURNEY';
}

export default async function SignatureExperiences() {
    const packages = await getFeaturedPackages();

    if (packages.length === 0) return null;

    return (
        <section className="py-32 bg-off-white/50 relative overflow-hidden">
            {/* Decorative background */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-antique-gold/3 rounded-full blur-3xl -mr-48 -mt-48" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-deep-emerald/3 rounded-full blur-3xl -ml-48 -mb-48" />

            <div className="container mx-auto px-6 max-w-7xl relative z-10">
                <SectionHeading
                    title="Signature Experiences"
                    description="Curated luxury journeys across the most breathtaking landscapes of Sri Lanka — each one fully private, fully bespoke."
                    align="center"
                />

                {/* 3×3 Walkers-Style Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-20">
                    {packages.map((pkg: any, idx: number) => (
                        <Link
                            key={pkg._id || pkg.slug}
                            href={`/packages/${pkg.slug}`}
                            className={`group relative overflow-hidden rounded-2xl flex flex-col justify-end ${idx === 0 ? 'md:col-span-2 md:row-span-2 h-[500px] lg:h-[620px]' : 'h-[380px]'
                                }`}
                        >
                            <Image
                                src={pkg.images?.[0] || '/images/home/curated-kingdoms.png'}
                                alt={pkg.title}
                                fill
                                className="object-cover object-center transform group-hover:scale-105 transition-transform duration-1000 ease-out"
                                sizes={idx === 0 ? '(max-width: 768px) 100vw, 66vw' : '(max-width: 768px) 100vw, 33vw'}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent opacity-85 group-hover:opacity-90 transition-opacity duration-700" />

                            {/* Most Popular badge for first card */}
                            {idx === 0 && (
                                <div className="absolute top-5 left-5 bg-antique-gold/90 backdrop-blur-sm px-4 py-2 rounded-lg z-10">
                                    <span className="text-[10px] tracking-[0.2em] font-bold uppercase text-deep-emerald">Most Popular Tour</span>
                                </div>
                            )}

                            <div className="relative z-10 p-6 md:p-8">
                                {/* Theme label */}
                                <span className="text-[10px] tracking-[0.25em] font-medium uppercase text-white/60 mb-2 block">
                                    {getThemeLabel(pkg.tags)}
                                </span>

                                <h3 className={`font-display text-white font-medium mb-2 leading-tight uppercase tracking-wide ${idx === 0 ? 'text-2xl lg:text-3xl' : 'text-lg lg:text-xl'
                                    }`}>
                                    {pkg.title}
                                    <span className="inline-block ml-3 w-8 h-[1.5px] bg-white/40 align-middle" />
                                </h3>

                                {/* Duration */}
                                <div className="flex items-center gap-2 text-white/50 text-xs tracking-wide">
                                    <Clock className="w-3.5 h-3.5" strokeWidth={1.5} />
                                    <span>{pkg.duration}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* View All CTA */}
                <div className="flex justify-center mt-14">
                    <Link
                        href="/packages"
                        className="inline-flex items-center gap-3 text-xs font-sans uppercase tracking-[0.25em] text-deep-emerald border border-deep-emerald/25 px-10 py-4 hover:bg-deep-emerald hover:text-antique-gold transition-all duration-500 rounded-none group/cta"
                    >
                        View All Journeys
                        <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover/cta:translate-x-1" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
