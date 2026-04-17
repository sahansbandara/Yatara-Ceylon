import Image from 'next/image';
import Link from 'next/link';
import { Binoculars, Mountain, Waves, TreePine, MapPin, Clock, Star, Camera } from 'lucide-react';

const adventures = [
    {
        icon: Binoculars,
        title: 'Wildlife Safaris',
        description: 'Yala National Park boasts the highest density of leopards in the world. Spot elephants, sloth bears, crocodiles, and over 200 bird species.',
    },
    {
        icon: Mountain,
        title: 'Trekking & Hiking',
        description: 'Summit Adam\'s Peak at sunrise, hike the Knuckles Mountain Range, or trek through the misty trails of Horton Plains to World\'s End.',
    },
    {
        icon: Waves,
        title: 'Water Sports',
        description: 'World-class surfing at Arugam Bay, whale watching in Mirissa, white-water rafting in Kitulgala, and diving in Trincomalee\'s crystal waters.',
    },
    {
        icon: Camera,
        title: 'Bird Watching',
        description: 'Sri Lanka is home to 34 endemic bird species. Explore Sinharaja Rainforest, Bundala, and Kumana for world-class birding.',
    },
];

const featuredTours = [
    {
        title: 'Deep Dive into the Wild',
        duration: '16 Nights / 17 Days',
        destinations: 'Yala, Udawalawe, Sinharaja, Wilpattu',
        description: 'The ultimate wildlife odyssey — experience the diverse ecosystems of Sri Lanka from national parks to pristine rainforests.',
        image: '/images/home/signature-wildlife.png',
        rating: '4.9',
    },
    {
        title: 'Wildlife Paradise',
        duration: '8 Nights / 9 Days',
        destinations: 'Minneriya, Yala, Mirissa',
        description: 'From the great elephant gathering to whale watching — encounter Sri Lanka\'s most iconic wildlife experiences.',
        image: '/images/cat-wildlife.png',
        rating: '4.8',
    },
    {
        title: 'Adventure Seeker',
        duration: '10 Nights / 11 Days',
        destinations: 'Kitulgala, Ella, Arugam Bay, Knuckles',
        description: 'Rafting, surfing, trekking, and canyoning — an adrenaline-packed tour across Sri Lanka\'s most thrilling landscapes.',
        image: '/images/home/hero-split-right.png',
        rating: '4.7',
    },
];

const wildlifeSpots = [
    { name: 'Yala National Park', specialty: 'Leopards, elephants, crocodiles', image: '/images/cat-wildlife.png' },
    { name: 'Udawalawe', specialty: 'Wild elephants, buffalo, eagles', image: '/images/home/signature-wildlife.png' },
    { name: 'Sinharaja Forest', specialty: 'Endemic birds, rare reptiles', image: '/images/home/heritage-story.png' },
    { name: 'Wilpattu', specialty: 'Leopards, deer, natural lakes', image: '/images/home/curated-kingdoms.png' },
];

export default function WildlifeAdventurePage() {
    return (
        <div className="min-h-screen bg-off-white">
            {/* Hero Section */}
            <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
                <Image
                    src="/images/home/signature-wildlife.png"
                    alt="Wildlife & Adventure Tours in Sri Lanka"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-deep-emerald/60" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a1f15]/80 via-transparent to-deep-emerald/90" />

                <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="text-center max-w-3xl px-4">
                        <span className="inline-block mb-4 text-xs tracking-[0.4em] font-medium text-[#D4AF37] uppercase">
                            Untamed Sri Lanka
                        </span>
                        <h1 className="text-5xl md:text-7xl font-display text-white leading-tight">
                            Wildlife &<br />
                            <span className="italic font-light text-[#D4AF37]">Adventure</span>
                        </h1>
                        <p className="mt-6 text-white/70 font-light text-lg max-w-xl mx-auto">
                            Leopards, elephants, whales, and untamed landscapes — Sri Lanka packs extraordinary wildlife into a compact island.
                        </p>
                    </div>
                </div>
            </section>

            {/* Adventure Types */}
            <section className="py-28">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="text-center mb-16">
                        <span className="text-xs tracking-[0.3em] text-[#D4AF37] uppercase font-medium">Adventures Await</span>
                        <h2 className="text-4xl md:text-5xl font-display text-deep-emerald mt-3">
                            Choose Your Thrill
                        </h2>
                        <div className="h-px w-16 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mt-6" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {adventures.map((item, idx) => (
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

            {/* Wildlife Spots */}
            <section className="py-28 bg-white">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="text-center mb-16">
                        <span className="text-xs tracking-[0.3em] text-[#D4AF37] uppercase font-medium">National Parks</span>
                        <h2 className="text-4xl md:text-5xl font-display text-deep-emerald mt-3">
                            Top Wildlife Destinations
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {wildlifeSpots.map((spot, idx) => (
                            <div key={idx} className="group relative rounded-2xl overflow-hidden aspect-[3/4] shadow-lg">
                                <Image src={spot.image} alt={spot.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-5">
                                    <h3 className="text-lg font-display text-white mb-1">{spot.name}</h3>
                                    <p className="text-white/60 font-light text-xs flex items-center gap-1">
                                        <TreePine className="w-3 h-3" /> {spot.specialty}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Tours */}
            <section className="py-28">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="text-center mb-16">
                        <span className="text-xs tracking-[0.3em] text-[#D4AF37] uppercase font-medium">Curated Journeys</span>
                        <h2 className="text-4xl md:text-5xl font-display text-deep-emerald mt-3">
                            Featured Adventure Tours
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {featuredTours.map((tour, idx) => (
                            <div key={idx} className="group rounded-2xl overflow-hidden bg-white border border-deep-emerald/5 shadow-sm hover:shadow-xl transition-all duration-500">
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
                <div className="absolute inset-0 bg-fixed bg-cover bg-center" style={{ backgroundImage: "url('/images/home/signature-wildlife.png')" }} />
                <div className="absolute inset-0 bg-deep-emerald/30" />
                <div className="relative z-10 flex items-center justify-center h-full">
                    <div className="text-center">
                        <p className="text-xs tracking-[0.4em] font-medium text-white/80 uppercase mb-4 drop-shadow-lg">
                            Answer the Call of the Wild
                        </p>
                        <h3 className="text-3xl md:text-5xl font-display text-white drop-shadow-lg mb-8">
                            Book Your <span className="italic text-[#D4AF37]">Safari</span>
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
