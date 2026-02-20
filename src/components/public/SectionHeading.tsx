import { cn } from '@/lib/utils';

interface SectionHeadingProps {
    title: string;
    subtitle?: string;
    description?: string;
    align?: 'left' | 'center' | 'right';
    className?: string;
}

export default function SectionHeading({
    title,
    subtitle,
    description,
    align = 'center',
    className,
}: SectionHeadingProps) {
    return (
        <div className={cn('space-y-4', align === 'center' ? 'text-center' : `text-${align}`, className)}>
            {subtitle && (
                <span className="text-antique-gold font-medium uppercase tracking-widest text-xs inline-block mb-1 border border-antique-gold/30 px-3 py-1 bg-deep-emerald/5">
                    {subtitle}
                </span>
            )}
            <h2 className="text-3xl md:text-5xl font-serif text-deep-emerald leading-tight">
                {title}
            </h2>
            {description && (
                <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed font-light">
                    {description}
                </p>
            )}
            <div className={cn('h-px w-24 bg-antique-gold mt-6 opacity-50', align === 'center' ? 'mx-auto' : '')} />
        </div>
    );
}
