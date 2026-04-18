'use client';

import { FileText, Compass, Plane, Map, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const steps = [
    {
        number: '01',
        icon: Map,
        title: 'Curate Your Canvas',
        description: 'Translate your travel style into the perfect blend of geography—from mist-wrapped tea hills to private southern shores.',
        image: '/images/home/process-1-regions.webp'
    },
    {
        number: '02',
        icon: Compass,
        title: 'Signature Experiences',
        description: 'Access the inaccessible. Private architectural tours, elite leopard tracking, or dining on secluded sandbanks.',
        image: '/images/home/process-2-experiences.webp'
    },
    {
        number: '03',
        icon: FileText,
        title: 'Masterful Routing',
        description: 'Your dedicated specialist orchestrates logistics—balancing deep discovery with rest, ensuring seamless transitions.',
        image: '/images/home/process-3-route.webp'
    },
    {
        number: '04',
        icon: Plane,
        title: 'Seamless Execution',
        description: 'From VIP customs clearance to your final departure, every single detail is flawlessly managed behind the scenes.',
        badge: 'Concierge Execution',
        image: '/images/home/process-4-travel.webp'
    },
];

export default function HowItWorks() {
    return (
        <section
            className="py-20 md:py-28 bg-[#E3EFE9] text-deep-emerald relative overflow-hidden"
            aria-label="How your journey is crafted"
        >
            {/* Background Pattern Overlay */}
            <div
                className="absolute inset-0 z-0 opacity-30 pointer-events-none mix-blend-multiply"
                style={{
                    backgroundImage: "url('/images/home/curated-bg-pattern.webp')",
                    backgroundSize: '400px',
                    backgroundPosition: 'top left',
                    backgroundRepeat: 'repeat'
                }}
            />

            {/* Subtle background accents */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-antique-gold/[0.03] rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-deep-emerald/[0.02] rounded-full blur-3xl" />

            {/* ── Content layer ── */}
            <div className="relative z-10 flex flex-col items-center justify-center w-full">
                <div className="w-full max-w-[1400px] px-6 md:px-10 lg:px-16 py-4 md:py-6 lg:py-8">

                    {/* Header */}
                    <div className="text-center mb-8 md:mb-12">
                        <span className="inline-block mb-3 text-[10px] sm:text-[11px] tracking-[0.35em] font-medium text-antique-gold uppercase">
                            The Process
                        </span>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-display text-deep-emerald leading-[1.1] mb-4">
                            How Your Journey Is{' '}
                            <span className="italic font-light">Crafted</span>
                        </h2>
                        <p className="text-gray-500 font-light text-base md:text-lg max-w-xl mx-auto leading-relaxed">
                            Four intuitive steps. One dedicated specialist.
                        </p>
                    </div>

                    {/* Grid of Steps: 2 columns to save vertical space */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6" role="list">
                        {steps.map((step, idx) => (
                            <article
                                key={idx}
                                role="listitem"
                                className="group relative rounded-[20px] bg-white/70 backdrop-blur-md p-3 md:p-4 flex flex-col sm:flex-row gap-5 items-center hover:-translate-y-1 transition-all duration-500 shadow-[0_8px_32px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.08)] overflow-hidden border border-white/40"
                            >
                                {/* Image Container */}
                                <div className="relative w-full sm:w-[40%] md:w-[35%] lg:w-[40%] aspect-[4/3] rounded-[16px] overflow-hidden shrink-0 bg-[#E3EFE9]">
                                    <Image
                                        src={step.image}
                                        alt={step.title}
                                        fill
                                        className="object-cover transform group-hover:scale-105 transition-transform duration-[2s] ease-out"
                                    />
                                    {/* Subtle gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none" />

                                    {/* Badge */}
                                    {step.badge && (
                                        <span className="absolute top-3 right-3 text-[7px] font-nav font-semibold tracking-[0.15em] uppercase text-antique-gold bg-black/60 backdrop-blur-md px-2 py-1 rounded-full border border-antique-gold/30 shadow-sm">
                                            {step.badge}
                                        </span>
                                    )}
                                </div>

                                {/* Content Container */}
                                <div className="flex-1 flex flex-col justify-center py-2 px-3 sm:px-2 sm:pr-4">
                                    {/* Number and Icon Header */}
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="w-9 h-9 rounded-full border border-antique-gold/30 flex items-center justify-center text-antique-gold group-hover:bg-antique-gold/10 transition-colors duration-300 bg-white">
                                            <step.icon
                                                className="w-4 h-4"
                                                strokeWidth={1.5}
                                            />
                                        </div>
                                        <span className="text-3xl md:text-4xl font-display text-deep-emerald/10 group-hover:text-deep-emerald/20 transition-colors duration-500">
                                            {step.number}
                                        </span>
                                    </div>

                                    <h3 className="text-xl md:text-2xl font-display mb-2 tracking-wide text-deep-emerald group-hover:text-antique-gold transition-colors duration-300">
                                        {step.title}
                                    </h3>
                                    <p className="text-[13px] md:text-sm font-light leading-relaxed m-0 text-gray-500">
                                        {step.description}
                                    </p>
                                </div>
                            </article>
                        ))}
                    </div>

                    {/* CTA */}
                    <div className="flex justify-center mt-10 md:mt-12">
                        <Link
                            href="/build-tour"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-deep-emerald text-white rounded-full text-[11px] font-nav font-semibold tracking-[0.2em] uppercase group hover:bg-antique-gold hover:text-deep-emerald hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all duration-500"
                        >
                            Start Bespoke Tour
                            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                    </div>

                    {/* Assurance strip */}
                    <div className="mt-8 pt-6 border-t border-deep-emerald/10 flex flex-wrap justify-center gap-x-8 md:gap-x-12 gap-y-4">
                        {['Private Transfers', 'Vetted Stays', 'On-Trip Support'].map((item) => (
                            <span
                                key={item}
                                className="text-[10px] md:text-[11px] font-nav tracking-[0.2em] uppercase font-semibold text-deep-emerald/40"
                            >
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
