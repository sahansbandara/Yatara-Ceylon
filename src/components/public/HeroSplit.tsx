'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Plus, ArrowRight } from 'lucide-react';

export default function HeroSplit() {
    return (
        <section className="relative bg-off-white overflow-hidden">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 bg-mesh-gradient opacity-50" />

            <div className="relative z-10 max-w-[1320px] mx-auto px-4 md:px-8 py-16 md:py-24 lg:py-28">
                {/* 3-column grid: image — content — image */}
                <div className="grid grid-cols-1 lg:grid-cols-[minmax(260px,360px)_1fr_minmax(260px,360px)] gap-8 lg:gap-12 items-center">

                    {/* Left Image Card */}
                    <div className="relative group order-2 lg:order-1">
                        <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-xl">
                            <Image
                                src="/images/home/hero-split-left.png"
                                alt="Ancient Sri Lankan heritage temple surrounded by lush tropical greenery"
                                fill
                                priority
                                sizes="(max-width: 1024px) 100vw, 360px"
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            {/* Subtle gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-deep-emerald/30 via-transparent to-transparent" />

                            {/* Floating label */}
                            <div className="absolute bottom-6 left-6 right-6">
                                <span className="inline-block px-4 py-2 text-[10px] tracking-[0.3em] uppercase font-medium text-white/90 bg-deep-emerald/60 backdrop-blur-md rounded-full border border-white/20">
                                    Ancient Heritage
                                </span>
                            </div>
                        </div>

                        {/* Decorative accent */}
                        <div className="absolute -bottom-3 -right-3 w-24 h-24 border-2 border-antique-gold/20 rounded-2xl -z-10 hidden lg:block" />
                    </div>

                    {/* Center Content */}
                    <div className="text-center order-1 lg:order-2 flex flex-col items-center justify-center px-4 lg:px-8">
                        {/* Label */}
                        <span className="inline-block mb-6 text-xs tracking-[0.4em] font-medium text-antique-gold uppercase">
                            Bespoke Sri Lanka
                        </span>

                        {/* Main Title */}
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display text-deep-emerald leading-[1.08] mb-6">
                            Discover the{' '}
                            <span className="italic font-light text-antique-gold block sm:inline">
                                Elite
                            </span>
                            <br />
                            Island Experience
                        </h1>

                        {/* Divider */}
                        <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-antique-gold to-transparent mb-6" />

                        {/* Description */}
                        <p className="text-gray-500 font-light leading-relaxed text-base md:text-lg max-w-md mb-10">
                            Curated itineraries, private chauffeur-guides, and unparalleled luxury — crafted around you by our dedicated concierge team.
                        </p>

                        {/* CTA — Icon circle + label (Walkers pattern) */}
                        <Link
                            href="/about"
                            className="flex items-center gap-4 text-deep-emerald hover:text-antique-gold transition-all duration-500 group"
                        >
                            <div className="w-14 h-14 rounded-full border-2 border-deep-emerald group-hover:border-antique-gold flex items-center justify-center transition-all duration-500 group-hover:shadow-lg group-hover:shadow-antique-gold/20 group-hover:-translate-y-1">
                                <Plus className="w-6 h-6 transition-transform duration-300 group-hover:rotate-90" />
                            </div>
                            <span className="text-xs tracking-[0.25em] font-semibold uppercase">
                                About Us
                            </span>
                        </Link>

                        {/* Secondary CTA */}
                        <Link
                            href="/inquire"
                            className="mt-6 inline-flex items-center gap-3 text-xs tracking-[0.2em] uppercase font-medium text-gray-400 hover:text-antique-gold transition-colors duration-300"
                        >
                            Request a Proposal
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    {/* Right Image Card */}
                    <div className="relative group order-3">
                        <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-xl">
                            <Image
                                src="/images/home/hero-split-right.png"
                                alt="Pristine Sri Lankan tropical coastline with turquoise waters"
                                fill
                                sizes="(max-width: 1024px) 100vw, 360px"
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            {/* Subtle gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-deep-emerald/30 via-transparent to-transparent" />

                            {/* Floating label */}
                            <div className="absolute bottom-6 left-6 right-6">
                                <span className="inline-block px-4 py-2 text-[10px] tracking-[0.3em] uppercase font-medium text-white/90 bg-deep-emerald/60 backdrop-blur-md rounded-full border border-white/20">
                                    Coastal Paradise
                                </span>
                            </div>
                        </div>

                        {/* Decorative accent */}
                        <div className="absolute -top-3 -left-3 w-24 h-24 border-2 border-antique-gold/20 rounded-2xl -z-10 hidden lg:block" />
                    </div>

                </div>

                {/* Trust micro-badges — below the grid */}
                <div className="flex flex-wrap justify-center gap-8 md:gap-14 mt-16 pt-10 border-t border-gray-200/80">
                    {[
                        'Private Transfers',
                        '24/7 Concierge',
                        'Fixed-Price Guarantee',
                        'Fully Bespoke',
                    ].map((badge) => (
                        <span
                            key={badge}
                            className="text-[11px] tracking-[0.2em] uppercase font-light text-gray-400 flex items-center gap-2"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-antique-gold/50" />
                            {badge}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
}
