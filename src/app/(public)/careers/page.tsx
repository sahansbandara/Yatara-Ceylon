import Image from 'next/image';
import Link from 'next/link';
import { Briefcase, MapPin, Clock, Heart, TrendingUp, Users, Star, Globe } from 'lucide-react';

const openPositions = [
    {
        title: 'Senior Tour Planner',
        department: 'Tour Planning',
        location: 'Colombo',
        type: 'Full-Time',
        description: 'Design bespoke itineraries for international guests, working closely with our destination experts and partner hotels.',
    },
    {
        title: 'Chauffeur Guide',
        department: 'Operations',
        location: 'Island-wide',
        type: 'Full-Time',
        description: 'Drive and guide international tourists across Sri Lanka. Multilingual candidates with excellent local knowledge preferred.',
    },
    {
        title: 'Digital Marketing Executive',
        department: 'Marketing',
        location: 'Colombo',
        type: 'Full-Time',
        description: 'Lead our digital marketing campaigns across social media, SEO, and content marketing to attract global travellers.',
    },
    {
        title: 'Guest Relations Officer',
        department: 'Customer Service',
        location: 'Colombo',
        type: 'Full-Time',
        description: 'Be the first point of contact for our guests, ensuring every interaction exceeds expectations from inquiry to departure.',
    },
    {
        title: 'MICE Coordinator',
        department: 'MICE Division',
        location: 'Colombo',
        type: 'Full-Time',
        description: 'Plan and execute corporate events, conferences, and incentive programmes for international corporate clients.',
    },
    {
        title: 'Fleet Coordinator',
        department: 'Transport',
        location: 'Colombo',
        type: 'Full-Time',
        description: 'Manage vehicle scheduling, driver assignments, and fleet maintenance across our 200+ vehicle fleet.',
    },
];

const benefits = [
    { icon: Heart, title: 'Health & Wellness', desc: 'Comprehensive medical insurance and annual wellness checks for you and your family.' },
    { icon: TrendingUp, title: 'Career Growth', desc: 'Clear career progression paths, mentorship programmes, and leadership development.' },
    { icon: Globe, title: 'Travel Perks', desc: 'Discounted travel packages, FAM trips, and exposure to global tourism events.' },
    { icon: Users, title: 'Team Culture', desc: 'A vibrant, inclusive workplace where passion for travel brings everyone together.' },
    { icon: Star, title: 'Performance Rewards', desc: 'Competitive bonuses, recognition programmes, and annual performance incentives.' },
    { icon: Briefcase, title: 'Work-Life Balance', desc: 'Flexible schedules, paid time off, and a supportive work environment.' },
];

export default function CareersPage() {
    return (
        <div className="min-h-screen bg-off-white">
            {/* Hero Section */}
            <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
                <Image
                    src="/images/home/curated-southcoast.png"
                    alt="Careers at Yatara Ceylon"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-deep-emerald/60" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a1f15]/80 via-transparent to-deep-emerald/90" />

                <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="text-center max-w-3xl px-4">
                        <span className="inline-block mb-4 text-xs tracking-[0.4em] font-medium text-[#D4AF37] uppercase">
                            Join Our Team
                        </span>
                        <h1 className="text-5xl md:text-7xl font-display text-white leading-tight">
                            Build Your Career<br />
                            <span className="italic font-light text-[#D4AF37]">in Travel</span>
                        </h1>
                        <p className="mt-6 text-white/70 font-light text-lg max-w-xl mx-auto">
                            Join Sri Lanka&apos;s leading destination management company and help create unforgettable journeys for travellers worldwide.
                        </p>
                    </div>
                </div>
            </section>

            {/* Why Join Us */}
            <section className="py-28">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="text-center mb-16">
                        <span className="text-xs tracking-[0.3em] text-[#D4AF37] uppercase font-medium">Why Yatara Ceylon</span>
                        <h2 className="text-4xl md:text-5xl font-display text-deep-emerald mt-3">
                            Benefits & Culture
                        </h2>
                        <div className="h-px w-16 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mt-6" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {benefits.map((benefit, idx) => (
                            <div key={idx} className="flex items-start gap-5 group">
                                <div className="w-11 h-11 rounded-xl bg-deep-emerald/5 border border-deep-emerald/10 flex items-center justify-center shrink-0 group-hover:bg-[#D4AF37]/10 group-hover:border-[#D4AF37]/20 transition-all">
                                    <benefit.icon className="w-5 h-5 text-deep-emerald/60 group-hover:text-[#D4AF37] transition-colors" strokeWidth={1.5} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-display text-deep-emerald mb-1">{benefit.title}</h3>
                                    <p className="text-gray-500 font-light text-sm leading-relaxed">{benefit.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Open Positions */}
            <section className="py-28 bg-white">
                <div className="max-w-5xl mx-auto px-4 md:px-8">
                    <div className="text-center mb-16">
                        <span className="text-xs tracking-[0.3em] text-[#D4AF37] uppercase font-medium">Current Openings</span>
                        <h2 className="text-4xl md:text-5xl font-display text-deep-emerald mt-3">
                            Open Positions
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {openPositions.map((position, idx) => (
                            <div
                                key={idx}
                                className="group p-6 rounded-2xl bg-off-white border border-deep-emerald/5 hover:border-[#D4AF37]/20 hover:shadow-lg transition-all duration-500"
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-display text-deep-emerald mb-2 group-hover:text-[#D4AF37] transition-colors">
                                            {position.title}
                                        </h3>
                                        <p className="text-gray-500 font-light text-sm mb-3">{position.description}</p>
                                        <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                                            <span className="flex items-center gap-1">
                                                <Briefcase className="w-3 h-3" /> {position.department}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <MapPin className="w-3 h-3" /> {position.location}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" /> {position.type}
                                            </span>
                                        </div>
                                    </div>
                                    <Link
                                        href="/contact"
                                        className="shrink-0 px-6 py-2.5 rounded-full border-2 border-deep-emerald/20 text-deep-emerald text-xs tracking-[0.15em] font-semibold uppercase hover:bg-deep-emerald hover:text-white transition-all"
                                    >
                                        APPLY NOW
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
                            Don&apos;t See Your Role?
                        </p>
                        <h3 className="text-3xl md:text-5xl font-display text-white drop-shadow-lg mb-8">
                            Send Us Your <span className="italic text-[#D4AF37]">CV</span>
                        </h3>
                        <Link
                            href="/contact"
                            className="inline-block px-10 py-4 rounded-full bg-[#D4AF37] text-[#0a1f15] text-sm tracking-[0.2em] font-semibold uppercase hover:bg-[#D4AF37]/90 transition-all shadow-lg"
                        >
                            GET IN TOUCH
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
