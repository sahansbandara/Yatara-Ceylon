import { Suspense } from 'react';
import HeroSplit from '@/components/public/HeroSplit';
import TourCategoriesCarousel from '@/components/public/TourCategoriesCarousel';
import TestimonialsOverlay from '@/components/public/TestimonialsOverlay';
import HowItWorks from '@/components/public/HowItWorks';
import SignatureExperiences from '@/components/public/SignatureExperiences';
import CuratedCollection from '@/components/public/CuratedCollection';
import HeritageStory from '@/components/public/HeritageStory';
import DestinationShowcase from '@/components/public/DestinationShowcase';
import YataraStandard from '@/components/public/YataraStandard';
import ParallaxDivider from '@/components/public/ParallaxDivider';

export default async function HomePage() {
    return (
        <div className="min-h-screen bg-off-white flex flex-col">
            {/* The Split Hero Section — Walkers-style 3-column */}
            <HeroSplit />

            {/* Tour Categories — Swiper carousel with tinted bg */}
            <TourCategoriesCarousel />

            {/* How It Works — 3-step concierge flow */}
            <HowItWorks />

            {/* Signature Experiences — Editorial layout */}
            <SignatureExperiences />

            {/* The Curated Collection Carousel */}
            <CuratedCollection />

            {/* Testimonials — Background overlay + watermark typography */}
            <TestimonialsOverlay />

            {/* Why Sri Lanka — Destination Showcase + Marquee */}
            <DestinationShowcase />

            {/* The Founders / Heritage Story */}
            <HeritageStory />

            {/* Parallax Scroll Divider */}
            <ParallaxDivider />

            {/* Yatara Trust Badges — 2-column layout */}
            <YataraStandard />
        </div>
    );
}
