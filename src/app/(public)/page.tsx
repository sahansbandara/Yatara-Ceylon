import HeroSection from '@/components/public/HeroSection';
import TourCategoriesCarousel from '@/components/public/TourCategoriesCarousel';
import AuthoritySection from '@/components/public/AuthoritySection';
import FeaturedJourneys from '@/components/public/FeaturedJourneys';
import HowItWorks from '@/components/public/HowItWorks';
import BuildTourTeaser from '@/components/public/BuildTourTeaser';
import PremiumStory from '@/components/public/PremiumStory';
import ExperiencesCarousel from '@/components/public/ExperiencesCarousel';
import FinalCTA from '@/components/public/FinalCTA';

export default async function HomePage() {
    return (
        <main className="min-h-screen bg-off-white flex flex-col">
            {/* 1. Hook */}
            <HeroSection />

            {/* 2. Browse fast */}
            <TourCategoriesCarousel />

            {/* 3. Authority — editorial who-we-are */}
            <AuthoritySection />

            {/* 4. Featured journeys */}
            <FeaturedJourneys />

            {/* 5. Clarity - How It Works */}
            <HowItWorks />

            {/* 6. Drive to differentiator */}
            <BuildTourTeaser />

            {/* 7. Premium justification */}
            <PremiumStory />

            {/* 8. Emotion - Testimonials */}
            <ExperiencesCarousel />

            {/* 9. Convert */}
            <FinalCTA />

            {/* 10. Footer is handled in layout.tsx */}
        </main>
    );
}
