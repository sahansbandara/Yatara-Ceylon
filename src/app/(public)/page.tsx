import { Suspense } from 'react';
import HeroSection from '@/components/public/HeroSection';
import CuratedCollection from '@/components/public/CuratedCollection';
import HeritageStory from '@/components/public/HeritageStory';
import YataraStandard from '@/components/public/YataraStandard';

export default async function HomePage() {
    return (
        <div className="min-h-screen bg-off-white">
            {/* The Cinematic Hero Section */}
            <HeroSection />

            {/* The Curated Collection Grid */}
            <CuratedCollection />

            {/* The Founders / Heritage Story */}
            <HeritageStory />

            {/* Yatara Trust Badges */}
            <YataraStandard />
        </div>
    );
}
