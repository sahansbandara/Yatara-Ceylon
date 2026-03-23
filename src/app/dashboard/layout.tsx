'use client';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';
import { CommandBar } from '@/components/dashboard/CommandBar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative grid min-h-screen w-full md:grid-cols-[260px_1fr] lg:grid-cols-[280px_1fr] overflow-hidden text-white bg-[#060d0b]">
            {/* Subtle background texture — no heavy image, no green fog */}
            <div className="absolute inset-0 z-0 select-none overflow-hidden pointer-events-none">
                {/* Very subtle radial gradient for depth */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.02)_0%,transparent_60%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(255,255,255,0.015)_0%,transparent_60%)]" />
                {/* Faint gold accent — top right corner only */}
                <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.025)_0%,transparent_70%)]" />
            </div>

            <DashboardSidebar />
            <div className="flex flex-col relative z-10 w-full h-screen overflow-y-auto scrollbar-glass-dark">
                <main className="flex flex-1 flex-col gap-6 p-4 pt-16 md:pt-6 lg:gap-8 lg:p-8">
                    {children}
                </main>
                <CommandBar />
            </div>
        </div>
    );
}
