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
            {/* Mesh gradient background — subtle depth without fog */}
            <div className="absolute inset-0 z-0 select-none overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_10%_20%,rgba(4,57,39,0.25)_0%,transparent_60%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_90%_80%,rgba(4,57,39,0.15)_0%,transparent_60%)]" />
                <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.02)_0%,transparent_70%)]" />
            </div>

            <DashboardSidebar />
            <div className="flex flex-col relative z-10 w-full h-screen overflow-y-auto scrollbar-glass-dark">
                <main className="flex flex-1 flex-col gap-5 lg:gap-6 p-4 pt-16 md:p-6 md:pt-6 lg:p-8 w-full max-w-[1440px] mx-auto">
                    {children}
                </main>
                <CommandBar />
            </div>
        </div>
    );
}

