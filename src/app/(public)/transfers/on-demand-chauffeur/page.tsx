import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ArrowLeft, Clock, Check } from 'lucide-react';

import { JsonLd, buildBreadcrumb, buildFAQPage } from '@/lib/jsonLd';
import TransferHero from '@/components/public/transfers/TransferHero';
import TransferTrustBar from '@/components/public/transfers/TransferTrustBar';
import TransferCategoryShowcase from '@/components/public/transfers/TransferCategoryShowcase';
import FleetTierCard from '@/components/public/transfers/FleetTierCard';

import {
    transferProducts,
    vehicleTiers,
    transferFaq,
    transferCategoryCards,
    formatLkr,
} from '@/data/transfers';

export const metadata: Metadata = {
    title: 'On-Demand Chauffeur Service | Yatara Ceylon',
    description:
        'Flexible hourly chauffeur hire across Sri Lanka. Half-day, full-day, and multi-day options with premium vehicles and experienced drivers. From LKR 9,500.',
};

export default function OnDemandChauffeurPage() {
    const category = transferCategoryCards.find((c) => c.slug === 'hourly')!;
    const hourlyTransfers = transferProducts.filter(
        (t) => t.transferType === 'HOURLY' || t.transferType === 'SAFARI' || t.transferType === 'EVENT'
    );

    const breadcrumb = buildBreadcrumb([
        { name: 'Home', url: '/' },
        { name: 'Transfers', url: '/transfers' },
        { name: 'On-Demand Chauffeur', url: '/transfers/on-demand-chauffeur' },
    ]);

    return (
        <main className="bg-off-white">
            {/* SEO */}
            <JsonLd data={breadcrumb} />
            <JsonLd data={buildFAQPage(transferFaq.slice(0, 4))} />

            {/* ─── Hero ─── */}
            <TransferHero
                badge="On-Demand Chauffeur"
                title="Your Schedule,"
                titleAccent="Our Driver"
                description="Total flexibility — a personal chauffeur on retainer, available at your schedule, for as many stops, diversions, and spontaneous discoveries as your day holds."
                primaryCTA={{ label: 'Get Instant Quote', href: '/inquire' }}
                secondaryCTA={{ label: 'View Options', href: '#options' }}
                heroImage="/images/transfers/on-demand-chauffeur-hero.webp"
            />

            {/* ─── Trust Bar ─── */}
            <TransferTrustBar />

            {/* ─── How Chauffeur Service Works ─── */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="text-center mb-14">
                        <span className="text-[10px] tracking-[0.3em] uppercase text-antique-gold font-nav font-semibold block mb-3">
                            How It Works
                        </span>
                        <h2 className="font-serif text-3xl md:text-4xl font-bold text-deep-emerald mb-4">
                            Flexibility, Redefined
                        </h2>
                        <p className="text-deep-emerald/60 text-lg font-nav max-w-2xl mx-auto leading-relaxed">
                            {category.description}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                        {[
                            {
                                step: '01',
                                title: 'Choose Your Duration',
                                desc: 'Half-day (4 hrs), full-day (8 hrs), or extended — we match the block to your needs.',
                            },
                            {
                                step: '02',
                                title: 'Pick Your Vehicle',
                                desc: 'Executive sedans, prestige SUVs, or grand people-carriers for groups.',
                            },
                            {
                                step: '03',
                                title: 'Set Your Itinerary',
                                desc: 'Pre-plan stops or go spontaneous — your chauffeur adapts to your rhythm.',
                            },
                            {
                                step: '04',
                                title: 'Travel Freely',
                                desc: 'Unlimited stops within your block. Your chauffeur waits while you explore.',
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
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Benefits Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            {
                                title: 'Unlimited Stops',
                                description:
                                    'Visit markets, temples, beaches, and restaurants — make as many stops as you wish within your booked block.',
                            },
                            {
                                title: 'Standby Chauffeur',
                                description:
                                    'Your driver waits while you dine, shop, or explore. No rush, no meter running.',
                            },
                            {
                                title: 'Local Expertise',
                                description:
                                    'Chauffeurs double as informal guides — they know the best local restaurants, hidden viewpoints, and shortcut routes.',
                            },
                            {
                                title: 'Corporate Ready',
                                description:
                                    'Professional appearance, punctuality, and discretion for business meetings and client entertainment.',
                            },
                            {
                                title: 'Extension Friendly',
                                description:
                                    'Need more time? Extend your booking on the spot — additional hours are charged at a transparent pro-rata rate.',
                            },
                            {
                                title: 'Multi-Day Retainers',
                                description:
                                    'Planning a multi-day exploration? Book a retainer package with daily flexibility and preferential rates.',
                            },
                        ].map((item) => (
                            <div
                                key={item.title}
                                className="p-6 bg-deep-emerald/[0.02] border border-deep-emerald/5 rounded-xl hover:border-antique-gold/20 transition-colors duration-300"
                            >
                                <h3 className="font-serif text-lg font-bold text-deep-emerald mb-2">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-deep-emerald/60 font-nav leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── Available Options ─── */}
            <div id="options">
                <TransferCategoryShowcase
                    transfers={hourlyTransfers}
                    sectionEyebrow="Chauffeur, Safari & Event Packages"
                    sectionTitle="On-Demand Options"
                />
            </div>

            {/* ─── Fleet ─── */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="text-center mb-16">
                        <span className="text-[10px] tracking-[0.3em] uppercase text-antique-gold font-nav font-semibold block mb-4">
                            The Fleet
                        </span>
                        <h2 className="font-serif text-3xl md:text-4xl font-bold text-deep-emerald mb-4">
                            Your Ride, Your Choice
                        </h2>
                        <p className="text-deep-emerald/60 font-nav max-w-xl mx-auto">
                            Select the vehicle tier that best suits your day — from executive sedans for solo exploration to spacious people-carriers for groups
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

            {/* ─── CTA ─── */}
            <section className="py-24 bg-deep-emerald">
                <div className="max-w-3xl mx-auto px-4 md:px-8 text-center">
                    <span className="text-[10px] tracking-[0.3em] uppercase text-antique-gold font-nav font-semibold block mb-6">
                        Your Day, Your Way
                    </span>
                    <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-6">
                        Reserve Your Chauffeur
                    </h2>
                    <p className="text-white/70 text-lg font-nav mb-12 leading-relaxed">
                        Tell us your dates, preferred vehicle, and destinations — we'll have a dedicated chauffeur ready and waiting.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/inquire"
                            className="inline-block px-8 py-4 bg-antique-gold text-deep-emerald font-nav font-semibold uppercase tracking-[0.15em] text-sm rounded-lg hover:bg-antique-gold/90 transition-all duration-300"
                        >
                            Request a Quote
                        </Link>
                        <Link
                            href="/transfers"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-antique-gold/30 text-antique-gold font-nav font-semibold uppercase tracking-[0.15em] text-sm rounded-lg hover:border-antique-gold hover:bg-antique-gold/5 transition-all duration-300"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            All Transfer Types
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
