'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef } from 'react';
import { Menu, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Image from 'next/image';
import { useCurrency } from '@/lib/CurrencyContext';

const navLinks = [
    {
        href: '/packages',
        label: 'JOURNEYS',
        dropdown: [
            { href: '/packages', label: 'All Journeys' },
            { href: '/packages?tag=heritage', label: 'Heritage Trails' },
            { href: '/packages?tag=wildlife', label: 'Wildlife & Safari' },
            { href: '/packages?tag=beach', label: 'Coastal Retreats' },
        ],
    },
    {
        href: '/destinations',
        label: 'DESTINATIONS',
        dropdown: [
            { href: '/destinations', label: 'All Destinations' },
            { href: '/destinations/sigiriya', label: 'Sigiriya' },
            { href: '/destinations/kandy', label: 'Kandy' },
            { href: '/destinations/galle', label: 'Galle' },
            { href: '/destinations/ella', label: 'Ella' },
        ],
    },
    { href: '/vehicles', label: 'TRANSFERS' },
    { href: '/build-tour', label: 'BESPOKE TOUR' },
    { href: '/guide', label: 'GUIDE' },
];

export function Navbar() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const { currency, setCurrency } = useCurrency();

    const isActive = (href: string) => {
        if (href === '/') return pathname === '/';
        return pathname.startsWith(href);
    };

    const handleDropdownEnter = (label: string) => {
        if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
        setActiveDropdown(label);
    };

    const handleDropdownLeave = () => {
        dropdownTimeoutRef.current = setTimeout(() => {
            setActiveDropdown(null);
        }, 200);
    };

    return (
        <header className="fixed top-0 z-50 w-full bg-[#0a1f15]/80 backdrop-blur-md border-b border-white/5">
            <div className="section-container flex h-16 items-center justify-between px-4 lg:px-8">
                {/* Logo */}
                <Link href="/" className="flex items-center shrink-0">
                    <Image
                        src="/images/yatara-brand-block.svg"
                        alt="Yatara Ceylon Logo"
                        width={180}
                        height={40}
                        className="object-contain h-[40px] w-auto hover:opacity-90 transition-all duration-500 brightness-0 invert drop-shadow-md"
                    />
                </Link>

                {/* Desktop Nav Center */}
                <nav className="hidden xl:flex flex-1 justify-center items-center gap-5 2xl:gap-8">
                    {navLinks.map((link) => (
                        <div
                            key={link.href}
                            className="relative"
                            onMouseEnter={() => link.dropdown && handleDropdownEnter(link.label)}
                            onMouseLeave={handleDropdownLeave}
                        >
                            <Link
                                href={link.href}
                                className={`text-[12px] 2xl:text-[13px] font-sans tracking-[0.15em] transition-all duration-300 whitespace-nowrap relative py-1 flex items-center gap-1
                                    ${isActive(link.href)
                                        ? 'text-[#D4AF37] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#D4AF37]'
                                        : 'text-white/70 hover:text-white'
                                    }`}
                            >
                                {link.label}
                                {link.dropdown && (
                                    <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${activeDropdown === link.label ? 'rotate-180' : ''}`} />
                                )}
                            </Link>

                            {/* Dropdown Panel */}
                            {link.dropdown && activeDropdown === link.label && (
                                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 animate-slide-down">
                                    <div className="bg-[#0a1f15]/95 backdrop-blur-xl border border-white/10 rounded-xl py-4 px-2 min-w-[220px] shadow-2xl">
                                        {link.dropdown.map((item) => (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                className="block px-4 py-2.5 text-[11px] tracking-[0.15em] text-white/60 hover:text-[#D4AF37] hover:bg-white/5 rounded-lg transition-all duration-200 font-medium"
                                            >
                                                {item.label}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </nav>

                {/* Desktop Right Actions */}
                <div className="hidden xl:flex items-center gap-6 shrink-0">
                    <Link
                        href="/auth/login"
                        className="text-[11px] font-sans tracking-[0.2em] text-white/70 hover:text-[#D4AF37] transition-colors font-semibold uppercase"
                    >
                        LOGIN
                    </Link>

                    <button
                        onClick={() => setCurrency(currency === 'LKR' ? 'USD' : 'LKR')}
                        className="currency-toggle-btn"
                        style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}
                    >
                        <span className="currency-toggle-indicator" />
                        <span className="text-[11px] font-semibold tracking-[0.2em]">
                            {currency}
                        </span>
                    </button>

                    <Link href="/inquire">
                        <Button className="h-9 px-7 tracking-[0.15em] text-[11px] rounded-full transition-all duration-500 font-semibold shadow-md hover:shadow-lg whitespace-nowrap bg-[#D4AF37] text-[#0a1f15] hover:bg-[#D4AF37]/90 border-0">
                            INQUIRE
                        </Button>
                    </Link>
                </div>

                {/* Mobile Menu */}
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild className="xl:hidden">
                        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                            <Menu className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-80 p-0 border-l border-[#D4AF37]/20 overflow-hidden">
                        <div className="absolute inset-0 liquid-glass-dark" />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />

                        <div className="relative z-10 flex flex-col gap-6 mt-16 px-6">
                            <div className="h-px w-16 bg-gradient-to-r from-[#D4AF37] to-transparent mb-4" />

                            {navLinks.map((link, idx) => (
                                <div key={link.href} style={{ animationDelay: `${idx * 80}ms` }} className="animate-fade-in-up opacity-0">
                                    <Link
                                        href={link.href}
                                        onClick={() => setOpen(false)}
                                        className={`text-[14px] font-sans tracking-[0.15em] transition-colors block
                                            ${isActive(link.href)
                                                ? 'text-[#D4AF37] border-b border-[#D4AF37] pb-1 w-fit'
                                                : 'text-white/80 hover:text-[#D4AF37]'
                                            }`}
                                    >
                                        {link.label}
                                    </Link>
                                    {link.dropdown && (
                                        <div className="ml-4 mt-2 space-y-2">
                                            {link.dropdown.slice(1).map((sub) => (
                                                <Link
                                                    key={sub.href}
                                                    href={sub.href}
                                                    onClick={() => setOpen(false)}
                                                    className="block text-[12px] tracking-[0.12em] text-white/40 hover:text-[#D4AF37] transition-colors"
                                                >
                                                    {sub.label}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}

                            <div className="border-t border-[#D4AF37]/20 pt-8 mt-4 flex flex-col gap-6">
                                <Link href="/auth/login" onClick={() => setOpen(false)} className="text-[14px] font-sans tracking-[0.15em] text-white/80 hover:text-[#D4AF37] transition-colors">
                                    LOGIN
                                </Link>
                                <button
                                    onClick={() => { setCurrency(currency === 'LKR' ? 'USD' : 'LKR'); setOpen(false); }}
                                    className="currency-toggle-btn self-start"
                                    style={{ borderColor: 'rgba(212,175,55,0.5)', color: 'white' }}
                                >
                                    <span className="currency-toggle-indicator" />
                                    <span className="text-[11px] font-semibold tracking-[0.2em]">{currency}</span>
                                </button>
                                <Link href="/inquire" onClick={() => setOpen(false)}>
                                    <Button className="w-full h-12 bg-[#D4AF37] text-[#0a1f15] hover:bg-[#D4AF37]/90 tracking-[0.15em] text-[13px] rounded-full font-semibold shadow-md transition-all duration-500">
                                        INQUIRE NOW
                                    </Button>
                                </Link>
                            </div>

                            <div className="absolute bottom-8 left-6 right-6">
                                <div className="h-px bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent" />
                                <p className="text-center text-[9px] tracking-[0.3em] text-white/20 mt-4 uppercase">
                                    Bespoke Sri Lanka
                                </p>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    );
}
