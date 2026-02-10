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
                <span className="text-ocean-600 font-semibold uppercase tracking-wider text-sm">
                    {subtitle}
                </span>
            )}
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                {title}
            </h2>
            {description && (
                <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                    {description}
                </p>
            )}
            <div className={cn('h-1 w-20 bg-ocean-500 rounded-full mt-2', align === 'center' ? 'mx-auto' : '')} />
        </div>
    );
}
