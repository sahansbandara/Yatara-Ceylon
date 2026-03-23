'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Clock, MapPin, Users } from 'lucide-react';
import { TransferProduct } from '@/data/transfers';
import { useCurrency, formatPrice } from '@/lib/CurrencyContext';

/* ─── Transfer-type → badge label ─── */
const typeBadge: Record<string, string> = {
    AIRPORT: 'Airport',
    INTERCITY: 'Intercity',
    HOURLY: 'Chauffeur',
    SCENIC: 'Scenic',
    SAFARI: 'Safari',
    EVENT: 'Event',
};

interface TransferCategoryShowcaseProps {
    transfers: TransferProduct[];
    sectionTitle?: string;
    sectionEyebrow?: string;
}

export default function TransferCategoryShowcase({
    transfers,
    sectionTitle = 'Available Routes',
    sectionEyebrow = 'Choose Your Route',
}: TransferCategoryShowcaseProps) {
    const { currency, convertRate } = useCurrency();

    if (transfers.length === 0) return null;

    return (
        <section className="py-20 bg-off-white">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                {/* Section Header */}
                <div className="mb-14">
                    <span className="text-[10px] tracking-[0.3em] uppercase text-antique-gold font-nav font-semibold block mb-3">
                        {sectionEyebrow}
                    </span>
                    <h2 className="font-serif text-3xl md:text-4xl font-bold text-deep-emerald">
                        {sectionTitle}
                    </h2>
                </div>

                {/* Route Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                    {transfers.map((transfer) => {
                        const cardImg =
                            transfer.cardImage || transfer.heroImage;
                        const badge = typeBadge[transfer.transferType] ?? '';

                        return (
                            <Link
                                key={transfer.slug}
                                href={`/transfers/${transfer.slug}`}
                                className="group block bg-white rounded-2xl overflow-hidden border border-deep-emerald/[0.06] hover:shadow-2xl hover:border-antique-gold/20 transition-all duration-500"
                            >
                                {/* ── Image Header ── */}
                                <div className="relative w-full aspect-[3/2] overflow-hidden">
                                    <Image
                                        src={cardImg}
                                        alt={transfer.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        className="object-cover group-hover:scale-[1.06] transition-transform duration-700 ease-out"
                                    />
                                    {/* Cinematic bottom gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                                    {/* Transfer type badge */}
                                    {badge && (
                                        <span className="absolute top-3 left-3 px-3 py-1 bg-deep-emerald/80 backdrop-blur-sm text-white text-[10px] font-nav font-semibold uppercase tracking-[0.15em] rounded-full">
                                            {badge}
                                        </span>
                                    )}

                                    {/* Duration + distance overlay at bottom */}
                                    <div className="absolute bottom-3 left-3 flex gap-3 text-white/90 text-xs font-nav">
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {transfer.duration}
                                        </span>
                                        {transfer.distanceKm > 0 && (
                                            <span className="flex items-center gap-1">
                                                <MapPin className="w-3 h-3" />
                                                {transfer.distanceKm} km
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* ── Card Body ── */}
                                <div className="p-5">
                                    {/* Route Name */}
                                    <h3 className="font-serif text-lg font-bold text-deep-emerald mb-1.5 group-hover:text-antique-gold transition-colors duration-300 leading-snug">
                                        {transfer.title}
                                    </h3>

                                    {/* Subtitle */}
                                    <p className="text-deep-emerald/55 text-[13px] font-nav leading-relaxed mb-4 line-clamp-2">
                                        {transfer.subtitle}
                                    </p>

                                    {/* Includes (first 3) */}
                                    <div className="flex flex-wrap gap-1.5 mb-4">
                                        {transfer.includes
                                            .slice(0, 3)
                                            .map((item) => (
                                                <span
                                                    key={item}
                                                    className="px-2 py-0.5 bg-antique-gold/[0.06] border border-antique-gold/[0.12] rounded text-[10px] font-nav text-deep-emerald/55"
                                                >
                                                    {item}
                                                </span>
                                            ))}
                                    </div>

                                    {/* Price + CTA Row */}
                                    <div className="flex items-center justify-between pt-4 border-t border-deep-emerald/[0.06]">
                                        <div>
                                            <span className="text-[10px] font-nav text-deep-emerald/35 uppercase tracking-wide block leading-none mb-0.5">
                                                From
                                            </span>
                                            <span className="font-serif text-xl font-bold text-deep-emerald">
                                                {formatPrice(
                                                    transfer.startingPriceLkr, currency, convertRate
                                                )}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-1.5 text-antique-gold text-xs font-nav font-semibold uppercase tracking-wider opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-500">
                                            View
                                            <ArrowRight className="w-3.5 h-3.5" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
