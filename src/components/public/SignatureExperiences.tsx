import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import SectionHeading from './SectionHeading';

const signatureExperiences = [
    {
        id: 'ramayana-heritage-trail',
        title: 'The Ramayana Heritage Trail',
        price: 'LKR 128,000',
        image: 'https://images.unsplash.com/photo-1590123767956-2b7f3e541866?w=800&auto=format&fit=crop&q=80',
        href: '/packages/ramayana-heritage-trail',
    },
    {
        id: 'ceylon-highlights-express',
        title: 'Ceylon Highlights Express',
        price: 'LKR 155,000',
        image: 'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?w=800&auto=format&fit=crop&q=80',
        href: '/packages/ceylon-highlights-express',
    },
    {
        id: 'heritage-wildlife-adventure',
        title: 'Heritage & Wildlife Adventure',
        price: 'LKR 195,000',
        image: 'https://images.unsplash.com/photo-1616422345026-6b21857908da?w=800&auto=format&fit=crop&q=80',
        href: '/packages/heritage-wildlife-adventure',
    },
];

export default function SignatureExperiences() {
    return (
        <section className="py-24 bg-off-white/50 border-t border-antique-gold/10">
            <div className="container mx-auto px-6 max-w-7xl">
                <SectionHeading
                    title="Signature Experiences"
                    description="Curated luxury journeys across the most breathtaking landscapes of Sri Lanka."
                    align="center"
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-16">
                    {signatureExperiences.map((exp) => (
                        <div key={exp.id} className="group relative overflow-hidden bg-white shadow-xl border border-deep-emerald/5 h-[450px] flex flex-col justify-end">
                            <Image
                                src={exp.image}
                                alt={exp.title}
                                fill
                                className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-deep-emerald/90 via-deep-emerald/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

                            <div className="relative z-10 p-8 flex flex-col items-center text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                <h3 className="text-2xl font-serif text-antique-gold font-medium mb-3">
                                    {exp.title}
                                </h3>
                                <div className="text-off-white/90 font-light tracking-widest text-sm mb-6 uppercase">
                                    From {exp.price}
                                </div>

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
