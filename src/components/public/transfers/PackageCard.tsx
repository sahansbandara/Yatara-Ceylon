'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface PackageCardProps {
  slug: string;
  categorySlug: string;
  title: string;
  tagline: string;
  image: string;
  highlights: string[];
  startingFrom: string;
}

export default function PackageCard({
  slug,
  categorySlug,
  title,
  tagline,
  image,
  highlights,
  startingFrom,
}: PackageCardProps) {
  return (
    <Link href={`/transfers/${categorySlug}/${slug}`}>
      <div className="group h-full overflow-hidden rounded-lg shadow-md transition-all duration-500 hover:shadow-2xl hover:translate-y-[-8px] hover:border-antique-gold border-2 border-transparent cursor-pointer bg-white">
        {/* Image Container */}
        <div className="relative h-64 w-full overflow-hidden bg-deep-emerald/10">
          {image ? (
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="absolute inset-0 bg-deep-emerald/10 flex items-center justify-center">
              <p className="text-deep-emerald/30 text-sm font-nav">{/* {image} */}</p>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col h-full">
          {/* Title */}
          <h3 className="font-serif text-2xl font-bold text-deep-emerald mb-2 line-clamp-2 group-hover:text-antique-gold transition-colors duration-300">
            {title}
          </h3>

          {/* Tagline */}
          <p className="text-deep-emerald/70 text-sm font-nav mb-4 leading-relaxed line-clamp-2">
            {tagline}
          </p>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-antique-gold/30 to-transparent mb-4" />

          {/* Highlights */}
          <div className="space-y-2.5 mb-6 flex-1">
            {highlights.map((highlight, index) => (
              <div
                key={index}
                className="flex items-start gap-3 text-sm text-deep-emerald/80 font-nav"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-antique-gold mt-2 flex-shrink-0" />
                <span>{highlight}</span>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-antique-gold/30 to-transparent mb-4" />

          {/* Price and CTA */}
          <div className="space-y-3 pt-2">
            {/* Starting Price */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-nav text-deep-emerald/60 uppercase tracking-widest font-semibold">
                Starting From
              </span>
              <span className="font-serif text-xl font-bold text-antique-gold">
                {startingFrom}
              </span>
            </div>

            {/* View Details Link */}
            <div className="flex items-center gap-2 text-antique-gold font-nav font-semibold uppercase tracking-widest text-xs pt-2 group-hover:gap-3 transition-all duration-300">
              <span>View Details</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
