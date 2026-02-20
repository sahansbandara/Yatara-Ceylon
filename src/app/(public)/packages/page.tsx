import { Metadata } from 'next';
import PackageCard from '@/components/public/PackageCard';

export const metadata: Metadata = {
    title: 'Curated Journeys | Yatara Ceylon',
    description: 'Explore our elite collection of Sri Lanka tour packages. From wildlife safaris to cultural expeditions.',
};

const PACKAGES = [
    {
        _id: 'p1',
        title: 'The Wildlife Safari Expedition',
        slug: 'wildlife-safari',
        description: 'An exclusive journey through Yala and Wilpattu, tracking leopards and elephants with expert naturalists from the comfort of luxury tented camps.',
        priceMin: 155000,
        durationDays: 7,
        images: ['https://images.unsplash.com/photo-1616422345026-6b21857908da?w=800&auto=format&fit=crop'],
        difficulty: 'LEISURE',
    },
    {
        _id: 'p2',
        title: 'The Ceylon Tea Trail',
        slug: 'tea-trail',
        description: 'A serene escape into the central highlands, staying in meticulously restored colonial planter bungalows amidst rolling emerald tea estates.',
        priceMin: 86800,
        durationDays: 5,
        images: ['https://images.unsplash.com/photo-1563654492723-5eac40467a5f?w=800&auto=format&fit=crop'],
        difficulty: 'EASY',
    },
    {
        _id: 'p3',
        title: 'The Cultural Triangle',
        slug: 'cultural-triangle',
        description: 'Immerse yourself in centuries of ancient royal heritage, exploring majestically preserved ruins and soaring stupas with private historians.',
        priceMin: 139500,
        durationDays: 4,
        images: ['https://images.unsplash.com/photo-1610488057200-e17f779de091?w=800&auto=format&fit=crop'],
        difficulty: 'MODERATE',
    }
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
                        Curated Journeys
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto font-light leading-relaxed">
                        Find the perfect itinerary for your Sri Lankan adventure, tailored for the elite traveler looking for uncompromising luxury.
                    </p>
                </div>

                {/* Packages Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {PACKAGES.map((pkg: any) => (
                        <PackageCard key={pkg._id} pkg={pkg} />
                    ))}
                </div>
            </div>
        </div>
    );
}
