'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

const InteractiveSriLankaMap = dynamic(
    () => import('@/components/public/InteractiveSriLankaMap'),
    {
        ssr: false,
        loading: () => (
            <div className="h-[600px] w-full flex items-center justify-center bg-off-white border border-antique-gold/20">
                <Loader2 className="w-8 h-8 text-deep-emerald animate-spin" />
            </div>
        ),
    }
);

export default function BespokeMapSection() {
    return <InteractiveSriLankaMap />;
}
