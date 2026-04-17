'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

const BespokeTourPlanner = dynamic(
    () => import('@/components/public/BespokeTourPlanner'),
    {
        ssr: false,
        loading: () => (
            <div className="h-[700px] w-full flex items-center justify-center bg-off-white border border-antique-gold/20">
                <Loader2 className="w-8 h-8 text-deep-emerald animate-spin" />
            </div>
        ),
    }
);

export default function BespokeMapSection() {
    return <BespokeTourPlanner />;
}
