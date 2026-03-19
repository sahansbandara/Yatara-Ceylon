import { Metadata } from 'next';
import BuildTourHero from './_components/BuildTourHero';
import QuickStartModes from './_components/QuickStartModes';
import BuildTourShell from './_components/BuildTourShell.client';
import HowItWorks from './_components/HowItWorks';
import PopularTours from './_components/PopularTours';
import ThemeCarousel from './_components/ThemeCarousel';
import BuildTourParallax from './_components/BuildTourParallax';
import Testimonials from './_components/Testimonials';
import FooterOverlayCTA from './_components/FooterOverlayCTA';

export const metadata: Metadata = {
    title: 'Bespoke Tour Planner | Yatara Ceylon',
    description: 'Build a smarter Sri Lanka journey. Explore the island visually on our interactive map, choose regions with confidence, and shape an elegant route with concierge-ready planning.',
};

export default function BuildTourPage() {
    return (
        <main className="bg-[#0a0f0d] min-h-screen">
            {/* 1. Hero — compact, product-led framing */}
            <BuildTourHero />

            {/* 2. Quick-start modes — reduce friction before planner */}
            <QuickStartModes
                onScrollToBuilder={() => {}}
                onScrollToThemes={() => {}}
                onScrollToStarters={() => {}}
            />

            {/* 3. Main planner — the star of the page */}
            <BuildTourShell />

            {/* 4. How it works — 3-step strip */}
            <HowItWorks />

            {/* 5. Popular starter itineraries */}
            <div id="starter-plans">
                <PopularTours />
            </div>

            {/* 6. Theme shortcuts — functional planner shortcuts */}
            <ThemeCarousel />

            {/* 7. Story banner — emotional reinforcement (lower, not interrupting) */}
            <BuildTourParallax />

            {/* 8. Testimonials — dark theme, connected to planner value */}
            <Testimonials />

            {/* 9. Concierge CTA */}
            <FooterOverlayCTA />
        </main>
    );
}
