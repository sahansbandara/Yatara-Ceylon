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
    title: 'Safari & National Park Transfers | Yatara Ceylon',
    description:
        'Premium private transfers to Sri Lanka\'s premier national parks. Travel from Colombo, Kandy, or the South Coast to Yala, Udawalawe, and Wilpattu in luxury.',
};

export default function SafariTransfersPage() {
    const category = transferCategoryCards.find((c) => c.slug === 'safari')!;
    const safariTransfers = transferProducts.filter(
        (t) => t.transferType === 'SAFARI'
    );

    const breadcrumb = buildBreadcrumb([
        { name: 'Home', url: '/' },
        { name: 'Transfers', url: '/transfers' },
        { name: category.title, url: '/transfers/safari-national-park' },
    ]);

    const faqSchema = buildFAQPage(
        transferFaq.map((faq) => ({
            question: faq.question,
            answer: faq.answer,
        }))
    );

    return (
        <main className="min-h-screen bg-sand-50 dark:bg-slate-900 pb-20">
            <JsonLd data={breadcrumb} />
            <JsonLd data={faqSchema} />

            {/* Sub-page Navigation */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-sand-200 dark:border-slate-800 sticky top-16 sm:top-20 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
                    <Link
                        href="/transfers"
                        className="flex items-center text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-gold-600 dark:hover:text-gold-400 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to All Transfers
                    </Link>
                    <div className="text-sm text-slate-500 dark:text-slate-500 hidden sm:block">
                        {category.title}
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <TransferHero
                title={category.title}
                description={category.description}
                heroImage={category.image}
            />

            {/* Trust Bar */}
            <TransferTrustBar />

            {/* Package Showcase */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
                <div className="max-w-3xl mb-12">
                    <h2 className="text-3xl font-serif text-slate-900 dark:text-white mb-4">
                        Premium Wildlife Journeys
                    </h2>
                    <p className="text-slate-600 dark:text-slate-300 text-lg">
                        Reach Sri Lanka's most remote and beautiful wildlife sanctuaries without sacrificing comfort. Our safari transfers are timed perfectly for afternoon game drives or early morning park gate openings.
                    </p>
                </div>

                <TransferCategoryShowcase 
                    transfers={safariTransfers} 
                    sectionTitle="Premium Wildlife Journeys" 
                    sectionEyebrow="Curated For You" 
                />
            </div>

            {/* Recommended Fleet */}
            <div className="bg-white dark:bg-slate-900 py-16 lg:py-24 border-t border-sand-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mb-12">
                        <h2 className="text-3xl font-serif text-slate-900 dark:text-white mb-4">
                            Vehicles for Safari Transfers
                        </h2>
                        <p className="text-slate-600 dark:text-slate-300 text-lg">
                            For national park routes involving winding hill descents and long rural stretches, we recommend our Prestige and Grand models.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {vehicleTiers
                            .filter((tier) => tier.slug === 'prestige' || tier.slug === 'grand' || tier.slug === 'executive')
                            .map((tier) => (
                                <FleetTierCard key={tier.slug} {...tier} />
                            ))}
                    </div>

                    <div className="mt-12 text-center">
                        <Link
                            href="/vehicles"
                            className="inline-flex items-center bg-transparent border border-gold-600 text-gold-700 dark:text-gold-400 hover:bg-gold-50 dark:hover:bg-gold-900/30 px-8 py-4 rounded-md font-medium transition-colors"
                        >
                            Explore All Vehicles
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
