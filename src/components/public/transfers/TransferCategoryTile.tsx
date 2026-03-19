'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { formatLkr } from '@/data/transfers';

interface TransferCategoryTileProps {
    slug: string;
    title: string;
    subtitle: string;
    image: string;
    startingFromLkr: number;
    typicalDuration: string;
    bestFor: string;
}

export default function TransferCategoryTile({
    slug,
    title,
    subtitle,
    image,
    startingFromLkr,
    typicalDuration,
    bestFor,
}: TransferCategoryTileProps) {
    return (
        <Link href={`/transfers#${slug}`} className="group block">
            <div className="relative h-[420px] overflow-hidden rounded-xl shadow-lg transition-all duration-500 hover:shadow-2xl cursor-pointer">
                {/* Background Image */}
                <div className="absolute inset-0">
                    {image ? (
                        <Image
                            src={image}
                            alt={title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-deep-emerald/30 to-deep-emerald/10" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
                </div>

                {/* Content */}
                <div className="relative h-full flex flex-col justify-between p-6 z-10">
                    {/* Top — Best For badge */}
                    <div className="flex justify-between items-start">
                        <span className="inline-block px-3 py-1 bg-antique-gold/20 backdrop-blur-sm border border-antique-gold/30 rounded-full text-antique-gold text-[10px] font-nav font-semibold uppercase tracking-[0.2em]">
                            {bestFor}
                        </span>
                        <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:translate-x-0 translate-x-2">
                            <ArrowRight className="w-5 h-5 text-antique-gold" />
                        </div>
                    </div>

                    {/* Bottom — Main content */}
                    <div>
                        {/* Title & Subtitle */}
                        <h3 className="font-serif text-2xl md:text-3xl text-white font-bold mb-2 leading-tight">
                            {title}
                        </h3>
                        <p className="text-white/70 text-sm font-nav leading-relaxed mb-5 line-clamp-2">
                            {subtitle}
                        </p>

                        {/* Info Bar */}
                        <div className="border-t border-antique-gold/40 pt-4">
                            <div className="grid grid-cols-3 gap-3 text-xs font-nav">
                                <div>
                                    <span className="text-antique-gold uppercase tracking-widest font-semibold block mb-1">
                                        From
                                    </span>
                                    <span className="text-white font-semibold">
                                        {formatLkr(startingFromLkr)}
                                    </span>
                                </div>
                                <div className="text-center">
                                    <span className="text-antique-gold uppercase tracking-widest font-semibold block mb-1">
                                        Duration
                                    </span>
                                    <span className="text-white/80">
                                        {typicalDuration}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <span className="text-antique-gold uppercase tracking-widest font-semibold block mb-1">
                                        View
                                    </span>
                                    <span className="text-white/80 group-hover:text-antique-gold transition-colors">
                                        Explore →
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
