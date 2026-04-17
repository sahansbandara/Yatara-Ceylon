import Image from 'next/image';
import Link from 'next/link';
import { Landmark, BookOpen, Music, Camera, MapPin, Clock, Star } from 'lucide-react';

const culturalHighlights = [
    {
        icon: Landmark,
        title: 'Ancient Cities',
        description: 'Explore UNESCO World Heritage Sites including Sigiriya Rock Fortress, Polonnaruwa, and Anuradhapura — remnants of civilisations over 2,500 years old.',
    },
    {
        icon: BookOpen,
        title: 'Sacred Temples',
        description: 'Visit the Temple of the Tooth Relic in Kandy, Dambulla Cave Temple, and Gangaramaya — spiritual sanctuaries steeped in centuries of devotion.',
    },
    {
        icon: Music,
        title: 'Traditional Arts',
        description: 'Witness Kandyan dance performances, mask-making in Ambalangoda, and batik artistry — living traditions passed through generations.',
    },
    {
        icon: Camera,
        title: 'Colonial Heritage',
        description: 'Walk through the cobblestone streets of Galle Fort, explore Colombo\'s colonial architecture, and discover Dutch and Portuguese influences.',
    },
];

const featuredTours = [
    {
        title: 'Royal Heritage Trail',
        duration: '7 Nights / 8 Days',
        destinations: 'Colombo, Sigiriya, Kandy, Ella, Galle',
        description: 'Journey through Sri Lanka\'s royal past — from the ancient kingdoms of the Cultural Triangle to the last Kandyan dynasty.',
        image: '/images/home/curated-kingdoms.png',
        rating: '4.9',
    },
    {
        title: 'Sacred Ceylon',
        duration: '5 Nights / 6 Days',
        destinations: 'Anuradhapura, Dambulla, Kandy',
        description: 'A spiritual odyssey through Sri Lanka\'s most sacred sites, ancient monasteries, and living temple traditions.',
        image: '/images/home/heritage-story.png',
        rating: '4.8',
    },
    {
        title: 'Art & Craft Discovery',
        duration: '4 Nights / 5 Days',
        destinations: 'Colombo, Ambalangoda, Galle',
        description: 'Immerse yourself in Sri Lanka\'s artisan heritage — from traditional mask-carving to handloom weaving and gem cutting.',
        image: '/images/home/signature-heritage.png',
        rating: '4.7',
    },
];

export default function CulturalToursPage() {
    return (
        <div className="min-h-screen bg-off-white">
            {/* Hero Section */}
            <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
                <Image
                    src="/images/home/curated-kingdoms.png"
                    alt="Cultural Tours in Sri Lanka"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-deep-emerald/60" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a1f15]/80 via-transparent to-deep-emerald/90" />

                <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="text-center max-w-3xl px-4">
                        <span className="inline-block mb-4 text-xs tracking-[0.4em] font-medium text-[#D4AF37] uppercase">
                            2,500 Years of Heritage
                        </span>
                        <h1 className="text-5xl md:text-7xl font-display text-white leading-tight">
                            Cultural<br />
                            <span className="italic font-light text-[#D4AF37]">Tours</span>
                        </h1>
                        <p className="mt-6 text-white/70 font-light text-lg max-w-xl mx-auto">
                            Walk through ancient kingdoms, sacred temples, and living traditions — discover the soul of Sri Lanka.
                        </p>
                    </div>
                </div>
            </section>

            {/* Cultural Highlights */}
            <section className="py-28">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="text-center mb-16">
                        <span className="text-xs tracking-[0.3em] text-[#D4AF37] uppercase font-medium">What Awaits</span>
                        <h2 className="text-4xl md:text-5xl font-display text-deep-emerald mt-3">
                            Cultural Experiences
                        </h2>
                        <div className="h-px w-16 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mt-6" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {culturalHighlights.map((item, idx) => (
                            <div key={idx} className="group p-8 rounded-2xl bg-white border border-deep-emerald/5 shadow-sm hover:shadow-xl transition-all duration-500 hover:border-[#D4AF37]/20">
                                <div className="w-14 h-14 rounded-xl bg-deep-emerald/5 border border-deep-emerald/10 flex items-center justify-center mb-6 group-hover:bg-[#D4AF37]/10 group-hover:border-[#D4AF37]/20 transition-all">
                                    <item.icon className="w-7 h-7 text-deep-emerald/60 group-hover:text-[#D4AF37] transition-colors" strokeWidth={1.5} />
                                </div>
                                <h3 className="text-2xl font-display text-deep-emerald mb-3">{item.title}</h3>
                                <p className="text-gray-500 font-light leading-relaxed">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Tours */}
            <section className="py-28 bg-white">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="text-center mb-16">
                        <span className="text-xs tracking-[0.3em] text-[#D4AF37] uppercase font-medium">Curated Journeys</span>
                        <h2 className="text-4xl md:text-5xl font-display text-deep-emerald mt-3">
                            Featured Cultural Tours
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {featuredTours.map((tour, idx) => (
                            <div key={idx} className="group rounded-2xl overflow-hidden bg-off-white border border-deep-emerald/5 shadow-sm hover:shadow-xl transition-all duration-500">
                                <div className="relative h-56 overflow-hidden">
                                    <Image src={tour.image} alt={tour.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                                    <div className="absolute top-4 right-4 flex items-center gap-1 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1">
                                        <Star className="w-3 h-3 text-[#D4AF37] fill-[#D4AF37]" />
                                        <span className="text-white text-xs font-medium">{tour.rating}</span>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-display text-deep-emerald mb-2">{tour.title}</h3>
                                    <div className="flex gap-4 mb-3 text-xs text-gray-400">
                                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {tour.duration}</span>
                                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {tour.destinations}</span>
                                    </div>
                                    <p className="text-gray-500 font-light text-sm leading-relaxed mb-4">{tour.description}</p>
                                    <Link
                                        href="/inquire"
                                        className="text-xs tracking-[0.15em] uppercase text-[#D4AF37] font-semibold hover:text-deep-emerald transition-colors"
                                    >
                                        INQUIRE NOW &rarr;
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <div className="relative h-[50vh] overflow-hidden">
                <div className="absolute inset-0 bg-fixed bg-cover bg-center" style={{ backgroundImage: "url('/images/home/signature-heritage.png')" }} />
                <div className="absolute inset-0 bg-deep-emerald/30" />
                <div className="relative z-10 flex items-center justify-center h-full">
                    <div className="text-center">
                        <p className="text-xs tracking-[0.4em] font-medium text-white/80 uppercase mb-4 drop-shadow-lg">
                            Discover Ancient Ceylon
                        </p>
                        <h3 className="text-3xl md:text-5xl font-display text-white drop-shadow-lg mb-8">
                            Plan Your <span className="italic text-[#D4AF37]">Cultural Journey</span>
                        </h3>
                        <Link
                            href="/inquire"
                            className="inline-block px-10 py-4 rounded-full bg-[#D4AF37] text-[#0a1f15] text-sm tracking-[0.2em] font-semibold uppercase hover:bg-[#D4AF37]/90 transition-all shadow-lg"
                        >
                            START PLANNING
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
