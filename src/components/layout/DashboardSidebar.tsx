'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
    LayoutDashboard,
    Users,
    Bell,
    Package,
    MapPin,
    Car,
    CalendarCheck,
    Headphones,
    DollarSign,
    Handshake,
    Palmtree,
    ChevronLeft,
    Menu,
    Building2,
    UserCircle,
    FileText,
    LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface NavLink {
    href: string;
    label: string;
    icon: any;
}

// Navigation items per role
const NAV_BY_ROLE: Record<string, NavLink[]> = {
    ADMIN: [
        { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
        { href: '/dashboard/bookings', label: 'Bookings', icon: CalendarCheck },
        { href: '/dashboard/packages', label: 'Packages', icon: Package },
        { href: '/dashboard/destinations', label: 'Destinations', icon: MapPin },
        { href: '/dashboard/vehicles', label: 'Vehicles', icon: Car },
        { href: '/dashboard/support', label: 'Support', icon: Headphones },
        { href: '/dashboard/finance', label: 'Finance', icon: DollarSign },
        { href: '/dashboard/partners', label: 'Partners', icon: Handshake },
        { href: '/dashboard/users', label: 'Users', icon: Users },
    ],
    STAFF: [
        { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
        { href: '/dashboard/bookings', label: 'Bookings', icon: CalendarCheck },
        { href: '/dashboard/packages', label: 'Packages', icon: Package },
        { href: '/dashboard/destinations', label: 'Destinations', icon: MapPin },
        { href: '/dashboard/vehicles', label: 'Vehicles', icon: Car },
        { href: '/dashboard/support', label: 'Support', icon: Headphones },
        { href: '/dashboard/partners', label: 'Partners', icon: Handshake },
    ],
    VEHICLE_OWNER: [
        { href: '/dashboard/fleet', label: 'My Vehicles', icon: Car },
        { href: '/dashboard/profile', label: 'Profile', icon: UserCircle },
    ],
    HOTEL_OWNER: [
        { href: '/dashboard/hotel', label: 'My Property', icon: Building2 },
        { href: '/dashboard/profile', label: 'Profile', icon: UserCircle },
    ],
    USER: [
        { href: '/dashboard/my-bookings', label: 'My Bookings', icon: CalendarCheck },
        { href: '/dashboard/my-plans', label: 'My Plans', icon: FileText },
        { href: '/dashboard/profile', label: 'Profile', icon: UserCircle },
    ],
};

const ROLE_LABELS: Record<string, string> = {
    ADMIN: 'Administrator',
    STAFF: 'Concierge Staff',
    VEHICLE_OWNER: 'Fleet Partner',
    HOTEL_OWNER: 'Hotel Partner',
    USER: 'Customer',
};

function SidebarContent({ userRole, userName, isLightTheme }: { userRole: string; userName: string; isLightTheme: boolean }) {
    const pathname = usePathname();
    const links = NAV_BY_ROLE[userRole] || NAV_BY_ROLE.USER;

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        window.location.href = '/auth/login';
    };

    return (
        <div className={`flex h-full flex-col ${isLightTheme ? 'bg-[#f4f6f8] text-slate-800 border-r border-slate-200' : 'bg-transparent text-white'}`}>
            {/* Brand */}
            <div className={`flex h-20 items-center px-6 border-b ${isLightTheme ? 'border-slate-200' : 'border-antique-gold/10'}`}>
                <Link href="/dashboard" className="flex items-center gap-3 group">
                    <div className="w-9 h-9 rounded-xl bg-antique-gold/15 border border-antique-gold/25 flex items-center justify-center group-hover:bg-antique-gold/25 transition-all duration-300">
                        <Palmtree className="h-4 w-4 text-antique-gold" />
                    </div>
                    <div>
                        <span className={`font-display text-lg font-bold tracking-tight ${isLightTheme ? 'text-slate-900' : 'text-off-white'}`}>
                            TOMS
                        </span>
                        <p className={`text-[9px] tracking-[0.2em] uppercase ${isLightTheme ? 'text-slate-500' : 'text-off-white/30'}`}>Yatara Ceylon</p>
                    </div>
                </Link>
            </div>

            {/* Role Badge */}
            <div className="px-6 py-3 border-b border-antique-gold/5">
                <p className="text-[10px] tracking-[0.15em] text-off-white/30 uppercase">Signed in as</p>
                <p className="text-xs text-antique-gold font-medium mt-0.5">{userName || 'User'}</p>
                <p className="text-[10px] text-off-white/40 mt-0.5">{ROLE_LABELS[userRole] || 'Customer'}</p>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-1 scrollbar-glass-dark">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive =
                        pathname === link.href ||
                        (link.href !== '/dashboard' && pathname.startsWith(link.href));
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                'sidebar-link text-off-white/60 hover:text-off-white hover:bg-white/5 rounded-xl',
                                isActive && 'sidebar-link-active text-antique-gold'
                            )}
                        >
                            <Icon className={cn(
                                "h-4 w-4 flex-shrink-0 transition-colors",
                                isActive ? "text-antique-gold" : "text-off-white/40"
                            )} />
                            <span className="text-[13px]">{link.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="border-t border-antique-gold/10 p-4 space-y-1">
                <Link
                    href="/"
                    className="sidebar-link text-off-white/40 hover:text-antique-gold rounded-xl"
                >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="text-[13px]">Back to Website</span>
                </Link>
                <button
                    onClick={handleLogout}
                    className="sidebar-link text-off-white/40 hover:text-red-400 rounded-xl w-full"
                >
                    <LogOut className="h-4 w-4" />
                    <span className="text-[13px]">Sign Out</span>
                </button>
            </div>
        </div>
    );
}

export function DashboardSidebar({ isLightTheme = false }: { isLightTheme?: boolean }) {
    const [open, setOpen] = useState(false);
    const [userRole, setUserRole] = useState('USER');
    const [userName, setUserName] = useState('');

    useEffect(() => {
        fetch('/api/auth/me')
            .then(res => res.json())
            .then(data => {
                if (data.user) {
                    setUserRole(data.user.role || 'USER');
                    setUserName(data.user.name || '');
                }
            })
            .catch(() => { });
    }, []);

    return (
        <>
            {/* Desktop Sidebar — Dark Glass */}
            <aside className={`hidden md:block min-h-screen ${isLightTheme ? 'bg-[#f4f6f8] border-r border-slate-200' : 'dashboard-sidebar-dark'}`}>
                <SidebarContent userRole={userRole} userName={userName} isLightTheme={isLightTheme} />
            </aside>

            {/* Mobile Sidebar Toggle */}
            <div className="md:hidden fixed top-0 left-0 z-40 p-3">
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon" className="liquid-glass border-antique-gold/20">
                            <Menu className="h-5 w-5 text-deep-emerald" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className={`w-72 p-0 border-r ${isLightTheme ? 'border-slate-200' : 'border-antique-gold/20'}`}>
                        <div className={`h-full ${isLightTheme ? 'bg-[#f4f6f8]' : 'dashboard-sidebar-dark'}`}>
                            <SidebarContent userRole={userRole} userName={userName} isLightTheme={isLightTheme} />
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </>
    );
}
