'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';
import { formatPrice, useCurrency } from '@/lib/CurrencyContext';

interface JourneyCardData {
    id: string;
    title: string;
    href: string;
    duration: string;
    image: string;
    highlights: string[];
    priceMin: number;
    styleLabel: string;
}

export default function FeaturedJourneysClient({
    packages,
}: {
    packages: JourneyCardData[];
}) {
    const { currency, convertRate } = useCurrency();

    if (!packages.length) {
        return null;
    }

    return (
        <section className="home-section-shell bg-[#eef3ee]">
            <div className="home-section-inner">
                <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-2xl">
                        <p className="home-kicker">Featured Journeys</p>
                        <h2 className="home-heading mt-4">
                            Concrete itineraries, without the catalog overload
                        </h2>
                        <p className="home-copy mt-5">
                            A tighter edit of private routes worth exploring next. The homepage shows only the strongest starting points, while the deeper catalog lives on the journeys page.
                        </p>
                    </div>

                    <Link
                        href="/packages"
                        className="inline-flex items-center gap-2 text-[11px] font-nav font-semibold uppercase tracking-[0.2em] text-deep-emerald transition duration-300 hover:text-antique-gold"
                    >
                        View all journeys
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {packages.slice(0, 6).map((pkg) => (
                        <Link
                            key={pkg.id}
                            href={pkg.href}
                            className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-deep-emerald/8 bg-white shadow-[0_14px_40px_rgba(4,57,39,0.06)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(4,57,39,0.12)]"
                        >
                            <div className="relative aspect-[4/3] overflow-hidden">
                                <Image
                                    src={pkg.image}
                                    alt={pkg.title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                                    className="object-cover transition duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,19,14,0.1)_0%,rgba(3,19,14,0.45)_100%)]" />
                                <span className="absolute left-5 top-5 rounded-full border border-white/20 bg-black/25 px-3 py-1 text-[10px] font-nav font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-sm">
                                    {pkg.styleLabel}
                                </span>
                            </div>

                            <div className="flex flex-1 flex-col p-6">
                                <div className="flex flex-wrap items-center gap-3 text-[10px] font-nav font-semibold uppercase tracking-[0.16em] text-deep-emerald/50">
                                    <span className="inline-flex items-center gap-1.5">
                                        <Clock className="h-3.5 w-3.5" />
                                        {pkg.duration}
                                    </span>
                                    <span className="h-1 w-1 rounded-full bg-antique-gold/70" />
                                    <span>
                                        {pkg.priceMin > 0
                                            ? `From ${formatPrice(pkg.priceMin, currency, convertRate)}`
                                            : 'Tailored pricing'}
                                    </span>
                                </div>

                                <h3 className="mt-4 text-3xl font-display leading-tight tracking-tight text-deep-emerald transition duration-300 group-hover:text-antique-gold">
                                    {pkg.title}
                                </h3>

                                <ul className="mt-6 space-y-3">
                                    {pkg.highlights.slice(0, 2).map((highlight) => (
                                        <li
                                            key={highlight}
                                            className="flex items-start gap-3 text-sm font-light leading-relaxed tracking-normal text-deep-emerald/70"
                                        >
                                            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-antique-gold" />
                                            <span>{highlight}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-8 inline-flex items-center gap-2 text-[11px] font-nav font-semibold uppercase tracking-[0.18em] text-deep-emerald transition duration-300 group-hover:text-antique-gold">
                                    View full itinerary
                                    <ArrowRight className="h-4 w-4 transition duration-300 group-hover:translate-x-1" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
