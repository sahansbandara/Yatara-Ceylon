'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Clock, MapPin, Shield } from 'lucide-react';
import { formatLkr } from '@/data/transfers';

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
    const typeBadgeColor = {
        AIRPORT: 'bg-blue-500/20 text-blue-300 border-blue-400/30',
        INTERCITY: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
        SCENIC: 'bg-purple-500/20 text-purple-300 border-purple-400/30',
        HOURLY: 'bg-amber-500/20 text-amber-300 border-amber-400/30',
        SAFARI: 'bg-orange-500/20 text-orange-300 border-orange-400/30',
        EVENT: 'bg-pink-500/20 text-pink-300 border-pink-400/30',
    }[transferType] || 'bg-white/20 text-white/80 border-white/30';

    return (
        <Link href={`/transfers/${slug}`}>
            <div className="group overflow-hidden rounded-xl shadow-md transition-all duration-500 hover:shadow-xl hover:translate-y-[-4px] cursor-pointer bg-white border border-deep-emerald/5 h-full flex flex-col">
                {/* Image Container */}
                <div className="relative h-52 w-full overflow-hidden">
                    {image ? (
                        <Image
                            src={image}
                            alt={`${from} to ${to}`}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-deep-emerald/20 to-deep-emerald/5" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                    {/* Type Badge */}
                    <div className="absolute top-4 left-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-nav font-semibold uppercase tracking-[0.15em] border backdrop-blur-sm ${typeBadgeColor}`}>
                            {transferType}
                        </span>
                    </div>

                    {/* Route Label */}
                    <div className="absolute bottom-4 left-4 right-4">
                        <p className="text-white text-lg font-serif font-bold">
                            {from} → {to}
                        </p>
                        <p className="text-antique-gold text-xs font-nav font-semibold uppercase tracking-wider">
                            {title}
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                    {/* Quick Facts */}
                    <div className="flex flex-wrap gap-3 mb-4">
                        <div className="flex items-center gap-1.5 text-xs font-nav text-deep-emerald/70">
                            <Clock className="w-3.5 h-3.5 text-antique-gold" />
                            {duration}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-nav text-deep-emerald/70">
                            <MapPin className="w-3.5 h-3.5 text-antique-gold" />
                            {distance}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-nav text-deep-emerald/70">
                            <Shield className="w-3.5 h-3.5 text-antique-gold" />
                            {vehicleTier}
                        </div>
                    </div>

                    {/* Includes */}
                    <div className="flex flex-wrap gap-1.5 mb-4 flex-1">
                        {includes.map((item, idx) => (
                            <span
                                key={idx}
                                className="inline-block px-2.5 py-1 bg-deep-emerald/5 border border-deep-emerald/10 rounded-md text-[11px] font-nav text-deep-emerald/60"
                            >
                                {item}
                            </span>
                        ))}
                    </div>

                    {/* Price + CTA */}
                    <div className="border-t border-deep-emerald/10 pt-4 flex items-center justify-between">
                        <div>
                            <span className="text-[10px] font-nav text-deep-emerald/50 uppercase tracking-widest block">
                                From
                            </span>
                            <span className="font-serif text-lg font-bold text-deep-emerald">
                                {formatLkr(startingPriceLkr)}
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-antique-gold text-xs font-nav font-semibold uppercase tracking-widest group-hover:gap-2.5 transition-all duration-300">
                            View Route
                            <ArrowRight className="w-4 h-4" />
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
