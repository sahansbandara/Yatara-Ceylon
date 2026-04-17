"use client";

import { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';

export default function ConciergeButton() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleChat = () => {
        // @ts-ignore
        if (typeof window !== 'undefined' && window.Tawk_API) {
            // @ts-ignore
            window.Tawk_API.toggle();
        }
    };

    if (!mounted) return null;

    return (
        <button
            onClick={toggleChat}
            className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[100] group flex items-center justify-center h-14 w-14 rounded-full bg-antique-gold border-2 border-off-white shadow-2xl hover:w-40 transition-all duration-500 overflow-hidden"
            aria-label="Open Concierge Chat"
        >
            <div className="absolute inset-0 rounded-full border border-antique-gold/50 animate-ping opacity-20" />

            <div className="flex items-center justify-center w-full h-full p-3 absolute left-0 group-hover:left-2 transition-all duration-500">
                <MessageCircle className="h-6 w-6 text-deep-emerald shrink-0" strokeWidth={1.5} />
            </div>

            <span className="text-deep-emerald font-serif text-sm font-semibold tracking-widest uppercase opacity-0 group-hover:opacity-100 absolute left-12 whitespace-nowrap transition-opacity duration-500 delay-100">
                Concierge
            </span>
        </button>
    );
}
