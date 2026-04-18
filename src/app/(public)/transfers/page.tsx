import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
    ArrowRight,
    Handshake,
    PlaneLanding,
    Clock,
    GlassWater,
    Luggage,
    MessageCircle,
    ChevronDown,
    BadgeDollarSign,
    Users,
    CalendarCheck,
    Headphones,
    Sparkles,
    Compass,
    ShieldCheck,
    Car,
    Star,
    Plus,
    Minus
} from 'lucide-react';

import { JsonLd, buildTravelAgency, buildFAQPage, buildBreadcrumb } from '@/lib/jsonLd';
import BookingStrip from '@/components/public/transfers/BookingStrip';
import SignatureRouteCard from '@/components/public/transfers/SignatureRouteCard';
import FleetTierCard from '@/components/public/transfers/FleetTierCard';

import {
    signatureRoutes,
    vehicleTiers,
    trustSignals,
    servicePromises,
    transferFaq,
} from '@/data/transfers';

import TransfersHero from './_components/TransfersHero';
import TransferCategoryGrid from './_components/TransferCategoryGrid';
import FadeIn from './_components/FadeIn';

export const metadata: Metadata = {
    title: 'Premium Private Transfers | Yatara Ceylon',
    description:
        'Luxury airport transfers, private chauffeur services, intercity routes, and safari logistics across Sri Lanka. Fixed pricing, meet & greet, flight tracking, premium fleet. From LKR 8,500.',
};

const serviceIcons: Record<string, React.ReactNode> = {
    handshake: <Handshake className="w-6 h-6 text-antique-gold" />,
    'plane-landing': <PlaneLanding className="w-6 h-6 text-antique-gold" />,
    clock: <Clock className="w-6 h-6 text-antique-gold" />,
    'glass-water': <GlassWater className="w-6 h-6 text-antique-gold" />,
    luggage: <Luggage className="w-6 h-6 text-antique-gold" />,
    'message-circle': <MessageCircle className="w-6 h-6 text-antique-gold" />,
};

const trustBarItems = [
    { icon: PlaneLanding, label: 'Meet & Greet at Arrivals' },
    { icon: BadgeDollarSign, label: 'Fixed Transparent Pricing' },
    { icon: Users, label: 'Professional Chauffeurs' },
    { icon: CalendarCheck, label: 'Flexible Cancellation' },
    { icon: Headphones, label: 'Concierge Support' },
];

