'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, Palmtree } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useCurrency } from '@/lib/CurrencyContext';

const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/packages', label: 'Curated Journeys' },
    { href: '/destinations', label: 'The Destinations' },
    { href: '/vehicles', label: 'Private Transfers' },
    { href: '/contact', label: 'Bespoke Planning' },
];

export function Navbar() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const { currency, setCurrency } = useCurrency();

    return (
        <header className="sticky top-0 z-50 w-full border-b border-off-white/10 bg-emerald-950/20 backdrop-blur-md supports-[backdrop-filter]:bg-emerald-950/20">
            <div className="section-container flex h-20 items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                    <Image
                        src="/images/yatara-brand-block.svg"
                        alt="Yatara Ceylon Logo"
                        width={240}
                        height={48}
                        className="object-contain h-12 w-auto group-hover:scale-[1.02] transition-transform duration-500"
                    />
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden lg:flex items-center gap-2">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                'px-4 py-2 text-[11px] font-semibold tracking-[0.2em] uppercase transition-all duration-300 border-b-2',
                                pathname === link.href
                                    ? 'text-antique-gold border-antique-gold'
                                    : 'text-off-white/70 border-transparent hover:text-antique-gold hover:border-antique-gold/50'
                            )}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Desktop CTA & Currency */}
                <div className="hidden lg:flex items-center gap-4">
                    <button
                        onClick={() => setCurrency(currency === 'LKR' ? 'USD' : 'LKR')}
                        className="text-[10px] font-semibold tracking-widest uppercase text-off-white hover:text-antique-gold transition-colors duration-300"
                    >
                        {currency}
                    </button>
                    <Link href="/build-tour">
                        <Button className="h-11 px-8 bg-deep-emerald text-antique-gold hover:bg-deep-emerald/90 uppercase tracking-[0.2em] text-[10px] rounded-none border border-deep-emerald transition-all duration-500">
                            Plan Your Journey
                        </Button>
                    </Link>
                </div>

                {/* Mobile Menu */}
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild className="lg:hidden">
                        <Button variant="ghost" size="icon" className="hover:bg-off-white/10 text-off-white">
                            <Menu className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-80 bg-off-white border-l border-gray-100">
                        <div className="flex flex-col gap-6 mt-12">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setOpen(false)}
                                    className={cn(
                                        'px-4 py-3 text-sm font-serif tracking-[0.2em] uppercase transition-all duration-300 border-l-2',
                                        pathname === link.href
                                            ? 'text-deep-emerald border-antique-gold bg-antique-gold/5'
                                            : 'text-gray-600 border-transparent hover:text-deep-emerald hover:bg-gray-50 hover:border-antique-gold/30'
                                    )}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div className="border-t border-gray-200 pt-8 mt-4 px-4 flex flex-col gap-4">
                                <div className="flex justify-center mb-2">
                                    <button
                                        onClick={() => setCurrency(currency === 'LKR' ? 'USD' : 'LKR')}
                                        className="text-xs font-serif tracking-widest uppercase text-deep-emerald border border-deep-emerald/20 px-4 py-1"
                                    >
                                        Currency: {currency}
                                    </button>
                                </div>
                                <Link href="/build-tour" onClick={() => setOpen(false)}>
                                    <Button className="w-full h-12 bg-deep-emerald text-antique-gold hover:bg-deep-emerald/90 uppercase tracking-[0.2em] text-[11px] rounded-none border border-deep-emerald transition-all duration-500">
                                        Plan Your Journey
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    );
}
