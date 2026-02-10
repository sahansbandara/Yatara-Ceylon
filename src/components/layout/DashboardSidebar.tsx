'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    Bell,
    Package,
    MapPin,
    Map,
    Car,
    CalendarCheck,
    Headphones,
    DollarSign,
    Handshake,
    Globe,
    Palmtree,
    ChevronLeft,
    Menu,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';
import { Separator } from '@/components/ui/separator';

const sidebarLinks = [
    { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/dashboard/bookings', label: 'Bookings', icon: CalendarCheck },
    { href: '/dashboard/content/packages', label: 'Packages', icon: Package },
    { href: '/dashboard/content/destinations', label: 'Destinations', icon: MapPin },
    { href: '/dashboard/content/faqs', label: 'FAQs', icon: Headphones },
    { href: '/dashboard/content/testimonials', label: 'Testimonials', icon: Users },
    { href: '/dashboard/content/gallery', label: 'Gallery', icon: Globe },
    { href: '/dashboard/build-tour', label: 'Tour Builder', icon: Map },
    { href: '/dashboard/vehicles', label: 'Vehicles', icon: Car },
    { href: '/dashboard/support', label: 'Support', icon: Headphones },
    { href: '/dashboard/finance', label: 'Finance', icon: DollarSign },
    { href: '/dashboard/partners', label: 'Partners', icon: Handshake },
    { href: '/dashboard/notifications', label: 'Notifications', icon: Bell },
    { href: '/dashboard/users', label: 'Users', icon: Users },
];

function SidebarContent() {
    const pathname = usePathname();

    return (
        <div className="flex h-full flex-col">
            {/* Brand */}
            <div className="flex h-16 items-center border-b px-4 lg:px-6">
                <Link href="/dashboard" className="flex items-center gap-2 group">
                    <Palmtree className="h-6 w-6 text-ocean-600" />
                    <span className="font-display text-lg font-bold gradient-text">
                        TOMS
                    </span>
                </Link>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-thin">
                {sidebarLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive =
                        pathname === link.href ||
                        (link.href !== '/dashboard' && pathname.startsWith(link.href));
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                'sidebar-link',
                                isActive && 'sidebar-link-active'
                            )}
                        >
                            <Icon className="h-4 w-4 flex-shrink-0" />
                            {link.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <Separator />
            <div className="p-3">
                <Link
                    href="/"
                    className="sidebar-link text-ocean-600 hover:text-ocean-700"
                >
                    <ChevronLeft className="h-4 w-4" />
                    Back to Website
                </Link>
            </div>
        </div>
    );
}

export function DashboardSidebar() {
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden md:block border-r bg-card min-h-screen">
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar Toggle */}
            <div className="md:hidden fixed top-0 left-0 z-40 p-3">
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon">
                            <Menu className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-72 p-0">
                        <SidebarContent />
                    </SheetContent>
                </Sheet>
            </div>
        </>
    );
}
