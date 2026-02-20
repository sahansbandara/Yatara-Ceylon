'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Currency = 'LKR' | 'USD';

interface CurrencyContextType {
    currency: Currency;
    setCurrency: (currency: Currency) => void;
    convertRate: number; // 1 USD = 310 LKR
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
    const [currency, setCurrency] = useState<Currency>('LKR');
    const convertRate = 310;

    // Optional: persist currency selection in localStorage
    useEffect(() => {
        const savedCurrency = localStorage.getItem('yatara_currency') as Currency;
        if (savedCurrency && (savedCurrency === 'LKR' || savedCurrency === 'USD')) {
            setCurrency(savedCurrency);
        }
    }, []);

    const handleSetCurrency = (newCurrency: Currency) => {
        setCurrency(newCurrency);
        localStorage.setItem('yatara_currency', newCurrency);
    };

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency: handleSetCurrency, convertRate }}>
            {children}
        </CurrencyContext.Provider>
    );
}

export function useCurrency() {
    const context = useContext(CurrencyContext);
    if (context === undefined) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
}

// Utility function to format price based on currency
export function formatPrice(basePriceLKR: number, currency: Currency, rate: number): string {
    if (currency === 'LKR') {
        return `LKR ${basePriceLKR.toLocaleString()}`;
    } else {
        const priceUSD = Math.round(basePriceLKR / rate);
        return `USD ${priceUSD.toLocaleString()}`;
    }
}
