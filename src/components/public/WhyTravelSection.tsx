'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const benefits = [
    {
        title: 'Concierge-led planning',
        description: 'One specialist plans, books, and manages your journey.',
    },
    {
        title: 'Private logistics',
        description: 'Seamless transfers with vetted driver-guides.',
    },
    {
        title: 'Curated stays',
        description: 'Boutique and luxury properties chosen for experience, not volume.',
    },
    {
        title: 'Pace-first itineraries',
        description: 'Routes built around comfort — no rushed checklist travel.',
    },
    {
        title: 'On-trip support',
        description: 'Real-time adjustments when conditions or preferences change.',
    },
];

const stats = [
    { value: '24/7', label: 'Concierge Support' },
    { value: '100+', label: 'Curated Routes & Experiences' },
    { value: '1', label: 'Single Point of Contact' },
    { value: '0', label: 'Hidden Service Fees' },
];

export default function WhyTravelSection() {
    return (
        <section className="py-24 md:py-32 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

                    {/* Left — Content */}
                    <div>
                        <span className="block text-[10px] tracking-[0.2em] font-nav text-deep-emerald/50 uppercase mb-5">
                            Why Travel With Yatara
                        </span>
                        <h2 className="text-3xl md:text-[2.65rem] font-display text-deep-emerald leading-[1.15] mb-6">
                            A private journey, executed quietly well.
                        </h2>
                        <p className="text-neutral-500 font-light text-[15px] leading-relaxed mb-10 max-w-lg">
                            We tailor each itinerary to your pace — combining refined stays, curated access, and seamless logistics across Sri Lanka.
                        </p>

                        {/* Benefit list */}
                        <ul className="space-y-5 mb-10">
                            {benefits.map((item) => (
                                <li key={item.title}>
                                    <h3 className="text-[15px] font-semibold text-neutral-800 mb-0.5">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm text-neutral-500 font-light leading-relaxed">
                                        {item.description}
                                    </p>
                                </li>
                            ))}
                        </ul>

                        {/* CTAs */}
                        <div className="flex items-center gap-6">
                            <Link
                                href="/about"
                                className="inline-flex items-center px-7 py-3.5 bg-deep-emerald text-white text-[11px] tracking-[0.15em] uppercase font-semibold rounded-full hover:bg-deep-emerald/90 transition-all duration-300"
                            >
                                About Yatara
                            </Link>
                            <Link
                                href="/inquire"
                                className="inline-flex items-center gap-2 text-[12px] tracking-[0.15em] uppercase font-semibold text-deep-emerald hover:text-antique-gold transition-colors duration-300 underline underline-offset-4 decoration-deep-emerald/30 hover:decoration-antique-gold/50"
                            >
                                Inquire
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    </div>

                    {/* Right — Stats Grid */}
                    <div className="flex flex-col justify-center">
                        <div className="grid grid-cols-2 gap-x-10 gap-y-12">
                            {stats.map((stat) => (
                                <div key={stat.label} className="border-l-2 border-antique-gold/30 pl-6">
                                    <span className="block text-4xl md:text-5xl font-display text-deep-emerald font-medium leading-none mb-2">
                                        {stat.value}
                                    </span>
                                    <span className="block text-[10px] tracking-[0.18em] uppercase text-neutral-500 font-nav font-medium">
                                        {stat.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
