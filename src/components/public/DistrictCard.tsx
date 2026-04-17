'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, ChevronRight } from 'lucide-react';
import type { DistrictContentItem } from '@/lib/districtContent';

interface DistrictCardProps {
  district: DistrictContentItem;
  placeCount: number;
  index: number;
}

export default function DistrictCard({ district, placeCount, index }: DistrictCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration: 0.6,
        delay: (index % 6) * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Link
        href={`/destinations/${district.slug}`}
        className="group block relative overflow-hidden rounded-2xl lg:rounded-3xl bg-deep-emerald"
        style={{ aspectRatio: index % 5 === 0 ? '3/4' : '4/5' }}
      >
        {/* Background image */}
        <Image
          src={district.heroImage}
          alt={`${district.name} — luxury travel destination in Sri Lanka`}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors duration-500 pointer-events-none" />

        {/* Top: Category chips */}
        <div className="absolute top-4 left-4 right-4 flex flex-wrap gap-1.5">
          {district.categories.slice(0, 3).map((cat) => (
            <span
              key={cat}
              className="inline-block px-2.5 py-1 text-[8px] tracking-[0.2em] uppercase font-semibold text-white/80 bg-white/10 backdrop-blur-md border border-white/10 rounded-full"
            >
              {cat}
            </span>
          ))}
        </div>

        {/* Bottom: Content */}
        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
          {/* Tagline */}
          <p className="text-[9px] tracking-[0.3em] uppercase text-antique-gold/80 font-semibold mb-1.5">
            {district.tagline}
          </p>

          {/* District name */}
          <h3 className="text-xl sm:text-2xl font-display text-white mb-2 leading-tight group-hover:text-antique-gold transition-colors duration-300">
            {district.name}
          </h3>

          {/* Positioning sentence */}
          <p className="text-[11px] text-white/60 leading-relaxed mb-3 line-clamp-2">
            {district.positioning}
          </p>

          {/* Footer: place count + arrow */}
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.12em] text-white/45">
              <MapPin className="h-3 w-3" />
              {placeCount} curated {placeCount === 1 ? 'place' : 'places'}
            </span>

            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 group-hover:bg-antique-gold group-hover:border-antique-gold/50 transition-all duration-300">
              <ChevronRight className="h-3.5 w-3.5 text-white group-hover:text-deep-emerald transition-colors duration-300" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
