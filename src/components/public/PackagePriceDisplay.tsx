'use client';

import { useCurrency, formatPrice } from '@/lib/CurrencyContext';

interface PackagePriceDisplayProps {
    priceMin: number;
    priceMax?: number;
    size?: 'sm' | 'lg';
    variant?: 'default' | 'white';
}

export default function PackagePriceDisplay({ priceMin, priceMax, size = 'sm', variant = 'default' }: PackagePriceDisplayProps) {
    const { currency, convertRate } = useCurrency();

    const isWhite = variant === 'white';

    if (size === 'lg') {
        return (
            <div>
                <p className={`text-[11px] tracking-[0.2em] uppercase font-medium mb-1 ${isWhite ? 'text-white/70' : 'text-gray-400'}`}>Starting from</p>
                <h3 className={`text-3xl font-display ${isWhite ? 'text-white' : 'text-deep-emerald'}`}>
                    {formatPrice(priceMin, currency, convertRate)}
                </h3>
                {priceMax && priceMax > 0 && priceMax !== priceMin && (
                    <p className={`text-xs font-light mt-1 ${isWhite ? 'text-white/60' : 'text-gray-400'}`}>
                        up to {formatPrice(priceMax, currency, convertRate)} per person
                    </p>
                )}
            </div>
        );
    }

    return (
        <div>
            <p className={`text-[10px] font-medium tracking-widest uppercase mb-0.5 ${isWhite ? 'text-white/70' : 'text-gray-400'}`}>From</p>
            <p className={`text-lg font-display ${isWhite ? 'text-white' : 'text-deep-emerald'}`}>
                {formatPrice(priceMin, currency, convertRate)}
            </p>
        </div>
    );
}
