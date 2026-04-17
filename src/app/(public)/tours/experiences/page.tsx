import Image from 'next/image';
import Link from 'next/link';
import { Utensils, Bike, Train, Palette, Leaf, Waves, Sun, Heart } from 'lucide-react';

const experiences = [
    {
        icon: Train,
        title: 'Scenic Rail Journeys',
        description: 'Ride the iconic blue train from Kandy to Ella — one of the world\'s most beautiful railway journeys through misty tea plantations and mountain tunnels.',
        image: '/images/cat-hillcountry.png',
    },
    {
        icon: Utensils,
        title: 'Culinary Experiences',
        description: 'Street food walks in Colombo, cooking classes with village families, spice garden tours, and fine dining at award-winning restaurants.',
        image: '/images/home/signature-ceylon.png',
    },
    {
        icon: Leaf,
        title: 'Tea Estate Tours',
        description: 'Wander through the lush tea plantations of Nuwara Eliya, learn the art of tea plucking, and sample Ceylon\'s finest brews at the source.',
        image: '/images/cat-hillcountry.png',
    },
    {
        icon: Waves,
        title: 'Whale Watching',
        description: 'Mirissa and Trincomalee offer some of the world\'s best whale watching — spot blue whales, sperm whales, and playful dolphins.',
        image: '/images/cat-coastal.png',
    },
    {
        icon: Sun,
        title: 'Hot Air Balloon Rides',
        description: 'Soar over the Cultural Triangle at sunrise — a bird\'s-eye view of ancient temples, tanks, and the emerald Sri Lankan landscape.',
        image: '/images/home/curated-kingdoms.png',
    },
    {
        icon: Bike,
        title: 'Cycling Tours',
        description: 'Pedal through rural villages, paddy fields, and scenic countryside trails — from easy rides to challenging hill-country routes.',
        image: '/images/home/heritage-story.png',
    },
    {
        icon: Heart,
        title: 'Ayurveda & Wellness',
        description: 'Traditional Ayurvedic treatments, yoga retreats, and meditation sessions at certified wellness centres across the island.',
        image: '/images/cat-ayurvedic.png',
    },
    {
        icon: Palette,
        title: 'Arts & Crafts',
        description: 'Mask-carving in Ambalangoda, batik workshops, gem-cutting demonstrations, and traditional pottery — hands-on cultural immersions.',
        image: '/images/home/signature-heritage.png',
    },
];

const popularExcursions = [
    { name: 'Colombo City Tour', duration: 'Half Day', price: 'From $45' },
    { name: 'Sigiriya Rock Fortress', duration: 'Full Day', price: 'From $85' },
    { name: 'Kandy Cultural Show', duration: 'Evening', price: 'From $35' },
    { name: 'Mirissa Whale Watching', duration: 'Half Day', price: 'From $65' },
    { name: 'Ella Nine Arches Bridge', duration: 'Full Day', price: 'From $70' },
    { name: 'Galle Fort Walking Tour', duration: 'Half Day', price: 'From $40' },
];

export default function ExperiencesPage() {
    return (
        <div className="min-h-screen bg-off-white">
            {/* Hero Section */}
            <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
                <Image
                    src="/images/home/signature-ceylon.png"
                    alt="Experiences & Excursions in Sri Lanka"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-deep-emerald/60" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a1f15]/80 via-transparent to-deep-emerald/90" />

                <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="text-center max-w-3xl px-4">
                        <span className="inline-block mb-4 text-xs tracking-[0.4em] font-medium text-[#D4AF37] uppercase">
                            Beyond the Ordinary
                        </span>
                        <h1 className="text-5xl md:text-7xl font-display text-white leading-tight">
                            Experiences &<br />
                            <span className="italic font-light text-[#D4AF37]">Excursions</span>
                        </h1>
                        <p className="mt-6 text-white/70 font-light text-lg max-w-xl mx-auto">
                            From scenic train rides and culinary adventures to whale watching and wellness retreats — immerse yourself in Sri Lanka.
                        </p>
                    </div>
                </div>
            </section>

            {/* Experiences Grid */}
            <section className="py-28">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="text-center mb-16">
                        <span className="text-xs tracking-[0.3em] text-[#D4AF37] uppercase font-medium">Signature Moments</span>
                        <h2 className="text-4xl md:text-5xl font-display text-deep-emerald mt-3">
                            Curated Experiences
                        </h2>
                        <div className="h-px w-16 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mt-6" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {experiences.map((exp, idx) => (
                            <div key={idx} className="group rounded-2xl overflow-hidden bg-white border border-deep-emerald/5 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                                <div className="relative h-48 overflow-hidden">
                                    <Image src={exp.image} alt={exp.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                    <div className="absolute bottom-3 left-3">
                                        <div className="w-9 h-9 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                            <exp.icon className="w-5 h-5 text-white" strokeWidth={1.5} />
                                        </div>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <h3 className="text-lg font-display text-deep-emerald mb-2">{exp.title}</h3>
                                    <p className="text-gray-500 font-light text-sm leading-relaxed">{exp.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Popular Excursions Table */}
            <section className="py-28 bg-white">
                <div className="max-w-4xl mx-auto px-4 md:px-8">
                    <div className="text-center mb-16">
                        <span className="text-xs tracking-[0.3em] text-[#D4AF37] uppercase font-medium">Quick Getaways</span>
                        <h2 className="text-4xl md:text-5xl font-display text-deep-emerald mt-3">
                            Popular Excursions
                        </h2>
                    </div>

                    <div className="bg-off-white rounded-2xl border border-deep-emerald/5 overflow-hidden">
                        {popularExcursions.map((excursion, idx) => (
                            <div
                                key={idx}
                                className="flex items-center justify-between px-6 py-5 border-b border-deep-emerald/5 last:border-0 hover:bg-white transition-colors group"
                            >
                                <div>
                                    <h3 className="text-deep-emerald font-medium group-hover:text-[#D4AF37] transition-colors">{excursion.name}</h3>
                                    <p className="text-gray-400 text-xs mt-1">{excursion.duration}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-[#D4AF37] font-display text-lg">{excursion.price}</span>
                                    <Link
                                        href="/inquire"
                                        className="px-4 py-1.5 rounded-full border border-deep-emerald/20 text-deep-emerald text-xs tracking-[0.1em] font-semibold uppercase hover:bg-deep-emerald hover:text-white transition-all"
                                    >
                                        BOOK
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <div className="relative h-[50vh] overflow-hidden">
                <div className="absolute inset-0 bg-fixed bg-cover bg-center" style={{ backgroundImage: "url('/images/home/signature-ceylon.png')" }} />
                <div className="absolute inset-0 bg-deep-emerald/30" />
                <div className="relative z-10 flex items-center justify-center h-full">
                    <div className="text-center">
                        <p className="text-xs tracking-[0.4em] font-medium text-white/80 uppercase mb-4 drop-shadow-lg">
                            Create Your Experience
                        </p>
                        <h3 className="text-3xl md:text-5xl font-display text-white drop-shadow-lg mb-8">
                            Every Moment, <span className="italic text-[#D4AF37]">Unforgettable</span>
                        </h3>
                        <Link
                            href="/build-tour"
                            className="inline-block px-10 py-4 rounded-full bg-[#D4AF37] text-[#0a1f15] text-sm tracking-[0.2em] font-semibold uppercase hover:bg-[#D4AF37]/90 transition-all shadow-lg"
                        >
                            BUILD YOUR TOUR
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
