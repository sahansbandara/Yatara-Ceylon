'use client';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative grid min-h-screen w-full md:grid-cols-[260px_1fr] lg:grid-cols-[280px_1fr] overflow-hidden text-white bg-[#020b08]">
            {/* Cinematic Background: Scenic image + deep overlay + glow orbs */}
            <div className="absolute inset-0 z-0 select-none overflow-hidden">
                {/* Base scenic image */}
                <div className="absolute inset-0 bg-[url('/images/home/colombo-lotus.webp')] bg-cover bg-center opacity-40" />
                {/* Dark emerald overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#020b08]/90 via-[#061a15]/85 to-[#020b08]/90" />
                {/* Blur layer */}
                <div className="absolute inset-0 backdrop-blur-[50px] saturate-[120%]" />
                {/* Gold glow orb — top right */}
                <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.06)_0%,transparent_70%)]" />
                {/* Emerald glow orb — bottom left */}
                <div className="absolute -bottom-48 -left-48 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(4,57,39,0.15)_0%,transparent_70%)]" />
                {/* Subtle gold glow — center */}
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse,rgba(212,175,55,0.03)_0%,transparent_70%)]" />
            </div>

            <DashboardSidebar />
            <div className="flex flex-col relative z-10 w-full h-screen overflow-y-auto scrollbar-glass-dark">
                <main className="flex flex-1 flex-col gap-6 p-4 pt-16 md:pt-4 lg:gap-8 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
