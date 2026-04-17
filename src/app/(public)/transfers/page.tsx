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
    ShieldCheck,
    Users,
    Headphones,
    BadgeDollarSign,
    CalendarCheck,
} from 'lucide-react';

import { JsonLd, buildTravelAgency, buildFAQPage, buildBreadcrumb } from '@/lib/jsonLd';
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

/* ───────── Trust Bar Items ───────── */
const trustBarItems = [
    { icon: PlaneLanding, label: 'Meet & Greet at Arrivals' },
    { icon: BadgeDollarSign, label: 'Fixed Transparent Pricing' },
    { icon: Users, label: 'Professional Chauffeurs' },
    { icon: CalendarCheck, label: 'Flexible Cancellation' },
    { icon: Headphones, label: 'Concierge Support' },
];

export default function TransfersPage() {
    return (
        <main className="bg-off-white">
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
            <section className="bg-deep-emerald pt-32 pb-20">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    {/* Eyebrow */}
                    <div className="mb-6">
                        <span className="text-[10px] tracking-[0.3em] uppercase text-antique-gold font-nav font-semibold">
                            Private Transfers
                        </span>
                    </div>

                    {/* Hero Content */}
                    <div className="max-w-3xl mb-12">
                        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                            Transfers Designed Around{' '}
                            <span className="italic text-antique-gold">Time, Privacy, and Comfort</span>
                        </h1>

                        <p className="text-white/80 text-lg font-nav max-w-xl mb-10 leading-relaxed">
                            From airport arrivals to intercity travel and chauffeured day use, each transfer
                            is tailored for seamless movement across Sri Lanka.
                        </p>

                        {/* CTAs */}
                        <div className="flex flex-wrap gap-4">
                            <Link
                                href="/inquire"
                                className="inline-block px-8 py-3 bg-antique-gold text-deep-emerald font-nav font-semibold uppercase tracking-[0.15em] text-sm rounded-lg hover:bg-antique-gold/90 transition-all duration-300"
                            >
                                Request a Transfer
                            </Link>
                            <a
                                href="#fleet"
                                className="inline-flex items-center gap-2 px-8 py-3 border border-antique-gold/30 text-antique-gold font-nav font-semibold uppercase tracking-[0.15em] text-sm rounded-lg hover:border-antique-gold hover:bg-antique-gold/5 transition-all duration-300"
                            >
                                View Fleet
                                <ArrowRight className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Booking Strip */}
                    <BookingStrip />
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                SECTION 2: TRUST BAR — DIRECTLY BELOW HERO
                ═══════════════════════════════════════════════════════════ */}
            <section className="bg-[#032b1e] border-t border-white/5">
                <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
                    <div className="flex flex-wrap items-center justify-between gap-6 md:gap-4">
                        {trustBarItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <div key={item.label} className="flex items-center gap-3">
                                    <div className="w-9 h-9 bg-antique-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Icon className="w-4 h-4 text-antique-gold" />
                                    </div>
                                    <span className="text-white/70 text-xs font-nav font-medium tracking-wide">
                                        {item.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                SECTION 3: CHOOSE YOUR TRANSFER TYPE — 6 DARK CARDS
                ═══════════════════════════════════════════════════════════ */}
            <section className="py-24 bg-[#0a1f16]">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="text-center mb-16">
                        <span className="text-[10px] tracking-[0.3em] uppercase text-antique-gold font-nav font-semibold block mb-4">
                            The Collection
                        </span>
                        <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">
                            Choose Your Transfer Type
                        </h2>
                        <p className="text-white/50 text-lg font-nav max-w-2xl mx-auto">
                            Six categories of premium ground transport, each designed for a specific travel need
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <section id="signature-routes" className="py-24 bg-[#f7f5f0]">
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
            <section id="fleet" className="py-24 bg-[#f7f5f0]">
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
                SECTION 6: WHAT'S INCLUDED — PREMIUM PROMISES
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
                SECTION 7: HOW IT WORKS
                ═══════════════════════════════════════════════════════════ */}
            <section className="py-24 bg-[#f7f5f0]">
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
                SECTION 8: TRUST STRIP
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
                SECTION 9: FAQ
                ═══════════════════════════════════════════════════════════ */}
            <section className="py-24 bg-[#f7f5f0]">
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
                SECTION 10: CONCIERGE CTA
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
