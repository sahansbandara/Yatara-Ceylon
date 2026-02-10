'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useEffect } from 'react';

export default function PackageFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Initial State from URL
    const [priceRange, setPriceRange] = useState([0, 5000]);
    const [duration, setDuration] = useState<string>('any');
    const [difficulty, setDifficulty] = useState<string>('any');

    useEffect(() => {
        // Sync with URL on mount if needed
    }, []);

    const applyFilters = () => {
        const params = new URLSearchParams();
        if (priceRange[1] < 5000) params.set('maxPrice', priceRange[1].toString());
        if (duration !== 'any') params.set('duration', duration);
        if (difficulty !== 'any') params.set('difficulty', difficulty);

        router.push(`/packages?${params.toString()}`);
    };

    const clearFilters = () => {
        setPriceRange([0, 5000]);
        setDuration('any');
        setDifficulty('any');
        router.push('/packages');
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-8 sticky top-24">
            <div>
                <h3 className="font-bold text-lg mb-4 text-gray-900">Filter Packages</h3>
                <div className="h-1 w-12 bg-ocean-500 rounded-full" />
            </div>

            {/* Price Range */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <Label className="text-gray-600 font-medium">Max Price</Label>
                    <span className="text-ocean-700 font-bold">${priceRange[1].toLocaleString()}</span>
                </div>
                <Slider
                    max={5000}
                    step={100}
                    value={[priceRange[1]]}
                    onValueChange={(val) => setPriceRange([0, val[0]])}
                    className="py-4"
                />
            </div>

            {/* Duration */}
            <div className="space-y-3">
                <Label className="text-gray-600 font-medium">Duration</Label>
                <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger>
                        <SelectValue placeholder="Any duration" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="any">Any duration</SelectItem>
                        <SelectItem value="short">Short (1-3 days)</SelectItem>
                        <SelectItem value="medium">Medium (4-7 days)</SelectItem>
                        <SelectItem value="long">Long (8+ days)</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Difficulty */}
            <div className="space-y-3">
                <Label className="text-gray-600 font-medium">Difficulty</Label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                    <SelectTrigger>
                        <SelectValue placeholder="Any difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="any">Any difficulty</SelectItem>
                        <SelectItem value="EASY">Easy</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="HARD">Hard</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 pt-4">
                <Button onClick={applyFilters} className="w-full bg-ocean-600 hover:bg-ocean-700 text-white font-semibold">
                    Apply Filters
                </Button>
                <Button onClick={clearFilters} variant="outline" className="w-full border-gray-200 text-gray-600 hover:bg-gray-50">
                    Reset Filters
                </Button>
            </div>
        </div>
    );
}
