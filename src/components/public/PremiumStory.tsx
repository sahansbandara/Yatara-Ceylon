'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, Compass, HeartHandshake } from 'lucide-react';
import { ArrowRight } from 'lucide-react';

const differentiators = [
    {
        title: "Guided by Specialists",
        promise: "Matched to your interests—heritage, wildlife, cuisine, and beyond.",
        support: "Travel with archaeologists through Anuradhapura, or track leopards with seasoned naturalists in Yala.",
        icon: Compass
    },
    {
        title: "Priority, Not Crowds",
        promise: "We plan timing and access for quieter moments—where private arrangements are available.",
        support: "Early starts, curated routes, and boutique stays selected for intimacy over scale.",
        icon: ShieldCheck
    },
    {
        title: "White-Glove Support",
        promise: "One point of contact from arrival to departure, handling changes effortlessly.",
        support: "A dedicated concierge monitors your journey—adjustments handled instantly, without friction.",
        icon: HeartHandshake
    }
];

export default function PremiumStory() {
    return (
        <section className="py-24 md:py-32 bg-white border-b border-black/[0.03]">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

                    {/* Left Image — editorial luxury photograph */}
                    <div className="relative aspect-[3/4] w-full max-w-[500px] mx-auto lg:mx-0 rounded-md overflow-hidden shadow-sm bg-gray-100">
                        <Image
                            src="/images/home/signature-heritage.png"
                            alt="Yatara Ceylon Experience"
                            fill
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            className="object-cover"
                        />
                        {/* Subtle bottom gradient for editorial feel */}
                        <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
                    </div>

                    {/* Right Copy Split */}
                    <div className="max-w-xl">
                        <span className="block text-[10px] tracking-[0.2em] font-nav text-deep-emerald/50 uppercase mb-6">
                            The Yatara Standard
                        </span>
                        <h2 className="text-4xl md:text-5xl font-display text-deep-emerald leading-tight mb-3">
                            Beyond <span className="italic font-light">Luxury</span>
                        </h2>
                        <p className="text-base font-light leading-relaxed text-deep-emerald/60 mb-10">
                            Crafted routes. Refined stays. Seamless execution.
                        </p>

                        <div className="space-y-8">
                            {differentiators.map((diff, idx) => (
                                <div
                                    key={idx}
                                    className="flex gap-6 group pl-4 border-l-2 border-transparent hover:border-antique-gold/40 transition-all duration-500"
                                >
                                    <div className="shrink-0 mt-1">
                                        <div className="w-12 h-12 rounded-full border border-antique-gold/30 flex items-center justify-center text-antique-gold group-hover:border-antique-gold group-hover:bg-antique-gold/5 group-hover:ring-1 group-hover:ring-antique-gold/20 transition-all duration-500">
                                            <diff.icon className="w-5 h-5" strokeWidth={1.5} />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-display text-deep-emerald mb-1 tracking-wide group-hover:text-deep-emerald transition-colors duration-300">
                                            {diff.title}
                                        </h3>
                                        <p className="text-sm leading-relaxed text-deep-emerald/80 mb-1">
                                            {diff.promise}
                                        </p>
                                        <p className="text-sm font-light leading-relaxed text-deep-emerald/55">
                                            {diff.support}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Proof strip */}
                        <div className="mt-10 pt-6 border-t border-deep-emerald/[0.06]">
                            <p className="text-[11px] tracking-[0.15em] uppercase text-deep-emerald/35 font-nav">
                                Concierge planning &nbsp;•&nbsp; Private transfers &nbsp;•&nbsp; Vetted stays
                            </p>
                        </div>

                        {/* CTA */}
                        <div className="mt-6">
                            <Link
                                href="/about"
                                className="inline-flex items-center gap-2 text-sm tracking-wide text-antique-gold hover:text-antique-gold/80 transition-colors duration-300 group/cta"
                            >
                                <span className="font-nav">Explore the Yatara Standard</span>
                                <ArrowRight className="w-4 h-4 group-hover/cta:translate-x-1 transition-transform duration-300" strokeWidth={1.5} />
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
