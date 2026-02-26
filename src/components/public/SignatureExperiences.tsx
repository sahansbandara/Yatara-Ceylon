import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Clock, Users, Compass } from 'lucide-react';
import SectionHeading from './SectionHeading';

const featuredJourney = {
    id: 'ramayana-heritage-trail',
    title: 'The Ramayana Heritage Trail',
    description: 'Trace the legendary footsteps of the Ramayana across Sri Lanka\'s most sacred and breathtaking sites. From the ancient temples of Nuwara Eliya to the coastal shrines of Trincomalee, this journey weaves mythology with natural wonder in an experience found nowhere else on earth.',
    image: '/images/home/signature-heritage.png',
    href: '/packages/ramayana-heritage-trail',
    duration: '10 Days',
    style: 'Private Guide · Heritage Focus',
    highlights: ['Ancient temple circuits', 'Private historian escorts', 'Boutique heritage stays'],
};

const supportingJourneys = [
    {
        id: 'ceylon-highlights-express',
        title: 'Ceylon Highlights Express',
        description: 'The essential Sri Lanka in seven unforgettable days — tea country, wildlife, and golden coastline.',
        image: '/images/home/signature-ceylon.png',
        href: '/packages/ceylon-highlights-express',
        duration: '7 Days',
        style: 'Private Chauffeur · All Highlights',
    },
    {
        id: 'heritage-wildlife-adventure',
        title: 'Heritage & Wildlife Adventure',
        description: 'Ancient kingdoms by morning, leopard safaris by dusk — the ultimate Sri Lanka dual experience.',
        image: '/images/home/signature-wildlife.png',
        href: '/packages/heritage-wildlife-adventure',
        duration: '12 Days',
        style: 'Private Guide · Wildlife & Culture',
    },
];

export default function SignatureExperiences() {
    return (
        <section className="py-28 bg-off-white/50 border-t border-antique-gold/10">
            <div className="container mx-auto px-6 max-w-7xl">
                <SectionHeading
                    title="Signature Experiences"
                    description="Curated luxury journeys across the most breathtaking landscapes of Sri Lanka — each one fully private, fully bespoke."
                    align="center"
                />

                {/* Featured Journey — Large Editorial Panel */}
                <div className="mt-20 group relative overflow-hidden bg-white shadow-sm hover:shadow-xl transition-shadow duration-700 border border-deep-emerald/5">
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        <div className="relative h-[400px] lg:h-[550px] overflow-hidden">
                            <Image
                                src={featuredJourney.image}
                                alt={featuredJourney.title}
                                fill
                                className="object-cover group-hover:scale-[1.03] transition-transform duration-1000 ease-out"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10 lg:bg-gradient-to-r lg:from-transparent lg:to-white/5" />
                        </div>

                        <div className="p-10 lg:p-16 flex flex-col justify-center">
                            <span className="inline-block mb-4 text-xs tracking-[0.2em] font-medium text-antique-gold uppercase">
                                Featured Journey
                            </span>
                            <h3 className="text-3xl lg:text-4xl font-serif text-deep-emerald mb-6 leading-tight">
                                {featuredJourney.title}
                            </h3>
                            <p className="text-gray-500 font-light leading-relaxed mb-8 max-w-lg">
                                {featuredJourney.description}
                            </p>

                            {/* Highlights */}
                            <div className="flex flex-wrap gap-6 mb-8 text-sm">
                                <span className="flex items-center gap-2 text-deep-emerald/70">
                                    <Clock className="w-4 h-4 text-antique-gold" strokeWidth={1.5} />
                                    {featuredJourney.duration}
                                </span>
                                <span className="flex items-center gap-2 text-deep-emerald/70">
                                    <Users className="w-4 h-4 text-antique-gold" strokeWidth={1.5} />
                                    {featuredJourney.style}
                                </span>
                            </div>

                            <ul className="space-y-3 mb-10">
                                {featuredJourney.highlights.map((h, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-gray-600 font-light">
                                        <Compass className="w-4 h-4 text-antique-gold/70 shrink-0" strokeWidth={1.5} />
                                        {h}
                                    </li>
                                ))}
                            </ul>

                            <Link
                                href={featuredJourney.href}
                                className="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-[0.2em] text-deep-emerald border border-deep-emerald/30 px-8 py-4 hover:bg-deep-emerald hover:text-antique-gold transition-all duration-300 w-fit"
                            >
                                View Full Itinerary
                                <ArrowRight className="w-4 h-4 ml-1" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Supporting Journeys — Smaller Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                    {supportingJourneys.map((exp) => (
                        <div key={exp.id} className="group relative overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-700 border border-deep-emerald/5 h-[420px] flex flex-col justify-end">
                            <Image
                                src={exp.image}
                                alt={exp.title}
                                fill
                                className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-deep-emerald/90 via-deep-emerald/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

                            <div className="relative z-10 p-8 md:p-10 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                <div className="flex items-center gap-4 mb-3 text-off-white/60 text-xs tracking-[0.15em] uppercase">
                                    <span className="flex items-center gap-1.5">
                                        <Clock className="w-3.5 h-3.5" strokeWidth={1.5} />
                                        {exp.duration}
                                    </span>
                                </div>
                                <h3 className="text-2xl font-serif text-antique-gold font-medium mb-3">
                                    {exp.title}
                                </h3>
                                <p className="text-off-white/70 font-light text-sm mb-2 leading-relaxed">
                                    {exp.description}
                                </p>
                                <p className="text-off-white/50 font-light tracking-widest text-xs mb-6 uppercase">
                                    {exp.style}
                                </p>

                                <Link
                                    href={exp.href}
                                    className="inline-flex items-center gap-2 text-xs font-serif uppercase tracking-[0.2em] text-antique-gold border border-antique-gold/50 px-6 py-3 hover:bg-antique-gold hover:text-deep-emerald transition-all duration-300 opacity-0 group-hover:opacity-100"
                                >
                                    View Itinerary
                                    <ArrowRight className="w-4 h-4 ml-1" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
