'use client';

import { FileText, Compass, Plane, Map, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const steps = [
    {
        number: '01',
        icon: Map,
        title: 'Select Your Regions',
        description: 'Choose from handpicked destinations tailored to your pace.',
        proof: null,
        accent: false,
    },
    {
        number: '02',
        icon: Compass,
        title: 'Curate Your Experiences',
        description: 'Add heritage, wildlife, wellness, or private villa stays.',
        proof: null,
        accent: false,
    },
    {
        number: '03',
        icon: FileText,
        title: 'We Design Your Route',
        description:
            'Your specialist refines timing, stays, and transfers for comfort.',
        proof: 'Delivered promptly with a clear day-by-day plan.',
        accent: false,
    },
    {
        number: '04',
        icon: Plane,
        title: 'Confirm & Travel',
        description: 'Final approval—then we handle execution end-to-end.',
        proof: null,
        accent: true,
        badge: 'Concierge Execution',
    },
];

export default function HowItWorks() {
    return (
        <section className="py-28 bg-white border-b border-black/[0.03]">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
                {/* Header — concierge language */}
                <div className="text-center mb-20">
                    <span className="block text-[10px] tracking-[0.2em] font-nav text-deep-emerald/50 uppercase mb-4">
                        The Process
                    </span>
                    <h2 className="text-4xl md:text-5xl font-display text-deep-emerald leading-tight mb-4">
                        How Your Journey Is{' '}
                        <span className="italic font-light">Crafted</span>
                    </h2>
                    <p className="text-sm font-nav text-deep-emerald/50 tracking-wide">
                        Four steps. One dedicated specialist.
                    </p>
                </div>

                {/* Progress line with dots */}
                <div className="hidden lg:block relative mb-12">
                    <div className="absolute top-1/2 left-0 right-0 h-px bg-deep-emerald/10 -translate-y-1/2" />
                    <div className="flex justify-between max-w-[calc(100%-6rem)] mx-auto">
                        {steps.map((step, idx) => (
                            <div key={idx} className="relative flex items-center justify-center">
                                <span
                                    className={`block w-2.5 h-2.5 rounded-full border-2 transition-colors duration-500 ${
                                        step.accent
                                            ? 'bg-antique-gold border-antique-gold'
                                            : 'bg-white border-deep-emerald/30'
                                    }`}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 relative">
                    {steps.map((step, idx) => (
                        <div
                            key={idx}
                            className={`group relative flex flex-col p-10 rounded-lg transition-all duration-500 cursor-default
                                ${
                                    step.accent
                                        ? 'bg-deep-emerald/[0.04] border border-deep-emerald/[0.08]'
                                        : 'bg-white border border-black/[0.05]'
                                }
                                shadow-[0_1px_3px_rgba(0,0,0,0.04)]
                                hover:shadow-[0_8px_30px_rgba(4,57,39,0.08)]
                                hover:-translate-y-1
                            `}
                        >
                            {/* Badge for step 04 */}
                            {step.accent && 'badge' in step && step.badge && (
                                <span className="absolute top-4 right-4 text-[8px] font-nav font-semibold tracking-[0.15em] uppercase text-antique-gold bg-antique-gold/10 px-2.5 py-1 rounded-full">
                                    {step.badge}
                                </span>
                            )}

                            <div
                                className={`flex justify-between items-start mb-14 transition-colors duration-500 ${
                                    step.accent
                                        ? 'text-antique-gold'
                                        : 'text-deep-emerald group-hover:text-antique-gold'
                                }`}
                            >
                                <step.icon
                                    className="w-7 h-7 transition-transform duration-500 group-hover:rotate-2 group-hover:translate-y-[-2px]"
                                    strokeWidth={1.2}
                                />
                                <span className="text-[10px] font-nav font-semibold tracking-widest uppercase text-deep-emerald/30">
                                    {step.number}
                                </span>
                            </div>

                            <h3 className="text-xl font-display mb-3 tracking-wide text-deep-emerald">
                                {step.title}
                            </h3>
                            <p className="text-sm font-light leading-relaxed text-deep-emerald/60">
                                {step.description}
                            </p>

                            {/* Micro-proof line */}
                            {step.proof && (
                                <p className="mt-4 text-xs font-nav tracking-wide text-antique-gold/80 border-t border-antique-gold/15 pt-3">
                                    {step.proof}
                                </p>
                            )}
                        </div>
                    ))}
                </div>

                {/* Single CTA */}
                <div className="flex justify-center mt-16">
                    <Link
                        href="/build-tour"
                        className="inline-flex h-14 items-center justify-center px-12 bg-deep-emerald hover:bg-deep-emerald/90 text-white transition-all duration-500 rounded-none font-nav font-semibold tracking-[0.2em] text-[10px] uppercase group"
                    >
                        Start Bespoke Tour
                        <ArrowRight className="w-4 h-4 ml-3 transition-transform duration-500 group-hover:translate-x-1" />
                    </Link>
                </div>

                {/* Assurance strip (replaces heavy green bar) */}
                <div className="mt-14 pt-8 border-t border-black/[0.04] flex flex-wrap justify-center gap-x-10 gap-y-3">
                    {[
                        'Private Transfers',
                        'Vetted Stays',
                        'On-Trip Support',
                    ].map((item) => (
                        <span
                            key={item}
                            className="text-[10px] font-nav tracking-[0.18em] uppercase text-deep-emerald/35 font-medium"
                        >
                            {item}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
}
