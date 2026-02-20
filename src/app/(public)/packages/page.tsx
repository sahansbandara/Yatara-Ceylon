import { Metadata } from 'next';
import PackageCard from '@/components/public/PackageCard';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Signature Journeys | Yatara Ceylon',
    description: 'Explore our elite collection of Sri Lanka tour packages. Handcrafted luxury itineraries for the discerning traveler.',
};

const PACKAGES = [
    {
        _id: 'p1',
        title: 'The Ramayana Heritage Trail',
        slug: 'ramayana-heritage-trail',
        description: 'A spiritual and cultural odyssey tracing the ancient Ramayana saga across sacred temples, mystical caves, and legendary landmarks — perfect for families and pilgrims seeking profound heritage.',
        priceMin: 128000,
        durationDays: 6,
        durationNights: 5,
        images: ['https://images.unsplash.com/photo-1590123767956-2b7f3e541866?w=800&auto=format&fit=crop&q=80'],
        difficulty: 'LEISURE',
        tags: ['Families', 'Pilgrims', 'Culture'],
    },
    {
        _id: 'p2',
        title: 'The Ceylon Highlights Express',
        slug: 'ceylon-highlights-express',
        description: 'An essential 7-day immersion through Sri Lanka\'s crown jewels — from Sigiriya\'s lion fortress to Galle\'s colonial charm. Ideal for first-time visitors, couples, and families.',
        priceMin: 155000,
        durationDays: 7,
        durationNights: 6,
        images: ['https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?w=800&auto=format&fit=crop&q=80'],
        difficulty: 'EASY',
        tags: ['First-Time Visitors', 'Couples', 'Families'],
    },
    {
        _id: 'p3',
        title: 'The Cultural & Scenic Escape',
        slug: 'cultural-scenic-escape',
        description: 'A curated journey blending ancient kingdoms with breathtaking hill country landscapes. Experience the Cultural Triangle, tea plantations, and scenic train rides in refined luxury.',
        priceMin: 168000,
        durationDays: 7,
        durationNights: 6,
        images: ['https://images.unsplash.com/photo-1546708773-e57be64fa2e3?w=800&auto=format&fit=crop&q=80'],
        difficulty: 'MODERATE',
        tags: ['Culture Enthusiasts', 'Couples'],
    },
    {
        _id: 'p4',
        title: 'Heritage & Wildlife Adventure',
        slug: 'heritage-wildlife-adventure',
        description: 'The ultimate Sri Lanka experience — from UNESCO heritage sites to thrilling safari encounters at Yala National Park. Designed for wildlife lovers and history buffs alike.',
        priceMin: 195000,
        durationDays: 7,
        durationNights: 6,
        images: ['https://images.unsplash.com/photo-1616422345026-6b21857908da?w=800&auto=format&fit=crop&q=80'],
        difficulty: 'MODERATE',
        tags: ['Wildlife Lovers', 'History Buffs'],
    },
    {
        _id: 'p5',
        title: 'The Classic Ceylon Getaway',
        slug: 'classic-ceylon-getaway',
        description: 'A leisurely circuit through the island\'s timeless gems — Kandy, Nuwara Eliya, and the southern coast. Perfect for general travelers and families seeking a quintessential Sri Lanka experience.',
        priceMin: 142000,
        durationDays: 7,
        durationNights: 6,
        images: ['https://images.unsplash.com/photo-1563654492723-5eac40467a5f?w=800&auto=format&fit=crop&q=80'],
        difficulty: 'EASY',
        tags: ['General Travelers', 'Families'],
    },
    {
        _id: 'p6',
        title: 'The East Coast Explorer',
        slug: 'east-coast-explorer',
        description: 'Sun-drenched beaches, world-class surf breaks, and hidden lagoons along Sri Lanka\'s pristine eastern shoreline. An exclusive retreat for beach lovers and summer travelers.',
        priceMin: 175000,
        durationDays: 8,
        durationNights: 7,
        images: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80'],
        difficulty: 'LEISURE',
        tags: ['Beach Lovers', 'Summer Travelers'],
    },
    {
        _id: 'p7',
        title: 'Tea, Temples & Safari',
        slug: 'tea-temples-safari',
        description: 'A harmonious blend of misty tea estates, ancient temples, and thrilling game drives. An immersive 8-day journey for nature enthusiasts and history devotees.',
        priceMin: 189000,
        durationDays: 8,
        durationNights: 7,
        images: ['https://images.unsplash.com/photo-1588258387711-540e53db3838?w=800&auto=format&fit=crop&q=80'],
        difficulty: 'MODERATE',
        tags: ['Nature Lovers', 'History Buffs'],
    },
];

export default function PackagesPage() {
    return (
        <div className="min-h-screen bg-off-white pt-32 pb-20">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                {/* Header */}
                <div className="mb-16 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <span className="inline-block py-1 px-4 text-xs tracking-[0.2em] uppercase font-medium text-antique-gold border border-antique-gold/30 mb-6 bg-deep-emerald/5">
                        Our Signature Itineraries
                    </span>
                    <h1 className="text-4xl md:text-5xl font-serif text-deep-emerald mb-4">
                        Signature Journeys
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto font-light leading-relaxed">
                        Handcrafted luxury itineraries for the discerning traveler. Each journey is meticulously designed to unveil the authentic soul of Ceylon.
                    </p>
                </div>

                {/* Top Row — 5 cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-6">
                    {PACKAGES.slice(0, 5).map((pkg: any) => (
                        <PackageCard key={pkg._id} pkg={pkg} />
                    ))}
                </div>

                {/* Bottom Row — 2 cards + View All */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                    {PACKAGES.slice(5).map((pkg: any) => (
                        <PackageCard key={pkg._id} pkg={pkg} />
                    ))}
                    {/* Spacer for alignment */}
                    <div className="hidden xl:block" />
                    {/* View All Tours CTA */}
                    <div className="xl:col-span-2 flex items-center justify-center">
                        <Link
                            href="/build-tour"
                            className="inline-flex items-center gap-3 px-10 py-4 bg-deep-emerald text-antique-gold hover:bg-deep-emerald/90 border border-antique-gold/30 hover:border-antique-gold/60 font-serif uppercase tracking-[0.2em] text-sm transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                            View All Tours
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
