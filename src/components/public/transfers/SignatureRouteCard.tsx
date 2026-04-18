'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Clock, MapPin, Shield } from 'lucide-react';
import { useCurrency, formatPrice } from '@/lib/CurrencyContext';
import { DEFAULT_IMAGE_BLUR_DATA_URL } from '@/lib/image-utils';

interface SignatureRouteCardProps {
    from: string;
    to: string;
    title: string;
    slug: string;
    transferType: string;
    duration: string;
    distance: string;
    startingPriceLkr: number;
    vehicleTier: string;
    includes: string[];
    image: string;
}

export default function SignatureRouteCard({
    from,
    to,
    title,
    slug,
    transferType,
    duration,
    distance,
    startingPriceLkr,
    vehicleTier,
    includes,
    image,
}: SignatureRouteCardProps) {
    const { currency, convertRate } = useCurrency();

    const typeBadgeColor = {
        AIRPORT: 'bg-blue-500/20 text-blue-300 border-blue-400/30',
        INTERCITY: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
        SCENIC: 'bg-purple-500/20 text-purple-300 border-purple-400/30',
        HOURLY: 'bg-amber-500/20 text-amber-300 border-amber-400/30',
        SAFARI: 'bg-orange-500/20 text-orange-300 border-orange-400/30',
        EVENT: 'bg-pink-500/20 text-pink-300 border-pink-400/30',
    }[transferType] || 'bg-white/20 text-white/80 border-white/30';

    return (
        <Link href={`/transfers/${slug}`} className="group block h-[450px]">
            <div className="relative h-full overflow-hidden rounded-xl shadow-md transition-all duration-500 hover:shadow-xl cursor-pointer bg-deep-emerald">
                {/* Image Background */}
                <div className="absolute inset-0">
                    {image ? (
                        <Image
                            src={image}
                            alt={`${from} to ${to}`}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                            quality={68}
                            placeholder="blur"
                            blurDataURL={DEFAULT_IMAGE_BLUR_DATA_URL}
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-deep-emerald/30 to-deep-emerald/10" />
                    )}
                    {/* Layered Gradients for distinct text legibility */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/90" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                </div>

                {/* Top Badge */}
                <div className="absolute top-4 left-4 z-10 flex justify-between w-[calc(100%-2rem)]">
                    <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-nav font-semibold uppercase tracking-[0.15em] border backdrop-blur-sm shadow-lg ${typeBadgeColor}`}>
                        {transferType}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                        <ArrowRight className="w-4 h-4 text-white" />
                    </div>
                </div>

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-5 z-10 flex flex-col justify-end h-full opacity-100">
                    {/* Includes Badges / Tags (shows on hover for desktop, or static) */}
                    <div className="flex flex-wrap gap-1.5 mb-3 opacity-80 group-hover:opacity-100 transition-opacity">
                        {includes.slice(0, 2).map((item, idx) => (
                            <span
                                key={idx}
                                className="inline-block px-2 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded text-[9px] font-nav text-white/90 uppercase tracking-wider"
                            >
                                {item}
                            </span>
                        ))}
                    </div>

                    <p className="text-antique-gold text-xs font-nav font-bold uppercase tracking-wider mb-1">
                        {title}
                    </p>
                    <h3 className="text-white text-xl md:text-2xl font-serif font-bold mb-4 leading-tight group-hover:text-antique-gold transition-colors duration-300">
                        {from} <span className="opacity-50 mx-1">→</span> {to}
                    </h3>

                    {/* Quick Facts */}
                    <div className="flex flex-wrap gap-x-4 gap-y-2 mb-5">
                        <div className="flex items-center gap-1.5 text-xs font-nav text-white/80">
                            <Clock className="w-3.5 h-3.5 text-antique-gold" />
                            {duration}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-nav text-white/80">
                            <MapPin className="w-3.5 h-3.5 text-antique-gold" />
                            {distance}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-nav text-white/80">
                            <Shield className="w-3.5 h-3.5 text-antique-gold" />
                            {vehicleTier}
                        </div>
                    </div>

                    {/* Price & CTA */}
                    <div className="pt-4 border-t border-white/20 flex flex-row items-center justify-between">
                        <div>
                            <span className="text-[10px] font-nav text-white/60 uppercase tracking-widest block mb-0.5">
                                Starting From
                            </span>
                            <span className="font-serif text-lg font-bold text-white">
                                {formatPrice(startingPriceLkr, currency, convertRate)}
                            </span>
                        </div>
                        <span className="text-[10px] font-nav font-bold uppercase tracking-widest text-antique-gold group-hover:text-white transition-colors">
                            Explore
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
