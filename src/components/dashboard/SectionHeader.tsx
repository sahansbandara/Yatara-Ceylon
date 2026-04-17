import { ReactNode } from 'react';

interface SectionHeaderProps {
    title: string;
    action?: ReactNode;
}

export function SectionHeader({ title, action }: SectionHeaderProps) {
    return (
        <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-display font-semibold text-white/90 tracking-tight">{title}</h3>
            {action}
        </div>
    );
}
