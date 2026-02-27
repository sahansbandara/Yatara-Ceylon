import Image from 'next/image';
import Link from 'next/link';
import { Plane, Phone, Clock, Shield, CheckCircle, MapPin, Users, Car } from 'lucide-react';

const features = [
    { icon: Plane, text: 'A 24/7 operating travel counter at Bandaranaike Airport' },
    { icon: Phone, text: '24/7 concierge call center for on-trip support' },
    { icon: Shield, text: 'Hassle-free, secure, and seamless online booking' },
    { icon: Clock, text: 'Free cancellation up to 24 hours on all transport services' },
    { icon: CheckCircle, text: 'We partner with over 200 hotels, all vetted by our quality team' },
];

const numbers = [
    { value: '12+', label: 'Years of Industry Experience' },
    { value: '50+', label: 'Staff Members' },
    { value: '100+', label: 'Chauffeur Guides' },
    { value: '200+', label: 'Vehicles' },
];

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-off-white">
            {/* Hero Section */}
            <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
                <Image
                    src="/images/home/curated-kingdoms.png"
                    alt="Sri Lanka aerial"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-deep-emerald/60" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a1f15]/80 via-transparent to-deep-emerald/90" />

                <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="text-center">
                        <span className="inline-block mb-4 text-xs tracking-[0.4em] font-medium text-[#D4AF37] uppercase">
                            Est. 2012 — Colombo, Sri Lanka
                        </span>
                        <h1 className="text-5xl md:text-7xl font-display text-white leading-tight">
                            Sri Lanka&apos;s Leading<br />
                            <span className="italic font-light text-[#D4AF37]">Destination Management</span><br />
                            Company
                        </h1>
                    </div>
                </div>
            </section>

            {/* About Section — 3-Column Layout */}
            <section className="py-28">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                        {/* Left Image */}
                        <div className="relative rounded-2xl overflow-hidden aspect-[3/4] shadow-xl">
                            <Image
                                src="/images/home/heritage-story.png"
                                alt="Yatara experience"
                                fill
                                className="object-cover"
                            />
                        </div>

                        {/* Center Text */}
                        <div className="flex flex-col justify-center">
                            <h2 className="text-2xl md:text-3xl font-display text-deep-emerald mb-6 leading-snug">
                                Experience the enchantment of Sri Lanka with Yatara Ceylon...
                            </h2>
                            <p className="text-gray-500 font-light leading-relaxed mb-6 text-[15px]">
                                Yatara Ceylon has been at the forefront of the Sri Lankan tourism industry for over a decade of excellence, organizing inbound tours for couples on holiday or honeymoon, for individual adventurers and nature lovers, as well as for special interest and incentive holiday groups.
                            </p>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center gap-3 text-deep-emerald text-sm font-medium">
                                    <CheckCircle className="w-4 h-4 text-[#D4AF37]" />
                                    A pioneer in bespoke Sri Lankan tourism
                                </li>
                                <li className="flex items-center gap-3 text-deep-emerald text-sm font-medium">
                                    <CheckCircle className="w-4 h-4 text-[#D4AF37]" />
                                    Trusted partner for leading global travel brands
                                </li>
                                <li className="flex items-center gap-3 text-deep-emerald text-sm font-medium">
                                    <CheckCircle className="w-4 h-4 text-[#D4AF37]" />
                                    Award-winning customer service excellence
                                </li>
                            </ul>
                            <Link
                                href="/inquire"
                                className="flex items-center gap-3 text-deep-emerald hover:text-[#D4AF37] transition-colors group w-fit"
                            >
                                <div className="w-10 h-10 rounded-full border-2 border-deep-emerald group-hover:border-[#D4AF37] flex items-center justify-center transition-colors">
                                    <span className="text-xl leading-none">+</span>
                                </div>
                                <span className="text-xs tracking-[0.2em] font-semibold uppercase">ABOUT US</span>
                            </Link>
                        </div>

                        {/* Right Image */}
                        <div className="relative rounded-2xl overflow-hidden aspect-[3/4] shadow-xl">
                            <Image
                                src="/images/home/curated-southcoast.png"
                                alt="Sri Lanka coastline"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Book With Us Section */}
            <section className="py-28 bg-white">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        {/* Left — Features */}
                        <div>
                            <h2 className="text-4xl md:text-5xl font-display text-deep-emerald mb-4 leading-tight">
                                Why Book with<br />Yatara Ceylon?
                            </h2>
                            <div className="h-px w-16 bg-gradient-to-r from-[#D4AF37] to-transparent mt-6 mb-12" />

                            <div className="space-y-6">
                                {features.map((f, idx) => (
                                    <div key={idx} className="flex items-start gap-5 group">
                                        <div className="w-11 h-11 rounded-xl bg-deep-emerald/5 border border-deep-emerald/10 flex items-center justify-center shrink-0 group-hover:bg-[#D4AF37]/10 group-hover:border-[#D4AF37]/20 transition-all">
                                            <f.icon className="w-5 h-5 text-deep-emerald/60 group-hover:text-[#D4AF37] transition-colors" strokeWidth={1.5} />
                                        </div>
                                        <p className="text-gray-600 font-light text-[15px] leading-relaxed pt-2.5">
                                            {f.text}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right — Stats */}
                        <div>
                            <p className="text-gray-500 font-light leading-relaxed mb-12 text-[15px] max-w-md">
                                At Yatara Ceylon, we customize each itinerary to fit your preferences, ensuring a unique and unforgettable experience across the island.
                            </p>

                            <div className="grid grid-cols-2 gap-8">
                                {numbers.map((n, idx) => (
                                    <div key={idx} className="group">
                                        <p className="text-5xl md:text-6xl font-display text-deep-emerald group-hover:text-[#D4AF37] transition-colors duration-500 mb-2">
                                            {n.value}
                                        </p>
                                        <p className="text-xs tracking-[0.15em] uppercase text-gray-400 font-medium">
                                            {n.label}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Parallax Image Divider */}
            <div className="relative h-[50vh] overflow-hidden">
                <div
                    className="absolute inset-0 bg-fixed bg-cover bg-center"
                    style={{ backgroundImage: "url('/images/home/signature-ceylon.png')" }}
                />
                <div className="absolute inset-0 bg-deep-emerald/30" />
                <div className="relative z-10 flex items-center justify-center h-full">
                    <div className="text-center">
                        <p className="text-xs tracking-[0.4em] font-medium text-white/80 uppercase mb-4 drop-shadow-lg">
                            Your Journey Starts Here
                        </p>
                        <h3 className="text-3xl md:text-5xl font-display text-white drop-shadow-lg mb-8">
                            Ready to Explore <span className="italic text-[#D4AF37]">Ceylon</span>?
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
