import HeroSection from '@/components/public/HeroSection';
import TrustedByStrip from '@/components/public/TrustedByStrip';
import SignatureExperiences from '@/components/public/SignatureExperiences';
import FeaturedJourneys from '@/components/public/FeaturedJourneys';
import HeritageStory from '@/components/public/HeritageStory';
import HowItWorks from '@/components/public/HowItWorks';
import BuildTourTeaser from '@/components/public/BuildTourTeaser';
import TransfersTeaser from '@/components/public/TransfersTeaser';
import RealExperiencesSection from '@/components/public/RealExperiencesSection';
import FAQSection from '@/components/public/FAQSection';
import FinalCTA from '@/components/public/FinalCTA';

export default function HomePage() {
    return (
        <main className="flex min-h-screen flex-col bg-off-white">
            <HeroSection />
            <TrustedByStrip />
            <SignatureExperiences />
            <FeaturedJourneys />
            <HeritageStory />
            <HowItWorks />
            <BuildTourTeaser />
            <TransfersTeaser />
            <RealExperiencesSection />
            <FAQSection />
            <FinalCTA />
        </main>
    );
}
