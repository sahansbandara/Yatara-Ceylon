import Image from 'next/image';
import Link from 'next/link';
import { Train, Mountain, Coffee, TreePine, MapPin, Clock, Star } from 'lucide-react';

const highlights = [
    {
        icon: Train,
        title: 'Scenic Rail Journeys',
        description: 'Ride one of the world\'s most beautiful train routes from Kandy to Ella — winding through emerald tea plantations, misty tunnels, and dramatic bridges.',
    },
    {
        icon: Mountain,
        title: 'Highland Trails',
        description: 'Hike through Horton Plains to World\'s End, summit Little Adam\'s Peak at sunrise, and explore the Knuckles Mountain Range.',
    },
    {
        icon: Coffee,
        title: 'Tea Country Heritage',
        description: 'Tour colonial-era tea factories, taste single-estate Ceylon tea, and stay in restored planter\'s bungalows surrounded by rolling green hills.',
    },
    {
        icon: TreePine,
        title: 'Misty Retreats',
        description: 'Cool mountain air, cascading waterfalls, and boutique hill-country lodges — a serene escape from the tropical lowlands.',
    },
];

const featuredTours = [
    {
        title: 'Tea Trails & Railways',
        duration: '5 Nights / 6 Days',
        destinations: 'Kandy, Nuwara Eliya, Ella',
        description: 'The quintessential hill country journey — scenic trains, tea plantations, and misty highland walks.',
        image: '/images/home/cat-hillcountry.webp',
        rating: '4.9',
    },
    {
        title: 'Highland Explorer',
        duration: '7 Nights / 8 Days',
        destinations: 'Kandy, Knuckles, Nuwara Eliya, Ella, Haputale',
        description: 'Go deeper into Sri Lanka\'s highlands — mountain treks, waterfall hikes, and off-the-beaten-path tea estates.',
        image: '/images/home/cat-heritage.webp',
        rating: '4.8',
    },
    {
        title: 'Romance in the Hills',
        duration: '4 Nights / 5 Days',
        destinations: 'Kandy, Nuwara Eliya, Ella',
        description: 'A couple\'s highland escape — private tea tastings, misty morning walks, and boutique bungalow stays.',
        image: '/images/home/cat-honeymoon.webp',
        rating: '4.8',
    },
];

export default function HillCountryToursPage() {
    return (
        <div className="min-h-screen bg-off-white">
            {/* Hero Section */}
            <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
                <Image
                    src="/images/home/cat-hillcountry.webp"
                    alt="Hill Country & Rail in Sri Lanka"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-deep-emerald/60" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a1f15]/80 via-transparent to-deep-emerald/90" />

                <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="text-center max-w-3xl px-4">
                        <span className="inline-block mb-4 text-xs tracking-[0.4em] font-medium text-[#D4AF37] uppercase">
                            Misty Highlands
                        </span>
                        <h1 className="text-5xl md:text-7xl font-display text-white leading-tight">
                            Hill Country<br />
                            <span className="italic font-light text-[#D4AF37]">& Rail</span>
                        </h1>
                        <p className="mt-6 text-white/70 font-light text-lg max-w-xl mx-auto">
                            Tea bungalows, scenic train rides, and cool mountain air in Sri Lanka&apos;s enchanting highlands.
                        </p>
                    </div>
                </div>
            </section>

            {/* Highlights */}
            <section className="py-28">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="text-center mb-16">
                        <span className="text-xs tracking-[0.3em] text-[#D4AF37] uppercase font-medium">What Awaits</span>
                        <h2 className="text-4xl md:text-5xl font-display text-deep-emerald mt-3">
                            Highland Experiences
                        </h2>
                        <div className="h-px w-16 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mt-6" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {highlights.map((item, idx) => (
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
                            Featured Hill Country Tours
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
                <div className="absolute inset-0 bg-fixed bg-cover bg-center" style={{ backgroundImage: "url('/images/home/cat-hillcountry.webp')" }} />
                <div className="absolute inset-0 bg-deep-emerald/30" />
                <div className="relative z-10 flex items-center justify-center h-full">
                    <div className="text-center">
                        <p className="text-xs tracking-[0.4em] font-medium text-white/80 uppercase mb-4 drop-shadow-lg">
                            Into the Misty Highlands
                        </p>
                        <h3 className="text-3xl md:text-5xl font-display text-white drop-shadow-lg mb-8">
                            Plan Your <span className="italic text-[#D4AF37]">Hill Country Journey</span>
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
