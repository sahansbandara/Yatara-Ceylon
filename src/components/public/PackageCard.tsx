'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCurrency, formatPrice } from '@/lib/CurrencyContext';

interface PackageCardProps {
    pkg: {
        title: string;
        slug: string;
        description: string;
        priceMin: number;
        durationDays: number;
        durationNights?: number;
        images: string[];
        difficulty: string;
        tags?: string[];
    };
}

export default function PackageCard({ pkg }: PackageCardProps) {
    const { currency, convertRate } = useCurrency();

    return (
        <div className="group rounded-none overflow-hidden bg-white hover:bg-off-white/50 border border-transparent hover:border-antique-gold/30 transition-all duration-700 flex flex-col h-full shadow-sm">
            {/* Image */}
            <div className="relative h-[280px] overflow-hidden">
                <Image
                    src={pkg.images[0]}
                    alt={pkg.title}
                    fill
                    className="object-cover transform group-hover:scale-105 transition-transform duration-1000 ease-out"
                />
                <div className="absolute top-4 right-4">
                    <Badge className="bg-white/90 text-deep-emerald hover:bg-white backdrop-blur-sm font-serif shadow-sm rounded-none tracking-widest text-[10px] uppercase px-3 py-1.5">
                        {pkg.durationDays} Days, {pkg.durationNights || pkg.durationDays - 1} Nights
                    </Badge>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-deep-emerald/80 via-transparent to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-700" />
            </div>

            {/* Content gap-8 for spaciousness */}
            <div className="p-8 flex flex-col flex-grow">
                {/* Tags */}
                {pkg.tags && pkg.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {pkg.tags.slice(0, 2).map((tag) => (
                            <span
                                key={tag}
                                className="text-[10px] tracking-[0.2em] uppercase font-medium text-antique-gold"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                <h3 className="text-2xl font-serif text-deep-emerald group-hover:text-antique-gold transition-colors duration-500 mb-4 leading-snug">
                    {pkg.title}
                </h3>

                <p className="text-gray-500 font-light text-sm line-clamp-3 leading-relaxed mb-8 flex-grow">
                    {pkg.description}
                </p>

                <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] text-gray-400 font-semibold tracking-widest uppercase mb-1">Starting from</p>
                        <p className="text-xl font-serif text-deep-emerald">
                            {formatPrice(pkg.priceMin, currency, convertRate)}
                        </p>
                    </div>
                    <Link href={`/packages/${pkg.slug}`}>
                        <Button
                            variant="outline"
                            className="border-deep-emerald text-deep-emerald hover:bg-deep-emerald hover:text-white rounded-none transition-all duration-500 h-10 px-6 uppercase tracking-widest text-xs font-semibold group-hover:bg-deep-emerald group-hover:text-white"
                        >
                            Explore
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
