import { Metadata } from 'next';
import BuildTourHero from './_components/BuildTourHero';
import BuildTourShell from './_components/BuildTourShell.client';
import ThemeCarousel from './_components/ThemeCarousel';
import Testimonials from './_components/Testimonials';
import FooterOverlayCTA from './_components/FooterOverlayCTA';

export const metadata: Metadata = {
    title: 'Bespoke Planning | Yatara Ceylon',
    description: 'Design your perfect Sri Lanka itinerary. Select destinations on our interactive map and curate a luxury journey tailored to you.',
};

export default function BuildTourPage() {
    return (
        <main className="bg-[#0a0f0d] min-h-screen">
            <BuildTourHero />
            <BuildTourShell />
            <ThemeCarousel />
            <Testimonials />
            <FooterOverlayCTA />
        </main>
    );
}
