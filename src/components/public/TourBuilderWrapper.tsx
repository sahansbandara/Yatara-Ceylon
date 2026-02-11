'use client';

import dynamic from 'next/dynamic';

const TourBuilder = dynamic(() => import('@/components/public/TourBuilder'), { ssr: false });

interface TourBuilderWrapperProps {
    districts: any[];
    places: any[];
}

export default function TourBuilderWrapper({ districts, places }: TourBuilderWrapperProps) {
    return <TourBuilder districts={districts} places={places} />;
}
