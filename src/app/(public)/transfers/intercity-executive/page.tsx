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
    title: 'Intercity Executive Transfers | Yatara Ceylon',
    description:
        'Premium private transfers between Sri Lanka\'s iconic destinations. Colombo to Kandy, Galle to Ella, and beyond. Fixed pricing, scenic routes, experienced chauffeurs. From LKR 14,500.',
};

export default function IntercityExecutivePage() {
    const category = transferCategoryCards.find((c) => c.slug === 'intercity')!;
    const intercityTransfers = transferProducts.filter(
        (t) => t.transferType === 'INTERCITY' || t.transferType === 'SCENIC'
    );

    const breadcrumb = buildBreadcrumb([
        { name: 'Home', url: '/' },
        { name: 'Transfers', url: '/transfers' },
        { name: 'Intercity Executive', url: '/transfers/intercity-executive' },
    ]);

    return (
        <main className="bg-off-white">
            {/* SEO */}
            <JsonLd data={breadcrumb} />
            <JsonLd data={buildFAQPage(transferFaq.slice(0, 4))} />

            {/* ─── Hero ─── */}
            <TransferHero
                badge="Intercity Executive"
                title="Between Destinations,"
                titleAccent="Beyond Expectations"
                description="Every intercity transfer is a curated passage through Sri Lanka's heartland — experienced chauffeurs, premium vehicles, and the freedom to stop wherever the view demands."
                primaryCTA={{ label: 'Get Instant Quote', href: '/inquire' }}
                secondaryCTA={{ label: 'Browse Routes', href: '#routes' }}
                heroImage="/images/transfers/intercity-executive-hero.webp"
            />

            {/* ─── Trust Bar ─── */}
            <TransferTrustBar />

            {/* ─── The Intercity Difference ─── */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="text-center mb-14">
                        <span className="text-[10px] tracking-[0.3em] uppercase text-antique-gold font-nav font-semibold block mb-3">
                            The Journey
                        </span>
                        <h2 className="font-serif text-3xl md:text-4xl font-bold text-deep-emerald mb-4">
                            Every Route, a Story
                        </h2>
                        <p className="text-deep-emerald/60 text-lg font-nav max-w-2xl mx-auto leading-relaxed">
                            {category.description}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            {
                                title: 'Door-to-Door Service',
                                description:
                                    'Pickup from your exact hotel, villa, or address — drop-off at your next destination\'s doorstep. No terminal transfers or waiting areas.',
                            },
                            {
                                title: 'Scenic Route Knowledge',
                                description:
                                    'Our chauffeurs know every viewing point, tea estate, and roadside gem. Request the scenic route at no extra charge.',
                            },
                            {
                                title: 'Complimentary Stops',
                                description:
                                    'One brief stop is included on most routes — for a photo, a temple visit, or simply to stretch your legs at a vista point.',
                            },
                            {
                                title: 'Fixed Pricing, Always',
                                description:
                                    'No surge pricing, no meter surprises. The price quoted at booking is the price you pay — regardless of traffic or weather.',
                            },
                            {
                                title: 'Refreshments On Board',
                                description:
                                    'Chilled water and refreshments in every vehicle. Prestige and Grand tiers include a cooler with additional beverages.',
                            },
                            {
                                title: 'Flexible Scheduling',
                                description:
                                    'Early morning departures, late evening pickups — we operate on your schedule, not ours. 24/7 availability across all routes.',
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
                    transfers={intercityTransfers}
                    sectionEyebrow="Intercity & Scenic Routes"
                    sectionTitle="Premium Intercity Transfers"
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
                            Travel in Your Preferred Style
                        </h2>
                        <p className="text-deep-emerald/60 font-nav max-w-xl mx-auto">
                            Select the vehicle tier that suits your party size and comfort preference for the journey ahead
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
                        Your Next Destination Awaits
                    </span>
                    <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-6">
                        Plan Your Intercity Transfer
                    </h2>
                    <p className="text-white/70 text-lg font-nav mb-12 leading-relaxed">
                        Tell us where you're heading and we'll arrange the perfect vehicle, route, and chauffeur for a seamless journey.
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
