'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, Palmtree } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/packages', label: 'Packages' },
    { href: '/destinations', label: 'Destinations' },
    { href: '/build-tour', label: 'Build Tour' },
    { href: '/offers', label: 'Offers' },
    { href: '/contact', label: 'Contact' },
];

export function Navbar() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="section-container flex h-16 items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <Palmtree className="h-7 w-7 text-ocean-600 group-hover:text-ocean-500 transition-colors" />
                    <span className="font-display text-xl font-bold gradient-text">
                        Ceylon Escapes
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-1">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                'px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                                pathname === link.href
                                    ? 'text-ocean-700 bg-ocean-50'
                                    : 'text-muted-foreground hover:text-ocean-700 hover:bg-ocean-50/50'
                            )}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Desktop CTA */}
                <div className="hidden md:flex items-center gap-3">
                    <Link href="/contact">
                        <Button className="btn-primary text-sm h-9">
                            Book Now
                        </Button>
                    </Link>
                    <Link
                        href="/dashboard"
                        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Dashboard
                    </Link>
                </div>

                {/* Mobile Menu */}
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild className="md:hidden">
                        <Button variant="ghost" size="icon">
                            <Menu className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-72">
                        <div className="flex flex-col gap-4 mt-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setOpen(false)}
                                    className={cn(
                                        'px-4 py-2.5 rounded-lg text-base font-medium transition-all',
                                        pathname === link.href
                                            ? 'text-ocean-700 bg-ocean-50'
                                            : 'text-muted-foreground hover:text-ocean-700 hover:bg-ocean-50/50'
                                    )}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div className="border-t pt-4 mt-2">
                                <Link href="/contact" onClick={() => setOpen(false)}>
                                    <Button className="btn-primary w-full">
                                        Book Now
                                    </Button>
                                </Link>
                                <Link
                                    href="/dashboard"
                                    onClick={() => setOpen(false)}
                                    className="block text-center mt-3 text-sm font-medium text-muted-foreground hover:text-foreground"
                                >
                                    Dashboard →
                                </Link>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    );
}
