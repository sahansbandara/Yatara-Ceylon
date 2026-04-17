import Image from 'next/image';
import Link from 'next/link';
import { Compass, Car, Hotel, Utensils, Plane, Map, HeartPulse, Shield } from 'lucide-react';

const services = [
    {
        icon: Compass,
        title: 'Tailor-Made Tours',
        description: 'Bespoke itineraries crafted to your exact preferences — from cultural deep-dives to coastal escapes. Every journey is uniquely yours.',
        link: '/build-tour',
    },
    {
        icon: Car,
        title: 'Private Transfers',
        description: 'A fleet of 200+ air-conditioned vehicles with professional chauffeur-guides. Airport pickups, intercity travel, and scenic drives.',
        link: '/transfers',
    },
    {
        icon: Hotel,
        title: 'Accommodation',
        description: 'Hand-picked stays ranging from boutique villas and luxury resorts to authentic eco-lodges and heritage bungalows across the island.',
        link: '/packages',
    },
    {
        icon: Map,
        title: 'Destination Management',
        description: 'End-to-end destination management for group tours, FIT travellers, and corporate delegations visiting Sri Lanka.',
        link: '/about',
    },
    {
        icon: Plane,
        title: 'Domestic Air Transfers',
        description: 'Skip the road and fly — domestic seaplane and helicopter transfers to Sigiriya, Yala, Trincomalee, and more.',
        link: '/transfers',
    },
    {
        icon: HeartPulse,
        title: 'Wellness & Ayurveda',
        description: 'Curated wellness retreats combining traditional Ayurvedic treatments, yoga, and holistic healing at certified centres.',
        link: '/packages',
    },
    {
        icon: Shield,
        title: 'Travel Insurance',
        description: 'Comprehensive travel insurance packages covering medical emergencies, trip cancellations, and luggage protection.',
        link: '/contact',
    },
    {
        icon: Utensils,
        title: 'Culinary Experiences',
        description: 'From street food walks in Colombo to private cooking classes with local chefs — taste the authentic flavours of Ceylon.',
        link: '/packages',
    },
];

export default function ServicesPage() {
    return (
        <div className="min-h-screen bg-off-white">
            {/* Hero Section */}
            <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
                <Image
                    src="/images/home/signature-ceylon.png"
                    alt="Yatara Ceylon Services"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-deep-emerald/60" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a1f15]/80 via-transparent to-deep-emerald/90" />

                <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="text-center max-w-3xl px-4">
                        <span className="inline-block mb-4 text-xs tracking-[0.4em] font-medium text-[#D4AF37] uppercase">
                            What We Offer
                        </span>
                        <h1 className="text-5xl md:text-7xl font-display text-white leading-tight">
                            Our<br />
                            <span className="italic font-light text-[#D4AF37]">Services</span>
                        </h1>
                        <p className="mt-6 text-white/70 font-light text-lg max-w-xl mx-auto">
                            A comprehensive range of travel services designed to make your Sri Lankan journey seamless, luxurious, and unforgettable.
                        </p>
                    </div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-28">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="text-center mb-16">
                        <span className="text-xs tracking-[0.3em] text-[#D4AF37] uppercase font-medium">Full-Service Travel Partner</span>
                        <h2 className="text-4xl md:text-5xl font-display text-deep-emerald mt-3">
                            Everything You Need
                        </h2>
                        <div className="h-px w-16 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mt-6" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {services.map((service, idx) => (
                            <Link
                                key={idx}
                                href={service.link}
                                className="group p-6 rounded-2xl bg-white border border-deep-emerald/5 shadow-sm hover:shadow-xl transition-all duration-500 hover:border-[#D4AF37]/20 hover:-translate-y-1"
                            >
                                <div className="w-12 h-12 rounded-xl bg-deep-emerald/5 border border-deep-emerald/10 flex items-center justify-center mb-5 group-hover:bg-[#D4AF37]/10 group-hover:border-[#D4AF37]/20 transition-all">
                                    <service.icon className="w-6 h-6 text-deep-emerald/60 group-hover:text-[#D4AF37] transition-colors" strokeWidth={1.5} />
                                </div>
                                <h3 className="text-lg font-display text-deep-emerald mb-2">{service.title}</h3>
                                <p className="text-gray-500 font-light text-sm leading-relaxed">{service.description}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Process Section */}
            <section className="py-28 bg-white">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-xl">
                            <Image
                                src="/images/home/heritage-story.png"
                                alt="Planning your Sri Lanka trip"
                                fill
                                className="object-cover"
                            />
                        </div>

                        <div>
                            <span className="text-xs tracking-[0.3em] text-[#D4AF37] uppercase font-medium">How It Works</span>
                            <h2 className="text-4xl md:text-5xl font-display text-deep-emerald mt-3 mb-4 leading-tight">
                                Your Journey,<br />Our <span className="italic text-[#D4AF37]">Expertise</span>
                            </h2>
                            <div className="h-px w-16 bg-gradient-to-r from-[#D4AF37] to-transparent mt-6 mb-12" />

                            <div className="space-y-8">
                                {[
                                    { step: '01', title: 'Share Your Vision', desc: 'Tell us your travel dates, interests, budget, and group size.' },
                                    { step: '02', title: 'We Craft Your Itinerary', desc: 'Our experts design a personalised itinerary within 24 hours.' },
                                    { step: '03', title: 'Refine & Confirm', desc: 'Review, tweak, and finalise every detail until it is perfect.' },
                                    { step: '04', title: 'Travel with Confidence', desc: 'Enjoy 24/7 on-ground support from arrival to departure.' },
                                ].map((item, idx) => (
                                    <div key={idx} className="flex gap-6 group">
                                        <span className="text-3xl font-display text-[#D4AF37]/30 group-hover:text-[#D4AF37] transition-colors shrink-0">
                                            {item.step}
                                        </span>
                                        <div>
                                            <h3 className="text-lg font-display text-deep-emerald mb-1">{item.title}</h3>
                                            <p className="text-gray-500 font-light text-sm">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
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
                            Ready to Get Started?
                        </p>
                        <h3 className="text-3xl md:text-5xl font-display text-white drop-shadow-lg mb-8">
                            Let Us Plan Your <span className="italic text-[#D4AF37]">Perfect Trip</span>
                        </h3>
                        <Link
                            href="/inquire"
                            className="inline-block px-10 py-4 rounded-full bg-[#D4AF37] text-[#0a1f15] text-sm tracking-[0.2em] font-semibold uppercase hover:bg-[#D4AF37]/90 transition-all shadow-lg"
                        >
                            INQUIRE NOW
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
