'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Image from 'next/image';
import { useCurrency } from '@/lib/CurrencyContext';

const navLinks = [
    { href: '/packages', label: 'SIGNATURE JOURNEYS' },
    { href: '/destinations', label: 'THE DESTINATIONS' },
    { href: '/vehicles', label: 'PRIVATE TRANSFERS' },
    { href: '/build-tour', label: 'BESPOKE PLANNING' },
    { href: '/guide', label: 'GUIDE' },
];

export function Navbar() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const { currency, setCurrency } = useCurrency();

    const isActive = (href: string) => {
        if (href === '/') return pathname === '/';
        return pathname.startsWith(href);
    };

    return (
        <header className="sticky top-0 z-50 w-full navbar-liquid-glass">
            <div className="section-container flex h-20 items-center justify-between px-4 lg:px-8">
                {/* Logo */}
                <Link href="/" className="flex items-center shrink-0">
                    <Image
                        src="/images/yatara-brand-block.svg"
                        alt="Yatara Ceylon Logo"
                        width={200}
                        height={46}
                        className="object-contain h-[46px] w-auto hover:opacity-90 transition-opacity drop-shadow-sm"
                    />
                </Link>

                {/* Desktop Nav Center */}
                <nav className="hidden xl:flex flex-1 justify-center items-center gap-5 2xl:gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`text-[12px] 2xl:text-[13px] font-sans tracking-[0.15em] transition-colors whitespace-nowrap relative py-1
                                ${isActive(link.href)
                                    ? 'text-[#D4AF37] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#D4AF37]'
                                    : 'text-[#043927]/90 hover:text-[#D4AF37]'
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Desktop Right Actions */}
                <div className="hidden xl:flex items-center gap-4 shrink-0">
                    {/* Distinctive Currency Toggle */}
                    <button
                        onClick={() => setCurrency(currency === 'LKR' ? 'USD' : 'LKR')}
                        className="currency-toggle-btn"
                    >
                        <span className="currency-toggle-indicator" />
                        <span className="text-[11px] font-semibold tracking-[0.2em]">
                            {currency}
                        </span>
                    </button>

                    {/* Request A Proposal - Primary CTA */}
                    <Link href="/inquire">
                        <Button className="h-10 px-7 bg-deep-emerald text-white hover:bg-deep-emerald/85 tracking-[0.15em] text-[12px] rounded-full border border-deep-emerald transition-all duration-300 font-semibold shadow-md hover:shadow-lg whitespace-nowrap">
                            REQUEST A PROPOSAL
                        </Button>
                    </Link>
                </div>

                {/* Mobile Menu */}
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild className="xl:hidden">
                        <Button variant="ghost" size="icon" className="hover:bg-[#043927]/10 text-[#043927]">
                            <Menu className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-80 bg-[#043927] border-l border-[#D4AF37]/20">
                        <div className="flex flex-col gap-8 mt-16 px-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setOpen(false)}
                                    className={`text-[14px] font-sans tracking-[0.15em] transition-colors
                                        ${isActive(link.href)
                                            ? 'text-[#D4AF37] border-b border-[#D4AF37] pb-1 w-fit'
                                            : 'text-white hover:text-[#D4AF37]'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div className="border-t border-[#D4AF37]/20 pt-8 mt-4 flex flex-col gap-6">
                                <button
                                    onClick={() => { setCurrency(currency === 'LKR' ? 'USD' : 'LKR'); setOpen(false); }}
                                    className="currency-toggle-btn self-start"
                                >
                                    <span className="currency-toggle-indicator" />
                                    <span className="text-[11px] font-semibold tracking-[0.2em]">
                                        {currency}
                                    </span>
                                </button>
                                <Link href="/inquire" onClick={() => setOpen(false)}>
                                    <Button className="w-full h-12 bg-deep-emerald text-white hover:bg-deep-emerald/85 tracking-[0.15em] text-[13px] rounded-full font-semibold shadow-md border border-deep-emerald">
                                        REQUEST A PROPOSAL
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
