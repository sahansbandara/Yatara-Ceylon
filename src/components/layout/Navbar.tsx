'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { Menu, ChevronDown, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Image from 'next/image';
import { useCurrency } from '@/lib/CurrencyContext';

const navLinks = [
    {
        href: '/packages',
        label: 'JOURNEYS',
        dropdown: [
            {
                title: 'Curated',
                links: [
                    { href: '/packages?tag=featured', label: 'Featured' },
                    { href: '/packages?tag=wildlife', label: 'Wildlife' },
                    { href: '/packages?tag=heritage', label: 'Heritage' },
                    { href: '/packages', label: 'View all →', special: true },
                ]
            },
            {
                title: 'By Duration',
                links: [
                    { href: '/packages?duration=5-7', label: '5–7 Days' },
                    { href: '/packages?duration=8-10', label: '8–10 Days' },
                    { href: '/packages?duration=11-14', label: '11–14 Days' },
                    { href: '/packages', label: 'View all →', special: true },
                ]
            },
            {
                title: 'By Style',
                links: [
                    { href: '/packages?tag=luxury', label: 'Luxury' },
                    { href: '/packages?tag=honeymoon', label: 'Honeymoon' },
                    { href: '/packages?tag=family', label: 'Family' },
                    { href: '/packages', label: 'View all →', special: true },
                ]
            }
        ],
    },
    {
        href: '/destinations',
        label: 'DESTINATIONS',
        dropdown: [
            {
                title: 'Top Places',
                links: [
                    { href: '/destinations/ella', label: 'Ella' },
                    { href: '/destinations/sigiriya', label: 'Sigiriya' },
                    { href: '/destinations/kandy', label: 'Kandy' },
                    { href: '/destinations', label: 'View all →', special: true },
                ]
            },
            {
                title: 'By Region',
                links: [
                    { href: '/destinations/region/hill-country', label: 'Hill Country' },
                    { href: '/destinations/region/cultural-triangle', label: 'Cultural Triangle' },
                    { href: '/destinations/region/south-coast', label: 'South Coast' },
                    { href: '/destinations/region', label: 'View all →', special: true },
                ]
            },
            {
                title: 'Explore',
                links: [
                    { href: '/build-tour', label: 'Interactive Map' },
                    { href: '/destinations', label: 'All Destinations' },
                ]
            }
        ],
    },
    {
        href: '/transfers',
        label: 'TRANSFERS',
        dropdown: [
            {
                title: 'Services',
                links: [
                    { href: '/transfers/airport', label: 'Airport Transfers' },
                    { href: '/transfers/private', label: 'Private Driver' },
                    { href: '/transfers/intercity', label: 'Intercity Transfers' },
                    { href: '/transfers/fleet', label: 'Fleet Standards' },
                    { href: '/transfers', label: 'View all →', special: true },
                ]
            }
        ]
    },
    {
        href: '/build-tour',
        label: 'BESPOKE TOUR',
        dropdown: [
            {
                title: 'Custom Travel',
                links: [
                    { href: '/build-tour', label: 'Build Your Tour' },
                    { href: '/build-tour/how-it-works', label: 'How It Works' },
                    { href: '/build-tour/proposal', label: 'Proposal in 24 Hours' },
                    { href: '/build-tour/faqs', label: 'FAQs' },
                ]
            }
        ]
    },
    {
        href: '/guide',
        label: 'GUIDE',
        dropdown: [
            {
                title: 'Resources',
                links: [
                    { href: '/guide', label: 'Sri Lanka Guide' },
                    { href: '/guide/best-time-to-visit', label: 'Best Time to Visit' },
                    { href: '/guide/regions', label: 'Regions' },
                    { href: '/guide/blog', label: 'Blog' },
                    { href: '/guide', label: 'View all →', special: true },
                ]
            }
        ]
    },
];

