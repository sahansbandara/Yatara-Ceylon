'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Clock3 } from 'lucide-react';
import { transferCategoryCards } from '@/data/transfers';
import { formatPrice, useCurrency } from '@/lib/CurrencyContext';

const FLAGSHIP_CATEGORIES = transferCategoryCards.filter((category) =>
    ['airport', 'intercity', 'hourly'].includes(category.slug)
);

const CATEGORY_ROUTES: Record<string, string> = {
    airport: '/transfers/airport-concierge',
    intercity: '/transfers/intercity-executive',
    hourly: '/transfers/on-demand-chauffeur',
};

export default function TransfersTeaser() {
    const { currency, convertRate } = useCurrency();

    return (
        <section className="home-section-shell bg-[#edf2ec]">
            <div className="home-section-inner">
                <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-2xl">
                        <p className="home-kicker">Seamless Ground Transport</p>
                        <h2 className="home-heading mt-4">
                            Transfers stay on the homepage, but in a supporting role
                        </h2>
                        <p className="home-copy mt-5">
                            Airport arrivals, intercity comfort, and flexible chauffeur days remain easy to discover here without overpowering the core journey story.
                        </p>
                    </div>

                    <Link
                        href="/transfers"
                        className="inline-flex items-center gap-2 text-[11px] font-nav font-semibold uppercase tracking-[0.2em] text-deep-emerald transition duration-300 hover:text-antique-gold"
                    >
                        Explore transfers
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {FLAGSHIP_CATEGORIES.map((category) => (
                        <Link
                            key={category.slug}
                            href={CATEGORY_ROUTES[category.slug] || '/transfers'}
                            className="group overflow-hidden rounded-[28px] border border-deep-emerald/8 bg-white shadow-[0_14px_36px_rgba(4,57,39,0.06)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(4,57,39,0.12)]"
                        >
                            <div className="relative aspect-[4/5] overflow-hidden">
                                <Image
                                    src={category.image}
                                    alt={category.title}
                                    fill
                                    sizes="(max-width: 1024px) 100vw, 33vw"
                                    className="object-cover transition duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,19,14,0.08)_0%,rgba(3,19,14,0.78)_100%)]" />

                                <div className="absolute inset-x-0 bottom-0 p-6">
                                    <span className="rounded-full border border-white/16 bg-black/20 px-3 py-1 text-[10px] font-nav font-semibold uppercase tracking-[0.2em] text-antique-gold backdrop-blur-sm">
                                        {category.bestFor}
                                    </span>
                                    <h3 className="mt-4 text-3xl font-display leading-tight tracking-tight text-white">
                                        {category.title}
                                    </h3>
                                    <p className="mt-3 text-sm font-light leading-relaxed tracking-normal text-white/70">
                                        {category.subtitle}
                                    </p>
                                </div>
                            </div>

                            <div className="grid gap-4 p-6 sm:grid-cols-2">
                                <div>
                                    <p className="text-[10px] font-nav font-semibold uppercase tracking-[0.18em] text-deep-emerald/40">
                                        From
                                    </p>
                                    <p className="mt-2 text-lg font-display tracking-tight text-deep-emerald">
                                        {formatPrice(category.startingFromLkr, currency, convertRate)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-nav font-semibold uppercase tracking-[0.18em] text-deep-emerald/40">
                                        Typical timing
                                    </p>
                                    <p className="mt-2 inline-flex items-center gap-2 text-sm font-light tracking-normal text-deep-emerald/70">
                                        <Clock3 className="h-4 w-4 text-antique-gold" />
                                        {category.typicalDuration}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
