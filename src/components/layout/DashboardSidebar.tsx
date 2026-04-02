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
    ChevronLeft,
    Menu,
    Building2,
    UserCircle,
    FileText,
    Logs,
    LogOut,
    ClipboardList,
    Activity,
    ArchiveRestore,
    TrendingUp,
} from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface NavLink {
    href: string;
    label: string;
    icon: any;
}

interface NavGroup {
    label: string;
    links: NavLink[];
}

// Grouped navigation per role
const NAV_GROUPS_BY_ROLE: Record<string, NavGroup[]> = {
    ADMIN: [
        {
            label: 'Overview',
            links: [
                { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
                { href: '/dashboard/analytics', label: 'Analytics', icon: TrendingUp },
            ],
        },
        {
            label: 'Operations',
            links: [
                { href: '/dashboard/bookings', label: 'Bookings', icon: CalendarCheck },
                { href: '/dashboard/vehicles', label: 'Vehicles', icon: Car },
                { href: '/dashboard/support', label: 'Support', icon: Headphones },
            ],
        },
        {
            label: 'Content',
            links: [
                { href: '/dashboard/packages', label: 'Packages', icon: Package },
                { href: '/dashboard/destinations', label: 'Destinations', icon: MapPin },
            ],
        },
        {
            label: 'Management',
            links: [
                { href: '/dashboard/admin-applications', label: 'Applications', icon: ClipboardList },
                { href: '/dashboard/finance', label: 'Finance', icon: DollarSign },
                { href: '/dashboard/partners', label: 'Partners', icon: Handshake },
                { href: '/dashboard/users', label: 'Users', icon: Users },
                { href: '/dashboard/notifications', label: 'Notifications', icon: Bell },
                { href: '/dashboard/audit-logs', label: 'Audit Logs', icon: Activity },
                { href: '/dashboard/archive', label: 'Archive', icon: ArchiveRestore },
            ],
        },
    ],
    STAFF: [
        {
            label: 'Overview',
            links: [
                { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
            ],
        },
        {
            label: 'Operations',
            links: [
                { href: '/dashboard/bookings', label: 'Bookings', icon: CalendarCheck },
                { href: '/dashboard/vehicles', label: 'Vehicles', icon: Car },
                { href: '/dashboard/support', label: 'Support', icon: Headphones },
            ],
        },
        {
            label: 'Content',
            links: [
                { href: '/dashboard/packages', label: 'Packages', icon: Package },
                { href: '/dashboard/destinations', label: 'Destinations', icon: MapPin },
                { href: '/dashboard/partners', label: 'Partners', icon: Handshake },
            ],
        },
        {
            label: 'System',
            links: [
                { href: '/dashboard/admin-applications', label: 'Applications', icon: ClipboardList },
                { href: '/dashboard/notifications', label: 'Notifications', icon: Bell },
            ],
        },
    ],
    VEHICLE_OWNER: [
        {
            label: 'Fleet',
            links: [
                { href: '/dashboard/fleet', label: 'My Vehicles', icon: Car },
            ],
        },
        {
            label: 'Account',
            links: [
                { href: '/dashboard/profile', label: 'Profile', icon: UserCircle },
            ],
        },
    ],
    HOTEL_OWNER: [
        {
            label: 'Property',
            links: [
                { href: '/dashboard/hotel', label: 'My Property', icon: Building2 },
            ],
        },
        {
            label: 'Account',
            links: [
                { href: '/dashboard/profile', label: 'Profile', icon: UserCircle },
            ],
        },
    ],
    USER: [
        {
            label: 'My Travel',
            links: [
                { href: '/dashboard/my-bookings', label: 'My Bookings', icon: CalendarCheck },
                { href: '/dashboard/my-plans', label: 'My Plans', icon: FileText },
            ],
        },
        {
            label: 'Account',
            links: [
                { href: '/dashboard/profile', label: 'Profile', icon: UserCircle },
            ],
        },
    ],
};

const ROLE_LABELS: Record<string, string> = {
    ADMIN: 'Administrator',
    STAFF: 'Concierge Staff',
    VEHICLE_OWNER: 'Fleet Partner',
    HOTEL_OWNER: 'Hotel Partner',
    USER: 'Customer',
};

function SidebarContent({ userRole, userName, isLoading }: { userRole: string; userName: string; isLoading?: boolean }) {
    const pathname = usePathname();
    const groups = isLoading ? [] : (NAV_GROUPS_BY_ROLE[userRole] || NAV_GROUPS_BY_ROLE.USER);

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        window.location.href = '/auth/login';
    };

    return (
        <div className="flex h-full flex-col bg-transparent text-white">
            {/* Brand Lockup */}
            <div className="flex h-[80px] items-center px-5 border-b border-white/[0.06] justify-center pt-2">
                <Link href="/dashboard" className="flex items-center group transition-transform hover:scale-[1.02]">
                    <Image
                        src="/images/yatara-brand-block.svg"
                        alt="Yatara Ceylon"
                        width={180}
                        height={40}
                        className="brightness-0 invert opacity-95"
                        priority
                    />
                </Link>
            </div>

            {/* User Info */}
            <div className="px-5 py-3 border-b border-white/[0.04] flex items-center gap-3">
                {isLoading ? (
                    <div className="h-10 w-10 bg-white/10 rounded-full animate-pulse flex-shrink-0" />
                ) : (
                    <div className="h-10 w-10 flex-shrink-0 rounded-full bg-antique-gold/20 border border-antique-gold/30 flex items-center justify-center text-antique-gold font-bold text-sm liquid-glass-card-dark">
                        {userName ? userName.charAt(0).toUpperCase() : 'U'}
                    </div>
                )}
                <div className="min-w-0">
                    <p className="text-[10px] tracking-[0.12em] text-off-white/25 uppercase">Signed in as</p>
                    {isLoading ? (
                        <div className="h-4 w-24 bg-white/10 rounded mt-1 animate-pulse" />
                    ) : (
                        <p className="text-xs text-antique-gold font-medium mt-0.5 truncate">
                            {userName || 'User'} <span className="text-off-white/50 font-normal text-[10px] block">({ROLE_LABELS[userRole] || 'Customer'})</span>
                        </p>
                    )}
                </div>
            </div>

            {/* Navigation Groups */}
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5 scrollbar-glass-dark">
                {groups.map((group) => (
                    <div key={group.label}>
                        <p className="px-3 mb-2 text-[9px] tracking-[0.2em] uppercase text-off-white/20 font-semibold">
                            {group.label}
                        </p>
                        <div className="space-y-0.5">
                            {group.links.map((link) => {
                                const Icon = link.icon;
                                const isActive =
                                    pathname === link.href ||
                                    (link.href !== '/dashboard' && pathname?.startsWith(link.href + '/')) ||
                                    (link.href !== '/dashboard' && pathname === link.href);
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={cn(
                                            'relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-300 overflow-hidden',
                                            isActive
                                                ? 'bg-antique-gold/15 border border-antique-gold/20 text-antique-gold'
                                                : 'text-off-white/50 hover:text-off-white/80 hover:bg-white/[0.04] border border-transparent'
                                        )}
                                    >
                                        {isActive && (
                                            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-antique-gold" />
                                        )}
                                        <Icon className={cn(
                                            "h-4 w-4 flex-shrink-0 transition-all duration-300",
                                            isActive ? "text-antique-gold" : "text-off-white/30 group-hover:text-off-white/50"
                                        )} />
                                        <span>{link.label}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Footer */}
            <div className="border-t border-white/[0.06] p-3 space-y-0.5">
                <Link
                    href="/"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-off-white/35 hover:text-antique-gold hover:bg-white/[0.03] border border-transparent transition-all duration-300"
                >
                    <ChevronLeft className="h-4 w-4" />
                    <span>Back to Website</span>
                </Link>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-off-white/35 hover:text-red-400 hover:bg-red-500/[0.05] border border-transparent w-full transition-all duration-300"
                >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                </button>
            </div>
        </div>
    );
}

export function DashboardSidebar() {
    const [open, setOpen] = useState(false);
    const [userRole, setUserRole] = useState('USER');
    const [userName, setUserName] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch('/api/auth/me')
            .then(res => res.json())
            .then(data => {
                if (data.user) {
                    setUserRole(data.user.role || 'USER');
                    setUserName(data.user.name || '');
                }
            })
            .catch(() => { })
            .finally(() => setIsLoading(false));
    }, []);

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden md:block min-h-screen dashboard-sidebar-dark">
                <SidebarContent userRole={userRole} userName={userName} isLoading={isLoading} />
            </aside>

            {/* Mobile Sidebar Toggle */}
            <div className="md:hidden fixed top-0 left-0 z-40 p-3">
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon" className="liquid-glass border-antique-gold/20 bg-[#061a15]/80 backdrop-blur-xl">
                            <Menu className="h-5 w-5 text-antique-gold" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-72 p-0 border-r border-antique-gold/10 bg-[#020b08]">
                        <div className="h-full dashboard-sidebar-dark">
                            <SidebarContent userRole={userRole} userName={userName} isLoading={isLoading} />
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </>
    );
}
