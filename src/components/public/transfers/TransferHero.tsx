import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface CTAButton {
  label: string;
  href: string;
}

interface TransferHeroProps {
  badge?: string;
  title: string;
  titleAccent?: string;
  description: string;
  primaryCTA?: CTAButton;
  secondaryCTA?: CTAButton;
}

export default function TransferHero({
  badge,
  title,
  titleAccent,
  description,
  primaryCTA,
  secondaryCTA,
}: TransferHeroProps) {
  return (
    <section className="relative bg-deep-emerald text-white py-16 md:py-24 overflow-hidden">
      {/* Background accent elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-antique-gold/10 rounded-full filter blur-3xl -translate-y-1/2 -translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-antique-gold/10 rounded-full filter blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Badge */}
        {badge && (
          <div className="flex justify-center mb-6 md:mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-2 border border-antique-gold/50 rounded-full">
              <span className="inline-block w-2 h-2 rounded-full bg-antique-gold" />
              <span className="text-sm font-nav uppercase tracking-widest font-semibold text-antique-gold">
                {badge}
              </span>
            </span>
          </div>
        )}

        {/* Title with accent */}
        <div className="text-center mb-6 md:mb-8">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-wide">
            {title}
            {titleAccent && (
              <>
                {' '}
                <span className="text-antique-gold italic font-display">
                  {titleAccent}
                </span>
              </>
            )}
          </h1>
        </div>

        {/* Gold divider */}
        <div className="flex justify-center mb-8 md:mb-10">
          <div className="h-1 w-16 bg-gradient-to-r from-transparent via-antique-gold to-transparent" />
        </div>

        {/* Description */}
        <p className="text-center text-lg md:text-xl text-white/90 font-nav leading-relaxed mb-10 md:mb-12 max-w-2xl mx-auto">
          {description}
        </p>

        {/* CTAs */}
        {(primaryCTA || secondaryCTA) && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {primaryCTA && (
              <Link href={primaryCTA.href}>
                <button className="px-8 py-4 bg-antique-gold text-deep-emerald font-nav font-bold uppercase tracking-widest rounded-lg transition-all duration-300 hover:shadow-2xl hover:shadow-antique-gold/30 hover:scale-105 flex items-center gap-2 group">
                  {primaryCTA.label}
                  <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </Link>
            )}

            {secondaryCTA && (
              <Link href={secondaryCTA.href}>
                <button className="px-8 py-4 border-2 border-antique-gold text-antique-gold font-nav font-bold uppercase tracking-widest rounded-lg transition-all duration-300 hover:bg-antique-gold/10 hover:scale-105 flex items-center gap-2 group">
                  {secondaryCTA.label}
                  <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
