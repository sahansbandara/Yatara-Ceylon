import { TrendingUp, Sparkles } from 'lucide-react';
import { ReactNode } from 'react';

interface DashboardHeroProps {
    title: string;
    subtitle: string;
    badge?: string;
    action?: ReactNode;
}

export function DashboardHero({ title, subtitle, badge, action }: DashboardHeroProps) {
    return (
        <div className="dashboard-hero-glass px-6 py-5 md:px-8 md:py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 relative z-10">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-white drop-shadow-md">
                            {title}
                        </h1>
                        {badge && (
                            <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] tracking-[0.15em] uppercase font-semibold bg-antique-gold/10 border border-antique-gold/25 text-antique-gold">
                                <Sparkles className="w-3 h-3" />
                                {badge}
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-white/45 font-light">{subtitle}</p>
                </div>
                <div className="flex items-center gap-3">
                    {action}
                    <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <TrendingUp className="w-3.5 h-3.5 text-antique-gold" />
                        <span className="text-[10px] tracking-[0.12em] text-white/70 font-medium uppercase">Live</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
