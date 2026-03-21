import HeroSection from '@/components/public/HeroSection';
import TrustedByStrip from '@/components/public/TrustedByStrip';
import TourCategoriesCarousel from '@/components/public/TourCategoriesCarousel';
import AuthoritySection from '@/components/public/AuthoritySection';
import WhyYataraTextSection from '@/components/public/WhyYataraTextSection';
import FeaturedJourneys from '@/components/public/FeaturedJourneys';
import HowItWorks from '@/components/public/HowItWorks';
import ProofStack from '@/components/public/ProofStack';
import BuildTourTeaser from '@/components/public/BuildTourTeaser';
import TransfersTeaser from '@/components/public/TransfersTeaser';
import PremiumStory from '@/components/public/PremiumStory';
import JourneyDayStory from '@/components/public/JourneyDayStory';
import RealExperiencesSection from '@/components/public/RealExperiencesSection';
import FinalCTA from '@/components/public/FinalCTA';

export default async function HomePage() {
    return (
        <main className="min-h-screen bg-off-white flex flex-col">
            {/* 1. Hook — Hero with trip-builder */}
            <HeroSection />

            {/* 2. Trust — Partner & press logos */}
            <TrustedByStrip />

            {/* 3. Browse fast — Signature Experiences carousel */}
            <TourCategoriesCarousel />

            {/* 4. Authority — editorial who-we-are */}
            <AuthoritySection />

            {/* 5. Why Yatara — text benefits + stats */}
            <WhyYataraTextSection />

            {/* 6. Featured journeys — catalog-grade cards + filter */}
            <FeaturedJourneys />

            {/* 7. Clarity — How It Works */}
            <HowItWorks />

            {/* 8. Proof — Evidence stack */}
            <ProofStack />

            {/* 8.5. Transfers — Premium transport teaser */}
            <TransfersTeaser />

            {/* 9. Drive to differentiator — Bespoke Tour Builder */}
            <BuildTourTeaser />

            {/* 10. Premium justification — The Yatara Standard */}
            <PremiumStory />

            {/* 11. Storytelling — A Day on Your Journey */}
            <JourneyDayStory />

            {/* 12. Emotion — Testimonials */}
            <RealExperiencesSection />

            {/* 13. Convert — Final CTA */}
            <FinalCTA />

            {/* 14. Footer is handled in layout.tsx */}
        </main>
    );
}
