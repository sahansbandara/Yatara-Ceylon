'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';

const curatedJourneys = [
    {
        id: 'hill-country',
        title: 'The Hill Country Odyssey',
        tags: ['Heritage', 'Nature'],
        duration: '7 Days',
        image: '/images/home/curated-hillcountry.png',
        href: '/packages?tag=heritage',
    },
    {
        id: 'southern-coast',
        title: 'Southern Coast Serenity',
        tags: ['Beach', 'Culture'],
        duration: '5 Days',
        image: '/images/home/curated-southcoast.png',
        href: '/packages?tag=beach',
    },
    {
        id: 'ancient-kingdoms',
        title: 'Ancient Kingdom Trails',
        tags: ['History', 'Temples'],
        duration: '8 Days',
        image: '/images/home/curated-kingdoms.png',
        href: '/packages?tag=heritage',
    },
    {
        id: 'wildlife-safari',
        title: 'Wildlife & Safari Circuit',
        tags: ['Wildlife', 'Adventure'],
        duration: '6 Days',
        image: '/images/home/signature-wildlife.png',
        href: '/packages?tag=wildlife',
    },
    {
        id: 'spiritual-journey',
        title: 'Sacred Temple Pilgrimage',
        tags: ['Culture', 'Spiritual'],
        duration: '10 Days',
        image: '/images/home/signature-heritage.png',
        href: '/packages?tag=culture',
    },
    {
        id: 'east-coast',
        title: 'Trincomalee Escapes',
        tags: ['Beach', 'Marine'],
        duration: '4 Days',
        image: '/images/hints/beach.jpg',
        href: '/packages?tag=beach',
    },
];

export default function FeaturedJourneys() {
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
                    {curatedJourneys.map((journey) => (
                        <Link key={journey.id} href={journey.href} className="group flex flex-col h-full bg-white rounded-md overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-black/[0.03]">
                            {/* Card Image */}
                            <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                                <Image
                                    src={journey.image}
                                    alt={journey.title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    className="object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                                    unoptimized={false}
                                />
                                {/* Tags overlay */}
                                <div className="absolute top-4 left-4 flex gap-2">
                                    {journey.tags.map((tag) => (
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
                                        <span>{journey.duration}</span>
                                    </div>
                                    <div className="text-[10px] font-nav font-medium uppercase tracking-widest text-antique-gold">
                                        Inquire
                                    </div>
                                </div>

                                <h3 className="text-2xl font-display text-deep-emerald group-hover:text-antique-gold transition-colors duration-300">
                                    {journey.title}
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
