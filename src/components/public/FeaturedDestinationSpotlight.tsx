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
}

export default function FeaturedDestinationSpotlight({ destination }: FeaturedDestinationSpotlightProps) {
    const heroImage = normalizeImageUrl(destination.images?.[0], `/images/districts/${destination.slug}.jpg`);

    return (
        <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
        >
            {/* Section header */}
            <div className="flex items-center gap-3 mb-8">
                <Sparkles className="h-5 w-5 text-antique-gold" />
                <h2 className="text-sm tracking-[0.3em] uppercase text-deep-emerald/60 font-sans font-medium">
                    Editor&apos;s Pick
                </h2>
                <div className="flex-1 h-px bg-gradient-to-r from-antique-gold/30 to-transparent" />
            </div>

            {/* Split card */}
            <Link
                href={`/destinations/${destination.slug}`}
                className="group block"
            >
                <div className="liquid-glass-card rounded-3xl overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-5 min-h-[420px]">
                        {/* Image side — 3/5 */}
                        <div className="relative lg:col-span-3 h-[280px] sm:h-[320px] lg:h-auto overflow-hidden">
                            <Image
                                src={heroImage}
                                alt={`${destination.title} — featured luxury destination in Sri Lanka`}
                                fill
                                className="object-cover transform group-hover:scale-[1.03] transition-transform duration-[1400ms] ease-out"
                                sizes="(max-width: 1024px) 100vw, 60vw"
                                priority
                            />
                            {/* Gradient fade into content */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/60 hidden lg:block" />
                            <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent lg:hidden" />

                            {/* Region badge */}
                            {destination.region && (
                                <div className="absolute top-5 left-5 z-10">
                                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[10px] tracking-[0.2em] uppercase font-medium text-white bg-deep-emerald/70 backdrop-blur-md border border-white/15 rounded-full">
                                        <MapPin className="h-3 w-3" />
                                        {destination.region}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Content side — 2/5 */}
                        <div className="lg:col-span-2 flex flex-col justify-center p-6 sm:p-8 lg:p-10">
                            {/* Luxury micro-label */}
                            {destination.luxuryLabel && (
                                <p className="text-[10px] tracking-[0.25em] text-antique-gold font-medium uppercase mb-3">
                                    {destination.luxuryLabel}
                                </p>
                            )}

                            {/* Title */}
                            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-display text-deep-emerald leading-tight mb-4 group-hover:text-antique-gold/80 transition-colors duration-500">
                                {destination.title}
                            </h3>

                            {/* Description */}
                            <p className="text-sm text-deep-emerald/60 leading-relaxed mb-6 line-clamp-3">
                                {destination.description}
                            </p>

                            {/* Meta row */}
                            <div className="flex items-center gap-4 text-[11px] tracking-[0.12em] text-deep-emerald/45 uppercase mb-6">
                                {destination.bestSeason && (
                                    <span className="flex items-center gap-1.5">
                                        <Calendar className="h-3.5 w-3.5" />
                                        {destination.bestSeason}
                                    </span>
                                )}
                                {destination.idealNights && (
                                    <span className="flex items-center gap-1.5">
                                        <Moon className="h-3.5 w-3.5" />
                                        {destination.idealNights} nights
                                    </span>
                                )}
                            </div>

                            {/* Travel style tags */}
                            {destination.travelStyleTags && destination.travelStyleTags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-8">
                                    {destination.travelStyleTags.slice(0, 4).map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-3 py-1 text-[10px] tracking-[0.15em] uppercase text-deep-emerald/50 bg-deep-emerald/[0.04] border border-deep-emerald/10 rounded-full"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* CTA */}
                            <div className="flex items-center gap-2 text-sm font-medium text-antique-gold group-hover:gap-3 transition-all duration-500">
                                <span>Explore destination</span>
                                <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-500" />
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.section>
    );
}
