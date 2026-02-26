import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import SectionHeading from './SectionHeading';

const curatedJourneys = [
    {
        id: 'hill-country',
        title: 'The Hill Country Odyssey',
        description: 'A bespoke journey through misty tea plantations, colonial bungalows, and cascading waterfalls. Experience the refined slow pace of Ceylon.',
        image: '/images/home/curated-hillcountry.png',
    },
    {
        id: 'southern-coast',
        title: 'Southern Coast Serenity',
        description: 'Private villas, secluded golden beaches, and the heritage of Galle Fort. Unwind where the Indian Ocean meets curated luxury.',
        image: '/images/home/curated-southcoast.png',
    },
    {
        id: 'ancient-kingdoms',
        title: 'Ancient Kingdom Trails',
        description: 'Exclusive access to the cultural triangle. Discover Sigiriya and Polonnaruwa with private historians and boutique eco-lodges.',
        image: '/images/home/curated-kingdoms.png',
    }
];

export default function CuratedCollection() {
    return (
        <section className="py-24 bg-off-white text-deep-emerald relative">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="text-center mb-16">
                    <span className="inline-block mb-4 text-xs tracking-[0.2em] font-medium text-antique-gold uppercase">
                        Signature Experiences
                    </span>
                    <SectionHeading
                        title="The Curated Collection"
                        subtitle=""
                        description="Handpicked, highly personalized itineraries designed for the discerning traveler. Immerse yourself in the authentic soul of Ceylon."
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {curatedJourneys.map((journey) => (
                        <div key={journey.id} className="group relative overflow-hidden bg-white shadow-sm hover:shadow-2xl transition-all duration-700 border border-gray-200/50 hover:border-antique-gold/50 flex flex-col h-full rounded-none">
                            <div className="relative h-[28rem] w-full overflow-hidden">
                                <Image
                                    src={journey.image}
                                    alt={journey.title}
                                    fill
                                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-deep-emerald/90 via-deep-emerald/30 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-700" />
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 p-10 transform translate-y-6 group-hover:translate-y-0 transition-transform duration-700 ease-out">
                                <h3 className="text-3xl font-serif tracking-wide text-off-white mb-4 group-hover:text-antique-gold transition-colors duration-500">
                                    {journey.title}
                                </h3>
                                <p className="text-off-white/90 font-light text-sm mb-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-150 leading-relaxed max-w-[95%]">
                                    {journey.description}
                                </p>
                                <Link
                                    href={`/packages`}
                                    className="inline-flex items-center text-xs tracking-[0.2em] text-antique-gold hover:text-white uppercase font-semibold transition-colors duration-300 border-b border-transparent hover:border-white pb-1"
                                >
                                    View Journey <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
