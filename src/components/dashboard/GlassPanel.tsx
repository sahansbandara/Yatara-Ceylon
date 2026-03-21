import { ReactNode } from 'react';
import Link from 'next/link';

interface GlassPanelProps {
    title?: string;
    actionLabel?: string;
    actionHref?: string;
    children: ReactNode;
    className?: string;
    noPadding?: boolean;
}

export function GlassPanel({ title, actionLabel, actionHref, children, className = '', noPadding = false }: GlassPanelProps) {
    return (
        <div className={`liquid-glass-stat-dark rounded-2xl ${noPadding ? '' : 'p-6'} ${className}`}>
            {title && (
                <div className={`flex items-center justify-between border-b border-white/[0.06] ${noPadding ? 'px-6 pt-6' : ''} pb-4 mb-5`}>
                    <h3 className="text-base font-display font-semibold text-white/90 tracking-tight">{title}</h3>
                    {actionLabel && actionHref && (
                        <Link
                            href={actionHref}
                            className="text-[10px] tracking-[0.15em] text-antique-gold uppercase font-semibold hover:text-[#f5e6a3] transition-colors"
                        >
                            {actionLabel} →
                        </Link>
                    )}
                </div>
            )}
            <div className={noPadding && title ? 'px-6 pb-6' : ''}>{children}</div>
        </div>
    );
}
