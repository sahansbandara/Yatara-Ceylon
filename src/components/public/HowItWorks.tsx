import { FileText, Compass, Plane } from 'lucide-react';
import Link from 'next/link';

const steps = [
    {
        number: '01',
        icon: FileText,
        title: 'Request Your Proposal',
        description: 'Share your travel vision — dates, interests, pace. Our concierge team begins crafting your bespoke itinerary within 2 hours.',
    },
    {
        number: '02',
        icon: Compass,
        title: 'We Curate & Refine',
        description: 'Your dedicated travel designer builds a personalized journey, hand-selecting experiences, accommodations, and private guides.',
    },
    {
        number: '03',
        icon: Plane,
        title: 'Confirm & Travel',
        description: 'Lock in your fixed-price itinerary. From airport pickup to your last sunset, every detail is handled with private transfers and 24/7 support.',
    },
];

export default function HowItWorks() {
    return (
        <section className="py-28 bg-off-white relative">
            <div className="max-w-6xl mx-auto px-4 md:px-8">
                <div className="text-center mb-20">
                    <span className="inline-block mb-4 text-xs tracking-[0.2em] font-medium text-antique-gold uppercase">
                        Seamless from Start to Finish
                    </span>
                    <h2 className="text-3xl md:text-5xl font-serif text-deep-emerald leading-tight">
                        How <span className="italic font-light">It Works</span>
                    </h2>
                    <div className="h-px w-24 bg-antique-gold mt-6 opacity-50 mx-auto" />
                </div>

                {/* Steps */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 relative">
                    {/* Connecting line (desktop only) */}
                    <div className="hidden md:block absolute top-16 left-[16.67%] right-[16.67%] h-px bg-antique-gold/20" />

                    {steps.map((step, idx) => (
                        <div key={idx} className="flex flex-col items-center text-center group">
                            {/* Icon container */}
                            <div className="relative mb-8">
                                <div className="h-20 w-20 rounded-full bg-deep-emerald/5 border border-deep-emerald/10 flex items-center justify-center group-hover:bg-deep-emerald group-hover:border-deep-emerald transition-all duration-500 relative z-10">
                                    <step.icon className="h-7 w-7 text-deep-emerald group-hover:text-antique-gold transition-colors duration-500" strokeWidth={1.5} />
                                </div>
                                <span className="absolute -top-2 -right-2 text-[10px] tracking-[0.2em] font-semibold text-antique-gold bg-off-white px-2 py-0.5 border border-antique-gold/20 z-20">
                                    {step.number}
                                </span>
                            </div>

                            <h3 className="text-xl font-serif text-deep-emerald mb-4 tracking-wide">
                                {step.title}
                            </h3>
                            <p className="text-sm text-gray-500 font-light leading-relaxed max-w-[300px]">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="text-center mt-16">
                    <Link
                        href="/inquire"
                        className="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-[0.2em] text-deep-emerald border border-deep-emerald/30 px-10 py-4 hover:bg-deep-emerald hover:text-antique-gold transition-all duration-300"
                    >
                        Start Your Journey
                    </Link>
                </div>
            </div>
        </section>
    );
}