export default function TransfersPage() {
    return (
        <main className="min-h-screen bg-off-white">
            {/* ─── SEO Structured Data ─── */}
            <JsonLd data={buildTravelAgency()} />
            <JsonLd data={buildFAQPage(transferFaq)} />
            <JsonLd data={buildBreadcrumb([
                { name: 'Home', url: '/' },
                { name: 'Transfers', url: '/transfers' },
            ])} />

            {/* ═══════════════════════════════════════════════════════════
                SECTION 1: HERO
                ═══════════════════════════════════════════════════════════ */}
            <TransfersHero />

            {/* ═══════════════════════════════════════════════════════════
                SECTION 1.5: FLOATING BOOKING STRIP
                ═══════════════════════════════════════════════════════════ */}
            <div className="relative z-40 px-4 sm:px-6 flex justify-center -mt-20 sm:-mt-24 mb-16 pointer-events-none">
                <div className="pointer-events-auto w-full max-w-[1100px] bg-[#E5E0D8]/40 backdrop-blur-2xl border border-white/40 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] p-1 rounded-3xl transition-all duration-500 hover:bg-[#E5E0D8]/50 hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.2)]">
                    <BookingStrip />
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════
                SECTION 2: TRUST BAR
                ═══════════════════════════════════════════════════════════ */}
            <section className="bg-white border-y border-deep-emerald/5">
                <div className="max-w-[1400px] mx-auto px-4 py-4">
                    <FadeIn delay={0.2} className="flex flex-wrap lg:flex-nowrap items-center justify-center gap-4 sm:gap-6 lg:gap-10">
                        {trustBarItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <div key={item.label} className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-antique-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Icon className="w-3.5 h-3.5 text-antique-gold" />
                                    </div>
                                    <span className="text-deep-emerald/70 text-[9px] lg:text-[10px] font-nav font-bold uppercase tracking-wider text-center lg:text-left whitespace-nowrap">
                                        {item.label}
                                    </span>
                                </div>
                            );
                        })}
                    </FadeIn>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                SECTION 3: CHOOSE YOUR TRANSFER TYPE
                ═══════════════════════════════════════════════════════════ */}
            <section className="py-24 lg:py-32 bg-[#E3EFE9] relative overflow-hidden">
                {/* Decorative orbs */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-antique-gold/[0.05] rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-deep-emerald/[0.05] rounded-full blur-[100px] pointer-events-none" />
                
                <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
                    <FadeIn className="text-center mb-20 lg:mb-24">
                        <span className="text-[10px] tracking-[0.3em] uppercase text-antique-gold font-nav font-semibold block mb-4">
                            The Collection
                        </span>
                        <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-deep-emerald mb-6">
                            Choose Your Transfer Type
                        </h2>
                        <div className="w-16 h-px bg-antique-gold/40 mx-auto mb-6" />
                        <p className="text-deep-emerald/60 text-base md:text-lg font-nav max-w-2xl mx-auto">
                            Six categories of premium ground transport, each carefully designed for a specific travel requirement across the island.
                        </p>
                    </FadeIn>

                    <TransferCategoryGrid />
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                SECTION 4: SIGNATURE ROUTES
                ═══════════════════════════════════════════════════════════ */}
            <section id="signature-routes" className="py-24 lg:py-32 bg-off-white">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <FadeIn className="text-center mb-16 lg:mb-20">
                        <span className="text-[10px] tracking-[0.3em] uppercase text-antique-gold font-nav font-semibold block mb-4">
                            Curated Passages
                        </span>
                        <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-deep-emerald mb-6">
                            Signature Routes
                        </h2>
                        <div className="w-16 h-px bg-antique-gold/30 mx-auto mb-6" />
                        <p className="text-deep-emerald/60 text-base md:text-lg font-nav max-w-2xl mx-auto">
                            Our most requested routes between Sri Lanka's iconic destinations — with transparent pricing and premium service included.
                        </p>
                    </FadeIn>

                    <FadeIn delay={0.2} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {signatureRoutes.map((route) => (
                            <div key={route.slug} className="group h-full">
                                <SignatureRouteCard
                                    from={route.from}
                                    to={route.to}
                                    title={route.title}
                                    slug={route.slug}
                                    transferType={route.transferType}
                                    duration={route.duration}
                                    distance={route.distance}
                                    startingPriceLkr={route.startingPriceLkr}
                                    vehicleTier={route.vehicleTier}
                                    includes={route.includes}
                                    image={route.image}
                                />
                            </div>
                        ))}
                    </FadeIn>

                    {/* View All Routes */}
                    <FadeIn delay={0.3} className="text-center mt-16">
                        <Link
                            href="/inquire"
                            className="inline-flex items-center gap-3 text-deep-emerald font-nav font-bold uppercase tracking-[0.15em] text-xs hover:text-antique-gold transition-colors duration-300"
                        >
                            Request a Quote for Any Route
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </FadeIn>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                SECTION 5: FLEET TIERS
                ═══════════════════════════════════════════════════════════ */}
            <section id="fleet" className="py-24 lg:py-32 bg-[#E3EFE9] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-antique-gold/[0.05] rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-deep-emerald/[0.05] rounded-full blur-[100px] pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
                    <FadeIn className="text-center mb-16 lg:mb-20">
                        <span className="text-[10px] tracking-[0.3em] uppercase text-antique-gold font-nav font-semibold block mb-4">
                            The Fleet
                        </span>
                        <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-deep-emerald mb-6">
                            Three Tiers of Excellence
                        </h2>
                        <div className="w-16 h-px bg-antique-gold/40 mx-auto mb-6" />
                        <p className="text-deep-emerald/70 text-base md:text-lg font-nav max-w-2xl mx-auto">
                            Every vehicle is curated, regularly serviced, comprehensively insured, and equipped with amenities discerning travellers expect.
                        </p>
                    </FadeIn>

                    <FadeIn delay={0.2} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {vehicleTiers.map((tier) => (
                            <FleetTierCard
                                key={tier.slug}
                                name={tier.name}
                                tagline={tier.tagline}
                                vehicles={tier.vehicles}
                                maxGuests={tier.maxGuests}
                                maxLuggage={tier.maxLuggage}
                                features={tier.features}
                                image={tier.image}
                                idealFor={tier.idealFor}
                                useCases={tier.useCases}
                            />
                        ))}
                    </FadeIn>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                SECTION 6: WHAT'S INCLUDED — PREMIUM PROMISES
                ═══════════════════════════════════════════════════════════ */}
            <section className="py-6 lg:py-8 bg-white border-y border-deep-emerald/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-antique-gold/[0.02] rounded-full blur-[80px] pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
                    <FadeIn delay={0.1} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-4">
                        {servicePromises.map((promise) => (
                            <div key={promise.title} className="text-center group p-3 rounded-lg flex flex-col items-center justify-center transition-all duration-300 hover:bg-[#F4F8F6]">
                                <div className="w-10 h-10 mb-2 bg-white border border-antique-gold/20 shadow-sm rounded flex items-center justify-center group-hover:bg-antique-gold/10 transition-all duration-300">
                                    <div className="scale-90 text-antique-gold">
                                        {serviceIcons[promise.icon]}
                                    </div>
                                </div>
                                <h3 className="font-nav text-[9px] font-bold uppercase tracking-[0.15em] text-deep-emerald mb-1">
                                    {promise.title}
                                </h3>
                                <p className="text-[10px] text-deep-emerald/50 font-nav leading-snug max-w-[140px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 md:opacity-100 h-0 group-hover:h-auto overflow-hidden md:h-auto">
                                    {promise.description}
                                </p>
                            </div>
                        ))}
                    </FadeIn>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                SECTION 7: HOW IT WORKS
                ═══════════════════════════════════════════════════════════ */}
            <section className="py-24 lg:py-32 bg-[#E3EFE9] text-deep-emerald relative overflow-hidden">
                 {/* Background Pattern Overlay */}
                 <div
                    className="absolute inset-0 z-0 opacity-30 pointer-events-none mix-blend-multiply"
                    style={{
                        backgroundImage: "url('/images/home/curated-bg-pattern.webp')",
                        backgroundSize: '400px',
                        backgroundPosition: 'top left',
                        backgroundRepeat: 'repeat'
                    }}
                />

                {/* Subtle background accents */}
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-antique-gold/[0.03] rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-deep-emerald/[0.02] rounded-full blur-3xl" />

                <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative z-10">
                    <FadeIn className="text-center mb-16 lg:mb-20">
                        <span className="text-[10px] tracking-[0.3em] uppercase text-antique-gold font-nav font-semibold block mb-4">
                            Seamless Process
                        </span>
                        <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-deep-emerald mb-6">
                            How It Works
                        </h2>
                        <div className="w-16 h-px bg-antique-gold/40 mx-auto" />
                    </FadeIn>

                    <FadeIn delay={0.2} className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                        {[
                            {
                                step: '01',
                                icon: Compass,
                                title: 'Choose Your Route',
                                description: 'Select a signature route or request a custom quote for any pickup and drop-off combination.',
                                image: '/images/transfers/process-1.webp'
                            },
                            {
                                step: '02',
                                icon: CalendarCheck,
                                title: 'Confirm & Schedule',
                                description: 'Pick your vehicle tier, confirm your date, and share any special requirements with our concierge.',
                                image: '/images/transfers/process-2.webp'
                            },
                            {
                                step: '03',
                                icon: MessageCircle,
                                title: 'Receive Details',
                                description: 'Get your driver\'s name, vehicle details, and direct WhatsApp contact prior to your arrival.',
                                image: '/images/transfers/process-3.webp'
                            },
                            {
                                step: '04',
                                icon: Clock,
                                title: 'Travel in Comfort',
                                description: 'Your chauffeur handles everything — from meet & greet to luggage — backed by 24/7 support.',
                                badge: 'Concierge Execution',
                                image: '/images/transfers/process-4.webp'
                            },
                        ].map((item, idx) => (
                            <article
                                key={idx}
                                className="group relative rounded-[20px] bg-white/70 backdrop-blur-md p-3 md:p-4 flex flex-col sm:flex-row gap-5 items-center hover:-translate-y-1 transition-all duration-500 shadow-[0_8px_32px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.08)] overflow-hidden border border-white/40"
                            >
                                {/* Image Container */}
                                <div className="relative w-full sm:w-[40%] md:w-[35%] lg:w-[40%] aspect-[4/3] sm:aspect-auto sm:h-full min-h-[160px] rounded-[16px] overflow-hidden shrink-0 bg-[#E3EFE9]">
                                    <div 
                                        className="absolute inset-0 w-full h-full bg-cover bg-center transform group-hover:scale-105 transition-transform duration-[2s] ease-out"
                                        style={{ backgroundImage: `url(${item.image})` }}
                                    />
                                    {/* Subtle gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none" />

                                    {/* Badge */}
                                    {item.badge && (
                                        <span className="absolute top-3 right-3 text-[7px] font-nav font-semibold tracking-[0.15em] uppercase text-antique-gold bg-black/60 backdrop-blur-md px-2 py-1 rounded-full border border-antique-gold/30 shadow-sm">
                                            {item.badge}
                                        </span>
                                    )}
                                </div>

                                {/* Content Container */}
                                <div className="flex-1 flex flex-col justify-center py-2 px-3 sm:px-2 sm:pr-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="w-9 h-9 rounded-full border border-antique-gold/30 flex items-center justify-center text-antique-gold group-hover:bg-antique-gold/10 transition-colors duration-300 bg-white">
                                            <item.icon className="w-4 h-4" strokeWidth={1.5} />
                                        </div>
                                        <span className="text-3xl md:text-4xl font-display text-deep-emerald/10 group-hover:text-deep-emerald/20 transition-colors duration-500">
                                            {item.step}
                                        </span>
                                    </div>

                                    <h3 className="text-xl md:text-2xl font-display mb-2 tracking-wide text-deep-emerald group-hover:text-antique-gold transition-colors duration-300">
                                        {item.title}
                                    </h3>
                                    <p className="text-[13px] md:text-sm font-light leading-relaxed m-0 text-gray-500">
                                        {item.description}
                                    </p>
                                </div>
                            </article>
                        ))}
                    </FadeIn>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                SECTION 8: TRUST STRIP
                ═══════════════════════════════════════════════════════════ */}
            <section className="py-4 lg:py-6 bg-white border-y border-deep-emerald/5 relative overflow-hidden">
                <div className="absolute top-0 right-1/4 w-[300px] h-[300px] bg-antique-gold/[0.02] rounded-full blur-[80px] pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 flex justify-center">
                    <FadeIn delay={0.1} className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                        {trustSignals.map((signal, index) => {
                            const icons = [
                                <ShieldCheck key="shield" className="w-4 h-4 text-antique-gold opacity-90" />,
                                <Headphones key="headphones" className="w-4 h-4 text-antique-gold opacity-90" />,
                                <Car key="car" className="w-4 h-4 text-antique-gold opacity-90" />,
                                <Star key="star" className="w-4 h-4 text-antique-gold opacity-90" />
                            ];
                            return (
                                <div key={index} className="group py-2 px-3 rounded-lg flex flex-row items-center justify-start md:justify-center gap-3 transition-all duration-300 hover:bg-[#F4F8F6]">
                                    <div className="w-8 h-8 shrink-0 bg-white border border-antique-gold/20 shadow-sm rounded-full flex items-center justify-center group-hover:bg-antique-gold/10 transition-all duration-300">
                                        {icons[index]}
                                    </div>
                                    <div className="flex flex-col text-left">
                                        <h3 className="font-serif text-[15px] md:text-base font-bold text-deep-emerald leading-tight mb-0.5">
                                            {signal.value}
                                        </h3>
                                        <p className="font-nav text-[8px] md:text-[9px] font-bold uppercase tracking-[0.15em] text-deep-emerald/60">
                                            {signal.label}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </FadeIn>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                SECTION 9: FAQ
                ═══════════════════════════════════════════════════════════ */}
            <section className="py-24 lg:py-32 bg-[#E3EFE9] text-deep-emerald relative overflow-hidden">
                {/* Background Pattern Overlay */}
                <div
                    className="absolute inset-0 z-0 opacity-30 pointer-events-none mix-blend-multiply"
                    style={{
                        backgroundImage: "url('/images/home/curated-bg-pattern.webp')",
                        backgroundSize: '400px',
                        backgroundPosition: 'top left',
                        backgroundRepeat: 'repeat'
                    }}
                />

                {/* Subtle background accents */}
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-antique-gold/[0.03] rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-deep-emerald/[0.02] rounded-full blur-3xl pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
                    <FadeIn className="text-center mb-16 lg:mb-20">
                        <span className="text-[10px] tracking-[0.3em] uppercase text-[#043927]/60 font-nav font-bold block mb-4">
                            Questions Answered
                        </span>
                        <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-black mb-6">
                            Transfer <span className="italic">FAQ</span>
                        </h2>
                        <div className="w-16 h-px bg-black/20 mx-auto" />
                    </FadeIn>

                    <FadeIn delay={0.2} className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 items-start">
                        {transferFaq.map((item, idx) => (
                            <details
                                key={idx}
                                className="group relative bg-white/40 backdrop-blur-md rounded-2xl overflow-hidden hover:bg-white/60 transition-all duration-500 border border-white/60 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
                            >
                                <summary className="flex items-center justify-between gap-4 p-6 sm:p-8 cursor-pointer select-none outline-none list-none [&::-webkit-details-marker]:hidden">
                                    <h3 className="font-display text-[15px] sm:text-[17px] tracking-wide text-black/80 font-light pr-4 group-hover:text-black group-open:text-[#043927] transition-colors leading-snug">
                                        {item.question}
                                    </h3>
                                    <div className="shrink-0 relative flex items-center justify-center w-6 h-6 transition-transform duration-500">
                                        <div className="absolute transition-all duration-500 ease-[cubic-bezier(0.87,0,0.13,1)] group-open:rotate-180 group-open:opacity-0 group-open:scale-50 rotate-0 opacity-100 scale-100">
                                            <Plus className="w-5 h-5 text-black/30 font-light" strokeWidth={1} />
                                        </div>
                                        <div className="absolute transition-all duration-500 ease-[cubic-bezier(0.87,0,0.13,1)] group-open:rotate-0 group-open:opacity-100 group-open:scale-100 -rotate-180 opacity-0 scale-50">
                                            <Minus className="w-5 h-5 text-[#043927]" strokeWidth={1} />
                                        </div>
                                    </div>
                                </summary>
                                <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-0 animation-content-expand overflow-hidden">
                                    <p className="text-[#6a6a6a] font-sans font-light leading-[1.8] text-[13px] md:text-[14px]">
                                        {item.answer}
                                    </p>
                                </div>
                            </details>
                        ))}
                    </FadeIn>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                SECTION 10: CONCIERGE CTA (ELITE STYLE)
                ═══════════════════════════════════════════════════════════ */}
            <section className="pt-8 pb-24 lg:pb-32 bg-off-white px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <FadeIn>
                        <div className="relative overflow-hidden rounded-3xl liquid-glass-gold">
                            {/* Decorative gradient orbs */}
                            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-antique-gold/[0.06] blur-3xl pointer-events-none" />
                            <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-deep-emerald/[0.04] blur-3xl pointer-events-none" />

                            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 p-10 sm:p-14 lg:p-16">
                                <div className="max-w-xl text-center lg:text-left">
                                    <div className="inline-flex items-center gap-2 mb-4">
                                        <Sparkles className="w-4 h-4 text-antique-gold" />
                                        <p className="text-[10px] tracking-[0.3em] uppercase text-antique-gold font-bold">
                                            Bespoke Transfer Service
                                        </p>
                                    </div>
                                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display text-deep-emerald leading-tight mb-6">
                                        Your Journey Begins with a Conversation
                                    </h2>
                                    <p className="text-sm md:text-base text-deep-emerald/60 leading-relaxed font-nav">
                                        Our concierge team designs the perfect transfer experience for your Sri Lanka
                                        journey. Whether you need a single airport pickup or a multi-day private
                                        chauffeur, we orchestrate every detail.
                                    </p>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 shrink-0">
                                    <Link
                                        href="/inquire"
                                        className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-deep-emerald text-white text-[10px] tracking-[0.2em] font-bold uppercase rounded-full hover:bg-antique-gold hover:text-deep-emerald transition-all duration-500 shadow-lg shadow-deep-emerald/20 hover:shadow-xl hover:-translate-y-1"
                                    >
                                        <span>Request a Quote</span>
                                    </Link>
                                    <Link
                                        href="/contact"
                                        className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/50 border border-deep-emerald/20 text-deep-emerald text-[10px] tracking-[0.2em] font-bold uppercase rounded-full hover:bg-white hover:border-deep-emerald/30 transition-all duration-500 hover:shadow-lg hover:-translate-y-1"
                                    >
                                        <span>Speak with Concierge</span>
                                        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </section>
        </main>
    );
}
