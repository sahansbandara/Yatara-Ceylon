'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useCurrency } from '@/lib/CurrencyContext';

const navLinks = [
    { href: '/packages', label: 'SIGNATURE JOURNEYS' },
    { href: '/build-tour', label: 'BESPOKE BUILDER' },
    { href: '/destinations', label: 'DESTINATIONS' },
    { href: '/vehicles', label: 'PRIVATE FLEET' },
];

export function Navbar() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const { currency, setCurrency } = useCurrency();

    return (
        <header className="sticky top-0 z-50 w-full bg-emerald-950/20 backdrop-blur-lg border-b border-white/10">
            <div className="section-container flex h-20 items-center justify-between px-4 lg:px-8">
                {/* Logo */}
                <Link href="/" className="flex items-center shrink-0">
                    <Image
                        src="/images/yatara-brand-block.svg"
                        alt="Yatara Ceylon Logo"
                        width={225}
                        height={50}
                        className="object-contain h-[50px] w-auto hover:opacity-90 transition-opacity"
                    />
                </Link>

                {/* Desktop Nav Center */}
                <nav className="hidden lg:flex flex-1 justify-center items-center gap-6 xl:gap-10">
                    <Link href="/packages" className="text-[13px] xl:text-[14px] font-sans tracking-widest text-white hover:text-[#D4AF37] transition-colors whitespace-nowrap">
                        SIGNATURE JOURNEYS
                    </Link>
                    <Link href="/build-tour" className="text-[13px] xl:text-[14px] font-sans tracking-widest text-white hover:text-[#D4AF37] transition-colors border-b border-[#D4AF37] pb-1 whitespace-nowrap">
                        BESPOKE BUILDER
                    </Link>
                    <Link href="/destinations" className="text-[13px] xl:text-[14px] font-sans tracking-widest text-white hover:text-[#D4AF37] transition-colors whitespace-nowrap">
                        DESTINATIONS
                    </Link>
                </nav>

                {/* Desktop Right Actions */}
                <div className="hidden lg:flex items-center gap-6 shrink-0">
                    <button
                        onClick={() => setCurrency(currency === 'LKR' ? 'USD' : 'LKR')}
                        className="text-[13px] xl:text-[14px] font-sans tracking-widest text-white hover:text-[#D4AF37] transition-colors whitespace-nowrap"
                    >
                        {currency}
                    </button>
                    <Link href="/dashboard/my-journeys" className="text-[13px] xl:text-[14px] font-sans tracking-widest text-white hover:text-[#D4AF37] transition-colors whitespace-nowrap">
                        MY JOURNEYS
                    </Link>
                    <Link href="/auth/login">
                        <Button className="h-10 px-6 bg-transparent text-white hover:bg-[#D4AF37] hover:text-emerald-950 tracking-widest text-[13px] xl:text-[14px] rounded-none border border-[#D4AF37] transition-all duration-300 font-sans whitespace-nowrap">
                            CONCIERGE ACCESS
                        </Button>
                    </Link>
                </div>

                {/* Mobile Menu */}
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild className="lg:hidden">
                        <Button variant="ghost" size="icon" className="hover:bg-emerald-950/40 text-[#D4AF37]">
                            <Menu className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-80 bg-emerald-950 border-l border-[#D4AF37]/20">
                        <div className="flex flex-col gap-8 mt-16 px-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setOpen(false)}
                                    className="text-[14px] font-sans tracking-widest text-white hover:text-[#D4AF37] transition-colors"
                                    style={link.href === '/build-tour' ? { borderBottom: '1px solid #D4AF37', paddingBottom: '4px', width: 'fit-content' } : {}}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div className="border-t border-[#D4AF37]/20 pt-8 mt-4 flex flex-col gap-6">
                                <button
                                    onClick={() => { setCurrency(currency === 'LKR' ? 'USD' : 'LKR'); setOpen(false); }}
                                    className="text-left text-[14px] font-sans tracking-widest text-[#D4AF37] transition-colors"
                                >
                                    CURRENCY: {currency}
                                </button>
                                <Link href="/dashboard/my-journeys" onClick={() => setOpen(false)} className="text-[14px] font-sans tracking-widest text-white hover:text-[#D4AF37] transition-colors">
                                    MY JOURNEYS
                                </Link>
                                <Link href="/auth/login" onClick={() => setOpen(false)}>
                                    <Button className="w-full h-12 bg-transparent text-white hover:bg-[#D4AF37] hover:text-emerald-950 tracking-widest text-[14px] rounded-none border border-[#D4AF37] transition-all duration-300 font-sans">
                                        CONCIERGE ACCESS
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
