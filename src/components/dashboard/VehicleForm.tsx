'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { VehicleStatus, VehicleTypes } from '@/lib/constants';

interface VehicleFormProps {
    initialData?: any;
    isEdit?: boolean;
    redirectPath?: string;
    hideStatus?: boolean;
}

export default function VehicleForm({ initialData, isEdit = false, redirectPath = '/dashboard/vehicles', hideStatus = false }: VehicleFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        type: initialData?.type || VehicleTypes.CAR,
        model: initialData?.model || '',
        plateNumber: initialData?.plateNumber || '',
        seats: initialData?.seats || 4,
        luggage: initialData?.luggage || 2,
        dailyRate: initialData?.dailyRate || 0,
        status: initialData?.status || VehicleStatus.AVAILABLE,
        images: initialData?.images || [],
        features: initialData?.features || [],
        transferTypes: initialData?.transferTypes || [],
    });

    const toggleTransferType = (type: string) => {
        setFormData(prev => ({
            ...prev,
            transferTypes: prev.transferTypes.includes(type)
                ? prev.transferTypes.filter((t: string) => t !== type)
                : [...prev.transferTypes, type]
        }));
    };

    const [imagesText, setImagesText] = useState(initialData?.images?.join('\n') || '');
    const [featuresText, setFeaturesText] = useState(initialData?.features?.join('\n') || '');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            ...formData,
            images: imagesText.split('\n').filter((s: string) => s.trim()),
            features: featuresText.split('\n').filter((s: string) => s.trim())
        };

        try {
            const url = isEdit ? `/api/vehicles/${initialData._id}` : '/api/vehicles';
            const method = isEdit ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                router.push(redirectPath);
                router.refresh();
            } else {
                const error = await res.json();
                alert(`Error: ${error.message || 'Something went wrong'}`);
            }
        } catch (error) {
            console.error(error);
            alert('Failed to submit form');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl liquid-glass-stat-dark p-8 rounded-2xl border border-white/[0.08] shadow-2xl text-white">
            <div className="flex flex-col mb-4">
                <h2 className="text-xl font-semibold text-white mb-2">Vehicle Information</h2>
                <p className="text-white/40 text-sm">Details about the fleet vehicle.</p>
            </div>

            <div className="grid gap-6">
                <div className="grid grid-cols-2 gap-5">
                    <div className="grid gap-2">
                        <Label htmlFor="type" className="text-white/70">Vehicle Type</Label>
                        <Select value={formData.type} onValueChange={(val) => setFormData({ ...formData, type: val })}>
                            <SelectTrigger className="bg-white/[0.04] border-white/[0.08] text-white focus:ring-antique-gold/20 h-11 rounded-xl">
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#020b08] border-white/[0.08] text-white">
                                {Object.values(VehicleTypes).map((type) => (
                                    <SelectItem key={type} value={type} className="focus:bg-white/[0.06] focus:text-antique-gold cursor-pointer">{type}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="model" className="text-white/70">Model Name</Label>
                        <Input id="model" required value={formData.model} onChange={(e) => setFormData({ ...formData, model: e.target.value })} placeholder="e.g. Toyota Prius" className="bg-white/[0.04] border-white/[0.08] text-white focus-visible:ring-antique-gold/20 placeholder:text-white/20 h-11 rounded-xl" />
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-5">
                    <div className="grid gap-2">
                        <Label htmlFor="seats" className="text-white/70">Seats</Label>
                        <Input id="seats" type="number" required min={1} value={formData.seats} onChange={(e) => setFormData({ ...formData, seats: Number(e.target.value) })} className="bg-white/[0.04] border-white/[0.08] text-white focus-visible:ring-antique-gold/20 h-11 rounded-xl" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="luggage" className="text-white/70">Luggage Capacity</Label>
                        <Input id="luggage" type="number" min={0} value={formData.luggage} onChange={(e) => setFormData({ ...formData, luggage: Number(e.target.value) })} className="bg-white/[0.04] border-white/[0.08] text-white focus-visible:ring-antique-gold/20 h-11 rounded-xl" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="dailyRate" className="text-white/70">Rate per km (LKR)</Label>
                        <Input id="dailyRate" type="number" required min={0} value={formData.dailyRate} onChange={(e) => setFormData({ ...formData, dailyRate: Number(e.target.value) })} className="bg-white/[0.04] border-white/[0.08] text-white focus-visible:ring-antique-gold/20 h-11 rounded-xl" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                    <div className="grid gap-2">
                        <Label htmlFor="plateNumber" className="text-white/70">Plate Number</Label>
                        <Input id="plateNumber" value={formData.plateNumber} onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })} placeholder="e.g. WP CAA-1234" className="bg-white/[0.04] border-white/[0.08] text-white focus-visible:ring-antique-gold/20 placeholder:text-white/20 h-11 rounded-xl" />
                    </div>
                    {!hideStatus && (
                        <div className="grid gap-2">
                            <Label htmlFor="status" className="text-white/70">Status</Label>
                            <Select value={formData.status} onValueChange={(val) => setFormData({ ...formData, status: val })}>
                                <SelectTrigger className="bg-white/[0.04] border-white/[0.08] text-white focus:ring-antique-gold/20 h-11 rounded-xl">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#020b08] border-white/[0.08] text-white">
                                    {Object.values(VehicleStatus).map((status) => (
                                        <SelectItem key={status} value={status} className="focus:bg-white/[0.06] focus:text-antique-gold cursor-pointer">{status}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </div>

                <div className="grid gap-3">
                    <Label className="text-white/70">Transfer Types / Categories</Label>
                    <div className="flex flex-wrap gap-3">
                        {['AIRPORT_PICKUP', 'AIRPORT_DROP', 'CITY_TOUR'].map(type => {
                            const isSelected = formData.transferTypes.includes(type);
                            return (
                                <label key={type} className={`flex items-center space-x-2 border py-2.5 px-4 rounded-xl cursor-pointer transition-all duration-300 ${isSelected ? 'bg-antique-gold/[0.12] border-antique-gold/30 text-antique-gold shadow-[0_0_12px_rgba(212,175,55,0.06)]' : 'bg-white/[0.02] border-white/[0.06] text-white/60 hover:bg-white/[0.04] hover:text-white/90'}`}>
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => toggleTransferType(type)}
                                        className="h-4 w-4 appearance-none rounded border border-white/20 checked:bg-antique-gold checked:border-transparent transition-all relative before:content-[''] before:absolute before:inset-0 before:bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDIwYjA4IiBzdHJva2Utd2lkdGg9IjMiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBvbHlsaW5lIHBvaW50cz0iMjAgNiA5IDE3IDQgMTIiLz48L3N2Zz4=')] before:bg-no-repeat before:bg-center before:bg-[length:10px] before:opacity-0 checked:before:opacity-100"
                                    />
                                    <span className="text-sm font-medium leading-none">
                                        {type.replace('_', ' ')}
                                    </span>
                                </label>
                            );
                        })}
                    </div>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="features" className="text-white/70">Features (One per line)</Label>
                    <Textarea id="features" className="min-h-[100px] bg-white/[0.04] border-white/[0.08] text-white focus-visible:ring-antique-gold/20 placeholder:text-white/20 rounded-xl" value={featuresText} onChange={(e) => setFeaturesText(e.target.value)} placeholder="AC&#10;Bluetooth&#10;Sunroof" />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="images" className="text-white/70">Images (URLs, one per line)</Label>
                    <Textarea id="images" className="min-h-[100px] bg-white/[0.04] border-white/[0.08] text-white focus-visible:ring-antique-gold/20 placeholder:text-white/20 rounded-xl" value={imagesText} onChange={(e) => setImagesText(e.target.value)} placeholder="https://image1.jpg&#10;https://image2.jpg" />
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-white/[0.06] mt-4">
                <Button type="button" variant="outline" onClick={() => router.back()} className="border-antique-gold/40 text-antique-gold hover:bg-antique-gold/10 rounded-xl h-10 px-6 transition-all">Cancel</Button>
                <Button type="submit" disabled={loading} className="bg-antique-gold hover:bg-antique-gold/90 text-[#020b08] shadow-[0_0_20px_rgba(212,175,55,0.2)] rounded-xl h-10 px-6 font-semibold">
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin text-[#020b08]/60" /> : null}
                    {isEdit ? 'Update Vehicle' : 'Add Vehicle'}
                </Button>
            </div>
        </form>
    );
}
