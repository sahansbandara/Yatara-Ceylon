import Image from 'next/image';
import Link from 'next/link';
import { Building2, Users, Globe, Award, Briefcase, CalendarDays, MapPin, Headphones } from 'lucide-react';
import { AnimatedStat } from '@/components/ui/AnimatedStat';

const miceServices = [
    {
        icon: Building2,
        title: 'Meetings',
        description: 'Boardrooms and conference spaces across Colombo and resort destinations, equipped with state-of-the-art AV and seamless logistics.',
    },
    {
        icon: Award,
        title: 'Incentives',
        description: 'Reward top performers with exclusive Sri Lankan experiences — from coastal retreats and cultural tours to adrenaline-fuelled safaris.',
    },
    {
        icon: Globe,
        title: 'Conferences',
        description: 'World-class conference facilities accommodating up to 2,000 delegates, with full event management from registration to farewell dinners.',
    },
    {
        icon: CalendarDays,
        title: 'Events',
        description: 'Gala dinners, product launches, and corporate celebrations in stunning venues — from beachfront resorts to heritage estates.',
    },
];

const stats = [
    { value: '500+', label: 'Corporate Events Delivered' },
    { value: '2,000', label: 'Max Delegate Capacity' },
    { value: '50+', label: 'Premium Venue Partners' },
    { value: '12+', label: 'Years of MICE Expertise' },
];

const whyChooseUs = [
    { icon: Briefcase, text: 'Professional Conference Organizer (PCO) with decades of expertise' },
    { icon: MapPin, text: 'Access to exclusive venues across Sri Lanka — from five-star hotels to heritage estates' },
    { icon: Users, text: 'Dedicated MICE coordinator assigned to every event' },
    { icon: Headphones, text: '24/7 on-ground support throughout your event' },
];

export default function MicePage() {
    return (
        <div className="min-h-screen bg-off-white">
            {/* Hero Section */}
            <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
                <Image
                    src="/images/home/curated-kingdoms.png"
                    alt="MICE events in Sri Lanka"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-deep-emerald/60" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a1f15]/80 via-transparent to-deep-emerald/90" />

                <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="text-center max-w-3xl px-4">
                        <span className="inline-block mb-4 text-xs tracking-[0.4em] font-medium text-[#D4AF37] uppercase">
                            Meetings &middot; Incentives &middot; Conferences &middot; Events
                        </span>
                        <h1 className="text-5xl md:text-7xl font-display text-white leading-tight">
                            World-Class<br />
                            <span className="italic font-light text-[#D4AF37]">MICE Solutions</span><br />
                            in Sri Lanka
                        </h1>
                        <p className="mt-6 text-white/70 font-light text-lg max-w-xl mx-auto">
                            From intimate boardrooms to grand conferences for 2,000 delegates — we craft events that inspire.
                        </p>
                    </div>
                </div>
            </section>

            {/* MICE Services Grid */}
            <section className="py-28">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="text-center mb-16">
                        <span className="text-xs tracking-[0.3em] text-[#D4AF37] uppercase font-medium">Our Expertise</span>
                        <h2 className="text-4xl md:text-5xl font-display text-deep-emerald mt-3">
                            Comprehensive MICE Services
                        </h2>
                        <div className="h-px w-16 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mt-6" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {miceServices.map((service, idx) => (
                            <div
                                key={idx}
                                className="group p-8 rounded-2xl bg-white border border-deep-emerald/5 shadow-sm hover:shadow-xl transition-all duration-500 hover:border-[#D4AF37]/20"
                            >
                                <div className="w-14 h-14 rounded-xl bg-deep-emerald/5 border border-deep-emerald/10 flex items-center justify-center mb-6 group-hover:bg-[#D4AF37]/10 group-hover:border-[#D4AF37]/20 transition-all">
                                    <service.icon className="w-7 h-7 text-deep-emerald/60 group-hover:text-[#D4AF37] transition-colors" strokeWidth={1.5} />
                                </div>
                                <h3 className="text-2xl font-display text-deep-emerald mb-3">{service.title}</h3>
                                <p className="text-gray-500 font-light leading-relaxed">{service.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Bar */}
            <section className="py-20 bg-deep-emerald">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="text-center">
                                <p className="text-4xl md:text-5xl font-display text-[#D4AF37] mb-2">
                                    <AnimatedStat value={stat.value} />
                                </p>
                                <p className="text-xs tracking-[0.15em] uppercase text-white/60 font-medium">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-28 bg-white">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <span className="text-xs tracking-[0.3em] text-[#D4AF37] uppercase font-medium">Why Yatara Ceylon</span>
                            <h2 className="text-4xl md:text-5xl font-display text-deep-emerald mt-3 mb-4 leading-tight">
                                Sri Lanka&apos;s Premier<br />MICE Partner
                            </h2>
                            <div className="h-px w-16 bg-gradient-to-r from-[#D4AF37] to-transparent mt-6 mb-12" />

                            <div className="space-y-6">
                                {whyChooseUs.map((item, idx) => (
                                    <div key={idx} className="flex items-start gap-5 group">
                                        <div className="w-11 h-11 rounded-xl bg-deep-emerald/5 border border-deep-emerald/10 flex items-center justify-center shrink-0 group-hover:bg-[#D4AF37]/10 group-hover:border-[#D4AF37]/20 transition-all">
                                            <item.icon className="w-5 h-5 text-deep-emerald/60 group-hover:text-[#D4AF37] transition-colors" strokeWidth={1.5} />
                                        </div>
                                        <p className="text-gray-600 font-light text-[15px] leading-relaxed pt-2.5">{item.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-xl">
                            <Image
                                src="/images/home/curated-southcoast.png"
                                alt="Sri Lanka conference venue"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Destinations for MICE */}
            <section className="py-28">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="text-center mb-16">
                        <span className="text-xs tracking-[0.3em] text-[#D4AF37] uppercase font-medium">Premier Venues</span>
                        <h2 className="text-4xl md:text-5xl font-display text-deep-emerald mt-3">
                            Top MICE Destinations
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { name: 'Colombo', desc: 'World-class conference hotels and modern convention centres in the commercial capital.', image: '/images/home/curated-kingdoms.png' },
                            { name: 'Kandy', desc: 'Heritage venues surrounded by lush hills — perfect for intimate retreats and incentive programs.', image: '/images/home/heritage-story.png' },
                            { name: 'South Coast', desc: 'Beachfront resorts offering exclusive event spaces with ocean panoramas.', image: '/images/home/curated-southcoast.png' },
                        ].map((dest, idx) => (
                            <div key={idx} className="group relative rounded-2xl overflow-hidden aspect-[3/4] shadow-lg">
                                <Image src={dest.image} alt={dest.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-6">
                                    <h3 className="text-2xl font-display text-white mb-2">{dest.name}</h3>
                                    <p className="text-white/70 font-light text-sm">{dest.desc}</p>
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
                            Plan Your Next Corporate Event
                        </p>
                        <h3 className="text-3xl md:text-5xl font-display text-white drop-shadow-lg mb-8">
                            Let&apos;s Create Something <span className="italic text-[#D4AF37]">Extraordinary</span>
                        </h3>
                        <Link
                            href="/inquire"
                            className="inline-block px-10 py-4 rounded-full bg-[#D4AF37] text-[#0a1f15] text-sm tracking-[0.2em] font-semibold uppercase hover:bg-[#D4AF37]/90 transition-all shadow-lg"
                        >
                            REQUEST A PROPOSAL
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
