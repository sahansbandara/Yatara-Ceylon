import { Metadata } from 'next';
import DestinationCard from '@/components/public/DestinationCard';
import { DESTINATIONS } from '@/data/destinations';

export const metadata: Metadata = {
    title: 'The Destinations | Yatara Ceylon',
    description: 'Explore all 25 districts of Sri Lanka. From the vibrant streets of Colombo to the untouched beauty of the Northern peninsula.',
};

export default function DestinationsPage() {
    return (
        <div className="min-h-screen bg-deep-emerald/5 pt-32 pb-24">
            <div className="max-w-[1900px] mx-auto px-4 sm:px-6 md:px-8">
                <div className="mb-24 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000 max-w-4xl mx-auto">
                    <span className="inline-block py-2 px-6 text-[10px] tracking-[0.4em] uppercase font-medium text-antique-gold border border-antique-gold/30 mb-8 bg-transparent backdrop-blur-md">
                        The Map of Wonders
                    </span>
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-deep-emerald mb-8 leading-tight tracking-normal">
                        Our Private <span className="italic font-light text-antique-gold drop-shadow-sm">Destinations</span>
                    </h1>
                    <p className="text-gray-600 text-lg md:text-xl font-light leading-relaxed drop-shadow-sm">
                        Explore all 25 districts of the island from metropolitan elegance to untouched wild frontiers, each curated for premium journeys.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 xl:gap-7">
                    {DESTINATIONS.map((dest) => (
                        <DestinationCard key={dest._id} destination={dest} />
                    ))}
                </div>
            </div>
        </div>
    );
}
