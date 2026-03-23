import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';

const PROOF_POINTS = [
    {
        value: '24 hours',
        label: 'Typical turnaround for your first itinerary concept',
    },
    {
        value: 'Private only',
        label: 'No shared departures or one-size-fits-all routing',
    },
    {
        value: 'End-to-end',
        label: 'Stays, transfers, and pacing curated together',
    },
];

const BRAND_BULLETS = [
    'Chauffeur and transfer planning coordinated with the shape of the journey, not treated as an afterthought.',
    'Handpicked stays chosen for privacy, pace, and fit, rather than volume or template packages.',
    'Direct contact with a travel specialist who edits the route around how you want Sri Lanka to feel.',
];

export default function HeritageStory() {
    return (
        <section className="home-section-shell bg-white">
            <div className="home-section-inner">
                <div className="grid gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-center">
                    <div className="relative">
                        <div className="relative aspect-[4/5] overflow-hidden rounded-[32px] shadow-[0_20px_70px_rgba(4,57,39,0.16)]">
                            <Image
                                src="/images/home/heritage-story.png"
                                alt="Curated Sri Lanka luxury travel"
                                fill
                                sizes="(max-width: 1024px) 100vw, 45vw"
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,19,14,0.08)_0%,rgba(3,19,14,0.52)_100%)]" />
                        </div>

                        <div className="absolute inset-x-6 bottom-6 rounded-[24px] border border-white/16 bg-black/30 p-5 backdrop-blur-xl md:inset-x-8 md:p-6">
                            <p className="text-[10px] font-nav font-semibold uppercase tracking-[0.24em] text-antique-gold">
                                Why Yatara Ceylon
                            </p>
                            <p className="mt-3 text-sm font-light leading-relaxed tracking-normal text-white/80">
                                A more disciplined kind of luxury: fewer generic promises, stronger route design, and service details that stay coherent from airport arrival to final departure.
                            </p>
                        </div>
                    </div>

                    <div>
                        <p className="home-kicker">Brand Authority</p>
                        <h2 className="home-heading mt-4">
                            A private Sri Lanka journey should feel carefully edited, not crowded.
                        </h2>
                        <p className="home-copy mt-5">
                            Yatara Ceylon is at its best when the experience feels effortless to the guest and highly considered behind the scenes. That means sharper pacing, better logistics, and a smaller set of choices that genuinely fit.
                        </p>

                        <div className="mt-8 grid gap-4 sm:grid-cols-3">
                            {PROOF_POINTS.map((point) => (
                                <div
                                    key={point.value}
                                    className="rounded-[24px] border border-deep-emerald/8 bg-off-white p-5"
                                >
                                    <p className="text-lg font-display tracking-tight text-deep-emerald">
                                        {point.value}
                                    </p>
                                    <p className="mt-2 text-sm font-light leading-relaxed tracking-normal text-deep-emerald/60">
                                        {point.label}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <ul className="mt-8 space-y-4">
                            {BRAND_BULLETS.map((bullet) => (
                                <li
                                    key={bullet}
                                    className="flex items-start gap-3 text-sm font-light leading-relaxed tracking-normal text-deep-emerald/70"
                                >
                                    <span className="mt-0.5 rounded-full border border-antique-gold/30 bg-antique-gold/[0.12] p-1 text-antique-gold">
                                        <Check className="h-3.5 w-3.5" />
                                    </span>
                                    <span>{bullet}</span>
                                </li>
                            ))}
                        </ul>

                        <Link
                            href="/about"
                            className="mt-8 inline-flex items-center gap-2 text-[11px] font-nav font-semibold uppercase tracking-[0.2em] text-deep-emerald transition duration-300 hover:text-antique-gold"
                        >
                            Explore the brand
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
