'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Clock, ArrowRight, User } from 'lucide-react';
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
        images: string[];
        difficulty: string;
    };
}

export default function PackageCard({ pkg }: PackageCardProps) {
    const { currency, convertRate } = useCurrency();

    return (
        <div className="group rounded-none overflow-hidden bg-white shadow-sm hover:shadow-2xl transition-all duration-500 border border-off-white/20 flex flex-col h-full">
            {/* Image */}
            <div className="relative h-64 overflow-hidden">
                <Image
                    src={pkg.images[0] || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&auto=format&fit=crop'}
                    alt={pkg.title}
                    fill
                    className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 right-4">
                    <Badge className="bg-white/90 text-deep-emerald hover:bg-white backdrop-blur-sm font-serif shadow-sm rounded-none tracking-widest text-[10px] uppercase">
                        {pkg.durationDays} Days
                    </Badge>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-grow">
                <div className="mb-4">
                    <div className="flex items-center gap-2 text-antique-gold text-xs font-semibold uppercase tracking-widest mb-3 font-serif">
                        <span>{pkg.difficulty}</span>
                        <span>•</span>
                        <span>Curated Journey</span>
                    </div>
                    <h3 className="text-2xl font-serif text-deep-emerald group-hover:text-antique-gold transition-colors duration-500 mb-3 line-clamp-2">
                        {pkg.title}
                    </h3>
                    <p className="text-gray-500 font-light text-sm line-clamp-3 leading-relaxed">
                        {pkg.description}
                    </p>
                </div>

                <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] text-gray-400 font-semibold tracking-widest uppercase mb-1">Starting from</p>
                        <p className="text-2xl font-serif text-deep-emerald">
                            {formatPrice(pkg.priceMin, currency, convertRate)}
                        </p>
                    </div>
                    <Link href={`/packages/${pkg.slug}`}>
                        <Button
                            size="icon"
                            className="bg-deep-emerald/5 border border-deep-emerald/10 text-deep-emerald hover:bg-antique-gold hover:text-white rounded-none transition-all duration-300 h-12 w-12 group-hover:scale-110"
                        >
                            <ArrowRight className="h-5 w-5" />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
