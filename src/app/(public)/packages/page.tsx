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
        images: ['/images/home/pkg_ramayana_1772119639135.png'],
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
        images: ['/images/home/pkg_ceylon_express_1772119662402.png'],
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
        images: ['/images/home/pkg_cultural_scenic_1772119769964.png'],
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
        images: ['/images/home/pkg_heritage_wildlife_1772119687299.png'],
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
        images: ['/images/home/pkg_classic_ceylon_1772119707902.png'],
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
        images: ['/images/home/pkg_east_coast_1772119793935.png'],
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
        images: ['/images/home/pkg_tea_temples_1772119728527.png'],
        difficulty: 'MODERATE',
        tags: ['Nature Lovers', 'History Buffs'],
    },
];

export default function PackagesPage() {
    return (
        <div className="min-h-screen bg-off-white pt-32 pb-24">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                {/* Header */}
                <div className="mb-20 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000 max-w-3xl mx-auto">
                    <span className="inline-block py-1.5 px-5 text-xs tracking-[0.2em] uppercase font-medium text-antique-gold border border-antique-gold/30 mb-8 bg-deep-emerald/5">
                        Our Signature Itineraries
                    </span>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-deep-emerald mb-6 leading-tight">
                        Signature Journeys
                    </h1>
                    <p className="text-gray-600 text-lg font-light leading-relaxed">
                        Handcrafted luxury itineraries for the discerning traveler. Each journey is meticulously designed to unveil the authentic soul of Ceylon with private guides and elite comforts.
                    </p>
                </div>

                {/* Grid Layout - 2 columns on desktop for larger, more luxurious cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10 mb-16">
                    {PACKAGES.map((pkg: any) => (
                        <PackageCard key={pkg._id} pkg={pkg} />
                    ))}
                </div>

                {/* View All Tours / Inquiry CTA */}
                <div className="mt-20 flex flex-col md:flex-row items-center justify-center gap-6">
                    <Link
                        href="/build-tour"
                        className="inline-flex items-center gap-3 px-10 py-5 bg-deep-emerald text-antique-gold hover:bg-deep-emerald/90 border border-antique-gold/30 font-serif uppercase tracking-[0.2em] text-sm transition-all duration-300 shadow-lg"
                    >
                        Build Custom Tour
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                        href="/inquire"
                        className="inline-flex items-center gap-3 px-10 py-5 bg-white text-deep-emerald hover:bg-off-white border border-deep-emerald/30 font-serif uppercase tracking-[0.2em] text-sm transition-all duration-300"
                    >
                        Request A Proposal
                    </Link>
                </div>
            </div>
        </div>
    );
}
