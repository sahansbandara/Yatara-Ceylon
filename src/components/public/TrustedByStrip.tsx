'use client';

import Image from 'next/image';

/**
 * Partner / press logos displayed below the hero.
 * Uses an infinite auto-scrolling marquee to display all partners.
 */
const PARTNERS = [
    { name: 'Sri Lanka Tourism', src: '/images/partners/sltda-logo.webp', alt: 'Sri Lanka Tourism Development Authority' },
    { name: 'Lonely Planet', src: '/images/partners/lonely-planet-logo.webp', alt: 'Lonely Planet Recommended' },
    { name: 'Booking.com', src: '/images/partners/booking-logo.webp', alt: 'Booking.com Partner', scale: 0.8 },
    // New partners added by user
    { name: 'TourCert', src: '/images/partners/tourcert-logo.webp', alt: 'TourCert Qualified', scale: 1.2 },
    { name: 'Carbon Neutral', src: '/images/partners/carbon-neutral-logo.webp', alt: 'Certified Carbon Neutral Fleet' },
    { name: 'Travelife', src: '/images/partners/travelife-logo.webp', alt: 'Travelife Partner' },
    { name: 'Biodiversity Sri Lanka', src: '/images/partners/biodiversity-logo.webp', alt: 'Biodiversity Sri Lanka' },
    { name: 'PATA', src: '/images/partners/pata-logo.webp', alt: 'PATA Sri Lanka Chapter' },
    { name: 'Plasticcycle', src: '/images/partners/plasticcycle-logo.webp', alt: 'Plasticcycle Initiative' },
];

export default function TrustedByStrip() {
    return (
        <section className="py-3 md:py-4 bg-white border-y border-black/[0.03] overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 mb-2 md:mb-3">
                {/* Label */}
                <h2 className="text-center text-xs md:text-sm font-display text-deep-emerald font-medium tracking-tight">
                    Global Accreditations & Prestigious Memberships
                </h2>
            </div>

            {/* Marquee container */}
            <div className="relative flex overflow-hidden group">
                {/* Fade overlays for smooth edges */}
                <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

                {/* Animated scrolling track */}
                <div className="flex w-max animate-marquee hover:[animation-play-state:paused] items-center">
                    {/* Render the sets multiple times for seamless loop */}
                    {[...Array(2)].map((_, setIndex) => (
                        <div key={setIndex} className="flex flex-nowrap shrink-0 items-center gap-x-3 md:gap-x-6 px-2 md:px-4">
                            {PARTNERS.map((partner) => (
                                <div
                                    key={partner.name}
                                    className="relative h-14 md:h-16 w-[100px] md:w-[130px] flex items-center justify-center transition-all duration-300 shrink-0"
                                >
                                    <Image
                                        src={partner.src}
                                        alt={partner.alt}
                                        width={150}
                                        height={80}
                                        className="max-h-12 md:max-h-14 w-auto object-contain"
                                        style={{ transform: partner.scale ? `scale(${partner.scale})` : undefined }}
                                    />
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
