import Link from 'next/link';
import { ArrowRight, Map, Route, Sparkles } from 'lucide-react';

const STEPS = [
    {
        number: '01',
        title: 'Tell us your travel style',
        description:
            'Share your pace, dates, and the kind of Sri Lanka you want to experience first.',
        icon: Map,
    },
    {
        number: '02',
        title: 'We curate your private route',
        description:
            'Our team shapes the sequence, stays, and transfers into a route that feels coherent from day one.',
        icon: Route,
    },
    {
        number: '03',
        title: 'Confirm and travel seamlessly',
        description:
            'Once refined, every booking, transfer, and on-trip support detail moves through one coordinated plan.',
        icon: Sparkles,
    },
];

export default function HowItWorks() {
    return (
        <section className="home-section-shell bg-[#f3f6f2]">
            <div className="home-section-inner">
                <div className="mb-10 max-w-2xl">
                    <p className="home-kicker">How It Works</p>
                    <h2 className="home-heading mt-4">
                        A simpler planning story, told in three steps
                    </h2>
                    <p className="home-copy mt-5">
                        The homepage should make the process feel human and structured, not mysterious. This is the bridge between browsing inspiration and starting a bespoke request.
                    </p>
                </div>

                <div className="grid gap-5 lg:grid-cols-3">
                    {STEPS.map((step) => {
                        const Icon = step.icon;

                        return (
                            <article
                                key={step.number}
                                className="rounded-[28px] border border-deep-emerald/8 bg-white p-6 shadow-[0_14px_36px_rgba(4,57,39,0.05)]"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="rounded-2xl border border-antique-gold/25 bg-antique-gold/10 p-3 text-antique-gold">
                                        <Icon className="h-5 w-5" strokeWidth={1.7} />
                                    </div>
                                    <span className="text-4xl font-display tracking-tight text-deep-emerald/12">
                                        {step.number}
                                    </span>
                                </div>
                                <h3 className="mt-8 text-3xl font-display leading-tight tracking-tight text-deep-emerald">
                                    {step.title}
                                </h3>
                                <p className="mt-4 text-sm font-light leading-relaxed tracking-normal text-deep-emerald/70">
                                    {step.description}
                                </p>
                            </article>
                        );
                    })}
                </div>

                <div className="mt-10">
                    <Link
                        href="/build-tour"
                        className="inline-flex items-center gap-2 rounded-full border border-deep-emerald/14 px-6 py-3 text-[11px] font-nav font-semibold uppercase tracking-[0.2em] text-deep-emerald transition duration-300 hover:border-antique-gold/40 hover:text-antique-gold"
                    >
                        Design My Journey
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
