import HeroSection from '@/components/public/HeroSection';
import TrustedByStrip from '@/components/public/TrustedByStrip';
import TourCategoriesCarousel from '@/components/public/TourCategoriesCarousel';
import AuthoritySection from '@/components/public/AuthoritySection';
import WhyYataraTextSection from '@/components/public/WhyYataraTextSection';
import FeaturedJourneys from '@/components/public/FeaturedJourneys';
import HowItWorks from '@/components/public/HowItWorks';
import BuildTourTeaser from '@/components/public/BuildTourTeaser';
import TransfersTeaser from '@/components/public/TransfersTeaser';
import PremiumStory from '@/components/public/PremiumStory';
import RealExperiencesSection from '@/components/public/RealExperiencesSection';
import FinalCTA from '@/components/public/FinalCTA';

export default async function HomePage() {
    return (
        <main className="min-h-screen bg-off-white flex flex-col">
            {/* 1. Hero */}
            <HeroSection />

            {/* 2. Trust / Accreditations */}
            <TrustedByStrip />

            {/* 3. Signature Experiences */}
            <TourCategoriesCarousel />

            {/* 4. Featured Journeys */}
            <FeaturedJourneys />

            {/* 4.5 Authority — editorial who-we-are */}
            <AuthoritySection />

            {/* 5. Why Yatara Ceylon */}
            <WhyYataraTextSection />

            {/* 6. How It Works */}
            <HowItWorks />

            {/* 7. Bespoke Journey Builder */}
            <BuildTourTeaser />

            {/* 8. Transfers */}
            <TransfersTeaser />

            {/* 9. FAQ (PremiumStory component) */}
            <PremiumStory />

            {/* 10. Final CTA */}
            <FinalCTA />

            {/* 11. Testimonials */}
            <RealExperiencesSection />

            {/* 12. Footer is handled in layout.tsx */}
        </main>
    );
}
