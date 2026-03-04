import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';
import connectDB from '@/lib/mongodb';
import Package from '@/models/Package';

async function getFeaturedJourneys() {
    try {
        await connectDB();
        const packages = await Package.find({
            isPublished: true,
            isDeleted: false,
        })
            .sort({ homeRank: -1, createdAt: -1 })
            .limit(6)
            .lean();
        return JSON.parse(JSON.stringify(packages));
    } catch {
        return [];
    }
}

export default async function FeaturedJourneys() {
    const packages = await getFeaturedJourneys();

    if (packages.length === 0) return null;

    return (
        <section className="py-24 md:py-32 bg-[#F9F9F9] relative px-6 lg:px-10">
            <div className="max-w-[1400px] mx-auto relative z-10">

                {/* Header Row */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                    <div className="max-w-xl">
                        <span className="block text-[10px] tracking-[0.2em] font-nav text-deep-emerald/50 uppercase mb-4">
                            Handpicked Experiences
                        </span>
                        <h2 className="text-4xl md:text-5xl font-display text-deep-emerald leading-tight mb-6">
                            Featured <span className="italic font-light">Journeys</span>
                        </h2>
                        <p className="text-deep-emerald/60 font-light text-sm md:text-base leading-relaxed">
                            Curated itineraries crafted by our local experts, balancing iconic landmarks with hidden gems and unparalleled luxury.
                        </p>
                    </div>

                    <Link
                        href="/packages"
                        className="inline-flex items-center gap-3 text-[10px] tracking-[0.2em] font-nav font-semibold text-deep-emerald hover:text-antique-gold uppercase transition-colors group shrink-0"
                    >
                        View All Journeys
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {packages.map((pkg: any) => (
                        <Link
                            key={pkg._id || pkg.slug}
                            href={`/packages/${pkg.slug}`}
                            className="group flex flex-col h-full bg-white rounded-md overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-black/[0.03]"
                        >
                            {/* Card Image */}
                            <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                                <Image
                                    src={pkg.images?.[0] || '/images/home/curated-kingdoms.png'}
                                    alt={pkg.title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    className="object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                                />
                                {/* Tags overlay */}
                                <div className="absolute top-4 left-4 flex gap-2">
                                    {(pkg.tags || []).slice(0, 2).map((tag: string) => (
                                        <span key={tag} className="px-3 py-1 bg-black/40 backdrop-blur-md text-white text-[9px] font-nav tracking-widest uppercase rounded-sm border border-white/10">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Card Content */}
                            <div className="p-8 flex flex-col flex-1">
                                <div className="flex items-center justify-between gap-4 mb-4 text-deep-emerald/50">
                                    <div className="flex items-center gap-1.5 font-nav text-[10px] uppercase tracking-wider">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span>{pkg.duration}</span>
                                    </div>
                                    <div className="text-[10px] font-nav font-medium uppercase tracking-widest text-antique-gold">
                                        Inquire
                                    </div>
                                </div>

                                <h3 className="text-2xl font-display text-deep-emerald group-hover:text-antique-gold transition-colors duration-300">
                                    {pkg.title}
                                </h3>

                                <div className="mt-auto pt-6 flex items-center gap-2 text-[10px] font-nav font-semibold tracking-[0.2em] uppercase text-deep-emerald/70 group-hover:text-deep-emerald transition-colors">
                                    Explore Itinerary
                                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
