import { LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface EmptyStateCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
    actionLabel?: string;
    actionHref?: string;
}

export function EmptyStateCard({ icon: Icon, title, description, actionLabel, actionHref }: EmptyStateCardProps) {
    return (
        <div className="dashboard-empty-state py-12 px-8 flex flex-col items-center justify-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mb-4">
                <Icon className="h-6 w-6 text-white/25" />
            </div>
            <h4 className="text-sm font-semibold text-white/60 mb-1.5">{title}</h4>
            <p className="text-xs text-white/35 max-w-xs leading-relaxed">{description}</p>
            {actionLabel && actionHref && (
                <Link
                    href={actionHref}
                    className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold tracking-wider uppercase bg-antique-gold/10 border border-antique-gold/25 text-antique-gold hover:bg-antique-gold/20 hover:border-antique-gold/40 transition-all duration-300"
                >
                    {actionLabel}
                </Link>
            )}
        </div>
    );
}
