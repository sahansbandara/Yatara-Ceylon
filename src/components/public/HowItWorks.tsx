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
            className="relative overflow-clip bg-[#043927]"
            aria-label="How your journey is crafted"
        >
            {/* ── Background image layer ── */}
            <div className="absolute inset-0" aria-hidden="true">
                <Image
                    src="/images/home/how-it-works-bg.webp"
                    alt="Sri Lanka luxury travel scenery"
                    fill
                    sizes="100vw"
                    priority={false}
                    className="object-cover object-center scale-[1.03]"
                    style={{ filter: 'saturate(1.05) contrast(1.05)' }}
                />
            </div>

            {/* ── Scrim overlay for contrast control ── */}
            <div
                className="absolute inset-0"
                aria-hidden="true"
                style={{
                    background: `
                        radial-gradient(1200px 800px at 50% 30%, rgba(0,0,0,0.35), rgba(0,0,0,0.75)),
                        linear-gradient(to bottom, rgba(0,0,0,0.45), rgba(0,0,0,0.75))
                    `,
                }}
            />

            {/* ── Content layer ── */}
            <div className="relative z-10 flex flex-col items-center justify-center w-full">
                <div className="w-full max-w-[1400px] px-6 md:px-10 lg:px-16 py-16 md:py-20 lg:py-24">

                    {/* Header */}
                    <div className="text-center mb-10 md:mb-14">
                        <span className="block text-[10px] tracking-[0.2em] font-nav uppercase text-white/50 mb-3">
                            The Process
                        </span>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-display leading-tight mb-4 text-white">
                            How Your Journey Is{' '}
                            <span className="italic font-light text-antique-gold block md:inline mt-2 md:mt-0">Crafted</span>
                        </h2>
                        <p className="text-[13px] md:text-sm font-nav tracking-wide max-w-[60ch] mx-auto text-white/70">
                            Four intuitive steps. One dedicated specialist.
                        </p>
                    </div>

                    {/* Grid of Steps: 2 columns to save vertical space */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6" role="list">
                        {steps.map((step, idx) => (
                            <article
                                key={idx}
                                role="listitem"
                                className="glass-hero-card group relative rounded-[20px] p-2 md:p-2.5 flex flex-col sm:flex-row gap-4 items-center hover:-translate-y-1 transition-all duration-500 hover:shadow-2xl overflow-hidden border border-white/[0.05]"
                            >
                                {/* Image Container */}
                                <div className="relative w-full sm:w-[40%] md:w-[35%] lg:w-[40%] aspect-[4/3] rounded-[16px] overflow-hidden shrink-0 bg-[#021f15]">
                                    <Image
                                        src={step.image}
                                        alt={step.title}
                                        fill
                                        className="object-cover transform group-hover:scale-110 transition-transform duration-[2s] ease-out"
                                    />
                                    {/* Subtle gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10 pointer-events-none" />

                                    {/* Badge */}
                                    {step.badge && (
                                        <span className="absolute top-3 right-3 text-[7px] font-nav font-semibold tracking-[0.15em] uppercase text-antique-gold bg-black/60 backdrop-blur-md px-2 py-1 rounded-full border border-antique-gold/30 shadow-lg">
                                            {step.badge}
                                        </span>
                                    )}
                                </div>

                                {/* Content Container */}
                                <div className="flex-1 flex flex-col justify-center py-2 px-3 sm:px-2 sm:pr-4">
                                    {/* Number and Icon Header */}
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="w-8 h-8 rounded-full border border-antique-gold/20 flex items-center justify-center text-antique-gold group-hover:bg-antique-gold/10 transition-colors duration-300">
                                            <step.icon
                                                className="w-3.5 h-3.5 group-hover:drop-shadow-[0_0_8px_rgba(212,175,55,0.8)]"
                                                strokeWidth={1.5}
                                            />
                                        </div>
                                        <span className="text-3xl md:text-4xl font-display text-white/10 group-hover:text-antique-gold/20 transition-colors duration-500">
                                            {step.number}
                                        </span>
                                    </div>

                                    <h3 className="text-lg md:text-xl font-display mb-1.5 tracking-wide text-white group-hover:text-antique-gold transition-colors duration-300">
                                        {step.title}
                                    </h3>
                                    <p className="text-[13px] font-light leading-relaxed m-0 text-white/60 group-hover:text-white/90 transition-colors duration-300">
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
                            className="glass-hero-cta inline-flex items-center gap-2 px-6 py-3 md:px-8 md:py-4 rounded-full text-[10px] md:text-[11px] font-nav font-semibold tracking-[0.2em] uppercase no-underline group hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-shadow duration-500"
                            style={{ color: '#F6F3EE' }}
                        >
                            Start Bespoke Tour
                            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                        </Link>
                    </div>

                    {/* Assurance strip */}
                    <div className="mt-10 md:mt-14 pt-6 border-t border-white/[0.08] flex flex-wrap justify-center gap-x-8 md:gap-x-12 gap-y-4">
                        {['Private Transfers', 'Vetted Stays', 'On-Trip Support'].map((item) => (
                            <span
                                key={item}
                                className="text-[9px] md:text-[10px] font-nav tracking-[0.18em] uppercase font-medium text-white/40"
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
