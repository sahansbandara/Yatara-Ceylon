import { Metadata } from 'next';
import Link from 'next/link';
import {
    ArrowRight,
    Handshake,
    PlaneLanding,
    Clock,
    GlassWater,
    Luggage,
    MessageCircle,
    ChevronDown,
} from 'lucide-react';

import BookingStrip from '@/components/public/transfers/BookingStrip';
import TransferCategoryTile from '@/components/public/transfers/TransferCategoryTile';
import SignatureRouteCard from '@/components/public/transfers/SignatureRouteCard';
import FleetTierCard from '@/components/public/transfers/FleetTierCard';

import {
    transferCategoryCards,
    signatureRoutes,
    vehicleTiers,
    trustSignals,
    servicePromises,
    transferFaq,
    formatLkr,
} from '@/data/transfers';

export const metadata: Metadata = {
    title: 'Premium Private Transfers | Yatara Ceylon',
    description:
        'Luxury airport transfers, private chauffeur services, intercity routes, and safari logistics across Sri Lanka. Fixed pricing, meet & greet, flight tracking, premium fleet. From LKR 8,500.',
};

/* ───────── Service Promise Icon Map ───────── */
const serviceIcons: Record<string, React.ReactNode> = {
    handshake: <Handshake className="w-6 h-6 text-antique-gold" />,
    'plane-landing': <PlaneLanding className="w-6 h-6 text-antique-gold" />,
    clock: <Clock className="w-6 h-6 text-antique-gold" />,
    'glass-water': <GlassWater className="w-6 h-6 text-antique-gold" />,
    luggage: <Luggage className="w-6 h-6 text-antique-gold" />,
    'message-circle': <MessageCircle className="w-6 h-6 text-antique-gold" />,
};

