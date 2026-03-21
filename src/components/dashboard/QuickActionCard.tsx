import { LucideIcon, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

interface QuickActionCardProps {
    href: string;
    icon: LucideIcon;
    title: string;
    subtitle: string;
    iconColor?: string;
    iconBg?: string;
}

export function QuickActionCard({ href, icon: Icon, title, subtitle, iconColor = 'text-antique-gold', iconBg = 'bg-antique-gold/10 border-antique-gold/20' }: QuickActionCardProps) {
    return (
        <Link
            href={href}
            className="flex items-center gap-4 px-4 py-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] hover:border-antique-gold/20 transition-all duration-500 group"
        >
            <div className={`w-10 h-10 rounded-xl ${iconBg} border flex items-center justify-center group-hover:scale-105 transition-transform duration-500`}>
                <Icon className={`h-4 w-4 ${iconColor}`} />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white/85 group-hover:text-white transition-colors">{title}</p>
                <p className="text-[11px] text-white/40 mt-0.5">{subtitle}</p>
            </div>
            <ArrowUpRight className="h-4 w-4 text-white/20 group-hover:text-antique-gold transition-colors flex-shrink-0" />
        </Link>
    );
}
