import Image from 'next/image';
import Link from 'next/link';
import { Leaf, Droplets, Sun, Flower2, MapPin, Clock, Star } from 'lucide-react';

const highlights = [
    {
        icon: Leaf,
        title: 'Authentic Ayurveda',
        description: 'Experience centuries-old healing traditions with personalised treatment plans from certified Ayurvedic physicians in serene retreat settings.',
    },
    {
        icon: Droplets,
        title: 'Spa & Hydrotherapy',
        description: 'Herbal steam baths, oil treatments, and mineral-rich therapies — ancient wellness rituals in world-class spa facilities.',
    },
    {
        icon: Sun,
        title: 'Yoga & Meditation',
        description: 'Daily guided yoga sessions overlooking misty mountains or the Indian Ocean, paired with mindfulness meditation and breathwork.',
    },
    {
        icon: Flower2,
        title: 'Wellness Cuisine',
        description: 'Nutrient-rich meals designed by Ayurvedic chefs — fresh tropical ingredients, healing spices, and plant-based delicacies.',
    },
];

const featuredTours = [
    {
        title: 'Ayurvedic Restoration',
        duration: '7 Nights / 8 Days',
        destinations: 'Dambulla, Kandy, Bentota',
        description: 'A guided wellness reset combining daily Ayurvedic treatments, yoga, and meditation in peaceful tropical surroundings.',
        image: '/images/home/cat-ayurvedic.webp',
        rating: '4.9',
    },
    {
        title: 'Mindful Retreat',
        duration: '5 Nights / 6 Days',
        destinations: 'Sigiriya, Kandy',
        description: 'Disconnect from the noise — forest bathing, silent meditation, and holistic spa rituals in Sri Lanka\'s cultural heartland.',
        image: '/images/home/cat-heritage.webp',
        rating: '4.8',
    },
    {
        title: 'Coastal Wellness Escape',
        duration: '6 Nights / 7 Days',
        destinations: 'Weligama, Tangalle, Galle',
        description: 'Beachside yoga, ocean-view spa treatments, and Ayurvedic cuisine — a coastal reset for body and soul.',
        image: '/images/home/cat-coastal.webp',
        rating: '4.8',
    },
];

export default function WellnessToursPage() {
    return (
        <div className="min-h-screen bg-off-white">
            {/* Hero Section */}
            <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
                <Image
                    src="/images/home/cat-ayurvedic.webp"
                    alt="Ayurveda & Wellness in Sri Lanka"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-deep-emerald/60" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a1f15]/80 via-transparent to-deep-emerald/90" />

                <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="text-center max-w-3xl px-4">
                        <span className="inline-block mb-4 text-xs tracking-[0.4em] font-medium text-[#D4AF37] uppercase">
                            Ancient Healing Traditions
                        </span>
                        <h1 className="text-5xl md:text-7xl font-display text-white leading-tight">
                            Ayurveda &<br />
                            <span className="italic font-light text-[#D4AF37]">Wellness</span>
                        </h1>
                        <p className="mt-6 text-white/70 font-light text-lg max-w-xl mx-auto">
                            Guided wellness resets, daily treatments, and calm settings — restore body, mind, and spirit.
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
                            Wellness Experiences
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
                            Featured Wellness Tours
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
                <div className="absolute inset-0 bg-fixed bg-cover bg-center" style={{ backgroundImage: "url('/images/home/cat-ayurvedic.webp')" }} />
                <div className="absolute inset-0 bg-deep-emerald/30" />
                <div className="relative z-10 flex items-center justify-center h-full">
                    <div className="text-center">
                        <p className="text-xs tracking-[0.4em] font-medium text-white/80 uppercase mb-4 drop-shadow-lg">
                            Restore Body, Mind & Spirit
                        </p>
                        <h3 className="text-3xl md:text-5xl font-display text-white drop-shadow-lg mb-8">
                            Plan Your <span className="italic text-[#D4AF37]">Wellness Retreat</span>
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
