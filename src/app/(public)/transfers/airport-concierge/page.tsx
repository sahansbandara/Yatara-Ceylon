import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ArrowLeft } from 'lucide-react';

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
} from '@/data/transfers';

export const metadata: Metadata = {
    title: 'Airport Concierge Transfers | Yatara Ceylon',
    description:
        'Premium airport transfers from Bandaranaike International Airport (CMB) across Sri Lanka. Meet & greet, flight tracking, fixed fares, and luxury vehicles. From LKR 8,500.',
};

export default function AirportConciergePage() {
    const category = transferCategoryCards.find((c) => c.slug === 'airport')!;
    const airportTransfers = transferProducts.filter((t) => t.transferType === 'AIRPORT');

    const breadcrumb = buildBreadcrumb([
        { name: 'Home', url: '/' },
        { name: 'Transfers', url: '/transfers' },
        { name: 'Airport Concierge', url: '/transfers/airport-concierge' },
    ]);

    return (
        <main className="bg-off-white">
            {/* SEO */}
            <JsonLd data={breadcrumb} />
            <JsonLd data={buildFAQPage(transferFaq.slice(0, 4))} />

            {/* ─── Hero ─── */}
            <TransferHero
                badge="Airport Concierge"
                title="Your Sri Lanka Journey"
                titleAccent="Begins at the Gate"
                description="From the moment you clear customs, a named greeter awaits. Flight tracked, luggage handled, vehicle prepared — your premium transfer starts before you step outside."
                primaryCTA={{ label: 'Get Instant Quote', href: '/inquire' }}
                secondaryCTA={{ label: 'Browse Routes', href: '#routes' }}
                heroImage="/images/transfers/airport-concierge-hero.webp"
            />

            {/* ─── Trust Bar ─── */}
            <TransferTrustBar />

            {/* ─── What Makes Us Different ─── */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="text-center mb-14">
                        <span className="text-[10px] tracking-[0.3em] uppercase text-antique-gold font-nav font-semibold block mb-3">
                            The Experience
                        </span>
                        <h2 className="font-serif text-3xl md:text-4xl font-bold text-deep-emerald mb-4">
                            More Than a Pickup — An Arrival
                        </h2>
                        <p className="text-deep-emerald/60 text-lg font-nav max-w-2xl mx-auto leading-relaxed">
                            {category.description}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            {
                                title: 'Named Meet & Greet',
                                description:
                                    'A personal greeter waits at the international arrivals exit with a welcome sign displaying your name.',
                            },
                            {
                                title: 'Real-Time Flight Tracking',
                                description:
                                    'We monitor your inbound flight — delays and early arrivals are automatically adjusted. No wasted waiting.',
                            },
                            {
                                title: 'Complimentary Wait Buffer',
                                description:
                                    'Up to 60 minutes of free waiting time from your actual landing, so you never feel rushed through customs.',
                            },
                            {
                                title: 'Premium Vehicles Only',
                                description:
                                    'Executive sedans, prestige SUVs, and grand people-carriers — all serviced, insured, and fully equipped.',
                            },
                            {
                                title: 'Luggage Handling',
                                description:
                                    'From trolley to boot, we handle every bag. Porter assistance included for larger parties.',
                            },
                            {
                                title: '24/7 WhatsApp Concierge',
                                description:
                                    'Direct access to your trip concierge from the moment you book until you arrive at your hotel.',
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

            {/* ─── Routes ─── */}
            <div id="routes">
                <TransferCategoryShowcase
                    transfers={airportTransfers}
                    sectionEyebrow="Airport Routes"
                    sectionTitle="Signature Airport Transfers"
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
                            Choose Your Vehicle
                        </h2>
                        <p className="text-deep-emerald/60 font-nav max-w-xl mx-auto">
                            Every airport transfer is served by our curated fleet — choose the tier that matches your party size and preference
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
                        Ready to Land in Style?
                    </span>
                    <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-6">
                        Book Your Airport Transfer
                    </h2>
                    <p className="text-white/70 text-lg font-nav mb-12 leading-relaxed">
                        Share your flight details and our concierge will confirm your chauffeur, vehicle, and meet & greet arrangements within hours.
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
