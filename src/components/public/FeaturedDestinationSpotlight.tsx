'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Moon, MapPin, ArrowRight, Sparkles } from 'lucide-react';
import { normalizeImageUrl } from '@/lib/image-utils';

interface FeaturedDestinationSpotlightProps {
    destination: {
        title: string;
        slug: string;
        images: string[];
        description: string;
        luxuryLabel?: string;
        region?: string;
        bestSeason?: string;
        idealNights?: string;
        travelStyleTags?: string[];
    };
    badgeLabel?: string;
    reverse?: boolean;
}

export default function FeaturedDestinationSpotlight({ destination, badgeLabel = "Editor's Pick", reverse = false }: FeaturedDestinationSpotlightProps) {
    const heroImage = normalizeImageUrl(destination.images?.[0], `/images/districts/${destination.slug}.jpg`);

    return (
        <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full"
        >
            {/* Section badge/header placed elegantly above the block */}
            <div className={`flex items-center gap-3 mb-8 ${reverse ? 'md:flex-row-reverse' : ''}`}>
                <Sparkles className="h-4 w-4 text-antique-gold animate-pulse" />
                <h2 className="text-[11px] sm:text-xs tracking-[0.3em] uppercase text-deep-emerald/80 font-sans font-medium">
                    {badgeLabel}
                </h2>
                <div className={`flex-1 h-px bg-gradient-to-r ${reverse ? 'from-transparent to-antique-gold/30' : 'from-antique-gold/30 to-transparent'}`} />
            </div>

            <Link
                href={`/destinations/${destination.slug}`}
                className="group block relative"
            >
                <div className="relative z-10 w-full rounded-[2rem] overflow-hidden group-hover:shadow-2xl transition-all duration-1000 shadow-lg shadow-black/5">
                    <div className={`flex flex-col ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-stretch`}>
                        {/* Image side */}
                        <div className="relative w-full flex-1 h-[340px] sm:h-[400px] lg:h-auto min-h-[480px] overflow-hidden">
                            <Image
                                src={heroImage}
                                alt={`${destination.title} — featured luxury destination in Sri Lanka`}
                                fill
                                className="object-cover transform group-hover:scale-105 group-hover:-rotate-1 transition-all duration-2000 ease-out"
                                sizes="(max-width: 1024px) 100vw, 60vw"
                                priority
                            />
                            {/* Cinematic gradients */}
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-1000" />

                            {/* Floating region pill */}
                            {destination.region && (
                                <div className="absolute top-6 left-6 z-20">
                                    <span className="inline-flex items-center gap-1.5 px-4 py-2 text-[10px] tracking-[0.2em] uppercase font-medium text-white bg-black/20 backdrop-blur-md border border-white/20 rounded-full shadow-lg">
                                        <MapPin className="h-3.5 w-3.5" />
                                        {destination.region}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Content side — overlapping the image slightly visually via offset or just elegant padding */}
                        <div className={`w-full lg:w-[38%] bg-off-white relative flex flex-col justify-center p-8 sm:p-10 lg:p-12 ${reverse ? 'lg:-ml-8' : 'lg:-mr-8'} z-10 transform ${reverse ? 'lg:translate-x-8' : 'lg:-translate-x-8'} rounded-[2rem] border border-deep-emerald/5 shadow-2xl shadow-deep-emerald/5 my-0 lg:my-8 group-hover:border-antique-gold/20 transition-colors duration-700`}>
                            {/* Watermark in background */}
                            <div className="absolute top-4 right-6 text-7xl font-display text-deep-emerald/[0.02] pointer-events-none select-none z-0">
                                {destination.title.substring(0, 2).toUpperCase()}
                            </div>

                            <div className="relative z-10">
                                {/* Luxury micro-label */}
                                {destination.luxuryLabel && (
                                    <p className="text-[10px] tracking-[0.3em] text-antique-gold font-medium uppercase mb-4">
                                        {destination.luxuryLabel}
                                    </p>
                                )}

                                {/* Title */}
                                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-display text-deep-emerald leading-[1.1] mb-5 group-hover:text-antique-gold transition-colors duration-700">
                                    {destination.title}
                                </h3>

                                {/* Meta row */}
                                <div className="flex items-center gap-5 text-[11px] tracking-[0.15em] text-deep-emerald/60 uppercase mb-6 font-medium">
                                    {destination.bestSeason && (
                                        <span className="flex items-center gap-2">
                                            <Calendar className="h-3.5 w-3.5 text-antique-gold/70" />
                                            {destination.bestSeason}
                                        </span>
                                    )}
                                    {destination.idealNights && (
                                        <span className="flex items-center gap-2">
                                            <Moon className="h-3.5 w-3.5 text-antique-gold/70" />
                                            {destination.idealNights} nights
                                        </span>
                                    )}
                                </div>

                                {/* Description */}
                                <p className="text-[13px] text-deep-emerald/70 leading-relaxed mb-8 max-w-md font-light">
                                    {destination.description}
                                </p>

                                {/* Travel style tags */}
                                {destination.travelStyleTags && destination.travelStyleTags.length > 0 && (
                                    <div className="flex flex-wrap gap-2.5 mb-10">
                                        {destination.travelStyleTags.slice(0, 3).map((tag) => (
                                            <span
                                                key={tag}
                                                className="px-3.5 py-1.5 text-[9px] tracking-[0.15em] uppercase text-deep-emerald/60 bg-transparent border border-deep-emerald/15 rounded-full"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* CTA */}
                                <div className="inline-flex items-center gap-3 px-6 py-3 bg-deep-emerald text-white text-[10px] tracking-[0.2em] font-medium uppercase rounded-full hover:bg-antique-gold transition-all duration-500 shadow-lg shadow-deep-emerald/20 hover:shadow-antique-gold/30 hover:gap-4">
                                    <span>Discover More</span>
                                    <ArrowRight className="h-3.5 w-3.5" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.section>
    );
}