export default function TransfersPage() {
    return (
        <main className="bg-off-white">
            {/* ═══════════════════════════════════════════════════════════
                SECTION 1: HERO WITH BOOKING STRIP
                ═══════════════════════════════════════════════════════════ */}
            <section className="bg-deep-emerald pt-32 pb-16">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    {/* Eyebrow */}
                    <div className="mb-6">
                        <span className="text-[10px] tracking-[0.3em] uppercase text-antique-gold font-nav font-semibold">
                            Private Transfers
                        </span>
                    </div>

                    {/* Hero Content — Two Column */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
                        {/* Left — Copy */}
                        <div>
                            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
                                Sri Lanka Transfers,{' '}
                                <span className="italic text-antique-gold">Curated with Precision</span>
                            </h1>

                            <p className="text-white/80 text-lg font-nav max-w-xl mb-8 leading-relaxed">
                                Airport arrivals, intercity routes, private chauffeurs, and luxury vehicle
                                movement across the island — handled with fixed pricing, discreet service,
                                and elegant execution.
                            </p>

                            {/* CTAs */}
                            <div className="flex flex-wrap gap-4 mb-8">
                                <Link
                                    href="/inquire"
                                    className="inline-block px-8 py-3 bg-antique-gold text-deep-emerald font-nav font-semibold uppercase tracking-[0.15em] text-sm rounded-lg hover:bg-antique-gold/90 transition-all duration-300"
                                >
                                    Get Instant Quote
                                </Link>
                                <a
                                    href="#signature-routes"
                                    className="inline-flex items-center gap-2 px-8 py-3 border border-antique-gold/30 text-antique-gold font-nav font-semibold uppercase tracking-[0.15em] text-sm rounded-lg hover:border-antique-gold hover:bg-antique-gold/5 transition-all duration-300"
                                >
                                    Browse Signature Routes
                                    <ArrowRight className="w-4 h-4" />
                                </a>
                            </div>

                            {/* Trust Pills */}
                            <div className="flex flex-wrap gap-3">
                                {['Meet & greet', 'Flight tracking', 'Fixed fares', '24/7 concierge'].map(
                                    (pill) => (
                                        <span
                                            key={pill}
                                            className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white/80 text-xs font-nav"
                                        >
                                            {pill}
                                        </span>
                                    )
                                )}
                            </div>
                        </div>

                        {/* Right — Floating Booking Preview Card */}
                        <div className="hidden lg:flex items-center justify-center">
                            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 w-full max-w-sm">
                                <p className="text-antique-gold text-[10px] font-nav uppercase tracking-[0.2em] font-semibold mb-4">
                                    Sample Transfer
                                </p>
                                <div className="space-y-3 mb-5">
                                    <div className="flex justify-between text-sm font-nav">
                                        <span className="text-white/60">Pickup</span>
                                        <span className="text-white font-semibold">CMB Airport</span>
                                    </div>
                                    <div className="flex justify-between text-sm font-nav">
                                        <span className="text-white/60">Drop-off</span>
                                        <span className="text-white font-semibold">Galle Fort</span>
                                    </div>
                                    <div className="flex justify-between text-sm font-nav">
                                        <span className="text-white/60">Vehicle</span>
                                        <span className="text-white font-semibold">Prestige SUV</span>
                                    </div>
                                    <div className="flex justify-between text-sm font-nav">
                                        <span className="text-white/60">Duration</span>
                                        <span className="text-white font-semibold">2.5 hrs</span>
                                    </div>
                                </div>
                                <div className="border-t border-white/20 pt-4 mb-4">
                                    <div className="flex flex-wrap gap-2">
                                        {['Meet & greet', 'Water', 'Flight tracking'].map((item) => (
                                            <span
                                                key={item}
                                                className="px-2 py-1 bg-antique-gold/10 border border-antique-gold/20 rounded text-antique-gold text-[10px] font-nav"
                                            >
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-white/50 text-xs font-nav">From</span>
                                    <span className="font-serif text-2xl font-bold text-antique-gold">
                                        {formatLkr(22500)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Booking Strip */}
                    <BookingStrip />
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                SECTION 2: WHAT'S INCLUDED — PREMIUM PROMISES
                ═══════════════════════════════════════════════════════════ */}
            <section className="py-16 bg-white border-b border-deep-emerald/5">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="text-center mb-12">
                        <span className="text-[10px] tracking-[0.3em] uppercase text-antique-gold font-nav font-semibold block mb-3">
                            Every Transfer Includes
                        </span>
                        <h2 className="font-serif text-3xl md:text-4xl font-bold text-deep-emerald">
                            Premium Service, Standard
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {servicePromises.map((promise) => (
                            <div key={promise.title} className="text-center group">
                                <div className="w-14 h-14 mx-auto mb-3 bg-antique-gold/10 rounded-xl flex items-center justify-center group-hover:bg-antique-gold/20 transition-colors duration-300">
                                    {serviceIcons[promise.icon]}
                                </div>
                                <h3 className="font-nav text-sm font-semibold text-deep-emerald mb-1">
                                    {promise.title}
                                </h3>
                                <p className="text-xs text-deep-emerald/50 font-nav leading-relaxed">
                                    {promise.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                SECTION 3: CHOOSE YOUR TRANSFER TYPE
                ═══════════════════════════════════════════════════════════ */}
            <section className="py-24 bg-off-white">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="text-center mb-16">
                        <span className="text-[10px] tracking-[0.3em] uppercase text-antique-gold font-nav font-semibold block mb-4">
                            The Collection
                        </span>
                        <h2 className="font-serif text-4xl md:text-5xl font-bold text-deep-emerald mb-4">
                            Choose Your Transfer Type
                        </h2>
                        <p className="text-deep-emerald/60 text-lg font-nav max-w-2xl mx-auto">
                            Five categories of premium ground transport, each designed for a specific travel need
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {transferCategoryCards.map((category) => (
                            <TransferCategoryTile
                                key={category.slug}
                                slug={category.slug}
                                title={category.title}
                                subtitle={category.subtitle}
                                image={category.image}
                                startingFromLkr={category.startingFromLkr}
                                typicalDuration={category.typicalDuration}
                                bestFor={category.bestFor}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                SECTION 4: SIGNATURE ROUTES
                ═══════════════════════════════════════════════════════════ */}
            <section id="signature-routes" className="py-24 bg-deep-emerald/[0.03]">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="text-center mb-16">
                        <span className="text-[10px] tracking-[0.3em] uppercase text-antique-gold font-nav font-semibold block mb-4">
                            Curated Passages
                        </span>
                        <h2 className="font-serif text-4xl md:text-5xl font-bold text-deep-emerald mb-4">
                            Signature Routes
                        </h2>
                        <p className="text-deep-emerald/60 text-lg font-nav max-w-2xl mx-auto">
                            Our most requested routes between Sri Lanka's iconic destinations — with transparent pricing and premium service included
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {signatureRoutes.map((route) => (
                            <SignatureRouteCard
                                key={route.slug}
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
                        ))}
                    </div>

                    {/* View All Routes */}
                    <div className="text-center mt-12">
                        <Link
                            href="/inquire"
                            className="inline-flex items-center gap-2 text-antique-gold font-nav font-semibold uppercase tracking-[0.15em] text-sm hover:gap-3 transition-all duration-300"
                        >
                            Request a Quote for Any Route
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                SECTION 5: FLEET TIERS
                ═══════════════════════════════════════════════════════════ */}
            <section className="py-24 bg-off-white">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="text-center mb-16">
                        <span className="text-[10px] tracking-[0.3em] uppercase text-antique-gold font-nav font-semibold block mb-4">
                            The Fleet
                        </span>
                        <h2 className="font-serif text-4xl md:text-5xl font-bold text-deep-emerald mb-4">
                            Three Tiers of Excellence
                        </h2>
                        <p className="text-deep-emerald/60 text-lg font-nav max-w-2xl mx-auto">
                            Every vehicle is curated, regularly serviced, comprehensively insured, and equipped with amenities discerning travellers expect
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                SECTION 6: HOW IT WORKS
                ═══════════════════════════════════════════════════════════ */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="text-center mb-16">
                        <span className="text-[10px] tracking-[0.3em] uppercase text-antique-gold font-nav font-semibold block mb-4">
                            Simple Process
                        </span>
                        <h2 className="font-serif text-4xl md:text-5xl font-bold text-deep-emerald">
                            How It Works
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                step: '01',
                                title: 'Choose Your Route',
                                description: 'Select a signature route or request a custom quote for any pickup and drop-off combination across Sri Lanka.',
                            },
                            {
                                step: '02',
                                title: 'Confirm Vehicle & Schedule',
                                description: 'Pick your vehicle tier, confirm your date and time, and share any special requirements with our concierge.',
                            },
                            {
                                step: '03',
                                title: 'Receive Booking Details',
                                description: 'Get your driver\'s name, vehicle details, and direct WhatsApp contact before your transfer.',
                            },
                            {
                                step: '04',
                                title: 'Travel in Comfort',
                                description: 'Your chauffeur handles everything — from meet & greet to luggage — backed by 24/7 concierge support.',
                            },
                        ].map((item) => (
                            <div key={item.step} className="text-center group">
                                <div className="w-16 h-16 mx-auto mb-6 bg-antique-gold text-deep-emerald rounded-2xl flex items-center justify-center font-serif text-2xl font-bold group-hover:scale-110 transition-transform duration-300">
                                    {item.step}
                                </div>
                                <h3 className="font-serif text-xl font-bold text-deep-emerald mb-3">
                                    {item.title}
                                </h3>
                                <p className="text-deep-emerald/60 text-sm font-nav leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                SECTION 7: TRUST STRIP
                ═══════════════════════════════════════════════════════════ */}
            <section className="bg-deep-emerald py-16">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {trustSignals.map((signal, index) => (
                            <div key={index} className="text-center">
                                <p className="font-serif text-2xl md:text-3xl font-bold text-antique-gold mb-2">
                                    {signal.value}
                                </p>
                                <p className="text-white/60 text-sm font-nav uppercase tracking-[0.1em]">
                                    {signal.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                SECTION 8: FAQ
                ═══════════════════════════════════════════════════════════ */}
            <section className="py-24 bg-off-white">
                <div className="max-w-3xl mx-auto px-4 md:px-8">
                    <div className="text-center mb-16">
                        <span className="text-[10px] tracking-[0.3em] uppercase text-antique-gold font-nav font-semibold block mb-4">
                            Questions Answered
                        </span>
                        <h2 className="font-serif text-4xl md:text-5xl font-bold text-deep-emerald">
                            Transfer FAQ
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {transferFaq.map((item, idx) => (
                            <details
                                key={idx}
                                className="group bg-white border border-deep-emerald/10 rounded-xl overflow-hidden"
                            >
                                <summary className="flex items-center justify-between gap-4 p-6 cursor-pointer select-none">
                                    <h3 className="font-serif font-bold text-deep-emerald text-lg pr-4">
                                        {item.question}
                                    </h3>
                                    <ChevronDown className="w-5 h-5 text-antique-gold flex-shrink-0 group-open:rotate-180 transition-transform duration-300" />
                                </summary>
                                <div className="px-6 pb-6">
                                    <p className="text-deep-emerald/70 text-sm font-nav leading-relaxed">
                                        {item.answer}
                                    </p>
                                </div>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                SECTION 9: CONCIERGE CTA
                ═══════════════════════════════════════════════════════════ */}
            <section className="py-24 bg-deep-emerald">
                <div className="max-w-3xl mx-auto px-4 md:px-8 text-center">
                    <span className="text-[10px] tracking-[0.3em] uppercase text-antique-gold font-nav font-semibold block mb-6">
                        Concierge
                    </span>
                    <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-6">
                        Your Journey Begins with a Conversation
                    </h2>
                    <p className="text-white/70 text-lg font-nav mb-12 leading-relaxed">
                        Our concierge team designs the perfect transfer experience for your Sri Lanka
                        journey. Whether you need a single airport pickup or a multi-day private
                        chauffeur, we orchestrate every detail.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/inquire"
                            className="inline-block px-8 py-4 bg-antique-gold text-deep-emerald font-nav font-semibold uppercase tracking-[0.15em] text-sm rounded-lg hover:bg-antique-gold/90 transition-all duration-300"
                        >
                            Request a Quote
                        </Link>
                        <Link
                            href="/contact"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-antique-gold/30 text-antique-gold font-nav font-semibold uppercase tracking-[0.15em] text-sm rounded-lg hover:border-antique-gold hover:bg-antique-gold/5 transition-all duration-300"
                        >
                            Speak with Concierge
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
