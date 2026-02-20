'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Clock, ArrowRight, Star } from 'lucide-react';
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
        <div className="group rounded-none overflow-hidden bg-white shadow-sm hover:shadow-2xl transition-all duration-500 border border-off-white/20 flex flex-col h-full">
            {/* Image */}
            <div className="relative h-52 overflow-hidden">
                <Image
                    src={pkg.images[0] || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&auto=format&fit=crop'}
                    alt={pkg.title}
                    fill
                    className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-3 right-3">
                    <Badge className="bg-white/90 text-deep-emerald hover:bg-white backdrop-blur-sm font-serif shadow-sm rounded-none tracking-widest text-[9px] uppercase">
                        {pkg.durationDays}-Day, {pkg.durationNights || pkg.durationDays - 1}-Night
                    </Badge>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-lg font-serif text-deep-emerald group-hover:text-antique-gold transition-colors duration-500 mb-2 line-clamp-2 leading-snug">
                    {pkg.title}
                </h3>
                <p className="text-gray-500 font-light text-xs line-clamp-3 leading-relaxed mb-3">
                    {pkg.description}
                </p>

                {/* Tags */}
                {pkg.tags && pkg.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                        {pkg.tags.map((tag) => (
                            <span
                                key={tag}
                                className="text-[9px] tracking-widest uppercase font-medium text-antique-gold/80 bg-antique-gold/8 border border-antique-gold/15 px-2 py-0.5"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-[9px] text-gray-400 font-semibold tracking-widest uppercase mb-0.5">Starting from</p>
                        <p className="text-xl font-serif text-deep-emerald">
                            {formatPrice(pkg.priceMin, currency, convertRate)}
                        </p>
                    </div>
                    <Link href={`/packages/${pkg.slug}`}>
                        <Button
                            size="icon"
                            className="bg-deep-emerald/5 border border-deep-emerald/10 text-deep-emerald hover:bg-antique-gold hover:text-white rounded-none transition-all duration-300 h-10 w-10 group-hover:scale-110"
                        >
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
