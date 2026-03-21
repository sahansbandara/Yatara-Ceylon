'use client';

import { useCurrency, formatPrice } from '@/lib/CurrencyContext';

interface PackagePriceDisplayProps {
    priceMin: number;
    priceMax?: number;
    size?: 'sm' | 'lg';
}

export default function PackagePriceDisplay({ priceMin, priceMax, size = 'sm' }: PackagePriceDisplayProps) {
    const { currency, convertRate } = useCurrency();

    if (size === 'lg') {
        return (
            <div>
                <p className="text-[11px] tracking-[0.2em] uppercase text-gray-400 font-medium mb-1">Starting from</p>
                <h3 className="text-3xl font-display text-deep-emerald">
                    {formatPrice(priceMin, currency, convertRate)}
                </h3>
                {priceMax && priceMax > 0 && priceMax !== priceMin && (
                    <p className="text-xs text-gray-400 font-light mt-1">
                        up to {formatPrice(priceMax, currency, convertRate)} per person
                    </p>
                )}
            </div>
        );
    }

    return (
        <div>
            <p className="text-[10px] text-gray-400 font-medium tracking-widest uppercase mb-0.5">From</p>
            <p className="text-lg font-display text-deep-emerald">
                {formatPrice(priceMin, currency, convertRate)}
            </p>
        </div>
    );
}
