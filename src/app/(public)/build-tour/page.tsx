import { Metadata } from 'next';
import BuildTourHero from './_components/BuildTourHero';
import QuickStartModes from './_components/QuickStartModes';
import BuildTourClient from './_components/BuildTourClient';
import HowItWorks from './_components/HowItWorks';
import PopularTours from './_components/PopularTours';
import ThemeCarousel from './_components/ThemeCarousel';
import Testimonials from './_components/Testimonials';
import FooterOverlayCTA from './_components/FooterOverlayCTA';

export const metadata: Metadata = {
    title: 'Bespoke Tour Planner | Yatara Ceylon',
    description: 'Build a smarter Sri Lanka journey. Explore the island visually on our interactive map, choose regions with confidence, and shape an elegant route with concierge-ready planning.',
};

export default async function BuildTourPage({
    searchParams,
}: {
    searchParams: Promise<{ planId?: string }>;
}) {
    const { planId } = await searchParams;

    return (
        <main className="bg-off-white min-h-screen">
            {/* 1. Hero — compact, product-led framing */}
            <BuildTourHero />

            {/* 2. Quick-start modes — reduce friction before planner */}
            <QuickStartModes />

            {/* 3. Main planner — the star of the page */}
            <div id="planner" className="w-full">
                <BuildTourClient initialPlanId={planId} />
            </div>

            {/* 4. How it works — 3-step strip */}
            <HowItWorks />

            {/* 5. Popular starter itineraries */}
            <div id="starter-plans">
                <PopularTours />
            </div>

            {/* 6. Theme shortcuts — functional planner shortcuts */}
            <div id="themes">
                <ThemeCarousel />
            </div>

            {/* 7. Testimonials */}
            <Testimonials />

            {/* 9. Concierge CTA */}
            <FooterOverlayCTA />
        </main>
    );
}
