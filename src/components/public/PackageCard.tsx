'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useCurrency, formatPrice } from '@/lib/CurrencyContext';

interface PackageCardProps {
    pkg: {
        title: string;
        slug: string;
        description?: string;
        summary?: string;
        priceMin: number;
        duration?: string;
        durationDays?: number;
        durationNights?: number;
        images: string[];
        difficulty?: string;
        tags?: string[];
        highlights?: string[];
    };
}

export default function PackageCard({ pkg }: PackageCardProps) {
    const { currency, convertRate } = useCurrency();

    const displayText = pkg.summary || pkg.description || '';
    const durationLabel = pkg.duration || (pkg.durationDays ? `${pkg.durationDays} Days, ${pkg.durationNights || pkg.durationDays - 1} Nights` : '');

    return (
        <div className="group rounded-2xl overflow-hidden liquid-glass-card flex flex-col h-full relative">
            {/* Image */}
            <div className="relative h-[280px] overflow-hidden">
                <Image
                    src={pkg.images?.[0] || '/images/home/curated-kingdoms.png'}
                    alt={pkg.title}
                    fill
                    className="object-cover transform group-hover:scale-[1.03] transition-transform duration-1000 ease-out"
                />
                {durationLabel && (
                    <div className="absolute top-4 right-4">
                        <span className="text-[10px] tracking-[0.15em] uppercase font-medium text-white/90 bg-white/15 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                            {durationLabel}
                        </span>
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </div>

            {/* Content */}
            <div className="p-7 flex flex-col flex-grow">
                {/* Tags */}
                {pkg.tags && pkg.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                        {pkg.tags.slice(0, 3).map((tag) => (
                            <span
                                key={tag}
                                className="text-[10px] tracking-[0.15em] uppercase font-medium text-antique-gold"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                <h3 className="text-xl font-display text-deep-emerald group-hover:text-antique-gold transition-colors duration-500 mb-3 leading-snug">
                    {pkg.title}
                </h3>

                <p className="text-gray-500 font-light text-sm line-clamp-2 leading-relaxed mb-5 flex-grow">
                    {displayText}
                </p>

                {/* Highlights preview */}
                {pkg.highlights && pkg.highlights.length > 0 && (
                    <div className="mb-5 space-y-1">
                        {pkg.highlights.slice(0, 2).map((h, i) => (
                            <p key={i} className="text-[11px] text-gray-400 font-light flex items-start gap-1.5">
                                <span className="text-antique-gold mt-0.5">&#9670;</span>
                                {h}
                            </p>
                        ))}
                    </div>
                )}

                <div className="mt-auto pt-5 border-t border-gray-100/50 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] text-gray-400 font-medium tracking-widest uppercase mb-0.5">From</p>
                        <p className="text-lg font-display text-deep-emerald">
                            {formatPrice(pkg.priceMin, currency, convertRate)}
                        </p>
                    </div>
                    <Link href={`/packages/${pkg.slug}`}>
                        <Button
                            variant="outline"
                            className="border-deep-emerald/20 text-deep-emerald hover:bg-deep-emerald hover:text-white rounded-xl transition-all duration-500 h-9 px-5 uppercase tracking-widest text-[10px] font-semibold group-hover:bg-deep-emerald group-hover:text-white"
                        >
                            Explore
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
