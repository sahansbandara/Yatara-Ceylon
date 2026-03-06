'use client';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isLightTheme = pathname.includes('/finance') || pathname.includes('/fleet') || pathname.includes('/hotel');

    return (
        <div className={`grid min-h-screen w-full md:grid-cols-[260px_1fr] lg:grid-cols-[280px_1fr] overflow-hidden ${isLightTheme
                ? 'dashboard-bg-light text-slate-800'
                : 'text-white bg-[#0a1f18] before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_at_top_right,_rgba(20,80,60,0.4),_transparent_60%)] before:pointer-events-none'
            }`}>
            <DashboardSidebar isLightTheme={isLightTheme} />
            <div className="flex flex-col relative z-10 w-full h-screen overflow-y-auto">
                <main className="flex flex-1 flex-col gap-6 p-4 lg:gap-8 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
