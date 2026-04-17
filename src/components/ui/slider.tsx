'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
    value: number[];
    onValueChange: (value: number[]) => void;
    max?: number;
    step?: number;
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
    ({ className, value, onValueChange, max = 100, step = 1, ...props }, ref) => {
        const val = value[0] || 0;

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            onValueChange([parseFloat(e.target.value)]);
        };

        const percentage = (val / max) * 100;

        return (
            <div className={cn('relative w-full h-6 flex items-center', className)}>
                {/* Track background */}
                <div className="absolute w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    {/* Active track */}
                    <div
                        className="h-full bg-ocean-600 absolute left-0 top-0"
                        style={{ width: `${percentage}%` }}
                    />
                </div>

                {/* Thumb input */}
                <input
                    type="range"
                    min={0}
                    max={max}
                    step={step}
                    value={val}
                    onChange={handleChange}
                    ref={ref}
                    className="absolute w-full h-full opacity-0 cursor-pointer z-10"
                    {...props}
                />

                {/* Visible Thumb */}
                <div
                    className="absolute h-5 w-5 bg-white border-2 border-ocean-600 rounded-full shadow-md pointer-events-none"
                    style={{ left: `calc(${percentage}% - 10px)` }}
                />
            </div>
        );
    }
);

Slider.displayName = 'Slider';

export { Slider };