export function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [scrolled, setScrolled] = useState(false);
    const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const { currency, setCurrency } = useCurrency();
    const isHome = pathname === '/';

    // Scroll detection for homepage transparent-to-solid transition
    useEffect(() => {
        if (!isHome) {
            setScrolled(true); // Always solid on inner pages
            return;
        }
        const handleScroll = () => setScrolled(window.scrollY > 80);
        handleScroll(); // check on mount
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isHome]);

    // Global CMD+K / CTRL+K listener & Escape handling
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                router.push('/search');
            }
            if (e.key === 'Escape') {
                setActiveDropdown(null);
            }
        };

        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, [router]);

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
        <>
            {/* Global Overlay when dropdown is open */}
            <div
                className={`fixed inset-0 top-[72px] bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 z-40 ${activeDropdown ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setActiveDropdown(null)}
            />

            <header className={`fixed top-0 z-50 w-full border-b transition-all duration-500 ${scrolled || !isHome ? 'bg-[#0a1f15]/95 backdrop-blur-lg border-white/10 shadow-lg' : 'bg-black/10 backdrop-blur-md border-white/10'}`}>
                <div className="max-w-[1400px] mx-auto flex h-[72px] items-center justify-between px-6 lg:px-10">
                    {/* Logo */}
                    <Link href="/" className="flex items-center shrink-0">
                        <Image
                            src="/images/yatara-brand-block.svg"
                            alt="Yatara Ceylon Logo"
                            width={180}
                            height={40}
                            className="object-contain h-[38px] w-auto hover:opacity-90 transition-all duration-500 brightness-0 invert drop-shadow-md"
                        />
                    </Link>

                    {/* Desktop Nav Center */}
                    <nav className="hidden xl:flex flex-1 justify-center items-center gap-10 2xl:gap-12">
                        {navLinks.map((link) => (
                            <div
                                key={link.href}
                                className="relative"
                                onMouseEnter={() => link.dropdown && handleDropdownEnter(link.label)}
                                onMouseLeave={handleDropdownLeave}
                            >
                                {/* Nav label — click navigates to landing page, hover opens dropdown */}
                                <Link
                                    href={link.href}
                                    className={`font-nav text-[11px] tracking-[0.18em] uppercase transition-all duration-300 whitespace-nowrap relative py-2 flex items-center gap-1 group
                                    ${isActive(link.href)
                                            ? 'text-white'
                                            : 'text-white/50 hover:text-white/90'
                                        }`}
                                >
                                    {link.label}
                                    {link.dropdown && (
                                        <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${activeDropdown === link.label ? 'rotate-180' : ''}`} />
                                    )}
                                    {/* Animated underline */}
                                    <span
                                        className={`absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#D4AF37] transition-transform duration-300 origin-center
                                        ${isActive(link.href)
                                                ? 'scale-x-100'
                                                : 'scale-x-0 group-hover:scale-x-100'
                                            }`}
                                    />
                                </Link>

                                {/* Dropdown Panel */}
                                {link.dropdown && activeDropdown === link.label && (
                                    <div
                                        className="absolute top-full left-1/2 -translate-x-1/2 pt-0"
                                        onMouseEnter={() => handleDropdownEnter(link.label)}
                                        onMouseLeave={handleDropdownLeave}
                                    >
                                        {/* Invisible bridge to prevent hover gap */}
                                        <div className="h-3 w-full" />
                                        <div className="w-max min-w-[480px] max-w-[720px] bg-[rgba(6,20,14,0.82)] backdrop-blur-[20px] backdrop-saturate-[140%] border border-white/[0.08] rounded-2xl py-7 px-8 flex gap-14 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.02)]">
                                            {link.dropdown.map((section, idx) => (
                                                <div key={idx} className="flex flex-col flex-1 min-w-[130px]">
                                                    <span className="text-[10px] text-white/50 tracking-[0.25em] font-nav uppercase mb-3 px-3 font-medium">
                                                        {section.title}
                                                    </span>
                                                    <div className="flex flex-col">
                                                        {section.links.map((item, linkIdx) => (
                                                            <button
                                                                key={`${item.href}-${linkIdx}`}
                                                                type="button"
                                                                onClick={() => {
                                                                    setActiveDropdown(null);
                                                                    router.push(item.href);
                                                                }}
                                                                className={`flex items-center px-3 h-[42px] font-nav text-[13px] tracking-wide rounded-lg transition-all duration-200 text-left ${item.special
                                                                    ? 'text-[#D4AF37] hover:bg-white/[0.06] mt-1 text-[12px]'
                                                                    : 'text-white/80 hover:text-white hover:bg-white/[0.06]'
                                                                    }`}
                                                            >
                                                                {item.label}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </nav>

                    {/* Desktop Right Actions */}
                    <div className="hidden xl:flex items-center gap-5 shrink-0">
                        <Link
                            href="/search"
                            className="p-2 rounded-full text-white/40 hover:text-white hover:bg-white/[0.06] transition-all duration-300 flex items-center group relative"
                            aria-label="Search"
                        >
                            <Search className="w-[18px] h-[18px]" strokeWidth={1.5} />
                            {/* Tooltip hint on hover */}
                            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-[#0a1f15]/90 border border-white/10 text-[9px] font-nav uppercase tracking-[0.2em] px-2 py-1 rounded text-white/50 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                ⌘K
                            </span>
                        </Link>

                        <Link href="/auth/login" className="font-nav text-[11px] tracking-[0.18em] text-white/60 hover:text-white transition-colors uppercase">
                            LOGIN
                        </Link>

                        <button
                            onClick={() => setCurrency(currency === 'LKR' ? 'USD' : 'LKR')}
                            className="currency-toggle-btn ml-2"
                            style={{ borderColor: 'rgba(212,175,55,0.5)', color: 'white' }}
                            aria-label="Toggle Currency"
                        >
                            <span className="currency-toggle-indicator" />
                            <span className="font-nav text-[10px] font-semibold tracking-[0.2em] uppercase">{currency}</span>
                        </button>

                        <Link href="/inquire" className="ml-2">
                            <Button className="h-9 px-8 tracking-[0.18em] text-[10px] rounded-full transition-all duration-500 font-nav font-semibold shadow-md hover:shadow-lg hover:shadow-antique-gold/20 whitespace-nowrap bg-[#D4AF37] text-[#0a1f15] hover:bg-[#D4AF37]/90 border-0 uppercase">
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
                                            className={`font-nav text-[13px] tracking-[0.15em] transition-colors block uppercase
                                            ${isActive(link.href)
                                                    ? 'text-[#D4AF37] border-b border-[#D4AF37] pb-1 w-fit'
                                                    : 'text-white/80 hover:text-[#D4AF37]'
                                                }`}
                                        >
                                            {link.label}
                                        </Link>
                                        {link.dropdown && (
                                            <div className="ml-4 mt-4 flex flex-col gap-6">
                                                {link.dropdown.map((section, sIdx) => (
                                                    <div key={sIdx} className="flex flex-col gap-2">
                                                        <span className="text-[9px] text-[#D4AF37]/50 tracking-[0.2em] font-nav uppercase px-2">
                                                            {section.title}
                                                        </span>
                                                        {section.links.map((item) => (
                                                            <Link
                                                                key={item.href}
                                                                href={item.href}
                                                                onClick={() => setOpen(false)}
                                                                className="block px-2 py-1 font-nav text-[11px] tracking-[0.12em] text-white/50 hover:text-[#D4AF37] transition-colors uppercase"
                                                            >
                                                                {item.label}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}

                                <div className="border-t border-[#D4AF37]/20 pt-8 mt-4 flex flex-col gap-6">
                                    <Link href="/auth/login" onClick={() => setOpen(false)} className="font-nav text-[13px] tracking-[0.15em] text-white/80 hover:text-[#D4AF37] transition-colors uppercase">
                                        LOGIN
                                    </Link>
                                    <button
                                        onClick={() => { setCurrency(currency === 'LKR' ? 'USD' : 'LKR'); setOpen(false); }}
                                        className="currency-toggle-btn self-start"
                                        style={{ borderColor: 'rgba(212,175,55,0.5)', color: 'white' }}
                                    >
                                        <span className="currency-toggle-indicator" />
                                        <span className="font-nav text-[10px] font-semibold tracking-[0.2em]">{currency}</span>
                                    </button>
                                    <Link href="/inquire" onClick={() => setOpen(false)}>
                                        <Button className="w-full h-12 bg-[#D4AF37] text-[#0a1f15] hover:bg-[#D4AF37]/90 tracking-[0.15em] text-[12px] rounded-full font-nav font-semibold shadow-md transition-all duration-500 uppercase">
                                            INQUIRE NOW
                                        </Button>
                                    </Link>
                                </div>

                                <div className="absolute bottom-8 left-6 right-6">
                                    <div className="h-px bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent" />
                                    <p className="text-center text-[9px] tracking-[0.3em] text-white/20 mt-4 uppercase font-nav">
                                        Bespoke Sri Lanka
                                    </p>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </header>
        </>
    );
}
