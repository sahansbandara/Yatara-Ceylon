import { LucideIcon } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string;
    icon: LucideIcon;
    trend?: { value: string; positive: boolean };
    accentColor?: string;
}

export function StatCard({ title, value, icon: Icon, trend, accentColor = 'text-antique-gold' }: StatCardProps) {
    return (
        <div className="liquid-glass-stat-dark p-5 group cursor-default">
            <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] font-medium text-white/50 tracking-wide uppercase">{title}</p>
                <div className={`w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center group-hover:bg-white/[0.08] group-hover:border-antique-gold/20 transition-all duration-500`}>
                    <Icon className={`h-4.5 w-4.5 ${accentColor} opacity-80 group-hover:opacity-100 transition-opacity`} />
                </div>
            </div>
            <p className="text-2xl md:text-3xl font-display font-bold text-white drop-shadow-md tracking-tight">{value}</p>
            {trend && (
                <div className="flex items-center gap-1 mt-2">
                    <span className={`text-[10px] font-semibold ${trend.positive ? 'text-emerald-400' : 'text-red-400'}`}>
                        {trend.positive ? '▲' : '▼'} {trend.value}
                    </span>
                </div>
            )}
        </div>
    );
}
